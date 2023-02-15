<template>
  <q-page>
    <div class="q-pa-sm">
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
            @update:model-value="tabLeftChanged"
          >
            <q-tab name="play" label="play" />
            <q-tab name="ventilator" label="ventilator" />
            <q-tab name="ecls" label="ecls" />
            <q-tab name="build" label="build" />
          </q-tabs>
          <q-separator></q-separator>

          <q-tab-panels v-model="tab_left" keep-alive>
            <q-tab-panel name="play">
              <InterventionsComponent></InterventionsComponent>
              <GroupersComponent></GroupersComponent>
              <CaseStudiesComponent></CaseStudiesComponent>
              <BuildModelComponent></BuildModelComponent>
            </q-tab-panel>
            <q-tab-panel name="ventilator">
              <MechanicalVentilator></MechanicalVentilator>
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
              <ScriptComponentVue></ScriptComponentVue>
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
            @update:model-value="tabRightChanged"
          >
            <q-tab name="monitor" label="monitor" />
            <q-tab name="numerics" label="numerics" />
            <q-tab name="probes" label="probes" />
          </q-tabs>
          <q-separator />
          <q-tab-panels v-model="tab_right" keep-alive>
            <q-tab-panel name="monitor">
              <PatientMonitor></PatientMonitor>
              <TrendsMonitor></TrendsMonitor>
            </q-tab-panel>

            <q-tab-panel name="numerics">
              <div v-for="(monitor, index) in monitors" :key="index">
                <MonitorComponentVue
                  :title="monitor.title"
                  :collapsed="monitor.collapsed"
                  :data_type="monitor.data_type"
                  :parameters="monitor.parameters"
                ></MonitorComponentVue>
              </div>
            </q-tab-panel>
            <q-tab-panel name="probes">
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
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import ModelComponent from "../components/ModelComponent.vue";
import CaseStudiesComponent from "src/components/CaseStudiesComponent.vue";
import GroupersComponent from "../components/GroupersComponent.vue";
import InterventionsComponent from "src/components/InterventionsComponent.vue";
import ScriptsComponentVue from "../components/ScriptsComponent.vue";
import MonitorsComponentVue from "../components/MonitorsComponent.vue";
import DiagramComponent from "src/components/DiagramComponent.vue";
import DiagramEditorComponent from "src/components/DiagramEditorComponent.vue";
import TimeChartComponentVue from "../components/charts/TimeChartComponent.vue";
import PatientMonitor from "src/components/PatientMonitor.vue";
import MechanicalVentilator from "src/components/MechanicalVentilator.vue";
import TrendsMonitor from "src/components/TrendsMonitor.vue";
import { useUserStore } from "src/stores/user";
import { useConfigStore } from "src/stores/config";
import { useGeneralStore } from "../stores/general";

export default {
  setup() {
    const user = useUserStore();
    const general = useGeneralStore();
    const uiConfig = useConfigStore();
    return {
      general,
      user,
      uiConfig,
    };
  },
  components: {
    CaseStudiesComponent,
    TrendsMonitor,
    PatientMonitor,
    MechanicalVentilator,
    InterventionsComponent,
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
      tab_right: "numerics",
      monitors: [],
      charts: [],
      models: [],
    };
  },
  methods: {
    tabLeftChanged() {
      console.log(this.tab_left);
      if (this.tab_left === "ventilator") {
        this.$bus.emit("ventilator_on");
      } else {
        this.$bus.emit("ventilator_off");
      }
    },
    tabRightChanged() {
      console.log(this.tab_right);
      if (this.tab_right === "monitor") {
        this.$bus.emit("monitors_on");
      } else {
        this.$bus.emit("monitors_off");
      }
    },
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
