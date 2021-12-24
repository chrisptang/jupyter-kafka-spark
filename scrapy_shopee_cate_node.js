import fetch from "node-fetch";

const tasks = [], started_at = new Date();

function getRandomTimeout() {
    return 30 * (100 + 1 * parseInt(100 * Math.random()))
}

let no_task_wait = 5;

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

function executeTask() {
    let cb = tasks.shift();
    if (cb) {
        console.log("task size:", tasks.length);
        cb();
    } else {
        console.warn("has no task");
        if (no_task_wait-- <= 0) {
            console.log("\n\nAll tasks finished at:", new Date, "started at:", started_at);
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
const singapore_cates = [11013080, 11027777, 11013109, 11013128, 11013142, 11013157, 11027792, 11013167, 11013171, 11027812, 11027822, 11013196]
const my_cates = [11000691, 11000692, 11000693, 11000699, 11000700, 11000701, 11000709]
const th_cates = [11045141, 11045142, 11045143, 11045144, 11045145, 11045146, 11045147, 11045149, 11045150, 11045151, 11045152, 11045153, 11045154, 11045155, 11045156, 11045157, 11045028, 11045175, 11045177]
const br_cates = [22134, 22244, 22418, 22393, 22406, 22360, 22413, 27201, 27203, 22366]

const id_cates = [...accessories_cate, ...home_cates];

const by = ["sales", "pop"];
by.forEach(sort => {
    for (let i = 0; i * 60 < 1000; i++) {
        singapore_cates.forEach(cate => {
            let cb = cate_callback.bind(this, i, cate, sort, "shopee.sg");
            tasks.push(cb);
        });

        br_cates.forEach(cate => {
            let cb = cate_callback.bind(this, i, cate, sort, "shopee.com.br");
            tasks.push(cb);
        });

        my_cates.forEach(cate => {
            let cb = cate_callback.bind(this, i, cate, sort, "shopee.com.my");
            tasks.push(cb);
        });

        th_cates.forEach(cate => {
            let cb = cate_callback.bind(this, i, cate, sort, "shopee.co.th");
            tasks.push(cb);
        });
    }
});

executeTask();