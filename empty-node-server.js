import { createServer } from 'http'; // Import Node.js core module
import { scheduleJob } from 'node-schedule';
import { addAllTasks, executeTask } from './scrapy_shopee_cate_node.js';

const server = createServer(function (req, res) {   //create web server
    res.writeHead(200, { 'Content-Type': 'text/html' });
    if (req.url == "/trigger") {
        triggerScrapy();
        res.write('OK, tasks have been started.');
    } if (req.url == "/trigger_default") {
        triggerScrapy("default");
        res.write('OK, tasks have been started. from default.');
    } else {
        res.write('<p>OK, server is running</p><p><a href="/trigger" target="_blank">Click here to trigger tasks</a></p>' +
            '<p><a href="/trigger_default" target="_blank">Trigger default tasks</a></p>');
    }
    res.end();
});

async function triggerScrapy() {
    console.log("about to start job.", new Date());
    addAllTasks();
    executeTask();
}

const port = parseInt(process.env.PORT || process.argv[2] || 5000)
const crontab_expression = process.env.JOB_SCHEDULE || '5 0 1/1 * *'

const job = scheduleJob(crontab_expression, triggerScrapy);

server.listen(port); //listen for any incoming requests

console.log(`Node.js web server at port ${port} is running..`)

