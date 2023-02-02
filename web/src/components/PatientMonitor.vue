<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <div
      class="q-mt-es q-mb-sm row gutter text-overline justify-center"
      @click="isEnabled = !isEnabled"
    >
      PATIENT MONITOR
    </div>
    <div class="row q-gutter-md text-overline justify-left">
      <q-icon
        name="fa-solid fa-network-wired"
        class="q-ml-lg q-mt-sm q-mb-sm q-mr-lg"
      ></q-icon>
      1A-16
      <q-icon
        name="fa-solid fa-baby"
        class="q-ml-lg q-mt-sm q-mb-sm q-mr-lg"
      ></q-icon>
      Explain
    </div>
    <div class="stagePatMon" :style="{ display: display }">
      <canvas id="stagePatMon"></canvas>
    </div>
  </q-card>
</template>

<script>
import { PIXI } from "../boot/pixi";
import { explain } from "../boot/explain";
import TimeChartComponent from "./charts/TimeChartComponent.vue";

let canvasPatMon = null;
export default {
  components: {},
  data() {
    return {
      pixiApp: null,
      collapsed: false,
      isEnabled: true,
      currentData: {},
      display: "block",
      abpCurve: null,
      breathingCurve: null,
      ecgData: [],
      abpData: [],
      satData: [],
      satCurve: null,
      ecgCurve: null,
      breathingData: [],
      timeDeltae: 0,
      graphDrawCounter: 0,
      graphDrawInterval: 0.03,
      graphWidth: 800,
      graphHeight: 600,
      graphInterval: 10,
      graphSpeed: 2,
      dataUpdateInterval: 0.015,
      dataWindowTime: 3,
      channels: {},
      no_channels: 6,
      channel_height: 100,
      autoscale_counter: 0,
      autoscale_interval: 2,
      channelsConfig: [
        {
          channel_no: 1,
          channel_grid: false,
          channel_grid_color: 0xffffff,

          channelLabel: "HR",
          channelLabel_color: "lime",
          channelLabel_font_size: 12,

          valueLabel: "147",
          valueLabel_color: "lime",
          valueLabel_font_size: 48,
          valueFactor: 1,
          valueRounding: 0,
          value_prop1: "Heart.HeartRate",
          value_prop2: "",

          curve_label: "II",
          curve_color: "green",
          curve_font_size: 16,
          curve_prop: "Heart.EcgSignal",
          curve_color: 0x32cd32,
        },
        {
          channel_no: 2,
          channel_grid: true,
          channel_grid_color: 0xff00ff,
          channelLabel: "SpO2(1)",
          channelLabel_color: "magenta",
          channelLabel_font_size: 12,

          valueLabel: "99",
          valueFactor: 100,
          valueRounding: 0,
          valueLabel_color: "magenta",
          valueLabel_font_size: 48,
          value_prop1: "AA.So2",
          value_prop2: "",

          curve_label: "Pleth(1)",
          curve_color: "magenta",
          curve_font_size: 16,
          curve_prop: "AA.Pres",
          curve_color: 0xff00ff,
        },
        // {
        //   channel_no: 3,
        //   channel_grid: true,
        //   channel_grid_color: 0xff00ff,
        //   channelLabel: "SpO2(2)",
        //   channelLabel_color: "purple",
        //   channelLabel_font_size: 12,

        //   valueLabel: "97",
        //   valueLabel_color: "purple",
        //   valueLabel_font_size: 48,
        //   valueLabel_prop1: "AD.So2",
        //   valueLabel_prop2: "",

        //   curve_label: "Pleth(2)",
        //   curve_color: "purple",
        //   curve_font_size: 16,
        //   curve_prop: "AD.Pres",
        //   curve_color: 0xff00ff,
        // },
        {
          channel_no: 4,
          channel_grid: true,
          channel_grid_color: 0xff0000,
          channelLabel: "Abp",
          channelLabel_color: "red",
          channelLabel_font_size: 12,

          valueLabel: "60/40",
          valueFactor: 1,
          valueRounding: 0,
          valueLabel_color: "red",
          valueLabel_font_size: 48,
          value_prop1: "AA.PresMax",
          value_prop2: "AA.PresMin",

          curve_label: "Pres",
          curve_color: "red",
          curve_font_size: 16,
          curve_prop: "AA.Pres",
          curve_color: 0xff0000,
        },
        {
          channel_no: 5,
          channel_grid: true,
          channel_grid_color: 0xffffff,
          channelLabel: "Resp",
          channelLabel_color: "white",
          channelLabel_font_size: 12,

          valueLabel: "45",
          valueFactor: 1,
          valueRounding: 0,
          valueLabel_color: "white",
          valueLabel_font_size: 48,
          value_prop1: "Breathing.RespRate",
          value_prop2: "",

          curve_label: "Resp",
          curve_color: "white",
          curve_font_size: 16,
          curve_prop: "CHEST_L.Vol",
          curve_color: 0xffffff,
        },
        // {
        //   channel_no: 6,
        //   channel_grid: true,
        //   channel_grid_color: 0xffff00,
        //   channelLabel: "EtCO2",
        //   channelLabel_color: "yellow",
        //   channelLabel_font_size: 12,

        //   valueLabel: "4.5",
        //   valueLabel_color: "yellow",
        //   valueLabel_font_size: 48,
        //   valueLabel_prop1: "",
        //   valueLabel_prop2: "",

        //   curve_label: "CO2",
        //   curve_color: "yellow",
        //   curve_font_size: 16,
        //   curve_prop: "MechanicalVentilator.EtCo2",
        //   curve_color: 0xff0000,
        // },
      ],
      channel1Curve: null,
      channel2Curve: null,
      channel3Curve: null,
      channel4Curve: null,
      channel5Curve: null,
      channel6Curve: null,
    };
  },
  methods: {
    initMonitor() {
      if (this.pixiApp) {
        this.pixiApp.destroy();
      }
      // get the reference to the canvas
      canvasPatMon = document.getElementById("stagePatMon");
      // set the resolution of the pix application
      PIXI.settings.RESOLUTION = 1;
      // define a pixi app with the canvas as view
      this.pixiApp = new PIXI.Application({
        transparent: false,
        antialias: true,
        backgroundColor: 0x111111,
        view: canvasPatMon,
      });
      // allow sortable children
      this.pixiApp.stage.sortableChildren = true;

      // clear all channels
      this.channels = [];

      // remove all children
      this.pixiApp.stage.removeChildren();

      // get the dimensions
      this.graphWidth = this.pixiApp.renderer.width;
      this.graphHeight = this.pixiApp.renderer.height;

      // calculate the channel height
      this.channel_height = this.graphHeight / this.no_channels;

      // configure the channels
      this.channelsConfig.forEach((channel) => {
        // do the channel label
        let channelLabelStyle = new PIXI.TextStyle({
          fill: channel.channelLabel_color,
          fontSize: channel.channelLabel_font_size,
          fontFamily: "Arial",
          strokeThickness: 0,
        });
        let channelLabel = new PIXI.Text(
          channel.channelLabel,
          channelLabelStyle
        );
        channelLabel.x = this.graphWidth - 0.2 * this.graphWidth;
        channelLabel.y = 0;
        if (channel.channel_no > 1) {
          channelLabel.y =
            (this.graphHeight / this.no_channels) * (channel.channel_no - 1);
        }
        this.pixiApp.stage.addChild(channelLabel);

        // do the label
        let valueLabelStyle = new PIXI.TextStyle({
          fill: channel.valueLabel_color,
          fontSize: channel.valueLabel_font_size,
          fontFamily: "Arial",
          strokeThickness: 0,
        });
        let valueLabel = new PIXI.Text(channel.valueLabel, valueLabelStyle);
        valueLabel.x = this.graphWidth - 0.2 * this.graphWidth;
        valueLabel.y = 10;
        if (channel.channel_no > 1) {
          valueLabel.y =
            10 +
            (this.graphHeight / this.no_channels) * (channel.channel_no - 1);
        }
        explain.watchModelPropertiesSlow([channel.value_prop1]);
        if (channel.value_prop2 != "") {
          explain.watchModelPropertiesSlow([channel.value_prop2]);
        }
        this.pixiApp.stage.addChild(valueLabel);

        // do the curve label
        let curveLabelStyle = new PIXI.TextStyle({
          fill: channel.curve_color,
          fontSize: channel.curve_font_size,
          fontFamily: "Arial",
          strokeThickness: 0,
        });
        let curveLabel = new PIXI.Text(channel.curve_label, curveLabelStyle);
        curveLabel.x = 10;
        curveLabel.y = 10;
        if (channel.channel_no > 1) {
          curveLabel.y =
            10 +
            (this.graphHeight / this.no_channels) * (channel.channel_no - 1);
        }
        this.pixiApp.stage.addChild(curveLabel);

        // set the grid
        let grid = {};
        if (channel.channel_grid) {
          grid = new PIXI.Graphics();
          grid.lineStyle(1, channel.channel_grid_color, 0.2);
          let y = 10;
          if (channel.channel_no > 1) {
            y =
              10 +
              (this.graphHeight / this.no_channels) * (channel.channel_no - 1);
          }
          grid.moveTo(0, y);
          grid.lineTo(this.graphWidth - 0.2 * this.graphWidth, y);
          y = y + this.graphHeight / this.no_channels / 3;
          grid.moveTo(0, y);
          grid.lineTo(this.graphWidth - 0.2 * this.graphWidth, y);
          y = y + this.graphHeight / this.no_channels / 3;
          grid.moveTo(0, y);
          grid.lineTo(this.graphWidth - 0.2 * this.graphWidth, y);
          this.pixiApp.stage.addChild(grid);
        }
        // initialize the curve
        let curve = new PIXI.Graphics();
        this.pixiApp.stage.addChild(curve);

        // add the prop to the watchlist
        explain.watchModelProperties([channel.curve_prop]);

        // store the channel
        this.channels.push({
          channel_no: channel.channel_no,
          channelLabel: channelLabel,
          valueLabel: valueLabel,
          valueFactor: channel.valueFactor,
          valueRounding: channel.valueRounding,
          curveLabel: curveLabel,
          grid: grid,
          curve: curve,
          curve_min: 0,
          curve_max: 100,
          curve_factor: 1,
          curve_y: 300,
          curve_y_min: 0,
          curve_y_max: 100,
          curve_prop: channel.curve_prop,
          curve_color: channel.curve_color,
          value_prop1: channel.value_prop1,
          value_prop2: channel.value_prop2,
          curve_data: [],
        });
      });
    },
    dataUpdateSlow() {
      if (!this.isEnabled) return;

      let slowData = explain.modelDataSlow[explain.modelDataSlow.length - 1];
      this.channels.forEach((channel) => {
        let valueText = (
          slowData[channel.value_prop1] * channel.valueFactor
        ).toFixed(channel.valueRounding);
        if (channel.value_prop2 !== "") {
          valueText +=
            "/" +
            (slowData[channel.value_prop2] * channel.valueFactor).toFixed(
              channel.valueRounding
            );
        }
        channel.valueLabel.text = valueText;
      });
    },
    remap(value, from1, to1, from2, to2) {
      return ((value - from1) / (to1 - from1)) * (to2 - from2) + from2;
    },
    autoscale() {
      this.channels.forEach((channel) => {
        channel.curve_max = Math.max.apply(null, channel.curve_data);
        channel.curve_min = Math.min.apply(null, channel.curve_data);

        channel.curve_y_min = this.channel_height * (channel.channel_no - 1);
        channel.curve_y_max = this.channel_height * channel.channel_no;

        channel.curve_factor =
          ((channel.curve_y_max - channel.curve_y_min) /
            (channel.curve_max - channel.curve_min)) *
          0.5;
      });
    },
    dataUpdate() {
      if (!this.isEnabled) return;

      this.currentData = explain.modelData[explain.modelData.length - 1];
      // determine the number of x coordinates available for the graph, so we have maximum of that number of data points

      // number x pixels available
      let nox = this.graphWidth - 0.2 * this.graphWidth;

      // number of needed datapoints for the requested time frame
      let ndp = this.dataWindowTime / this.dataUpdateInterval;

      // so we have nox pixels available for ndp number of datapoints
      // calculate the number of pixels per datapoint
      let step = nox / ndp;

      this.channels.forEach((channel) => {
        channel.curve_data.push(this.currentData[channel.curve_prop]);
        if (channel.curve_data.length > ndp) {
          channel.curve_data.shift();
        }
      });

      // // now draw the datapoints, we have ndp data points available which is
      if (this.graphDrawCounter > this.graphDrawInterval) {
        this.graphDrawCounter = 0;
        this.channels.forEach((channel) => {
          channel.curve.clear();
          channel.curve.moveTo(0, 300);
          channel.curve.lineStyle(2, channel.curve_color, 1);
          for (let i = 0; i < channel.curve_data.length; i += 1) {
            channel.curve.lineTo(
              i * step,
              channel.curve_y_max -
                this.channel_height * 0.4 -
                (channel.curve_data[i] - channel.curve_min) *
                  channel.curve_factor
            );
          }
        });
      }
      this.graphDrawCounter += this.dataUpdateInterval;
      if (this.autoscale_counter > this.autoscale_interval) {
        this.autoscale_interval = 5;
        this.autoscale_counter = 0;
        this.autoscale();
      }
      this.autoscale_counter += this.dataUpdateInterval;
    },
    stateUpdate() {},
  },
  beforeUnmount() {
    document.removeEventListener("data_slow", this.dataUpdateSlow);
    document.removeEventListener("state", this.stateUpdate);
    document.removeEventListener("rt", this.dataUpdate);
  },
  mounted() {
    this.isEnabled = !this.collapsed;

    try {
      document.removeEventListener("data_slow", this.dataUpdateSlow);
      document.removeEventListener("state", this.stateUpdate);
      document.removeEventListener("rt", this.dataUpdate);
    } catch {}

    document.addEventListener("data_slow", this.dataUpdateSlow);
    document.addEventListener("rt", this.dataUpdate);
    document.addEventListener("state", this.stateUpdate);

    this.initMonitor();
  },
};
</script>

<style>
#stagePatMon {
  width: 100%;
}
</style>
