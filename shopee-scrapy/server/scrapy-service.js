import fetch from "node-fetch";
import { Pool } from 'node-postgres';
import { scrapy_config } from "./scrapy-config"

const result_sink_url = process.env.SINK_URL || 'http://localhost:1688/api/1688search/sink';

const tasks = [], max_no_task_wait = 60;
let started_at = new Date(), no_task_wait = max_no_task_wait;

function getRandomTimeout() {
    return 30 * (100 + 1 * parseInt(100 * Math.random()))
}

const agent_list = [
    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; AcooBrowser; .NET CLR 1.1.4322; .NET CLR 2.0.50727)",
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; Acoo Browser; SLCC1; .NET CLR 2.0.50727; Media Center PC 5.0; .NET CLR 3.0.04506)",
    "Mozilla/4.0 (compatible; MSIE 7.0; AOL 9.5; AOLBuild 4337.35; Windows NT 5.1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)",
    "Mozilla/5.0 (Windows; U; MSIE 9.0; Windows NT 9.0; en-US)",
    "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 2.0.50727; Media Center PC 6.0)",
    "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 1.0.3705; .NET CLR 1.1.4322)",
    "Mozilla/4.0 (compatible; MSIE 7.0b; Windows NT 5.2; .NET CLR 1.1.4322; .NET CLR 2.0.50727; InfoPath.2; .NET CLR 3.0.04506.30)",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN) AppleWebKit/523.15 (KHTML, like Gecko, Safari/419.3) Arora/0.3 (Change: 287 c9dfb30)",
    "Mozilla/5.0 (X11; U; Linux; en-US) AppleWebKit/527+ (KHTML, like Gecko, Safari/419.3) Arora/0.6",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.2pre) Gecko/20070215 K-Ninja/2.1.1",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; rv:1.9) Gecko/20080705 Firefox/3.0 Kapiko/3.0",
    "Mozilla/5.0 (X11; Linux i686; U;) Gecko/20070322 Kazehakase/0.4.5",
    "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.8) Gecko Fedora/1.9.0.8-1.fc10 Kazehakase/0.5.6",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.20 (KHTML, like Gecko) Chrome/19.0.1036.7 Safari/535.20",
    "Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; fr) Presto/2.9.168 Version/11.52",
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
]

function get_random_agent() {
    return agent_list[Math.min(parseInt(agent_list.length * Math.random()), agent_list.length)];
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
            console.log("\n\nAll tasks finished at:", new Date, "started at:", started_at);
            no_task_wait = max_no_task_wait;
            return;
        }
    }
    setTimeout(executeTask.bind(this, false), getRandomTimeout());
}



async function getShopeeData(url = '', retry = 1) {
    if (retry < 0) {
        console.log("try too many times:", url, retry);
        return null;
    }
    console.log("requesting:", url);
    // Default options are marked with *
    try {
        const response = await fetch(url, {
            headers: {
                'user-agent': get_random_agent(),
                "x-api-source": "rweb",
                "x-requested-with": "XMLHttpRequest",
                "x-shopee-language": "en"
            }
        });
        return response.json(); // parses JSON response into native JavaScript objects
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

const by = ["sales"];

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
    let query_tpl = 'select * FROM daily_tasks where "deletedAt" is null and type="cat" ' +
        "order by id ";

    do {
        let query = query_tpl + `limit ${batch_site} offset ${offset};`
        console.log("query:", query);
        let response = await pool.query(query);
        let rows = response.rows;
        if (rows.length > 0) {
            console.log(rows);

            by.forEach(sort => {
                for (let i = 0; i * 60 < search_item_api_max_result; i++) {
                    rows.forEach(row => {
                        let cb = cate_callback.bind(this, i, row.catid, sort, country_host_mapping[row.country.toLowerCase()]);
                        tasks.push(cb);
                    });
                }
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
    let query_tpl = 'select * FROM daily_tasks where "deletedAt" is null and type="shop" ' +
        "order by id ";
    do {
        let query = query_tpl + `limit ${batch_site} offset ${offset};`
        console.log("query:", query);
        let response = await pool.query(query);
        let rows = response.rows;
        if (rows.length > 0) {
            console.log(rows);

            by.forEach(sort => {
                for (let i = 0; i * 60 < search_item_api_max_result; i++) {
                    rows.forEach(row => {
                        let cb = cate_callback.bind(this, i, row.catid, sort, country_host_mapping[row.country.toLowerCase()]);
                        tasks.push(cb);
                    });
                }
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

async function addAllTasks(task_source) {
    let taskSource = task_source || process.env.TASK_SOURCE;
    addCategoryAllTasksFromPG();
    addShopAllTasksFromPG();

    return "done";
}

export { addAllTasks, executeTask }