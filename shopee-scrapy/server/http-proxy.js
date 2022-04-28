import crypto from "crypto";
import axios from 'axios-proxy-fix';

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
];

function getRandomAgent() {
    return agent_list[Math.floor(Math.random() * agent_list.length)];
}

const proxies = ["47.240.11.53:16067", "47.242.25.66:12103", "149.129.100.105:11759", "8.210.2.122:11256", "149.129.100.105:17782", "8.210.2.122:19051", "47.242.25.66:16875", "149.129.100.105:11599", "8.210.2.122:11346", "149.129.100.105:11973"];

const secret = process.env.PROXY_SECRET || 'you-secret',
    license = process.env.PROXY_LICENSE || "P62EF6DF7659806F3";

function getProxyReuqestOptins() {
    let params = {
        "license": license,
        "time": parseInt(new Date().getTime() / 1000)
    }

    params.sign = md5_string(license + params.time + secret);
    return params;
}

async function fetchLatestAvailableProxies() {
    let params = getProxyReuqestOptins();
    console.log("fetching lastest proxy...proxy parameters:", params);

    const url = "https://api.ttproxy.com/v1/obtain"

    const response = await axios.get(url, {
        params: params
    });
    if (response.status != 200) {
        console.error(response.statusText, ":", response.status);
    }

    let new_proxies = response.data.data.proxies;
    if (new_proxies && new_proxies.length > 0) {
        proxies.splice(0, proxies.length);
        proxies.push(...new_proxies);
    }
    console.log("new proxies:", new_proxies);

    // adding current ip to whitelist;
    const ip = await (await axios.get('https://ifconfig.co/ip')).data;
    console.log("adding current ip:", ip);

    let whitelist_options = getProxyReuqestOptins();
    whitelist_options.ip = ip.trim();
    console.log("whitelist_options", whitelist_options)
    const result = await (await axios.get('https://api.ttproxy.com/v1/whitelist/add', {
        params: whitelist_options
    })).data;

    console.log("whilelist result:", result);

    return new_proxies;
}

function getRandomProxy() {
    let proxy_selected = proxies[Math.floor(Math.random() * proxies.length)];
    console.log("using proxy:", proxy_selected)
    return proxy_selected;
}

let proxy_usage = 0;

async function fetchWithProxy(url, options = {
    headers: {
        "Content-Type": "application/json",
        "Accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6'
    }
}) {
    if (proxy_usage++ % 20 == 0) {
        let new_proxies = await fetchLatestAvailableProxies();
    }
    let proxy = getRandomProxy().split(":");
    options.proxy = {
        host: proxy[0],
        port: parseInt(proxy[1])
    };
    options.headers = options.headers || {};
    options.headers['User-Agent'] = getRandomAgent();
    try {
        const response = await axios.get(url, options);
        return response.data;
    } catch (error) {
        console.error("url:", url, "options:", options, "\nerror:", error);
        return null;
    }
}

function md5_string(str) {
    return crypto.createHash('md5').update(str).digest("hex")
}

console.log('testing...md5:\n', md5_string("1234567890"), '\n');

const testing1 = "https://httpbin.org/get",
    testing2 = "https://shopee.co.id/api/v4/search/search_items?by=sales&limit=60&match_id=11043849&newest=1020&order=desc&page_type=search&scenario=PAGE_OTHERS&version=2";

console.log("testing shopee:\n", await fetchWithProxy(testing2));

export { fetchWithProxy }