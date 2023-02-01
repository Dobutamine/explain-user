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
      channels: [],
      no_channels: 6,
      channelsConfig: [
        {
          channel_no: 1,

          channelLabel: "HR",
          channelLabel_color: "lime",
          channelLabel_font_size: 12,

          valueLabel: "147",
          valueLabel_color: "lime",
          valueLabel_font_size: 48,
          valueLabel_prop1: "Heart.Heartrate",
          valueLabel_prop2: "",

          curve_label: "II",
          curve_color: "green",
          curve_font_size: 20,
          curve_prop: "Heart.EcgSignal",
        },
        {
          channel_no: 2,

          channelLabel: "SpO2(1)",
          channelLabel_color: "magenta",
          channelLabel_font_size: 12,

          valueLabel: "99",
          valueLabel_color: "magenta",
          valueLabel_font_size: 48,
          valueLabel_prop1: "AA.So2",
          valueLabel_prop2: "",

          curve_label: "Pleth(1)",
          curve_color: "magenta",
          curve_font_size: 20,
          curve_prop: "AA.Pres",
        },
        {
          channel_no: 3,

          channelLabel: "SpO2(2)",
          channelLabel_color: "purple",
          channelLabel_font_size: 12,

          valueLabel: "97",
          valueLabel_color: "purple",
          valueLabel_font_size: 48,
          valueLabel_prop1: "AD.So2",
          valueLabel_prop2: "",

          curve_label: "Pleth(2)",
          curve_color: "purple",
          curve_font_size: 20,
          curve_prop: "AD.Pres",
        },
        {
          channel_no: 4,

          channelLabel: "Abp",
          channelLabel_color: "red",
          channelLabel_font_size: 12,

          valueLabel: "60/40",
          valueLabel_color: "red",
          valueLabel_font_size: 48,
          valueLabel_prop1: "AA.PresMax",
          valueLabel_prop2: "AA.PresMin",

          curve_label: "Pres",
          curve_color: "red",
          curve_font_size: 20,
          curve_prop: "AA.Pres",
        },
        {
          channel_no: 5,

          channelLabel: "Resp",
          channelLabel_color: "white",
          channelLabel_font_size: 12,

          valueLabel: "45",
          valueLabel_color: "white",
          valueLabel_font_size: 48,
          valueLabel_prop1: "Breathing.RespRate",
          valueLabel_prop2: "",

          curve_label: "Resp",
          curve_color: "white",
          curve_font_size: 20,
          curve_prop: "CHEST_L.Vol",
        },
        {
          channel_no: 6,

          channelLabel: "EtCO2",
          channelLabel_color: "yellow",
          channelLabel_font_size: 12,

          valueLabel: "4.5",
          valueLabel_color: "yellow",
          valueLabel_font_size: 48,
          valueLabel_prop1: "",
          valueLabel_prop2: "",

          curve_label: "CO2",
          curve_color: "yellow",
          curve_font_size: 20,
          curve_prop: "MechanicalVentilator.EtCo2",
        },
      ],
    };
  },
  methods: {
    initMonitor() {
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

      this.graphWidth = this.pixiApp.renderer.width;
      this.graphHeight = this.pixiApp.renderer.height;

      // draw abp line
      this.abpCurve = new PIXI.Graphics();
      this.abpCurve.lineStyle(1, 0xff0000, 1);
      this.abpCurve.moveTo(0, this.pixiApp.renderer.height / 2);
      this.abpCurve.lineTo(
        this.pixiApp.renderer.width,
        this.pixiApp.renderer.height / 2
      );

      this.satCurve = new PIXI.Graphics();
      this.satCurve.lineStyle(1, 0xffff00, 1);
      this.satCurve.moveTo(0, this.pixiApp.renderer.height / 2);
      this.satCurve.lineTo(
        this.pixiApp.renderer.width,
        this.pixiApp.renderer.height / 2
      );

      this.breathingCurve = new PIXI.Graphics();
      this.breathingCurve.lineStyle(1, 0xffffff, 1);
      this.breathingCurve.moveTo(0, this.pixiApp.renderer.height / 2);
      this.breathingCurve.lineTo(
        this.pixiApp.renderer.width,
        this.pixiApp.renderer.height / 2
      );

      this.ecgCurve = new PIXI.Graphics();
      this.ecgCurve.lineStyle(1, 0x00ffff, 1);
      this.ecgCurve.moveTo(0, this.pixiApp.renderer.height / 2);
      this.ecgCurve.lineTo(
        this.pixiApp.renderer.width,
        this.pixiApp.renderer.height / 2
      );

      this.pixiApp.stage.addChild(this.abpCurve);
      this.pixiApp.stage.addChild(this.satCurve);
      this.pixiApp.stage.addChild(this.breathingCurve);
      this.pixiApp.stage.addChild(this.ecgCurve);

      this.drawBackgroundGraphics();
    },
    drawBackgroundGraphics() {
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
      });
    },
    drawCurves() {
      // get width
      let width = this.pixiApp.renderer.width;
      let height = this.pixiApp.renderer.height;
      // abp curves
    },
    dataUpdateSlow() {
      if (!this.isEnabled) return;
      this.drawCurves();
      this.currentData =
        explain.modelDataSlow[explain.modelDataSlow.length - 1];
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

      this.abpData.push(this.currentData["AA.Pres"]);
      this.ecgData.push(this.currentData["Heart.EcgSignal"]);
      this.breathingData.push(
        (this.currentData["CHEST_L.Vol"] + this.currentData["CHEST_R.Vol"]) *
          1000
      );

      // shift the data
      if (this.abpData.length > ndp) {
        this.abpData.shift();
        this.ecgData.shift();
        this.breathingData.shift();
      }

      // now draw the datapoints, we have ndp data points available which is
      if (this.graphDrawCounter > this.graphDrawInterval) {
        this.graphDrawCounter = 0;
        this.abpCurve.clear();
        this.abpCurve.lineStyle(2, 0xff0000, 1);
        this.abpCurve.moveTo(0, 300 - this.abpData[0]);

        this.ecgCurve.clear();
        this.ecgCurve.lineStyle(2, 0x00ffff, 1);
        this.ecgCurve.moveTo(0, 300 - this.ecgData[0]);

        this.breathingCurve.clear();
        this.breathingCurve.lineStyle(2, 0xffffff, 1);
        this.breathingCurve.moveTo(0, 300 - this.breathingData[0]);

        this.satCurve.clear();
        this.satCurve.lineStyle(2, 0xffff00, 1);
        this.satCurve.moveTo(0, 300 - this.abpData[0]);

        for (let i = 0; i < this.abpData.length - 2; i += 1) {
          this.abpCurve.lineTo(i * step, 300 - this.abpData[i]);
          this.ecgCurve.lineTo(i * step, 300 - this.ecgData[i] * 5);
          this.satCurve.lineTo(i * step, 500 - this.abpData[i]);
          this.breathingCurve.lineTo(i * step, 300 - this.breathingData[i] * 2);
        }
      }

      this.graphDrawCounter += this.dataUpdateInterval;
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

    explain.watchModelProperties(["AA.Pres"]);
    explain.watchModelProperties(["CHEST_L.Vol"]);
    explain.watchModelProperties(["CHEST_R.Vol"]);
    explain.watchModelProperties(["Heart.EcgSignal"]);

    this.initMonitor();
  },
};
</script>

<style>
#stagePatMon {
  width: 100%;
}
</style>
