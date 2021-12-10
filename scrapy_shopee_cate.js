var oldTimeout = setTimeout;
window.scheduledTimeouts = [];
window.mySetTimeout = function (callback, timeout) {
    let id = oldTimeout(function () {
        callback();
        console.log('timeout finished', window.scheduledTimeouts.shift());
    }, timeout);
    window.scheduledTimeouts.push({
        "id": id,
        "created_at": new Date().toLocaleString(),
        "timeout": timeout,
        "callback": callback.name
    });
}

async function getShopeeData(url = '') {
    console.log("requesting:", url);
    // Default options are marked with *
    const response = await fetch(url);
    return response.json(); // parses JSON response into native JavaScript objects
}

async function sendResult(json = {}, url = '') {
    console.log("sending json to sinker:", json);
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

async function cate_callback(i, cate_id, by) {
    if (i * page_size > 1000) {
        console.warn("stopped at:", i * 60, cate_id, by);
        return;
    }
    by = by || "sales"
    cate_id = cate_id || 11042921;
    let url = `https://shopee.co.id/api/v4/search/search_items?by=${by}&limit=${page_size}&match_id=${cate_id}&newest=${i * 60}&order=desc&page_type=search&scenario=PAGE_OTHERS&version=2`;

    let json = await getShopeeData(url);
    if (!json || !json.items || json.items.length <= 0) {
        console.warn("url has no items:", url);
        return
    }
    json.url = url;
    let response = await sendResult(json);
    console.log("sink resule:", response);
    mySetTimeout(cate_callback.bind(this, ++i, cate_id, by), parseInt(6000 + 5000 * Math.random()));
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


let cates = [11042921, 11042947, 11042938, 11042923, 11042922, 11042937, 11042978];
let home_cates = [11044346, 11044344, 11043849, 11043875, 11043886, 11043939, 11043779, 11043783, 11043797, 11043952, 11043951, 11043807]
let collections = [889750, 889749, 889751, 889754, 889753, 960104, 960105, 960106];
let by = ["sales", "pop"];
// cates = [11043939]
for (let k in by) {
    for (let j in cates) {
        let cb = cate_callback.bind(this, 0, cates[j], by[k]);
        mySetTimeout(cb, 200 * (k + j) * parseInt(50 * Math.random()));
    }
}

for (let k in by) {
    for (let j in collections) {
        let cb = collection_callback.bind(this, 0, collections[j], by[k]);
        mySetTimeout(cb, 1000 * (k + j) * parseInt(5 * Math.random()));
    }
}