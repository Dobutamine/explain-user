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
            narrow-indicator
            outside-arrows
            @update:model-value="tabLeftChanged"
          >
            <q-tab name="play" label="play" />
            <q-tab name="build" label="build" />
            <q-tab name="ventilator" label="vent" />
            <q-tab name="ecls" label="ecls" />
            <q-tab name="aw" label="fetal" />
          </q-tabs>
          <q-separator></q-separator>

          <q-tab-panels v-model="tab_left" keep-alive>
            <q-tab-panel name="play">
              <q-scroll-area
                class="q-pa-es"
                dark
                :style="screen_height"
                :vertical-bar-style="{
                  right: '5px',
                  borderRadius: '5px',
                  background: 'grey-10',
                  width: '5px',
                  opacity: 0.5,
                }"
              >
                <InterventionsComponent></InterventionsComponent>
                <GroupersComponent></GroupersComponent>
                <CaseStudiesComponent></CaseStudiesComponent>
                <BuildModelComponent></BuildModelComponent>
              </q-scroll-area>
            </q-tab-panel>

            <q-tab-panel name="ventilator">
              <q-scroll-area
                class="q-pa-es"
                dark
                :style="screen_height"
                :vertical-bar-style="{
                  right: '5px',
                  borderRadius: '5px',
                  background: 'grey-10',
                  width: '5px',
                  opacity: 0.5,
                }"
              >
                <MechanicalVentilator></MechanicalVentilator>
              </q-scroll-area>
            </q-tab-panel>
            <q-tab-panel name="ecls">
              <q-scroll-area
                class="q-pa-es"
                dark
                :style="screen_height"
                :vertical-bar-style="{
                  right: '5px',
                  borderRadius: '5px',
                  background: 'grey-10',
                  width: '5px',
                  opacity: 0.5,
                }"
              >
                <EclsComponent></EclsComponent>
              </q-scroll-area>
            </q-tab-panel>
            <q-tab-panel name="aw">
              <q-scroll-area
                class="q-pa-es"
                dark
                :style="screen_height"
                :vertical-bar-style="{
                  right: '5px',
                  borderRadius: '5px',
                  background: 'grey-10',
                  width: '5px',
                  opacity: 0.5,
                }"
              >
                <PlacentaComponent></PlacentaComponent>
                <ArtificialWhombComponent></ArtificialWhombComponent>
              </q-scroll-area>
            </q-tab-panel>
            <q-tab-panel name="build">
              <q-scroll-area
                class="q-pa-es"
                dark
                :style="screen_height"
                :vertical-bar-style="{
                  right: '5px',
                  borderRadius: '5px',
                  background: 'grey-10',
                  width: '5px',
                  opacity: 0.5,
                }"
              >
                <ModelDiagramEditorComponent></ModelDiagramEditorComponent>
                <BuildModelComponent></BuildModelComponent>
              </q-scroll-area>
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
            outside-arrows
          >
            <q-tab name="scripts" label="Scripts" />
            <q-tab name="charts" label="Charts" />
            <q-tab name="diagram" label="Diagram" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" keep-alive>
            <q-tab-panel name="scripts">
              <q-scroll-area
                class="q-pa-es"
                dark
                :style="screen_height"
                :vertical-bar-style="{
                  right: '5px',
                  borderRadius: '5px',
                  background: 'grey-10',
                  width: '5px',
                  opacity: 0.5,
                }"
              >
                <ScriptComponentVue></ScriptComponentVue>
              </q-scroll-area>
            </q-tab-panel>
            <q-tab-panel name="diagram">
              <q-scroll-area
                class="q-pa-es"
                dark
                :style="screen_height"
                :vertical-bar-style="{
                  right: '5px',
                  borderRadius: '5px',
                  background: 'grey-10',
                  width: '5px',
                  opacity: 0.5,
                }"
              >
                <DiagramComponent></DiagramComponent>
              </q-scroll-area>
            </q-tab-panel>

            <q-tab-panel name="charts">
              <q-scroll-area
                class="q-pa-es"
                dark
                :style="screen_height"
                :vertical-bar-style="{
                  right: '5px',
                  borderRadius: '5px',
                  background: 'grey-10',
                  width: '5px',
                  opacity: 0.5,
                }"
              >
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
                    :loopMode="chart.loopMode"
                  ></TimeChartComponentVue>
                </div>
              </q-scroll-area>
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
            outside-arrows
            @update:model-value="tabRightChanged"
          >
            <q-tab name="monitor" label="monitor" />
            <q-tab name="numerics" label="numerics" />
            <q-tab name="probes" label="probes" />
          </q-tabs>
          <q-separator />
          <q-tab-panels v-model="tab_right" keep-alive>
            <q-tab-panel name="monitor">
              <q-scroll-area
                class="q-pa-es"
                dark
                :style="screen_height"
                :vertical-bar-style="{
                  right: '5px',
                  borderRadius: '5px',
                  background: 'grey-10',
                  width: '5px',
                  opacity: 0.5,
                }"
              >
                <PatientMonitor></PatientMonitor>
                <TrendsMonitor></TrendsMonitor>
              </q-scroll-area>
            </q-tab-panel>

            <q-tab-panel name="numerics">
              <q-scroll-area
                class="q-pa-es"
                dark
                :style="screen_height"
                :vertical-bar-style="{
                  right: '5px',
                  borderRadius: '5px',
                  background: 'grey-10',
                  width: '5px',
                  opacity: 0.5,
                }"
              >
                <div v-for="(monitor, index) in monitors" :key="index">
                  <MonitorComponentVue
                    :title="monitor.title"
                    :collapsed="monitor.collapsed"
                    :data_type="monitor.data_type"
                    :parameters="monitor.parameters"
                  ></MonitorComponentVue>
                </div>
              </q-scroll-area>
            </q-tab-panel>
            <q-tab-panel name="probes">
              <q-scroll-area
                class="q-pa-es"
                dark
                :style="screen_height"
                :vertical-bar-style="{
                  right: '5px',
                  borderRadius: '5px',
                  background: 'grey-10',
                  width: '5px',
                  opacity: 0.5,
                }"
              >
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
                    :loopMode="chart.loopMode"
                  ></TimeChartComponentVue>
                </div>
              </q-scroll-area>
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
import EclsComponent from "src/components/EclsComponent.vue";
import ArtificialWhombComponent from "src/components/ArtificialWhombComponent.vue";
import PlacentaComponent from "src/components/PlacentaComponent.vue";
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
    ArtificialWhombComponent,
    PlacentaComponent,
    EclsComponent,
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
      screen_height: 870,
      screen_offset: 120,
    };
  },
  methods: {
    tabLeftChanged() {
      let h = this.$q.screen.height - this.screen_offset;
      this.screen_height = "height: " + h + "px";

      if (this.tab_left === "ventilator") {
        this.$bus.emit("ventilator_on");
      } else {
        this.$bus.emit("ventilator_off");
      }
    },
    tabRightChanged() {
      let h = this.$q.screen.height - this.screen_offset;
      this.screen_height = "height: " + h + "px";

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
    let h = this.$q.screen.height - this.screen_offset;
    this.screen_height = "height: " + h + "px";
  },
};
</script>

<style></style>
