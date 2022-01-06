<template>
  <div class="hero">
    <div>
      <h1 class="display-3">Hello World</h1>
      <p class="lead">This is the homepage of your scrapy app</p>
      <b-row>
        <b-col>
          <button type="button" class="btn btn-primary trigger display-3" @click.prevent="triggerTasks()">Trigger All Tasks</button>
        </b-col>
      </b-row>
      <p class="lead">All tasks will be execute at 00:00:05 every day</p>
    </div>
  </div>
</template>

<script>
import api from "@/api";
export default {
  name: "Home",
  data() {
    return {
      loading: false,
    };
  },
  async created() {
    this.refresh();
  },
  methods: {
    async refresh() {

    },
    async triggerTasks() {
      if (confirm("Are you sure you want to trigger tasks?")) {
        await api.triggerScrapyTasks({});
        await this.refresh();
      }
    }
  },
};
</script>

<style>
  .hero {
    height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .hero .lead {
    font-weight: 200;
    font-size: 1.5rem;
  }

  button.trigger{
    padding: 10px 20px;
    font-size: 1.5rem;
  }
</style>