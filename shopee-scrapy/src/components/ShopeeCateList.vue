<template>
  <div class="container-fluid mt-4">
    <b-row class="control-head">
      <b-col><h1 class="h1">Shopee Cat List</h1></b-col>
      <b-col>
        <label for="countrySelector">Country:</label>
        <select
          id="countrySelector"
          class="country-selector"
          v-model="model.country"
          @change="refreshAll()"
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
        <label for="rootCateSelector">Root Category:</label>
        <select id="rootCateSelector" v-model="model.root" @change="refresh()">
          <option v-for="root in rootList" :key="root.root" :value="root.root">
            {{ root.root }}
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
            <tr v-for="cat in cates.rows" :key="cat.id" class="table-row">
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
                  :alt="`No image for ${cat.catid}`"
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
    <b-row class="pagination">
      <b-col
        ><span>Total items: &nbsp;{{ cates.count }}</span></b-col
      >
      <b-col
        ><span>Per page size: &nbsp;{{ model.pageSize }}</span></b-col
      >
      <b-col
        ><span
          >showing result from: &nbsp;{{
            (model.page - 1) * model.pageSize + 1
          }}
          to: {{ Math.min(model.page * model.pageSize, cates.count) }}</span
        ></b-col
      >
      <b-col>
        <span>Go to: </span>
        <button
          type="button"
          class="btn btn-sm btn-primary"
          :disabled="!paging.previousAvailable"
          @click="tagglePaging(-1)"
        >
          Previous
        </button>
        <button
          type="button"
          class="btn btn-sm btn-primary"
          :disabled="!paging.nextAvailable"
          @click="tagglePaging(1)"
        >
          Next
        </button>
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
      cates: { count: 0, rows: [] },
      countryList: [],
      rootList: [],
      model: { country: "ID", q: null, root: null, page: 1, pageSize: 20 },
      paging: { nextAvailable: true, previousAvailable: false },
      loading: false,
    };
  },
  async created() {
    this.listCountrys();
    this.listRootCates();
    this.refresh();
  },
  methods: {
    async refreshAll() {
      this.listRootCates();
      this.refresh();
    },
    async refresh() {
      this.loading = true;
      let options = {
        root: this.model.root,
        offset: (this.model.page - 1) * this.model.pageSize,
        limit: this.model.pageSize,
        q: this.model.q,
      };
      this.cates = await api.getCatesPage(this.model.country, options);
      this.loading = false;
      this.isPagingAvailable();
    },

    async addToDailyTask(cat) {
      this.loading = true;
      const { country, catid, cat_path } = cat;
      let result = await api.addTask({
        country: country,
        catid: catid,
        cat_name_en: cat_path,
        cat_description: cat_path,
        type: "shop",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      alert("add task successfully:" + result.cat_name_en);
      this.loading = false;
    },
    async listCountrys() {
      this.countryList = await api.getAllCountry();
    },
    async listRootCates() {
      this.rootList = await api.listRootCates(this.model.country);
    },
    async tagglePaging(page) {
      this.model.page += page;
      this.paging.nextAvailable =
        this.model.page * this.model.pageSize < this.cates.count;
      this.refresh();
    },
    isPagingAvailable() {
      this.paging.previousAvailable = this.model.page > 1;
      this.paging.nextAvailable =
        this.model.page * this.model.pageSize < this.cates.count;
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

.country-selector {
  padding: 0 20px;
}

.text-right a {
  font-weight: bolder;
  color: deepskyblue;
}

.table-row:hover {
  background-color: #cfcfcf;
}

.control-head {
  position: sticky;
  top: 0px;
  background-color: white;
  align-items: center;
}

td {
  max-width: 200px;
}

.pagination {
  padding: 10px 0;
  position: sticky;
  bottom: 0px;
  background-color: #121212;
  color: #fff;
  align-items: center;
}
</style>
