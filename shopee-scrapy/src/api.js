import axios from 'axios'

const client = axios.create({
    baseURL: 'http://localhost:8081/api',
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
    addTask(data) {
        return this.execute('post', '/tasks', data)
    },
    deleteTask(id) {
        return this.execute('delete', `/tasks/${id}`)
    },
    triggerScrapyTasks(data) {
        return this.execute('post', '/schedule', data)
    },
}