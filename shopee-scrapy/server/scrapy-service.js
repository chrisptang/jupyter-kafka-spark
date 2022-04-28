import fetch from "node-fetch";
import { Pool } from 'node-postgres';
import { scrapy_config } from "./scrapy-config.js"
import { fetchWithProxy } from "./http-proxy.js"

const result_sink_url = process.env.SINK_URL || 'http://localhost:1688/api/1688search/sink';

const tasks = [], max_no_task_wait = 10;
let started_at = new Date(), no_task_wait = max_no_task_wait;

function getRandomTimeout() {
    return (100 + parseInt(100 * Math.random()))
}

function executeTask(is_new_start = true) {
    if (is_new_start) {
        started_at = new Date();
    }
    let cb = tasks.shift();
    if (cb) {
        console.log("task size:", tasks.length);
        cb();
    } else {
        console.warn("has no task, no_task_wait:", no_task_wait);
        if (no_task_wait-- <= 0) {
            const msg = "Scrapy tasks finished at:" + new Date() + ", tasks were started at:" + started_at;
            console.log(msg);
            no_task_wait = max_no_task_wait;
            return sendFeishuBot(msg);
        }
    }
    setTimeout(executeTask.bind(this, false), getRandomTimeout());
}

async function sendFeishuBot(msg = "tasks finished", bot_url = scrapy_config.feishu_bot) {
    let body_to_send = { "msg_type": "text", "content": { "text": msg } };
    let response = await fetch(bot_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        body: JSON.stringify(body_to_send)
    });
    return response.json();
}

async function getShopeeData(url = '', retry = 1) {
    if (retry < 0) {
        console.log("try too many times:", url, retry);
        return null;
    }
    console.log("requesting:", url);
    // Default options are marked with *
    try {
        const result = await fetchWithProxy(url, {
            headers: {
                "x-api-source": "rweb",
                "x-requested-with": "XMLHttpRequest",
                "x-shopee-language": "en"
            }
        });
        return result;
    } catch (error) {
        console.error("error while calling:" + url, error);
        return await getShopeeData(url, --retry);
    }
}

async function sendResult(json = {}, url = '') {
    console.log("sending json to sinker:", json.url);
    url = url || result_sink_url;
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            "X-Source": "shopee"
        },
        redirect: 'follow',
        body: JSON.stringify(json)
    });
    return response.json();
}

const page_size = 60, search_item_api_max_result = scrapy_config.search_item_api_max_result;

// Shopee Singapore
// https://shopee.sg/api/v4/search/search_items?by=sales&limit=20&match_id=11027812&newest=0&order=desc&page_type=search&scenario=PAGE_OTHERS&version=2

async function cate_callback(i = 0, cate_id = 11042921, by = "sales", site = "shopee.co.id") {
    if (i * page_size > search_item_api_max_result) {
        console.warn("stopped at:", i * 60, cate_id, by);
        return;
    }
    let url = `https://${site}/api/v4/search/search_items?by=${by}&limit=${page_size}&match_id=${cate_id}&newest=${i * 60}&order=desc&page_type=search&scenario=PAGE_OTHERS&version=2`;

    try {
        let json = await getShopeeData(url);
        if (!json || !json.items || json.items.length <= 0 || json.nomore) {
            console.warn("url has no items:", url, " returned json:", json);
            return;
        }
        json.url = url;
        let response = await sendResult(json);
        console.log("sink resule:", response);
    } catch (error) {
        console.warn("url:", url, "\nerror:", error);
    }
}

async function shop_callback(i = 0, shopid = 11042921, by = "sales", site = "shopee.co.id") {
    if (i * page_size > search_item_api_max_result) {
        console.warn("stopped at:", i * 60, cate_id, by);
        return;
    }
    // https://shopee.co.id/api/v4/search/search_items?by=sales&limit=30&match_id=64474495&newest=0&order=desc&page_type=shop&scenario=PAGE_OTHERS&version=2
    let url = `https://${site}/api/v4/search/search_items?by=${by}&limit=${page_size}&match_id=${shopid}&newest=${i * 60}&order=desc&page_type=shop&scenario=PAGE_OTHERS&version=2`;

    try {
        let json = await getShopeeData(url);
        if (!json || !json.items || json.items.length <= 0 || json.nomore) {
            console.warn("url has no items:", url);
            return
        }
        json.url = url;
        let response = await sendResult(json);
        console.log("sink resule:", response);
    } catch (error) {
        console.warn("url:", url, "\nerror:", error);
    }
}

const by = ["sales"], country_host_mapping = {
    "id": "shopee.co.id",
    "th": "shopee.co.th",
    "br": "shopee.com.br",
    "sg": "shopee.sg",
    "my": "shopee.com.my",
};

const pg_connection = {
    user: process.env.PG_USER || 'postgres',
    host: process.env.PG_HOST || 'db-postgres',
    database: process.env.PG_DB || 'warehouse',
    password: process.env.PG_PASSWORD || 'postgres-local',
    port: process.env.PG_PORT || 5432,
};

const pool = new Pool(pg_connection), batch_site = 20;

async function addCategoryAllTasksFromPG() {
    let offset = 0;
    let query_tpl = 'select * FROM daily_tasks where "deletedAt" is null and type=\'cat\' ' +
        "order by id ";

    do {
        let query = query_tpl + `limit ${batch_site} offset ${offset};`
        console.log("query:", query);
        let response = await pool.query(query);
        let rows = response.rows;
        if (rows.length > 0) {
            console.log("all cat tasks:", rows);
            rows.forEach(row => {
                addSingleCatTask(row);
            });
        } else {
            break;
        }

        if (rows.length < batch_site) {
            break;
        }
    } while ((offset += batch_site) <= 5000)

    return "category";
}

async function addShopAllTasksFromPG() {
    let offset = 0;
    let query_tpl = 'select * FROM daily_tasks where "deletedAt" is null and type=\'shop\' ' +
        "order by id ";
    do {
        let query = query_tpl + `limit ${batch_site} offset ${offset};`
        console.log("query:", query);
        let response = await pool.query(query);
        let rows = response.rows;
        if (rows.length > 0) {
            console.log("all shop tasks:", rows);
            rows.forEach(row => {
                addSingleShopTask(row);
            });
        } else {
            break;
        }

        if (rows.length < batch_site) {
            break;
        }
    } while ((offset += batch_site) <= 5000)

    return "PG";
}

async function addSingleShopTask(shop) {
    for (let i = 0; i * 60 < search_item_api_max_result; i++) {
        by.forEach(sort => {
            let cb = shop_callback.bind(this, i, shop.catid, sort, shop.country);
            tasks.push(cb);
        });
    }
    return shop.catid;
}

async function addSingleCatTask(row) {
    for (let i = 0; i * 60 < search_item_api_max_result; i++) {
        by.forEach(sort => {
            let cb = cate_callback.bind(this, i, row.catid, sort, country_host_mapping[row.country.toLowerCase()]);
            tasks.push(cb);
        });
    }
    return row.catid;
}

async function addAllTasks(task_source) {
    let taskSource = task_source || process.env.TASK_SOURCE;
    addCategoryAllTasksFromPG();
    addShopAllTasksFromPG();

    return "done";
}

export { addAllTasks, executeTask, addSingleCatTask, addSingleShopTask }