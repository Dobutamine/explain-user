<template>
  <div>
    <q-card class="q-pb-xs q-ma-sm" bordered>
      <div
        class="q-mt-es row gutter text-overline justify-center"
        @click="toggleVisibility"
      >
        {{ caption }}
        <q-icon
          v-if="!isEnabled"
          class="q-ml-sm q-mt-sm"
          name="fa-solid fa-chevron-down"
        ></q-icon>
        <q-icon
          v-if="isEnabled"
          class="q-ml-sm q-mt-sm"
          name="fa-solid fa-chevron-up"
        ></q-icon>
      </div>
      <div :style="visible">
        <div class="chart" :id="chartId"></div>
      </div>
    </q-card>
  </div>
</template>

<script>
// we have to declare the chart object here otherwise some chart functions won't work!
let chartsXY = {};
import { explain } from "src/boot/explain";
import * as Stat from "simple-statistics";
import { useConfigStore } from "src/stores/config";
import { useEngineStore } from "src/stores/engine";
import {
  lightningChart,
  emptyFill,
  ColorRGBA,
  SolidFill,
  ColorHEX,
  AxisTickStrategies,
  AxisScrollStrategies,
  FontSettings,
  Themes,
  _themeLoaderDuskInLapland,
} from "@arction/lcjs";
export default {
  setup() {
    const uiConfig = useConfigStore();
    const engine = useEngineStore();
    return {
      uiConfig,
      engine,
    };
  },
  props: {
    id: String,
    caption: String,
    models: Array,
    props: Array,
    channels: Number,
    collapsed: Boolean,
    enabled: Boolean,
    analysisEnabled: Boolean,
    autoscaleEnabled: Boolean,
    multipliersEnabled: Boolean,
    exportEnabled: Boolean,
    fixedProp: Boolean,
  },
  data() {
    return {
      isEnabled: true,
      visible: "",
      data_source: 0,
      y_min: 0,
      y_max: 100,
      autoscale: true,
      scaling: false,
      chart1_factor: 1.0,
      chart2_factor: 1.0,
      chart3_factor: 1.0,

      selected_component_name1: "",
      selected_prim_prop_name1: "",
      selected_sec_prop_name1: "",

      selected_component_name2: "",
      selected_prim_prop_name2: "",
      selected_sec_prop_name2: "",

      selected_component_name3: "",
      selected_prim_prop_name3: "",
      selected_sec_prop_name3: "",

      chartId: "chart",
      chartData: [],
      chart1_enabled: false,
      chart2_enabled: false,
      chart3_enabled: false,
      autoscaleX: false,
      autoscaleY: false,
      title: "Title",
      lineTitle: "LineTitle",
      yLabel: "",
      xLabel: "time(s)",
      width: "100%",
      height: "300px",
      first_run: true,
      lineSeries1: null,
      lineSeries2: null,
      lineSeries3: null,
    };
  },
  methods: {
    toggleVisibility() {
      this.isEnabled = !this.isEnabled;
      if (this.isEnabled) {
        this.visible = "visibility: visible;";
      } else {
        this.visible = "visibility: collapse; height: 0px";
      }
    },

    autoscaling() {
      if (this.autoscale) {
        chartsXY[this.chartId].chartYAxis.setScrollStrategy(
          AxisScrollStrategies.fitting
        );
      } else {
        chartsXY[this.chartId].chartYAxis.setScrollStrategy(
          AxisScrollStrategies.Numeric
        );
        chartsXY[this.chartId].chartYAxis.setInterval(this.y_min, this.y_max);
      }
    },

    stateUpdate() {
      // reset the component names as the model state is updated
      this.component_names = [""];
      // read all model components
      Object.keys(explain.modelState.Models).forEach((key) => {
        let mt = explain.modelState.Models[key].ModelType;
        if (this.models.length > 0) {
          if (this.models.includes(mt)) {
            this.component_names.push(key);
          }
        } else {
          this.component_names.push(key);
        }
      });
      // sort the model components alphabetically
      this.component_names.sort();
    },

    rtUpdate() {
      if (!this.isEnabled) return;
      this.data_source = 1;
      this.dataUpdate();
      this.data_source = 0;
    },
    dataUpdate() {
      if (!this.isEnabled) return;

      if (this.data_source == 0) {
        this.chartData1 = [];
        this.chartData2 = [];
        this.chartData3 = [];
      }
      this.lineSeries1.clear();

      if (this.lineSeries2) {
        this.lineSeries2.clear();
      }

      if (this.lineSeries3) {
        this.lineSeries3.clear();
      }

      if (!this.scaling) {
        this.chart1_factor = 1.0;
        this.chart2_factor = 1.0;
        this.chart3_factor = 1.0;
      }

      let prop1 = "";
      this.chart1_enabled = false;
      if (this.selected_component_name1 && this.selected_prim_prop_name1) {
        this.chart1_enabled = true;
        prop1 =
          this.selected_component_name1 + "." + this.selected_prim_prop_name1;
        if (this.selected_sec_prop_name1) {
          prop1 += "." + this.selected_sec_prop_name1;
        }
      }

      let prop2 = "";
      this.chart2_enabled = false;
      if (this.selected_component_name2 && this.selected_prim_prop_name2) {
        this.chart2_enabled = true;
        prop2 =
          this.selected_component_name2 + "." + this.selected_prim_prop_name2;
        if (this.selected_sec_prop_name2) {
          prop2 += "." + this.selected_sec_prop_name2;
        }
      }

      let prop3 = "";
      this.chart3_enabled = false;
      if (this.selected_component_name3 && this.selected_prim_prop_name3) {
        this.chart3_enabled = true;
        prop3 =
          this.selected_component_name3 + "." + this.selected_prim_prop_name3;
        if (this.selected_sec_prop_name3) {
          prop3 += "." + this.selected_sec_prop_name3;
        }
      }

      explain.modelData.forEach((data) => {
        if (this.chart1_enabled) {
          let y1 = parseFloat(data[prop1]) * this.chart1_factor;

          this.chartData1.push({
            x: data.time,
            y: y1,
          });
          if (this.data_source === 1) {
            this.chartData1.shift();
          }
        }
        if (this.chart2_enabled) {
          let y2 = parseFloat(data[prop2]) * this.chart2_factor;

          this.chartData2.push({
            x: data.time,
            y: y2,
          });
          if (this.data_source === 1) {
            this.chartData2.shift();
          }
        }
        if (this.chart3_enabled) {
          let y3 = parseFloat(data[prop3]) * this.chart3_factor;

          this.chartData3.push({
            x: data.time,
            y: y3,
          });
          if (this.data_source === 1) {
            this.chartData3.shift();
          }
        }
      });

      if (this.chart1_enabled) {
        this.lineSeries1.add(this.chartData1);
      }
      if (this.chart2_enabled) {
        this.lineSeries2.add(this.chartData2);
      }
      if (this.chart3_enabled) {
        this.lineSeries3.add(this.chartData3);
      }
    },

    createChart() {
      let chart_object = {
        chart: null,
        chartXAxis: null,
        chartYAxis: null,
      };
      // Set up chart
      chart_object.chart = lightningChart().ChartXY({
        container: this.chartId,
        theme: Themes.darkGold,
        antialias: true,
        disableAnimations: false,
        responsive: true,
        maintainAspectRatio: false,
      });
      // chart_object.chart.setTitle(this.title);
      // chart_object.chart.setTitleFont(
      //   new FontSettings({ size: 12, style: "normal" })
      // );
      chart_object.chart.setTitleFillStyle(emptyFill);
      chart_object.chart.setPadding({
        top: 10,
        bottom: 0,
        left: 15,
        right: 30,
      });
      // Set up axes
      chart_object.chartXAxis = chart_object.chart.getDefaultAxisX();
      chart_object.chartXAxis
        .setTitle(this.xLabel)
        .setTitleFillStyle(new SolidFill({ color: ColorHEX("#fff") }))
        .setTitleFont(new FontSettings({ size: 12, style: "normal" }))
        .setTickStrategy(AxisTickStrategies.Numeric)
        .setTickStyle((a) =>
          a.setMajorTickStyle((b) => b.setLabelFont((font) => font.setSize(10)))
        )
        .setTickStyle((a) =>
          a.setMinorTickStyle((b) => b.setLabelFont((font) => font.setSize(8)))
        )
        .setScrollStrategy(AxisScrollStrategies.fitting)
        .setAnimationScroll(false);
      chart_object.chartYAxis = chart_object.chart.getDefaultAxisY();
      chart_object.chartYAxis
        .setTitle(this.yLabel)
        .setTitleFillStyle(new SolidFill({ color: ColorHEX("#ff0000") }))
        .setTitleFont(new FontSettings({ size: 12, style: "normal" }))
        .setTickStrategy(AxisTickStrategies.Numeric)
        .setTickStyle((a) =>
          a.setMajorTickStyle((b) => b.setLabelFont((font) => font.setSize(10)))
        )
        .setTickStyle((a) =>
          a.setMinorTickStyle((b) => b.setLabelFont((font) => font.setSize(8)))
        )
        .setScrollStrategy(AxisScrollStrategies.fitting);

      this.lineSeries1 = chart_object.chart
        .addLineSeries()
        .setName(this.lineTitle);
      this.lineSeries1.setStrokeStyle((style) => style.setThickness(2));
      this.lineSeries1.setStrokeStyle((style) =>
        style.setFillStyle(new SolidFill({ color: ColorRGBA(200, 0, 0) }))
      );

      if (this.channels > 1) {
        this.lineSeries2 = chart_object.chart
          .addLineSeries()
          .setName(this.lineTitle);
        this.lineSeries2.setStrokeStyle((style) => style.setThickness(2));
        this.lineSeries2.setStrokeStyle((style) =>
          style.setFillStyle(new SolidFill({ color: ColorRGBA(0, 200, 0) }))
        );
      }

      if (this.channels > 2) {
        this.lineSeries3 = chart_object.chart
          .addLineSeries()
          .setName(this.lineTitle);
        this.lineSeries3.setStrokeStyle((style) => style.setThickness(2));
        this.lineSeries3.setStrokeStyle((style) =>
          style.setFillStyle(new SolidFill({ color: ColorRGBA(0, 0, 200) }))
        );
      }

      // add the chart to the global chartsXY array
      chartsXY[this.chartId] = chart_object;
    },
  },
  beforeUnmount() {
    // remove the current chart from the chartsXY array (which is a global object)
    delete chartsXY[this.chartId];
    document.removeEventListener("data", this.dataUpdate);
    document.removeEventListener("state", this.stateUpdate);
    document.removeEventListener("rt", this.rtUpdate);
  },
  beforeMount() {
    // generate a unique chartID
    this.chartId = "chart" + Math.floor(Math.random() * 10000);
  },
  mounted() {
    // remove handlers
    try {
      document.removeEventListener("data", this.dataUpdate);
      document.removeEventListener("state", this.stateUpdate);
      document.removeEventListener("rt", this.rtUpdate);
    } catch {}

    if (this.fixedProp) {
      this.selected_component_name1 = this.models[0];
      this.selected_prim_prop_name1 = this.props[0];
      this.selected_sec_prop_name1 = "";
      this.selected_component_name2 = this.models[0];
      this.selected_prim_prop_name2 = this.props[1];
      this.selected_component_name3 = this.models[0];
      this.selected_prim_prop_name3 = this.props[2];
      this.selected_sec_prop_name2 = "";
      explain.watchModelProperties([
        this.selected_component_name1 + "." + this.selected_prim_prop_name1,
        this.selected_component_name1 + "." + this.selected_prim_prop_name2,
        this.selected_component_name1 + "." + this.selected_prim_prop_name3,
      ]);
      this.height = "100px";
    }

    // create the chart
    this.createChart();

    // get the model state
    explain.getModelState();
    document.addEventListener("rt", this.rtUpdate);
    document.addEventListener("data", this.dataUpdate);
    document.addEventListener("state", this.stateUpdate);
    //this.toggleVisibility();
    this.chartData1 = [];
    this.chartData2 = [];
    this.chartData3 = [];
    // get the visibilty
    this.isEnabled = this.collapsed;
    this.toggleVisibility();
  },
};
</script>

<style>
.chart {
  background: black;
  width: 100%;
  height: 200px;
  align-self: flex-start;
}
</style>
