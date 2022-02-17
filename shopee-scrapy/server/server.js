import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import finale from 'finale-rest';
import { Sequelize, Op } from 'sequelize';
import { createServer } from 'http';
import { addAllTasks, executeTask } from "./scrapy-service.js";
import { scheduleJob, scheduledJobs, rescheduleJob, Job } from "node-schedule";
import { stringify } from "stringy";

let app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const static_path = process.env.SERVER_STATIC_PATH || '../dist';
app.use(express.static(static_path))

const server = createServer(app);

const pg_user = process.env.PG_USER || 'postgres'
    , pg_password = process.env.PG_PASSWORD || 'postgres-local'
    , pg_host = process.env.PG_HOST || 'db-postgres'
    , pg_port = process.env.PG_PORT || 5432
    , pg_db = process.env.PG_DB || 'warehouse';

const pd_url = `postgres://${pg_user}:${pg_password}@${pg_host}:${pg_port}/${pg_db}`

const database = new Sequelize(pd_url);

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

app.post('/api/schedule', async (req, res) => {
    addAllTasks();
    executeTask();
});

app.get('/api/country/list', async (req, res) => {
    let conutryList = await ShopeeCates.findAll({
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('country')), 'country'],
        ]
    })
    res.write(JSON.stringify(conutryList));
    res.end();
});

app.get('/api/cates/root', async (req, res) => {
    let country = req.query.country || "SG";
    let option = {
        attributes: [
            [Sequelize.literal('DISTINCT(split_part(cat_path,\' > \',1))'), 'root']
        ],
        where: {
            country: country
        }
    };
    console.log(option);
    let rootList = await ShopeeCates.findAll(option);
    res.write(JSON.stringify(rootList));
    res.end();
});

app.get('/api/cates/page', async (req, res) => {
    let country = req.query.country || "SG",
        root = req.query.root || req.query.q || "";
    let offset = req.query.offset || 0, limit = req.query.limit || 20;
    let option = {
        where: {
            country: country,
            cat_path: {
                [Op.like]: `%${root}%`,
            }
        },
        limit: limit,
        offset: offset
    };
    console.log(option);
    let rootList = await ShopeeCates.findAndCountAll(option);
    res.write(JSON.stringify(rootList));
    res.end();
});

async function triggerScrapy() {
    console.log("about to start job.", new Date());
    let source = await addAllTasks();
    console.log("added tasks from:" + source)
    executeTask();
}

const crontab_expression = process.env.JOB_SCHEDULE || '5 0 * * *'

let job = scheduleJob(crontab_expression, triggerScrapy);

app.get('/api/schedule/current', async (req, res) => {
    res.write(stringify(job));
    res.end();
});

app.post('/api/schedule/reschedule', async (req, res) => {
    let { cron } = req.body;
    let jobRescheduled = rescheduleJob(job, cron);
    if (!!jobRescheduled) {
        job = jobRescheduled;
    }
    console.log("rescheduled with:", cron, job, "result:", jobRescheduled);
    res.write(stringify(jobRescheduled));
    res.end();
});

const port = parseInt(process.env.PORT || "8081")

database
    .sync({ force: false })
    .then(() => {
        app.listen(port, () => {
            console.log(`listening to port localhost:${port}`)
        })
    })