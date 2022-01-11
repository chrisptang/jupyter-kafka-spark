<template>
  <div class="hero">
    <div>
      <h1 class="display-3">Hello World</h1>
      <p class="lead">
        By default, all tasks will be executed at <label v-text="currentJob.pendingInvocations[0].fireDate.substring(11,11+8)"></label> every day
      </p>
      <b-row class="actions">
        <b-col>
          <label
            style="color: lightcoral"
            v-text="
              'Next scheduled run: ' + currentJob.pendingInvocations[0].fireDate
            "
          ></label>
        </b-col>
        <b-col>
          <button
            type="button"
            class="btn btn-primary trigger display-3"
            @click.prevent="triggerTasks()"
          >
            Trigger All Tasks
          </button>
        </b-col>
      </b-row>
      <b-row class="actions">
        <b-col>
          You might reschedule it using
          <a href="https://crontab.guru/#5_0_*_*_*" target="_blank"
            >cron expression </a
          >:
        </b-col>
        <b-col>
          <input v-model="rescheduleCron" type="text" class="cron-expr" />
          <button
            type="button"
            class="btn btn-danger display-3"
            @click.prevent="reschedule()"
          >
            Reschedule
          </button>
        </b-col>
      </b-row>
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
      currentJob: { pendingInvocations: [{ fireDate: "" }] },
      rescheduleCron: null,
    };
  },
  async created() {
    this.refresh();
  },
  methods: {
    async refresh() {
      this.loading = true;
      this.currentJob = await api.getCurrentSchedule();
      this.loading = false;
    },
    async triggerTasks() {
      if (confirm("Are you sure you want to trigger tasks?")) {
        await api.triggerScrapyTasks({});
        await this.refresh();
      }
    },
    async reschedule() {
      if (
        !!this.rescheduleCron &&
        confirm("Are you sure you want to do reschedule?")
      ) {
        await api.reschedule(this.rescheduleCron);
        alert("rescheduled!");
        await this.refresh();
      }
    },
  },
};
</script>

<style>
#app .actions {
  align-items: center;
  border-top: 1px solid #cecece;
  margin-top: 15px;
  padding-top: 15px;
}
.hero {
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  /* text-align: center; */
}
.hero .lead {
  font-weight: 200;
  font-size: 1.5rem;
}

.cron-expr {
  padding: 5px 10px;
}

button.trigger {
  padding: 10px 20px;
  font-size: 1.5rem;
}
</style>