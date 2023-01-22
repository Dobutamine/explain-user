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
            <q-tab name="play" label="play" />

            <q-tab name="build" label="build" />
          </q-tabs>
          <q-separator></q-separator>

          <q-tab-panels v-model="tab_left" animated>
            <q-tab-panel name="file">
              <FileComponentVue></FileComponentVue>
            </q-tab-panel>
            <q-tab-panel name="play">
              <PlayComponentVue></PlayComponentVue>
              <ModelsComponentVue></ModelsComponentVue>
            </q-tab-panel>
            <q-tab-panel name="build">
              <ModelDiagramEditorComponent></ModelDiagramEditorComponent>
              <BuildComponentVue></BuildComponentVue>
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
            <q-tab name="circulation" label="Circulation" />
            <q-tab name="respiration" label="Respiration" />
            <q-tab name="ventilator" label="Ventilator" />
            <q-tab name="ecmo" label="Ecmo" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated keep-alive>
            <q-tab-panel name="scripts">
              <ScriptComponentVue></ScriptComponentVue>
            </q-tab-panel>
            <q-tab-panel name="circulation">
              <ModelDiagramComponentVue></ModelDiagramComponentVue>
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
import BuildComponentVue from "../components/BuildComponent.vue";
import DeleteComponentVue from "src/components/DeleteComponent.vue";
import GroupersEditorComponent from "src/components/GroupersEditorComponent.vue";
import GroupersComponentVue from "../components/GroupersComponent.vue";
import FileComponentVue from "../components/FileComponent.vue";
import ScriptsComponentVue from "../components/ScriptsComponent.vue";
import ModelsComponentVue from "../components/ModelsComponent.vue";
import MonitorsComponentVue from "../components/MonitorsComponent.vue";
import ModelDiagramComponentVue from "src/components/DiagramComponent.vue";
import TimeChartComponentVue from "../components/charts/TimeChartComponent.vue";
import NonTimeBasedChartVue from "../components/charts/NonTimeBasedChart.vue";
import DiagramEditorComponent from "src/components/DiagramEditorComponent.vue";

import { useLoggedInUser } from "stores/loggedInUser";
import { useUserInterfaceStore } from "src/stores/userInterface";

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
    ScriptComponentVue: ScriptsComponentVue,
    ModelsComponentVue,
    MonitorComponentVue: MonitorsComponentVue,
    PlayComponentVue: GroupersComponentVue,
    BuildComponentVue,
    ModelDiagramComponentVue,
    TimeChartComponentVue,
    ModelDiagramEditorComponent: DiagramEditorComponent,
  },
  data() {
    return {
      tab: "circulation",
      tab_left: "play",
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
