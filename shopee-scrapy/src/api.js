import axios from 'axios';
import { stringify } from 'querystring';

const client = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8081/api',
    json: true
})

export default {
    async execute(method, resource, data) {
        // inject the accessToken for each request
        return client({
            method,
            url: resource,
            data
        }).then(req => {
            return req.data
        })
    },
    getTasks(country, q = null, type = null) {
        return this.execute('get', `/tasks?country=${country}${q != null ? '&q=' + q : ""}${type != null ? '&type=' + type : ""}`)
    },
    getCates(country, q = null) {
        return this.execute('get', `/shopee-cates?country=${country}${q != null ? '&q=' + q : ""}`)
    },
    getCatesPage(country, options) {
        let queryString = stringify(options);
        return this.execute('get', `/cates/page?country=${country}${queryString != null ? '&' + queryString : ""}`);
    },
    getShopsPage(country, options) {
        let queryString = stringify(options);
        return this.execute('get', `/shops-page?site=${country}${queryString != null ? '&' + queryString : ""}`);
    },
    addTask(data) {
        return this.execute('post', '/tasks', data)
    },
    deleteTask(id) {
        return this.execute('delete', `/tasks/${id}`)
    },
    triggerScrapyTasks(data) {
        return this.execute('post', '/schedule', data)
    },
    getAllCountry() {
        return this.execute('get', '/country/list')
    },
    getAllSites() {
        return this.execute('get', '/site/list')
    },
    listRootCates(country) {
        return this.execute('get', `/cates/root?country=${country}`)
    },
    getCurrentSchedule() {
        return this.execute('get', '/schedule/current')
    },
    reschedule(cron) {
        return this.execute('post', `/schedule/reschedule`, { cron: cron });
    },
}