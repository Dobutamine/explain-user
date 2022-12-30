<template>
  <q-page>
    <div class="q-pa-md">
      <div class="row">
        <div class="col-3">
          <q-tabs
            v-model="tab_left"
            dense
            class="text-white"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="file" label="file" />
            <q-tab name="scripts" label="scripts" />
            <q-tab name="play" label="play" />
            <q-tab name="build" label="build" />
            <q-tab name="docs" label="docs" />
          </q-tabs>
          <q-separator></q-separator>

          <q-tab-panels v-model="tab_left" animated>
            <q-tab-panel name="file">
              <FileComponentVue></FileComponentVue>
            </q-tab-panel>
            <q-tab-panel name="scripts">
              <ScriptComponentVue></ScriptComponentVue>
              <ModelsComponentVue></ModelsComponentVue>
            </q-tab-panel>
            <q-tab-panel name="play"> </q-tab-panel>
            <q-tab-panel name="build">
              <ModelsComponentVue></ModelsComponentVue>
            </q-tab-panel>
          </q-tab-panels>
        </div>

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
              <TimeBaseChartVue></TimeBaseChartVue>
              <NonTimeBasedChartVue></NonTimeBasedChartVue>
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
          <div v-for="(monitor, index) in monitors" :key="index">
            <MonitorComponentVue
              :title="monitor.title"
              :collapsed="monitor.collapsed"
              :parameters="monitor.parameters"
            ></MonitorComponentVue>
          </div>
          <div v-for="(chart, index) in charts" :key="index">
            <ChartComponentVue
              :title="chart.title"
              :collapsed="chart.collapsed"
              :model_types="chart.model_types"
              :props="chart.model_props"
            ></ChartComponentVue>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import FileComponentVue from "src/components/FileComponent.vue";
import ScriptComponentVue from "src/components/ScriptComponent.vue";
import ModelsComponentVue from "src/components/ModelsComponent.vue";
import MonitorComponentVue from "src/components/MonitorComponent.vue";
import ChartComponentVue from "src/components/ChartComponent.vue";
import TimeBaseChartVue from "src/components/TimeBaseChart.vue";
import NonTimeBasedChartVue from "src/components/NonTimeBasedChart.vue";
import { useLoggedInUser } from "stores/loggedInUser";
import { useUserInterfaceStore } from "src/stores/UserInterface";

export default {
  setup() {
    const user = useLoggedInUser();
    const uiConfig = useUserInterfaceStore();
    return {
      user,
      uiConfig,
    };
  },
  components: {
    FileComponentVue,
    ScriptComponentVue,
    ModelsComponentVue,
    ChartComponentVue,
    MonitorComponentVue,
    TimeBaseChartVue,
    NonTimeBasedChartVue,
  },
  data() {
    return {
      tab: "charts",
      tab_left: "file",
      monitors: [],
      charts: [],
      models: [],
    };
  },
  mounted() {
    this.$q.dark.set(true);
    if (!this.user.loggedIn) {
      this.$router.push("/login");
    }
    // build the monitor list
    for (let key in this.uiConfig.monitors) {
      if (this.uiConfig.monitors[key].enabled) {
        this.monitors.push(this.uiConfig.monitors[key]);
      }
    }
    // build the chart list
    for (let key in this.uiConfig.charts) {
      if (this.uiConfig.charts[key].enabled) {
        this.charts.push(this.uiConfig.charts[key]);
      }
    }

    // // build the model list
    // for (let key in this.uiConfig.models) {
    //   // get the model type
    //   let model_type = this.uiConfig.models[key].model_type;
    //   // get all the models of this type from the explain model
    //   let models = ["LV", "AA", "AAR"];
    //   // set all the properties
    //   this.models.push({
    //     title: this.uiConfig.models[key].label,
    //     collapsed: this.uiConfig.models[key].collapsed,
    //     models: models,
    //     properties: this.uiConfig.models[key].properties,
    //   });
    // }
  },
};
</script>

<style></style>
