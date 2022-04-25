<template>
  <div class="container-fluid mt-4">
    <b-alert :show="loading" variant="info">Loading...</b-alert>
    <b-row>
      <b-col><h1 class="h1">Task Manager</h1></b-col>
      <b-col>
        <label for="countrySelector">Country:</label>
        <select
          id="countrySelector"
          class="country-selector"
          v-model="model.country"
          @change="refresh()"
        >
          <option
            v-for="country in countryList"
            :key="country.contry"
            :value="country.country"
          >
            {{ country.country }}
          </option>
        </select>
      </b-col>
      <b-col>
        <label for="countrySelector">Type:</label>
        <select
          id="typeSelector"
          class="type-selector"
          v-model="model.type"
          @change="refresh()"
        >
          <option value="cat">cat</option>
          <option value="shop">shop</option>
        </select>
      </b-col>
      <b-col>
        <label for="cateQuerry">Category filter:</label>
        <input type="text" v-model="model.q" @change="refresh()" />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Country</th>
              <th>CatId or ShopId</th>
              <th>Cat or Shop Name</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in tasks" :key="task.id">
              <td>{{ task.id }}</td>
              <td>{{ task.country }}</td>
              <td>{{ task.catid }}</td>
              <td>{{ task.cat_name_en }}</td>
              <td>{{ task.type }}</td>
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
      countryList: [],
      model: { country: "ID", q: null, type: null },
      loading: false,
    };
  },
  async created() {
    this.refresh();
    this.listCountrys();
  },
  methods: {
    async refresh() {
      this.loading = true;
      this.tasks = await api.getTasks(
        this.model.country,
        this.model.q,
        this.model.type
      );
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
    async listCountrys() {
      this.countryList = await api.getAllCountry();
      this.countryList.push(
        (await api.getAllSites()).map((site) => {
          return { country: site.site };
        })
      );
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

.country-selector {
  padding: 0 20px;
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
