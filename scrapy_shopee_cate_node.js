import fetch from "node-fetch";


const tasks = [], scheduledTimeouts = [];
// const oldTimeout = setTimeout;
// const mySetTimeout = function (callback, timeout) {
//     let id = oldTimeout(function () {
//         callback();
//         console.log('timeout finished', scheduledTimeouts.shift());
//     }, timeout);
//     scheduledTimeouts.push({
//         "id": id,
//         "created_at": new Date().toLocaleString(),
//         "timeout": timeout,
//         "callback": callback.name
//     });
// }

function getRandomTimeout() {
    return 30 * (100 + 1 * parseInt(100 * Math.random()))
}

let no_task_wait = 5;

function executeTask() {
    let cb = tasks.shift();
    if (cb) {
        console.log("task size:", tasks.length);
        cb();
    } else {
        console.warn("has no task");
        if (no_task_wait-- <= 0) {
            return;
        }
    }
    setTimeout(executeTask, getRandomTimeout());
}

async function getShopeeData(url = '', retry = 1) {
    if (retry < 0) {
        console.log("try too many times:", url, retry);
        return null;
    }
    console.log("requesting:", url);
    // Default options are marked with *
    try {
        const response = await fetch(url);
        return response.json(); // parses JSON response into native JavaScript objects
    } catch (error) {
        console.error("error while calling:" + url, error);
        return await getShopeeData(url, --retry);
    }
}

async function sendResult(json = {}, url = '') {
    console.log("sending json to sinker:", json.url);
    url = url || 'http://localhost:1688/api/1688search/sink';
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

const page_size = 60;

// Shopee Singapore
// https://shopee.sg/api/v4/search/search_items?by=sales&limit=20&match_id=11027812&newest=0&order=desc&page_type=search&scenario=PAGE_OTHERS&version=2

async function cate_callback(i = 0, cate_id = 11042921, by = "sales", site = "shopee.co.id") {
    if (i * page_size > 1000) {
        console.warn("stopped at:", i * 60, cate_id, by);
        return;
    }
    let url = `https://${site}/api/v4/search/search_items?by=${by}&limit=${page_size}&match_id=${cate_id}&newest=${i * 60}&order=desc&page_type=search&scenario=PAGE_OTHERS&version=2`;

    try {
        let json = await getShopeeData(url);
        if (!json || !json.items || json.items.length <= 0) {
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

async function collection_callback(i, collection_id, by) {
    if (i * page_size > 1000) {
        console.warn("stopped at:", i * 60, collection_id, by);
        return;
    }
    by = by || "sales"
    collection_id = collection_id || 889750;
    let url = `https://shopee.co.id/api/v4/search/search_items?by=${by}&limit=${page_size}&match_id=${collection_id}&newest=${i * page_size}&order=desc&page_type=collection&scenario=PAGE_COLLECTION_SEARCH&version=2`;
    let json = await getShopeeData(url);
    if (!json || !json.items || json.items.length <= 0) {
        console.warn("url has no items:", url);
        return
    }
    json.url = url;
    let response = await sendResult(json);
    console.log("sink resule:", response);
    mySetTimeout(collection_callback.bind(this, ++i, collection_id, by), parseInt(6000 + 5000 * Math.random()));
}


let accessories_cate = [11042921, 11042947, 11042938, 11042923, 11042922, 11042937, 11042978];
let home_cates = [11044346, 11044344, 11043849, 11043875, 11043886, 11043939, 11043779, 11043783, 11043797, 11043952, 11043951, 11043807]
// let collections = [889750, 889749, 889751, 889754, 889753, 960104, 960105, 960106];


// singapore
const singapore_cates = [11011433, 11011392, 11011381, 11011380, 11011364, 11011332, 11011311, 11011297, 11011273, 11011220, 11011195, 11011178, 11001566, 11027822, 11027812, 11027792, 11027777, 11013196, 11013171, 11013167, 11013157, 11013155, 11013142, 11013128, 11013109, 11013080]
const my_cates = [11000691, 11000692, 11000693, 11000699, 11000700, 11000701, 11000709, 11001156, 11001157, 11001165, 11001166, 11001177, 11001189, 11001213, 11001221, 11001229, 11001241, 11001246, 11001257, 11001261, 11001272]

const id_cates = [...accessories_cate, ...home_cates];

const by = ["sales", "pop"];
by.forEach(sort => {
    for (let i = 0; i * 60 < 1000; i++) {
        singapore_cates.forEach(cate => {
            let cb = cate_callback.bind(this, i, cate, sort, "shopee.sg");
            tasks.push(cb);
        });

        id_cates.forEach(cate => {
            let cb = cate_callback.bind(this, i, cate, sort, "shopee.co.id");
            tasks.push(cb);
        });

        my_cates.forEach(cate => {
            let cb = cate_callback.bind(this, i, cate, sort, "shopee.com.my");
            tasks.push(cb);
        });
    }
});

executeTask();

// for (let k in by) {
//     for (let j in collections) {
//         let cb = collection_callback.bind(this, 0, collections[j], by[k]);
//         mySetTimeout(cb, 1000 * (k + j) * parseInt(5 * Math.random()));
//     }
// }