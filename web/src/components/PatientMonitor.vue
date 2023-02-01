<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <div
      class="q-mt-es row gutter text-overline justify-center"
      @click="isEnabled = !isEnabled"
    >
      PATIENT MONITOR
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
      collapsed: false,
      isEnabled: true,
      currentData: {},
      display: "block",
      abpCurve: null,
      abpData: [],
      timeDeltae: 0,
      graphDrawCounter: 0,
      graphDrawInterval: 5.0,
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
        backgroundColor: 0x333333,
        view: canvasPatMon,
      });
      // allow sortable children
      this.pixiApp.stage.sortableChildren = true;

      // draw abp line
      this.abpCurve = new PIXI.Graphics();
      this.abpCurve.lineStyle(1, 0xff0000, 1);
      this.abpCurve.moveTo(0, this.pixiApp.renderer.height / 2);
      this.abpCurve.lineTo(
        this.pixiApp.renderer.width,
        this.pixiApp.renderer.height / 2
      );
      this.pixiApp.stage.addChild(this.abpCurve);
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
      this.abpData.push(this.currentData["AA.Pres"]);
      if (this.abpData.length > 800) {
        this.abpData.shift();
      }

      if (this.graphDrawCounter > this.graphDrawInterval) {
        this.graphDrawCounter = 0;
        this.abpCurve.clear();
        this.abpCurve.lineStyle(1, 0xff0000, 1);
        for (let i = 0; i < this.abpData.length - 2; i += 1) {
          this.abpCurve.moveTo(i, 300 - this.abpData[i]);
          this.abpCurve.lineTo(i + 1, 300 - this.abpData[i + 1]);
        }
      }
      this.graphDrawCounter += 1;
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
    this.initMonitor();
  },
};
</script>

<style>
#stagePatMon {
  width: 100%;
}
</style>
