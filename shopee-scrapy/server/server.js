import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import finale from 'finale-rest';
import { Sequelize, Op } from 'sequelize';
import { createServer } from 'http';
import { addAllTasks, executeTask } from "./scrapy-service.js";
import {scheduleJob} from "node-schedule";

let app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('../dist'))

const server = createServer(app);

const pg_host = "postgres://postgres:postgres-local@10.118.52.23:5432/warehouse"


const database = new Sequelize(pg_host);


let DailyTasks = database.define('daily_task', {
    country: Sequelize.STRING,
    cat_name_en: Sequelize.STRING,
    cat_description: Sequelize.STRING,
    catid: Sequelize.BIGINT
}, {
    paranoid: true,
    indexes: [{
        name: "idx_country_id",
        unique: true,
        fields: ["country", "catid"]
    }]
});

let ShopeeCates = database.define('shopee_cate_tree', {
    country: Sequelize.STRING,
    cat_path: Sequelize.STRING,
    image: Sequelize.STRING,
    catid: Sequelize.BIGINT,
    parent_catid: Sequelize.BIGINT
}, {
    paranoid: true,
    indexes: [{
        name: "idx_country_name",
        unique: true,
        fields: ["country", "cat_path"]
    }]
});

// Initialize finale
finale.initialize({
    app: app,
    sequelize: database
})

// Create the dynamic REST resource for our Post model
let taskResource = finale.resource({
    model: DailyTasks,
    endpoints: ['/api/tasks', '/api/tasks/:id']
})

let shopeeCateResource = finale.resource({
    model: ShopeeCates,
    endpoints: ['/api/shopee-cates', '/api/shopee-cates/:id']
})

app.post('/api/schedule', (req, res) => {
    addAllTasks();
    executeTask();
});

async function triggerScrapy() {
    console.log("about to start job.", new Date());
    addAllTasks();
    executeTask();
}

const crontab_expression = process.env.JOB_SCHEDULE || '5 0 1/1 * *'

const job = scheduleJob(crontab_expression, triggerScrapy);

// Resets the database and launches the express app on :8081
database
    .sync({ force: false })
    .then(() => {
        app.listen(8081, () => {
            console.log('listening to port localhost:8081')
        })
    })