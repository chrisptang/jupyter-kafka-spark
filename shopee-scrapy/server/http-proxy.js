import crypto from "crypto";
import axios from 'axios-proxy-fix';

const agent_list = [
    "Mozilla/5.0 (Linux; Android 11; SM-A215U Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/19B74",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/19D52",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/19E258",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/19D52",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 232.0.0.12.114 (iPhone10,1; iOS 15_4_1; en_US; en-GB; scale=2.00; 750x1334; 365562048)",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/19E258",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 9; SM-N950U Build/PPR1.180610.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 11; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/19B74",
    "Mozilla/5.0 (Linux; Android 11; SM-N986U Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 12; SM-N970U Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 12; SM-S908U Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 232.0.0.12.114 (iPhone13,2; iOS 15_4_1; en_US; en-US; scale=3.00; 1170x2532; 365562048)",
    "Mozilla/5.0 (Linux; Android 10; moto g(7) supra Build/QCOS30.95-Q3-10-47-6; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/99.0.4844.73 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 11; SM-A716U Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 230.0.0.20.113 (iPhone13,3; iOS 15_4_1; en_US; en-US; scale=3.00; 1170x2532; 363633589)",
    "Mozilla/5.0 (Linux; Android 11; SM-A215U Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 10; MAR-LX3A Build/HUAWEIMAR-L03A; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 11; SM-N976V Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 232.0.0.12.114 (iPhone10,5; iOS 15_4_1; en_GB; en-GB; scale=2.61; 1080x1920; 365562048)",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/19E258",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
    "Mozilla/5.0 (Linux; Android 11; SM-A515W Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/209.0.442442103 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 musical_ly_24.0.0 JsSdk/2.0 NetType/WIFI Channel/App Store ByteLocale/en Region/GB RevealType/Dialog isDarkMode/0 WKWebView/1 BytedanceWebview/d8a21c6",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/19E258",
    "Mozilla/5.0 (Linux; Android 11; SM-A326W Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (iPad; CPU OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/19E258",
    "Mozilla/5.0 (Linux; Android 12; SM-G998B Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 10; KTLA133) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
    "Mozilla/5.0 (Linux; Android 12; Pixel 4a (5G) Build/SP2A.220405.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 11; SM-A326W Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/19E258",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/19A346",
    "Mozilla/5.0 (Linux; Android 9; SM-J415FN) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.41 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 12; SM-N975U1 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 musical_ly_24.0.0 JsSdk/2.0 NetType/WIFI Channel/App Store ByteLocale/en Region/US ByteFullLocale/en isDarkMode/1 WKWebView/1 BytedanceWebview/d8a21c6",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_8_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/18H107",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 9; SM-S367VL Build/PPR1.180610.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 11; M2101K6G Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.141 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 11_2_6 like Mac OS X) AppleWebKit/604.5.6 (KHTML, like Gecko) Version/11.0 Mobile/15D100 Safari/604.1",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/19B81",
    "Mozilla/5.0 (Linux; Android 11; M2101K6G Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.141 Mobile Safari/537.36",
    "Mozilla/5.0 (iPad; CPU OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/19E258",
    "Mozilla/5.0 (Linux; Android 11; SM-A515W Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 10; KTLA133) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) WebKit/8613 (KHTML, like Gecko) Mobile/19E258",
    "Mozilla/5.0 (Linux; Android 11; SM-A515W Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 9; SM-S367VL Build/PPR1.180610.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 11; moto g play (2021) Build/RZAS31.Q2-146-14-7; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 10; M2003J15SC Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 10; M2003J15SC Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 musical_ly_24.0.0 JsSdk/2.0 NetType/WIFI Channel/App Store ByteLocale/en Region/US ByteFullLocale/en isDarkMode/1 WKWebView/1 BytedanceWebview/d8a21c6",
    "Mozilla/5.0 (Linux; Android 12; SM-G998B Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 12; Pixel 6 Pro Build/SP2A.220405.004; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/19E258",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/18F72",
    "Mozilla/5.0 (Linux; Android 11; SM-A226B Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/19B81",
    "Mozilla/5.0 (Linux; Android 12; SM-G998W) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/19D52",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 musical_ly_24.1.0 JsSdk/2.0 NetType/WIFI Channel/App Store ByteLocale/en Region/GB RevealType/Dialog isDarkMode/1 WKWebView/1 BytedanceWebview/d8a21c6",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 musical_ly_24.0.0 JsSdk/2.0 NetType/WIFI Channel/App Store ByteLocale/en Region/GB RevealType/Dialog isDarkMode/0 WKWebView/1 BytedanceWebview/d8a21c6",
    "Mozilla/5.0 (Linux; Android 10; SM-G986B Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 9; SM-N950F Build/PPR1.180610.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 12; SM-A526W) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 12; SM-N981U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.79 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 12; SM-N981U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.79 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 10; LM-Q720 Build/QKQ1.200308.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/19A346",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/209.0.442442103 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 232.0.0.12.114 (iPhone12,8; iOS 15_4_1; en_GB; en-GB; scale=2.00; 750x1334; 365562048)",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/18F72",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/19D52",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 11; moto g play (2021) Build/RZAS31.Q2-146-14-7; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955U1) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/16.2 Chrome/92.0.4515.166 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/19E258",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/19E258",
    "Mozilla/5.0 (Linux; Android 12; SM-G981U Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 11; SM-A515W Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 12; Pixel 6 Pro Build/SP2A.220405.004; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 223.0.0.11.104 (iPhone10,2; iOS 15_4_1; en_US; en-US; scale=2.61; 1080x1920; 352006504)",
    "Mozilla/5.0 (Linux; Android 11; motorola one 5G UW ace Build/RRVS31.Q2-36-14-16-11; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/98.0.4758.101 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/18G82",
    "Mozilla/5.0 (Linux; Android 11; SM-F711B Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 11; SM-A115F Build/RP1A.200720.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/99.0.4844.58 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 12; SAMSUNG SM-G781B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/16.0 Chrome/92.0.4515.166 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 9; SM-J415FN) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.41 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 232.0.0.12.114 (iPhone12,1; iOS 15_4_1; en_US; en-US; scale=2.00; 828x1792; 365562048)",
    "Mozilla/5.0 (Linux; Android 10; SM-G960U Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36 Instagram 232.0.0.16.114 Android (29/10; 480dpi; 1080x2076; samsung; SM-G960U; starqltesq; qcom; en_US; 366008860)",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 232.0.0.12.114 (iPhone12,1; iOS 15_4_1; en_DE; en-DE; scale=2.00; 828x1792; 365562048)",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 223.0.0.11.104 (iPhone10,2; iOS 15_4_1; en_US; en-US; scale=2.61; 1080x1920; 352006504)",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/19D52"
];

function getRandomAgent() {
    return agent_list[Math.floor(Math.random() * agent_list.length)];
}

const proxies = { "47.242.25.66:15550": 1, "8.210.2.122:12087": 1, "47.242.25.66:14470": 1, "47.242.25.66:16825": 1, "47.242.25.66:15724": 1, "47.242.25.66:16756": 1, "8.210.2.122:12534": 1, "149.129.100.105:11544": 1, "149.129.100.105:18663": 1, "149.129.100.105:11814": 1, "47.242.25.66:19442": 1, "149.129.100.105:11161": 1, "8.210.2.122:12159": 1, "47.242.25.66:15764": 1, "47.240.11.53:16096": 1, "149.129.100.105:18164": 1, "47.240.11.53:15786": 1, "149.129.100.105:11526": 1, "8.210.2.122:12309": 1, "47.242.25.66:15898": 1, "149.129.100.105:18850": 1, "8.210.2.122:19044": 1, "47.242.25.66:16047": 1, "149.129.100.105:19915": 1, "149.129.100.105:18362": 1, "149.129.100.105:11221": 1, "47.240.11.53:15567": 1, "47.240.11.53:11264": 1, "47.242.25.66:16606": 1, "47.242.25.66:16066": 1, "149.129.100.105:11673": 1, "47.240.11.53:17045": 1, "47.240.11.53:15080": 1, "8.210.2.122:12061": 1, "47.242.25.66:11818": 1, "47.240.11.53:15205": 1, "149.129.100.105:19103": 1, "8.210.2.122:14509": 1, "8.210.2.122:10195": 1, "149.129.100.105:16066": 1, "47.240.11.53:11498": 1, "149.129.100.105:14451": 1, "47.242.25.66:12832": 1, "149.129.100.105:16194": 1, "47.240.11.53:19593": 1, "8.210.2.122:19181": 1, "47.240.11.53:16701": 1, "149.129.100.105:11954": 1, "47.242.25.66:16093": 1, "149.129.100.105:12667": 1 };

const secret = process.env.PROXY_SECRET || 'you-secret',
    license = process.env.PROXY_LICENSE || "P62EF6DF7659806F3";

function getProxyReuqestOptins() {
    let params = {
        "license": license,
        "time": parseInt(new Date().getTime() / 1000),
        "cnt": 50
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
        new_proxies.forEach(element => {
            proxies[element] = 1;
        });
        let all_keys = Object.keys(json);
        if (all_keys.length > 500) {
            // 如果本地内存太大了，就删除一些
            all_keys.forEach(ele => {
                // 随机删除30%；
                if (Math.random() < 0.3) {
                    delete proxies[ele];
                }
            });
        }
    }
    console.log("new proxies:", new_proxies);

    // adding current ip to whitelist;
    // const ip = await (await axios.get('https://ifconfig.co/ip')).data;
    // console.log("adding current ip:", ip);

    // let whitelist_options = getProxyReuqestOptins();
    // whitelist_options.ip = ip.trim();
    // console.log("whitelist_options", whitelist_options)
    // const result = await (await axios.get('https://api.ttproxy.com/v1/whitelist/add', {
    //     params: whitelist_options
    // })).data;

    // console.log("whilelist result:", result);

    return new_proxies;
}

function getRandomProxy() {
    let keys = Object.keys(proxies);
    let proxy_selected = keys[Math.floor(Math.random() * keys.length)];
    console.log("using proxy:", proxy_selected)
    return proxy_selected;
}

function deleteUnavailableProxy(proxy) {
    delete proxies[proxy];
}

let proxy_usage = 0;

async function fetchWithProxy(url, options = {
    headers: {
        "Content-Type": "application/json",
        "Accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6'
    }
}, retry = 2) {
    if (retry < 0) {
        console.warn("stopped retry:", url);
        return null;
    }
    if (proxy_usage++ % 20 == 0) {
        let new_proxies = await fetchLatestAvailableProxies();
    }
    let proxy = getRandomProxy();
    let proxy_pair = proxy.split(":");
    options.proxy = {
        host: proxy_pair[0],
        port: parseInt(proxy_pair[1])
    };
    options.headers = options.headers || {};
    options.headers['User-Agent'] = getRandomAgent();
    try {
        const response = await axios.get(url, options);
        return response.data;
    } catch (error) {
        console.error("url:", url, "options:", options, "\nerror:", error);

        deleteUnavailableProxy(proxy);

        // 300ms 后重试一次
        await new Promise(resolve => setTimeout(resolve, 300));
        return await fetchWithProxy(url, options, --retry);
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