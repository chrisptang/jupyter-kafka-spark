// proxy_test.py


// npm install node-fetch
// npm install https-proxy-agent

const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');


(async () => {
    const proxyAgent = new HttpsProxyAgent('http://46.250.171.31:8080');
    const response = await fetch('https://httpbin.org/ip?json', { agent: proxyAgent});
    const body = await response.text();
    console.log(body);
})();