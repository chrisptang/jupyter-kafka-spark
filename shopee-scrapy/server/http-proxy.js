import fetch from "node-fetch";
import createHash from "crypto"

const proxies = ["47.240.11.53:16067", "47.242.25.66:12103", "149.129.100.105:11759", "8.210.2.122:11256", "149.129.100.105:17782", "8.210.2.122:19051", "47.242.25.66:16875", "149.129.100.105:11599", "8.210.2.122:11346", "149.129.100.105:11973"];

const secret = process.env.PROXY_SECRET || 'you-secret';

async function fetchLatestAvailableProxies() {
    let params = {
        "license": process.env.PROXY_LICENSE || "P62EF6DF7659806F3",
        "time": new Date().getTime / 1000,
        "cnt": 10,
    }

    let sign = createHash('md5').update((params["license"] + str(params["time"]) + secret).digest('hex'));
    params["sign"] = sign;

    console.log("proxy parameters:", params);

    const url = "https://api.ttproxy.com/v1/obtain";

    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            "Content-Type": "text/plain; charset=utf-8"
        },
        redirect: 'follow',
        data: params
    });
    let new_proxies = response.json().data.proxies;
    if (new_proxies && new_proxies.length > 0) {
        proxies.splice(0, proxies.length);
        proxies.push(...new_proxies);
    }
    return new_proxies;
}