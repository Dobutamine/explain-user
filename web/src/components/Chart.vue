<template>
  <div>
    <q-separator class="q-mt-sm" size="2px"></q-separator>
    <div class="row q-mt-sm">
      <div class="col">
        <div class="q-gutter-md row justify-center q-mb-sm">
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

    <div class="row q-mt-sm">
      <div class="col">
        <div class="q-gutter-sm row justify-center">
          <q-checkbox
            v-model="show_summary"
            @update:model-value="analyzeData"
            dense
            label="analyze"
            style="font-size: 12px"
          />
          <q-checkbox
            v-model="autoscale"
            dense
            label="autoscale"
            @update:model-value="autoscaling"
            style="font-size: 12px"
          />
          <q-input
            v-if="!autoscale"
            v-model.number="y_min"
            type="number"
            @update:model-value="autoscaling"
            label="min"
            filled
            dense
            hide-bottom-space
            style="width: 100px; font-size: 12px"
          />
          <q-input
            v-if="!autoscale"
            v-model.number="y_max"
            type="number"
            @update:model-value="autoscaling"
            label="max"
            filled
            dense
            hide-bottom-space
            style="width: 100px; font-size: 12px"
          />

          <q-checkbox
            v-model="scaling"
            dense
            label="multipliers"
            style="font-size: 12px"
          />
          <q-input
            v-if="scaling"
            v-model.number="chart1_factor"
            type="number"
            label="y1"
            outlined
            dense
            style="width: 75px; font-size: 10px"
          />
          <q-input
            v-if="scaling"
            v-model.number="chart2_factor"
            type="number"
            label="y2"
            outlined
            dense
            style="width: 75px; font-size: 10px"
          />
          <q-input
            v-if="scaling"
            v-model.number="chart3_factor"
            type="number"
            label="y3"
            outlined
            dense
            style="width: 75px; font-size: 10px"
          />

          <q-btn color="black" size="sm" @click="exportData">EXPORT</q-btn>
        </div>
      </div>
    </div>

    <div v-if="show_summary" class="q-mt-sm">
      <div v-if="chart1_enabled" class="q-gutter-xs row justify-center q-mt-xs">
        <q-input
          color="black"
          v-model="y1_max"
          outlined
          dense
          square
          label="y1 max"
          style="width: 100px; font-size: 12px"
        />
        <q-input
          color="black"
          v-model="y1_min"
          outlined
          dense
          square
          label="y1 min"
          style="width: 100px; font-size: 12px"
        />

        <q-input
          color="black"
          v-model="y1_perbeat"
          outlined
          dense
          square
          label="y1 max-min"
          style="width: 100px; font-size: 12px"
        />
        <q-input
          color="black"
          v-model="y1_mean"
          outlined
          dense
          square
          label="y1 mean"
          style="width: 100px; font-size: 12px"
        />
        <q-input
          color="black"
          v-model="y1_sd"
          outlined
          dense
          square
          label="y1 sd"
          style="width: 100px; font-size: 12px"
        />
        <q-input
          color="black"
          v-model="y1_perminute"
          outlined
          dense
          square
          label="y1 /min"
          style="width: 100px; font-size: 12px"
        />
      </div>
      <div v-if="chart2_enabled" class="q-gutter-xs row justify-center q-mt-xs">
        <q-input
          color="black"
          v-model="y2_max"
          outlined
          dense
          square
          label="y2 max"
          style="width: 100px; font-size: 12px"
        />
        <q-input
          color="black"
          v-model="y2_min"
          outlined
          dense
          square
          label="y2 min"
          style="width: 100px; font-size: 12px"
        />

        <q-input
          color="black"
          v-model="y2_perbeat"
          outlined
          dense
          square
          label="y2 max-min"
          style="width: 100px; font-size: 12px"
        />

        <q-input
          color="black"
          v-model="y2_mean"
          outlined
          dense
          square
          label="y2 mean"
          style="width: 100px; font-size: 12px"
        />
        <q-input
          color="black"
          v-model="y2_sd"
          outlined
          dense
          square
          label="y2 sd"
          style="width: 100px; font-size: 12px"
        />

        <q-input
          color="black"
          v-model="y2_perminute"
          outlined
          dense
          square
          label="y2 /min"
          style="width: 100px; font-size: 12px"
        />
      </div>
    </div>
    <q-separator class="q-mt-sm" size="2px"></q-separator>
  </div>
</template>

<script>
// we have to declare the chart object here otherwise some chart functions won't work!
let chartsXY = {};
import { explain } from "src/boot/explain";
import * as Stat from "simple-statistics";
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
} from "@arction/lcjs";
export default {
  setup() {},
  props: {
    model_types: Array,
    props: Array,
  },
  data() {
    return {
      data_source: 0,
      y1_min: 0,
      y1_max: 0,
      y1_mean: 0,
      y1_sd: 0,
      y1_perminute: 0,
      y1_perbeat: 0,
      y2_min: 0,
      y2_max: 0,
      y2_mean: 0,
      y2_sd: 0,
      y2_perminute: 0,
      y2_perbeat: 0,

      show_summary: false,
      export_file_name: "",
      y_min: 0,
      y_max: 100,
      autoscale: true,
      scaling: false,
      chart1_factor: 1.0,
      chart2_factor: 1.0,

      component_names: [],
      comp_name1: "",
      comp_name2: "",

      selected_component_name1: "",
      selected_component_name2: "",

      chartId: "chart",
      chartData: [],
      chart1_enabled: false,
      chart2_enabled: false,

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
      exportFileName: "data.csv",
    };
  },
  methods: {
    resetAnalysisResults() {
      this.y1_max = 0;
      this.y1_min = 0;
      this.y1_mean = 0;
      this.y1_perbeat = 0;
      this.y1_perminute = 0;
      this.y1_sd = 0;
      this.y2_max = 0;
      this.y2_min = 0;
      this.y2_mean = 0;
      this.y2_perbeat = 0;
      this.y2_perminute = 0;
      this.y2_sd = 0;
    },
    analyzeData() {
      this.resetAnalysisResults();
      const y1_values = [];
      const y2_values = [];

      if (this.chart1_enabled) {
        this.chartData1.forEach((datapoint) => {
          y1_values.push(datapoint.y);
        });
        this.y1_min = Stat.min(y1_values).toFixed(4);
        this.y1_max = Stat.max(y1_values).toFixed(4);
        this.y1_mean = Stat.mean(y1_values).toFixed(4);
        this.y1_sd = Stat.standardDeviation(y1_values).toFixed(4);
        this.y1_perminute = (
          (Stat.sum(y1_values) / parseFloat(y1_values.length)) *
          60.0
        ).toFixed(4);
        this.y1_perbeat = (this.y1_max - this.y1_min).toFixed(4);
      }
      if (this.chart2_enabled) {
        this.chartData2.forEach((datapoint) => {
          y2_values.push(datapoint.y);
        });
        this.y2_min = Stat.min(y2_values).toFixed(4);
        this.y2_max = Stat.max(y2_values).toFixed(4);
        this.y2_mean = Stat.mean(y2_values).toFixed(4);
        this.y2_sd = Stat.standardDeviation(y2_values).toFixed(4);
        this.y2_perminute = (
          (Stat.sum(y2_values) / parseFloat(y2_values.length)) *
          60.0
        ).toFixed(4);
        this.y2_perbeat = (this.y2_max - this.y2_min).toFixed(4);
      }
    },
    exportData() {
      let header = "";
      let t = new Date().toLocaleString();
      if (this.chart1_enabled) {
        header =
          this.selected_component_name1 +
          this.selected_prim_prop_name1 +
          this.selected_sec_prop_name1;
        this.exportFileName = `time_vs_${header}_${t}.csv`;
        this.writeDataToDisk(this.chartData1, "time," + header);
      }
      if (this.chart2_enabled) {
        header =
          this.selected_component_name2 +
          this.selected_prim_prop_name2 +
          this.selected_sec_prop_name2;
        this.exportFileName = `time_vs_${header}_${t}.csv`;
        this.writeDataToDisk(this.chartData2, "time," + header);
      }
    },
    writeDataToDisk(data_object, header) {
      // download to local disk
      const data_csv = this.jsonToCsv(data_object, header);
      const blob = new Blob([data_csv], { type: "text/json" });
      // create an element called a
      const a = document.createElement("a");
      a.download = this.exportFileName;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
      // create a synthetic click MouseEvent
      let evt = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      // dispatch the mouse click event
      a.dispatchEvent(evt);
      // remove the element from the document
      a.remove();
    },
    jsonToCsv(items, _headerString) {
      const headerString = _headerString;
      const rowItems = [];
      items.forEach((data_row) => {
        let x = data_row.x;
        let y = data_row.y;
        let item = x.toString() + ";" + y.toString();
        rowItems.push(item);
      });
      //const csv = "";
      // join header and body, and break into separate lines
      const csv = [headerString, ...rowItems].join("\r\n");
      return csv;
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
      if (!this.scaling) {
        this.chart1_factor = 1.0;
        this.chart2_factor = 1.0;
      }
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
      });
      if (this.chart1_enabled) {
        this.lineSeries1.add(this.chartData1);
      }
      if (this.chart2_enabled) {
        this.lineSeries2.add(this.chartData2);
      }

      if (this.show_summary) {
        this.analyzeData();
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
        responsive: true,
        maintainAspectRatio: false,
        willReadFrequently: true,
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
        .setTitleFillStyle(new SolidFill({ color: ColorHEX("#fff") }))
        .setTitleFont(new FontSettings({ size: 12, style: "normal" }))
        .setTickStrategy(AxisTickStrategies.Numeric)
        .setTickStyle((a) =>
          a.setMajorTickStyle((b) => b.setLabelFont((font) => font.setSize(10)))
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
