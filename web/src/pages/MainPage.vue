<template>
  <q-page>
    <div class="q-pa-sm">
      <div class="row">
        <div class="col-3"></div>

        <div class="col-6">
          <q-tabs
            v-model="tab"
            dense
            class="text-white"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="charts" label="Charts" />
            <q-tab name="circulation" label="Circulation" />
            <q-tab name="respiration" label="Respiration" />
            <q-tab name="ventilator" label="Ventilator" />
            <q-tab name="ecmo" label="Ecmo" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="circulation">
              <div class="text-h6">Circulation</div>
            </q-tab-panel>

            <q-tab-panel name="respiration">
              <div class="text-h6">Respiration</div>
            </q-tab-panel>

            <q-tab-panel name="ventilator">
              <div class="text-h6">Ventilator</div>
            </q-tab-panel>

            <q-tab-panel name="ecmo">
              <div class="text-h6">ECMO</div>
            </q-tab-panel>

            <q-tab-panel name="charts">
              <TimeBaseChart></TimeBaseChart>
              <NonTimeBasedChart></NonTimeBasedChart>
            </q-tab-panel>
          </q-tab-panels>
        </div>

        <div class="col-3">
          <q-tabs
            v-model="tab"
            dense
            class="text-white"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="test" label="" />
            <q-tab name="circulation" label="" />
            <q-tab name="respiration" label="" />
            <q-tab name="ventilator" label="" />
            <q-tab name="ecmo" label="" />
          </q-tabs>
          <q-separator />
          <HeartMonitor></HeartMonitor>
          <HemodynamicMonitor></HemodynamicMonitor>
          <ShuntsMonitor></ShuntsMonitor>
          <FlowMonitorVue></FlowMonitorVue>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import NonTimeBasedChart from "components/NonTimeBasedChart.vue";
import TimeBaseChart from "components/TimeBaseChart.vue";
import HemodynamicMonitor from "src/components/HemodynamicMonitor.vue";
import HeartMonitor from "src/components/HeartMonitor.vue";
import ShuntsMonitor from "src/components/ShuntsMonitor.vue";
import FlowMonitorVue from "src/components/FlowMonitor.vue";
import { useLoggedInUser } from "stores/loggedInUser";

export default {
  setup() {
    const user = useLoggedInUser();
    return {
      user,
    };
  },
  components: {
    TimeBaseChart,
    NonTimeBasedChart,
    HemodynamicMonitor,
    HeartMonitor,
    ShuntsMonitor,
    FlowMonitorVue,
  },
  data() {
    return {
      tab: "charts",
    };
  },
  mounted() {
    this.$q.dark.set(true);
    if (!this.user.loggedIn) {
      this.$router.push("/login");
    }
  },
};
</script>

<style></style>
