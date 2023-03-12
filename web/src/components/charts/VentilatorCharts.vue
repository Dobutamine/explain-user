<template>
  <div>
    <q-card class="q-pb-sm q-ma-sm bg-black" bordered>
      <div :style="visible" class="q-ma-sm">
        <div class="chart" :id="chartId"></div>
        <div class="font-size-9 q-mt-sm text-center">
          <q-btn-toggle
            v-model="loopMode"
            outline
            dense
            size="sm"
            toggle-color="secondary"
            :options="[
              { label: 'CHARTS', value: false },
              { label: 'LOOPS', value: true },
            ]"
            @update:model-value="enableLoops"
          />
        </div>
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
  AutoCursorModes,
  emptyTick,
} from "@arction/lcjs";
import { MechanicalVentilator } from "src/explain/ModelIndex";
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
      loopMode: false,
      visible: "",
      data_source: 0,
      y_min: 0,
      y_max: 100,
      autoscale: true,
      scaling: false,
      chart1_factor: 1.3595,
      chart1_offset: 760,
      chart2_factor: 60.0,
      chart3_factor: 1000.0,

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
      if (!explain.modelState.Models["MechanicalVentilator"].IsEnabled) return;
      this.data_source = 1;
      if (this.loopMode) {
        this.dataUpdateLoopMode();
      } else {
        this.dataUpdate();
      }

      this.data_source = 0;
    },
    dataUpdateLoopMode() {
      if (!this.isEnabled) return;
      if (!explain.modelState.Models["MechanicalVentilator"].IsEnabled) return;

      if (this.data_source == 0) {
        this.chartData1 = [];
        this.chartData2 = [];
        this.chartData3 = [];
      }

      this.lineSeries1.clear();
      this.lineSeries2.clear();
      this.lineSeries3.clear();

      explain.modelData.forEach((data) => {
        this.chartData1.push({
          x: parseFloat(data["MechanicalVentilator.Pres"] - 760.0) * 1.3595,
          y: parseFloat(data["MechanicalVentilator.Volume"] * 1000),
        });
        if (this.data_source === 1) {
          this.chartData1.shift();
        }

        let y2 = parseFloat(data["MechanicalVentilator.Flow"]) * 60.0;

        this.chartData2.push({
          x: parseFloat(data["MechanicalVentilator.Volume"] * 1000),
          y: y2,
        });
        if (this.data_source === 1) {
          this.chartData2.shift();
        }

        let y3 = parseFloat(data["MechanicalVentilator.Volume"]) * 1000;

        this.chartData3.push({
          x: data.time,
          y: y3,
        });
        if (this.data_source === 1) {
          this.chartData3.shift();
        }
      });

      this.lineSeries1.add(this.chartData1);

      this.lineSeries2.add(this.chartData2);

      this.lineSeries3.add(this.chartData3);
    },
    dataUpdate() {
      if (!this.isEnabled) return;
      if (!explain.modelState.Models["MechanicalVentilator"].IsEnabled) return;

      if (this.data_source == 0) {
        this.chartData1 = [];
        this.chartData2 = [];
        this.chartData3 = [];
      }

      this.lineSeries1.clear();
      this.lineSeries2.clear();
      this.lineSeries3.clear();

      explain.modelData.forEach((data) => {
        let y1 = parseFloat(data["MechanicalVentilator.Pres"] - 760.0) * 1.3595;

        this.chartData1.push({
          x: data.time,
          y: y1,
        });
        if (this.data_source === 1) {
          this.chartData1.shift();
        }

        let y2 = parseFloat(data["MechanicalVentilator.Flow"]) * 60.0;

        this.chartData2.push({
          x: data.time,
          y: y2,
        });
        if (this.data_source === 1) {
          this.chartData2.shift();
        }

        let y3 = parseFloat(data["MechanicalVentilator.Volume"]) * 1000;

        this.chartData3.push({
          x: data.time,
          y: y3,
        });
        if (this.data_source === 1) {
          this.chartData3.shift();
        }
      });

      this.lineSeries1.add(this.chartData1);

      this.lineSeries2.add(this.chartData2);

      this.lineSeries3.add(this.chartData3);
    },
    enableLoops() {
      this.lineSeries1.clear();
      this.lineSeries2.clear();
      if (this.loopMode) {
        chartsXY[this.chartId].dashboard.setRowHeight(0, 1.5);
        chartsXY[this.chartId].chart1XAxis.setTitle("Pres (cmH2O)");
        chartsXY[this.chartId].chart1YAxis.setTitle("Vol (mL)");
        chartsXY[this.chartId].chart1XAxis
          .setTitleFillStyle(new SolidFill({ color: ColorHEX("#ffffff") }))
          .setTitleFont(new FontSettings({ size: 8, style: "normal" }));

        chartsXY[this.chartId].chart2XAxis.setTitle("Vol (mL)");
        chartsXY[this.chartId].chart2YAxis.setTitle("Flow (l/min)");
        chartsXY[this.chartId].chart2XAxis
          .setTitleFillStyle(new SolidFill({ color: ColorHEX("#ffffff") }))
          .setTitleFont(new FontSettings({ size: 8, style: "normal" }));

        chartsXY[this.chartId].chart1XAxis
          .setTickStrategy(AxisTickStrategies.Numeric)
          .setTickStyle((a) =>
            a.setMajorTickStyle((b) =>
              b.setLabelFont((font) => font.setSize(8))
            )
          )
          .setTickStyle((a) =>
            a.setMinorTickStyle((b) =>
              b.setLabelFont((font) => font.setSize(8))
            )
          )
          .setScrollStrategy(AxisScrollStrategies.fitting);
        chartsXY[this.chartId].dashboard.setRowHeight(1, 1.5);
        chartsXY[this.chartId].chart2XAxis
          .setTickStrategy(AxisTickStrategies.Numeric)
          .setTickStyle((a) =>
            a.setMajorTickStyle((b) =>
              b.setLabelFont((font) => font.setSize(8))
            )
          )
          .setTickStyle((a) =>
            a.setMinorTickStyle((b) =>
              b.setLabelFont((font) => font.setSize(8))
            )
          )
          .setScrollStrategy(AxisScrollStrategies.fitting);
        chartsXY[this.chartId].dashboard.setRowHeight(2, 0.1);
        chartsXY[this.chartId].chart3.dispose();
      } else {
        chartsXY[this.chartId].dashboard.setRowHeight(0, 0.5);

        chartsXY[this.chartId].chart1XAxis
          .setTitleFillStyle(emptyFill)
          .setTickStrategy(AxisTickStrategies.Empty)
          .setScrollStrategy(AxisScrollStrategies.fitting)
          .setAnimationScroll(false);
        chartsXY[this.chartId].chart2XAxis
          .setTitleFillStyle(emptyFill)
          .setTickStrategy(AxisTickStrategies.Empty)
          .setScrollStrategy(AxisScrollStrategies.fitting)
          .setAnimationScroll(false);
        chartsXY[this.chartId].dashboard.setRowHeight(1, 0.5);
        chartsXY[this.chartId].dashboard.setRowHeight(2, 0.5);
        this.createChart3();
      }
    },
    createChart3() {
      chartsXY[this.chartId].chart3 = chartsXY[this.chartId].dashboard
        .createChartXY({ rowIndex: 2, columnIndex: 0 })
        .setPadding({ bottom: 4, top: 4, right: 4, left: 4 })
        .setMouseInteractions(false)
        .setAutoCursorMode(AutoCursorModes.disabled)
        .setTitleFillStyle(emptyFill);
      chartsXY[this.chartId].chart3XAxis = chartsXY[this.chartId].chart3
        .getDefaultAxisX()
        .setTickStrategy(AxisTickStrategies.Numeric)
        .setTickStyle((a) =>
          a.setMajorTickStyle((b) => b.setLabelFont((font) => font.setSize(6)))
        )
        .setTickStyle((a) =>
          a.setMinorTickStyle((b) => b.setLabelFont((font) => font.setSize(6)))
        )
        .setScrollStrategy(AxisScrollStrategies.fitting)
        .setAnimationScroll(false);
      chartsXY[this.chartId].chart3YAxis = chartsXY[this.chartId].chart3
        .getDefaultAxisY()
        .setTitle("Vol (mL)")
        .setTitleFillStyle(new SolidFill({ color: ColorHEX("#ffffff") }))
        .setTitleFont(new FontSettings({ size: 8, style: "normal" }))
        .setTickStrategy(AxisTickStrategies.Numeric)
        .setTickStyle((a) =>
          a.setMajorTickStyle((b) => b.setLabelFont((font) => font.setSize(8)))
        )
        .setTickStyle((a) =>
          a.setMinorTickStyle((b) => b.setLabelFont((font) => font.setSize(8)))
        )
        .setScrollStrategy(AxisScrollStrategies.fitting);

      this.lineSeries3 = chartsXY[this.chartId].chart3
        .addLineSeries()
        .setName(this.lineTitle);
      this.lineSeries3.setStrokeStyle((style) => style.setThickness(2));
      this.lineSeries3.setStrokeStyle((style) =>
        style.setFillStyle(new SolidFill({ color: ColorRGBA(0, 200, 0) }))
      );
    },

    createDashboard() {
      let chart_object = {
        dashboard: null,
        chart1: null,
        chart2: null,
        chart3: null,
        chart1XAxis: null,
        chart1YAxis: null,
        chart2XAxis: null,
        chart2YAxis: null,
        chart3XAxis: null,
        chart3YAxis: null,
      };

      chart_object.dashboard = lightningChart()
        .Dashboard({
          numberOfRows: 3,
          numberOfColumns: 1,
          disableAnimations: true,
          container: this.chartId,
          // theme: Themes.darkGold
        })
        .setRowHeight(0, 0.5)
        .setRowHeight(1, 0.5)
        .setRowHeight(2, 0.6);

      // chart 1
      chart_object.chart1 = chart_object.dashboard
        .createChartXY({ rowIndex: 0, columnIndex: 0 })
        .setPadding({ bottom: 4, top: 4, right: 4, left: 4 })
        .setMouseInteractions(false)
        .setAutoCursorMode(AutoCursorModes.disabled)
        .setTitleFillStyle(emptyFill);
      chart_object.chart1XAxis = chart_object.chart1
        .getDefaultAxisX()
        .setTitleFillStyle(emptyFill)
        .setTickStrategy(AxisTickStrategies.Empty)
        .setScrollStrategy(AxisScrollStrategies.fitting)
        .setAnimationScroll(false);
      chart_object.chart1YAxis = chart_object.chart1
        .getDefaultAxisY()
        .setTitle("Pres (cmH2O)")
        .setTitleFillStyle(new SolidFill({ color: ColorHEX("#ffffff") }))
        .setTitleFont(new FontSettings({ size: 8, style: "normal" }))
        .setTickStrategy(AxisTickStrategies.Numeric)
        .setTickStyle((a) =>
          a.setMajorTickStyle((b) => b.setLabelFont((font) => font.setSize(8)))
        )
        .setTickStyle((a) =>
          a.setMinorTickStyle((b) => b.setLabelFont((font) => font.setSize(8)))
        )
        .setScrollStrategy(AxisScrollStrategies.fitting);

      this.lineSeries1 = chart_object.chart1
        .addLineSeries()
        .setName(this.lineTitle);
      this.lineSeries1.setStrokeStyle((style) => style.setThickness(2));
      this.lineSeries1.setStrokeStyle((style) =>
        style.setFillStyle(new SolidFill({ color: ColorRGBA(0, 200, 0) }))
      );

      chart_object.chart2 = chart_object.dashboard
        .createChartXY({ rowIndex: 1, columnIndex: 0 })
        .setPadding({ bottom: 4, top: 4, right: 4, left: 4 })
        .setMouseInteractions(false)
        .setAutoCursorMode(AutoCursorModes.disabled)
        .setTitleFillStyle(emptyFill);
      chart_object.chart2XAxis = chart_object.chart2
        .getDefaultAxisX()
        .setTitleFillStyle(emptyFill)
        .setTickStrategy(AxisTickStrategies.Empty)
        .setScrollStrategy(AxisScrollStrategies.fitting)
        .setAnimationScroll(false);
      chart_object.chart2YAxis = chart_object.chart2
        .getDefaultAxisY()
        .setTitle("Flow (l/min)")
        .setTitleFillStyle(new SolidFill({ color: ColorHEX("#ffffff") }))
        .setTitleFont(new FontSettings({ size: 8, style: "normal" }))
        .setTickStrategy(AxisTickStrategies.Numeric)
        .setTickStyle((a) =>
          a.setMajorTickStyle((b) => b.setLabelFont((font) => font.setSize(8)))
        )
        .setTickStyle((a) =>
          a.setMinorTickStyle((b) => b.setLabelFont((font) => font.setSize(8)))
        )
        .setScrollStrategy(AxisScrollStrategies.fitting);

      this.lineSeries2 = chart_object.chart2
        .addLineSeries()
        .setName(this.lineTitle);
      this.lineSeries2.setStrokeStyle((style) => style.setThickness(2));
      this.lineSeries2.setStrokeStyle((style) =>
        style.setFillStyle(new SolidFill({ color: ColorRGBA(0, 200, 0) }))
      );

      chart_object.chart3 = chart_object.dashboard
        .createChartXY({ rowIndex: 2, columnIndex: 0 })
        .setPadding({ bottom: 4, top: 4, right: 4, left: 4 })
        .setMouseInteractions(false)
        .setAutoCursorMode(AutoCursorModes.disabled)
        .setTitleFillStyle(emptyFill);
      chart_object.chart3XAxis = chart_object.chart3
        .getDefaultAxisX()
        .setTickStrategy(AxisTickStrategies.Numeric)
        .setTickStyle((a) =>
          a.setMajorTickStyle((b) => b.setLabelFont((font) => font.setSize(6)))
        )
        .setTickStyle((a) =>
          a.setMinorTickStyle((b) => b.setLabelFont((font) => font.setSize(6)))
        )
        .setScrollStrategy(AxisScrollStrategies.fitting)
        .setAnimationScroll(false);
      chart_object.chart3YAxis = chart_object.chart3
        .getDefaultAxisY()
        .setTitle("Vol (mL)")
        .setTitleFillStyle(new SolidFill({ color: ColorHEX("#ffffff") }))
        .setTitleFont(new FontSettings({ size: 8, style: "normal" }))
        .setTickStrategy(AxisTickStrategies.Numeric)
        .setTickStyle((a) =>
          a.setMajorTickStyle((b) => b.setLabelFont((font) => font.setSize(8)))
        )
        .setTickStyle((a) =>
          a.setMinorTickStyle((b) => b.setLabelFont((font) => font.setSize(8)))
        )
        .setScrollStrategy(AxisScrollStrategies.fitting);

      this.lineSeries3 = chart_object.chart3
        .addLineSeries()
        .setName(this.lineTitle);
      this.lineSeries3.setStrokeStyle((style) => style.setThickness(2));
      this.lineSeries3.setStrokeStyle((style) =>
        style.setFillStyle(new SolidFill({ color: ColorRGBA(0, 200, 0) }))
      );

      // add chart object
      chartsXY[this.chartId] = chart_object;
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
        "MechanicalVentilator.Vol",
        this.selected_component_name1 + "." + this.selected_prim_prop_name1,
        this.selected_component_name1 + "." + this.selected_prim_prop_name2,
        this.selected_component_name1 + "." + this.selected_prim_prop_name3,
      ]);
      this.height = "100px";
    }

    // create the chart
    //this.createChart();
    this.createDashboard();

    // get the model state
    explain.getModelState();
    document.addEventListener("rt", this.rtUpdate);
    document.addEventListener("data", () => {
      if (this.loopMode) {
        this.dataUpdateLoopMode();
      } else {
        this.dataUpdate();
      }
    });
    document.addEventListener("state", this.stateUpdate);
    //this.toggleVisibility();
    this.chartData1 = [];
    this.chartData2 = [];
    this.chartData3 = [];
    // get the visibilty
    this.isEnabled = this.collapsed;
    this.toggleVisibility();

    this.$bus.on("ventilator_on", () => {
      console.log("ventilator screen on");
      this.isEnabled = true;
    });

    this.$bus.on("ventilator_off", () => {
      console.log("ventilator screen off");
      this.isEnabled = false;
    });
  },
};
</script>

<style>
.chart {
  background: black;
  width: 100%;
  height: 275px;
  align-self: flex-start;
}
</style>
