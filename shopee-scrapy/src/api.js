import axios from 'axios';
import {stringify} from 'querystring';

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
    getTasks(country, q = null) {
        return this.execute('get', `/tasks?country=${country}${q != null ? '&q=' + q : ""}`)
    },
    getCates(country, q = null) {
        return this.execute('get', `/shopee-cates?country=${country}${q != null ? '&q=' + q : ""}`)
    },
    getCatesPage(country, options) {
        let queryString = stringify(options);
        // options:{root:'cat-root',q:'any-query',offset:10,limit:20}
        return this.execute('get', `/cates/page?country=${country}${queryString != null ? '&' + queryString : ""}`);
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
    listRootCates(country) {
        return this.execute('get', `/cates/root?country=${country}`)
    }
}