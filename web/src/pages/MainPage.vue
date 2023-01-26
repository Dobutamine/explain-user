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
            <q-tab name="play" label="play" />

            <q-tab name="build" label="build" />
          </q-tabs>
          <q-separator></q-separator>

          <q-tab-panels v-model="tab_left" keep-alive>
            <q-tab-panel name="file">
              <FileComponentVue></FileComponentVue>
              <ModelControlComponent></ModelControlComponent>
            </q-tab-panel>
            <q-tab-panel name="play">
              <GroupersComponent></GroupersComponent>
            </q-tab-panel>
            <q-tab-panel name="build">
              <ModelDiagramEditorComponent></ModelDiagramEditorComponent>
              <BuildModelComponent></BuildModelComponent>
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
            <q-tab name="scripts" label="Scripts" />
            <q-tab name="charts" label="Charts" />
            <q-tab name="diagram" label="Diagram" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" keep-alive>
            <q-tab-panel name="scripts">
              <ScriptComponentVue></ScriptComponentVue>
            </q-tab-panel>
            <q-tab-panel name="diagram">
              <DiagramComponent></DiagramComponent>
            </q-tab-panel>

            <q-tab-panel name="charts">
              <div v-for="(chart, index) in charts" :key="index">
                <TimeChartComponentVue
                  v-if="chart.position === 2"
                  :id="chart._id"
                  :caption="chart.caption"
                  :models="chart.models"
                  :props="chart.props"
                  :channels="chart.channels"
                  :collapsed="chart.collapsed"
                  :enabled="chart.enabled"
                  :analysisEnabled="chart.analysisEnabled"
                  :autoscaleEnabled="chart.autoscaleEnabled"
                  :multipliersEnabled="chart.multipliersEnabled"
                  :exportEnabled="chart.exportEnabled"
                ></TimeChartComponentVue>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>

        <div class="col-3">
          <q-tabs
            v-model="tab_right"
            dense
            class="text-white"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="monitoring" label="monitoring" />
          </q-tabs>
          <q-separator />
          <div v-for="(monitor, index) in monitors" :key="index">
            <MonitorComponentVue
              :title="monitor.title"
              :collapsed="monitor.collapsed"
              :data_type="monitor.data_type"
              :parameters="monitor.parameters"
            ></MonitorComponentVue>
          </div>
          <div v-for="(chart, index) in charts" :key="index">
            <TimeChartComponentVue
              v-if="chart.position === 3"
              :id="chart._id"
              :caption="chart.caption"
              :models="chart.models"
              :props="chart.props"
              :channels="chart.channels"
              :collapsed="chart.collapsed"
              :enabled="chart.enabled"
              :analysisEnabled="chart.analysisEnabled"
              :autoscaleEnabled="chart.autoscaleEnabled"
              :multipliersEnabled="chart.multipliersEnabled"
              :exportEnabled="chart.exportEnabled"
            ></TimeChartComponentVue>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import ModelControlComponent from "src/components/ModelControlComponent.vue";
import ModelComponent from "../components/ModelComponent.vue";
import GroupersComponent from "../components/GroupersComponent.vue";
import FileComponentVue from "../components/FileComponent.vue";
import ScriptsComponentVue from "../components/ScriptsComponent.vue";
import MonitorsComponentVue from "../components/MonitorsComponent.vue";
import DiagramComponent from "src/components/DiagramComponent.vue";
import DiagramEditorComponent from "src/components/DiagramEditorComponent.vue";
import TimeChartComponentVue from "../components/charts/TimeChartComponent.vue";
import { useUserStore } from "src/stores/user";
import { useConfigStore } from "src/stores/config";

export default {
  setup() {
    const user = useUserStore();
    const uiConfig = useConfigStore();
    return {
      user,
      uiConfig,
    };
  },
  components: {
    ModelControlComponent,
    FileComponentVue,
    ScriptComponentVue: ScriptsComponentVue,
    MonitorComponentVue: MonitorsComponentVue,
    GroupersComponent,
    BuildModelComponent: ModelComponent,
    DiagramComponent,
    TimeChartComponentVue,
    ModelDiagramEditorComponent: DiagramEditorComponent,
  },
  data() {
    return {
      tab: "diagram",
      tab_left: "build",
      tab_right: "monitoring",
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
  },
};
</script>

<style></style>
