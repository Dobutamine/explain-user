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

      console.log(this.graphWidth, this.graphHeight);
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
      // draw the
      this.textStyle = new PIXI.TextStyle({
        fill: "green",
        fontSize: 20,
        fontFamily: "Arial",
        strokeThickness: 0,
      });
      this.text = new PIXI.Text("II", this.textStyle);
      // this.text.anchor = { x: 0.5, y: 0.5 };
      this.text.x = 10;
      this.text.y = 10;
      this.text.zIndex = 7;
      this.pixiApp.stage.addChild(this.text);

      this.textStyleHrValue = new PIXI.TextStyle({
        fill: "limegreen",
        fontSize: 60,
        fontFamily: "Arial",
        strokeThickness: 0,
      });
      this.textHrValue = new PIXI.Text("147", this.textStyleHrValue);
      // this.text.anchor = { x: 0.5, y: 0.5 };
      this.textHrValue.x = this.graphWidth - 0.2 * this.graphWidth;
      this.textHrValue.y = 10;
      this.textHrValue.zIndex = 7;
      this.pixiApp.stage.addChild(this.textHrValue);

      this.textStyleSat = new PIXI.TextStyle({
        fill: "purple",
        fontSize: 20,
        fontFamily: "Arial",
        strokeThickness: 0,
      });
      this.textSat = new PIXI.Text("Pleth", this.textStyleSat);
      // this.textSat.anchor = { x: 0.5, y: 0.5 };
      this.textSat.x = 10;
      this.textSat.y = 10 + this.graphHeight / 6;
      this.textSat.zIndex = 7;
      this.pixiApp.stage.addChild(this.textSat);

      this.textStyleSatValue = new PIXI.TextStyle({
        fill: "magenta",
        fontSize: 60,
        fontFamily: "Arial",
        strokeThickness: 0,
      });
      this.textSatValue = new PIXI.Text("93", this.textStyleSatValue);
      // this.text.anchor = { x: 0.5, y: 0.5 };
      this.textSatValue.x = this.graphWidth - 0.2 * this.graphWidth;
      this.textSatValue.y = 10 + this.graphHeight / 6;
      this.textSatValue.zIndex = 7;
      this.pixiApp.stage.addChild(this.textSatValue);

      this.textStyleSat2 = new PIXI.TextStyle({
        fill: "purple",
        fontSize: 20,
        fontFamily: "Arial",
        strokeThickness: 0,
      });
      this.textSat2 = new PIXI.Text("Pleth-po", this.textStyleSat2);
      // this.textSat.anchor = { x: 0.5, y: 0.5 };
      this.textSat2.x = 10;
      this.textSat2.y = 10 + (this.graphHeight / 6) * 2;
      this.textSat2.zIndex = 7;
      this.pixiApp.stage.addChild(this.textSat2);

      this.textStyleSat2Value = new PIXI.TextStyle({
        fill: "purple",
        fontSize: 60,
        fontFamily: "Arial",
        strokeThickness: 0,
      });
      this.textSat2Value = new PIXI.Text("93", this.textStyleSat2Value);
      // this.textSat.anchor = { x: 0.5, y: 0.5 };
      this.textSat2Value.x = this.graphWidth - 0.2 * this.graphWidth;
      this.textSat2Value.y = 10 + (this.graphHeight / 6) * 2;
      this.textSat2Value.zIndex = 7;
      this.pixiApp.stage.addChild(this.textSat2Value);

      this.textStyleAbp = new PIXI.TextStyle({
        fill: "red",
        fontSize: 20,
        fontFamily: "Arial",
        strokeThickness: 0,
      });
      this.textAbp = new PIXI.Text("ABP", this.textStyleAbp);
      // this.textAbp.anchor = { x: 0.5, y: 0.5 };
      this.textAbp.x = 10;
      this.textAbp.y = 10 + (this.graphHeight / 6) * 3;
      this.textAbp.zIndex = 7;
      this.pixiApp.stage.addChild(this.textAbp);

      this.textStyleAbpValue = new PIXI.TextStyle({
        fill: "red",
        fontSize: 38,
        fontFamily: "Arial",
        strokeThickness: 0,
      });
      this.textAbpValue = new PIXI.Text("60/40", this.textStyleAbpValue);
      this.textAbpMean = new PIXI.Text("(50)", this.textStyleAbpValue);
      // this.textAbpValue.anchor = { x: 0.5, y: 0.5 };
      this.textAbpValue.x = this.graphWidth - 0.2 * this.graphWidth;
      this.textAbpValue.y = 10 + (this.graphHeight / 6) * 3;
      this.textAbpMean.x = this.graphWidth - 0.2 * this.graphWidth + 15;
      this.textAbpMean.y = 45 + (this.graphHeight / 6) * 3;
      this.textAbpMean.anchor = { x: 0, y: 0 };
      this.textAbpValue.zIndex = 7;
      this.pixiApp.stage.addChild(this.textAbpValue);
      this.pixiApp.stage.addChild(this.textAbpMean);

      this.textStyleRespValue = new PIXI.TextStyle({
        fill: "white",
        fontSize: 20,
        fontFamily: "Arial",
        strokeThickness: 0,
      });
      this.textRespValue = new PIXI.Text("RespValue", this.textStyleRespValue);
      // this.textRespValue.anchor = { x: 0.5, y: 0.5 };
      this.textRespValue.x = 10;
      this.textRespValue.y = 10 + (this.graphHeight / 6) * 4;
      this.textRespValue.zIndex = 7;
      this.pixiApp.stage.addChild(this.textRespValue);

      this.textStyleRespValue = new PIXI.TextStyle({
        fill: "white",
        fontSize: 60,
        fontFamily: "Arial",
        strokeThickness: 0,
      });
      this.textRespValue = new PIXI.Text("45", this.textStyleRespValue);
      // this.textRespValue.anchor = { x: 0.5, y: 0.5 };
      this.textRespValue.x = this.graphWidth - 0.2 * this.graphWidth;
      this.textRespValue.y = 10 + (this.graphHeight / 6) * 4;
      this.textRespValue.zIndex = 7;
      this.pixiApp.stage.addChild(this.textRespValue);

      this.textStyleEtCO2 = new PIXI.TextStyle({
        fill: "yellow",
        fontSize: 20,
        fontFamily: "Arial",
        strokeThickness: 0,
      });
      this.textEtCO2 = new PIXI.Text("EtCO2", this.textStyleEtCO2);
      // this.textEtCO2.anchor = { x: 0.5, y: 0.5 };
      this.textEtCO2.x = 10;
      this.textEtCO2.y = 10 + (this.graphHeight / 6) * 5;
      this.textEtCO2.zIndex = 7;
      this.pixiApp.stage.addChild(this.textEtCO2);

      this.textStyleEtCO2Value = new PIXI.TextStyle({
        fill: "yellow",
        fontSize: 60,
        fontFamily: "Arial",
        strokeThickness: 0,
      });
      this.textEtCO2Value = new PIXI.Text("4.5", this.textStyleEtCO2Value);
      // this.textEtCO2Value.anchor = { x: 0.5, y: 0.5 };
      this.textEtCO2Value.x = this.graphWidth - 0.2 * this.graphWidth;
      this.textEtCO2Value.y = 10 + (this.graphHeight / 6) * 5;
      this.textEtCO2Value.zIndex = 7;
      this.pixiApp.stage.addChild(this.textEtCO2Value);
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
