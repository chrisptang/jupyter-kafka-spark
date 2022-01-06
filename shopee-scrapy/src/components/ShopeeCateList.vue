<template>
  <div class="container-fluid mt-4">
    <b-row>
      <b-col><h1 class="h1">Shopee Cat List</h1></b-col>
      <b-col>
        <label for="countrySelector">Country:</label>
        <select
          id="countrySelector"
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
              <th>CatId</th>
              <th>Parent CatId</th>
              <th>Cat Name</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cat in cates" :key="cat.id">
              <td>{{ cat.id }}</td>
              <td>{{ cat.country }}</td>
              <td>{{ cat.catid }}</td>
              <td>{{ cat.parent_catid }}</td>
              <td>{{ cat.cat_path }}</td>
              <td>
                <img
                  :src="`https://cf.shopee.sg/file/${cat.image}`"
                  class="cat-image"
                  loading="lazy"
                  :alt="`NO IMAGE FOR ${cat.cat_path}`"
                />
              </td>
              <td class="text-right">
                <a href="#" @click.prevent="addToDailyTask(cat)"
                  >Add to tasks</a
                >
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
  name: "ShopeeCatList",
  data() {
    return {
      msg: "This is Task list",
      cates: [],
      countryList: [],
      model: { country: "ID", q: null },
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
      this.cates = await api.getCates(this.model.country, this.model.q);
      this.loading = false;
    },

    async addToDailyTask(cat) {
      this.loading = true;
      const { country, catid, cat_path } = cat;
      let result = await api.addTask({
        country: country,
        catid: catid,
        cat_name_en: cat_path,
        cat_description: cat_path,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      alert("add task successfully:" + result.cat_name_en);
      this.loading = false;
    },
    async listCountrys() {
      this.countryList = await api.getAllCountry();
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

.cat-image {
  width: 100px;
  height: 100px;
}
</style>
