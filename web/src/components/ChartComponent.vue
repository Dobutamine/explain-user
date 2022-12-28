<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <div
      class="q-mt-es row gutter text-overline justify-center"
      @click="toggleVisibility"
    >
      {{ title }}
    </div>
    <div :style="visible">
      <div class="row">
        <div class="col">
          <div class="q-gutter-sm row justify-center q-mb-sm">
            <q-select
              label-color="red-6"
              v-model="comp_name1"
              :options="component_names"
              hide-bottom-space
              dense
              label="y1"
              style="width: 100px; font-size: 12px"
              @update:model-value="selectComponent1"
            />

            <q-select
              class="q-ml-md"
              label-color="green-6"
              v-model="comp_name2"
              :options="component_names"
              hide-bottom-space
              dense
              label="y2"
              style="width: 100px; font-size: 12px"
              @update:model-value="selectComponent2"
            />
          </div>
        </div>
      </div>
      <div class="chart" :id="chartId"></div>
    </div>
  </q-card>
</template>

<script>
// we have to declare the chart object here otherwise some chart functions won't work!
let chartsXY = {};
import { explain } from "src/boot/explain";
import {
  customSimpleTheme,
  customComplexTheme,
  lightningChart,
  emptyFill,
  ColorRGBA,
  SolidFill,
  ColorHEX,
  AxisTickStrategies,
  AxisScrollStrategies,
  FontSettings,
  Themes,
  DarkTheme,
  Color,
} from "@arction/lcjs";
export default {
  setup() {},
  props: {
    title: String,
    collapsed: Boolean,
    model_types: Array,
    props: Array,
  },
  data() {
    return {
      isEnabled: true,
      visible: "",
      data_source: 0,

      first_run: true,
      export_file_name: "",
      y_min: 0,
      y_max: 100,

      component_names: [],
      comp_name1: "",
      comp_name2: "",

      selected_component_name1: "",
      selected_component_name2: "",

      chartId: "chart",
      chartData: [],
      chart1_enabled: false,
      chart2_enabled: false,

      lineTitle: "LineTitle",
      yLabel: "",
      xLabel: "time(s)",
      width: "100%",
      height: "300px",
      lineSeries1: null,
      lineSeries2: null,
    };
  },
  methods: {
    toggleVisibility() {
      this.isEnabled = !this.isEnabled;
      if (this.isEnabled) {
        this.visible = "visibility: visible; height: 300px";
      } else {
        this.visible = "visibility: collapse; height: 0px";
      }
    },
    selectComponent1(selection) {
      if (selection === "") {
        // remove previous watched value
        if (this.selected_component_name1) {
          explain.unwatchModelProperty(this.selected_component_name1);
        }
      }
      this.selected_component_name1 = selection;
    },
    selectComponent2(selection) {
      if (selection === "") {
        if (this.selected_component_name2) {
          explain.unwatchModelProperty(this.selected_component_name2);
        }
      }
      this.selected_component_name2 = selection;
    },

    stateUpdate() {
      // reset the component names as the model state is updated
      this.component_names = [""];
      // read all model components which are in model_types and combine with the props which are in props
      Object.keys(explain.modelState).forEach((key) => {
        this.component_names.push(key);
      });
      // sort the model components alphabetically
      this.component_names.sort();
    },

    rtUpdate() {
      this.data_source = 1;
      this.dataUpdate();
      this.data_source = 0;
    },
    dataUpdate() {
      if (this.data_source === 0) {
        this.chartData1 = [];
        this.chartData2 = [];
      }
      this.lineSeries1.clear();
      this.lineSeries2.clear();

      let prop1 = "";
      this.chart1_enabled = false;
      if (this.selected_component_name1) {
        this.chart1_enabled = true;
        prop1 = this.selected_component_name1;
      }
      let prop2 = "";
      this.chart2_enabled = false;
      if (this.selected_component_name2) {
        this.chart2_enabled = true;
        prop2 = this.selected_component_name2;
      }
      explain.modelData.forEach((data) => {
        if (this.chart1_enabled) {
          let y1 = parseFloat(data[prop1]);
          this.chartData1.push({
            x: data.time,
            y: y1,
          });
          if (this.data_source === 1) {
            this.chartData1.shift();
          }
        }
        if (this.chart2_enabled) {
          let y2 = parseFloat(data[prop2]);
          this.chartData2.push({
            x: data.time,
            y: y2,
          });
          if (this.data_source === 1) {
            this.chartData2.shift();
          }
        }
      });
      if (this.chart1_enabled) {
        this.lineSeries1.add(this.chartData1);
      }
      if (this.chart2_enabled) {
        this.lineSeries2.add(this.chartData2);
      }
    },
    calculate() {
      explain.calculate(parseInt(this.number_of_seconds));
      if (this.first_run) {
        explain.getModelState();
        this.first_run = false;
      }
      this.resetAnalysisResults();
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
        responsive: false,
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
        right: 15,
      });
      // Set up axes
      chart_object.chartXAxis = chart_object.chart.getDefaultAxisX();
      chart_object.chartXAxis
        .setTitle(this.xLabel)
        .setTitleFillStyle(new SolidFill({ color: ColorHEX("#fff") }))
        .setTitleFont(new FontSettings({ size: 10, style: "normal" }))
        .setTickStrategy(AxisTickStrategies.Numeric)
        .setTickStyle((a) =>
          a.setMajorTickStyle((b) => b.setLabelFont((font) => font.setSize(8)))
        )
        .setTickStyle((a) =>
          a.setMinorTickStyle((b) => b.setLabelFont((font) => font.setSize(8)))
        )
        .setScrollStrategy(AxisScrollStrategies.fitting)
        .setAnimationScroll(false);
      chart_object.chartYAxis = chart_object.chart.getDefaultAxisY();
      chart_object.chartYAxis
        .setTitle(this.yLabel)
        .setTitleFillStyle(new SolidFill({ color: ColorHEX("#fff") }))
        .setTitleFont(new FontSettings({ size: 10, style: "normal" }))
        .setTickStrategy(AxisTickStrategies.Numeric)
        .setTickStyle((a) =>
          a.setMajorTickStyle((b) => b.setLabelFont((font) => font.setSize(8)))
        )
        .setTickStyle((a) =>
          a.setMinorTickStyle((b) => b.setLabelFont((font) => font.setSize(8)))
        )
        .setScrollStrategy(AxisScrollStrategies.fitting);
      //.setAnimationScroll(false);
      /*  Axis.setScrollStrategy | configure automatic scrolling behavior.
          Axis.setInterval | configure active axis interval.
          Axis.getInterval | get active axis interval.
          Axis.fit | fit axis interval to contain all attached series boundaries.
          Axis.stop | stop automatic scrolling momentarily.
          Axis.onScaleChange | trigger a custom action whenever axis scale changes.
          Axis.setAnimationScroll | Enable/disable automatic scrolling animation.
          Axis.disableAnimations | Disable all animations for the Axis.
      */
      // https://lightningchart.com/lightningchart-js-api-documentation/v3.4.0/classes/axis.html
      //   dummy data
      this.lineSeries1 = chart_object.chart
        .addLineSeries()
        .setName(this.lineTitle);
      this.lineSeries1.setStrokeStyle((style) => style.setThickness(2));
      this.lineSeries1.setStrokeStyle((style) =>
        style.setFillStyle(new SolidFill({ color: ColorRGBA(200, 0, 0) }))
      );
      this.lineSeries2 = chart_object.chart
        .addLineSeries()
        .setName(this.lineTitle);
      this.lineSeries2.setStrokeStyle((style) => style.setThickness(2));
      this.lineSeries2.setStrokeStyle((style) =>
        style.setFillStyle(new SolidFill({ color: ColorRGBA(0, 200, 0) }))
      );

      //this.lineSeries.add(this.points);
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
    // create the chart
    this.createChart();
    // get the model state
    explain.getModelState();
    document.addEventListener("rt", this.rtUpdate);
    document.addEventListener("data", this.dataUpdate);
    document.addEventListener("state", this.stateUpdate);
    this.isEnabled = !this.collapsed;
    this.toggleVisibility();
  },
};
</script>

<style>
.chart {
  background: black;
  width: 100%;
  height: 250px;
  align-self: flex-start;
}
</style>
