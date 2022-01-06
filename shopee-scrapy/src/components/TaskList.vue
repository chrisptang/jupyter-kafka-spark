<template>
  <div class="container-fluid mt-4">
    <b-alert :show="loading" variant="info">Loading...</b-alert>
    <b-row>
      <b-col><h1 class="h1">Task Manager</h1></b-col>
      <b-col>
        <label for="countrySelector">Country:</label>
        <select
          id="countrySelector"
          v-model="model.country"
          @change="refresh()"
        >
          <option value="ID">ID</option>
          <option value="SG">SG</option>
          <option value="MY">MY</option>
          <option value="BR">BR</option>
          <option value="TH">TH</option>
        </select>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Country</th>
              <th>CatId</th>
              <th>Cat Name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in tasks" :key="task.id">
              <td>{{ task.id }}</td>
              <td>{{ task.country }}</td>
              <td>{{ task.catid }}</td>
              <td>{{ task.cat_name_en }}</td>
              <td class="text-right">
                <a href="#" @click.prevent="deleteTask(task.id)">Delete</a>
              </td>
            </tr>
          </tbody>
        </table>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import api from "@/api";
export default {
  name: "TaskList",
  data() {
    return {
      msg: "This is Task list",
      tasks: [],
      model: { country: "ID", q: null },
      loading: false,
    };
  },
  async created() {
    this.refresh();
  },
  methods: {
    async refresh() {
      this.loading = true;
      this.tasks = await api.getTasks(this.model.country, this.model.q);
      this.loading = false;
    },
    async deleteTask(id) {
      if (confirm("Are you sure you want to delete this task?")) {
        if (this.model.id === id) {
          this.model = {};
        }
        await api.deleteTask(id);
        await this.refresh();
      }
    },
    async listTasks() {
      this.loading = true;
      this.tasks = await api.getTasks();
      this.loading = false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #35495e;
}
</style>
