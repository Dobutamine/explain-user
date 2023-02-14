<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <div
      class="q-mt-es q-mb-sm row gutter text-overline justify-center"
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
import { useConfigStore } from "src/stores/config";

let canvasPatMon = null;
export default {
  setup() {
    const config = useConfigStore();
    return {
      config,
    };
  },
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
      dataWindowTime: 10,
      channels: {},
      no_channels: 6,
      channel_height: 100,
      autoscale_counter: 0,
      autoscale_interval: 2,
      first_run: true,
      cursor: 0,
    };
  },
  methods: {
    restartMonitor() {
      // set the first run
      this.first_run = true;

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
      this.config.patient_monitor.forEach((channel) => {
        // add the value label
        let valueLabelStyle = new PIXI.TextStyle({
          fill: channel.value_label_color,
          fontSize: channel.value_label_font_size,
          fontFamily: "Arial",
          strokeThickness: 0,
        });
        let valueLabel = new PIXI.Text(channel.value_label, valueLabelStyle);
        valueLabel.x = this.graphWidth - 0.2 * this.graphWidth;
        valueLabel.y = 10;
        if (channel.channel_no > 1) {
          valueLabel.y = this.channel_height * (channel.channel_no - 1);
        }
        this.pixiApp.stage.addChild(valueLabel);

        // add the value
        let valueStyle = new PIXI.TextStyle({
          fill: channel.value_color,
          fontSize: channel.value_font_size,
          fontFamily: "Arial",
          strokeThickness: 0,
        });
        let value = new PIXI.Text(channel.value, valueStyle);
        value.x = this.graphWidth - 0.2 * this.graphWidth;
        value.y = 10 + channel.value_label_font_size;
        if (channel.channel_no > 1) {
          value.y =
            this.channel_height * (channel.channel_no - 1) +
            channel.value_label_font_size;
        }
        explain.watchModelPropertiesSlow([channel.value_prop1]);
        if (channel.value_prop2 != "") {
          explain.watchModelPropertiesSlow([channel.value_prop2]);
        }
        this.pixiApp.stage.addChild(value);

        // do curve label
        let curveLabelStyle = new PIXI.TextStyle({
          fill: channel.curve_label_color,
          fontSize: channel.curve_label_font_size,
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
        if (channel.grid) {
          grid = new PIXI.Graphics();
          grid.lineStyle(1, parseInt(channel.grid_color, 16), 0.2);
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
          valueLabel: valueLabel,
          curveLabel: curveLabel,
          value: value,
          valueFactor: channel.value_factor,
          valueRounding: channel.value_rounding,
          grid: grid,
          curve: curve,
          curve_min: 0,
          curve_max: 100,
          curve_factor: 1,
          curve_y: 300,
          curve_y_min: 0,
          curve_y_max: 100,
          curve_prop: channel.curve_prop,
          curve_color: parseInt(channel.curve_color, 16),
          value_prop1: channel.value_prop1,
          value_prop2: channel.value_prop2,
          curve_data: [],
          autoscale: channel.autoscale,
          min: channel.min,
          max: channel.max,
        });
      });
    },
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

      this.restartMonitor();
    },
    dataUpdateSlow() {
      if (!this.isEnabled) return;

      let slowData = explain.modelDataSlow[explain.modelDataSlow.length - 1];
      this.channels.forEach((channel) => {
        let valueText = "";
        try {
          valueText = (
            slowData[channel.value_prop1] * channel.valueFactor
          ).toFixed(channel.valueRounding);
        } catch {}

        if (channel.value_prop2 !== "") {
          valueText +=
            "/" +
            (slowData[channel.value_prop2] * channel.valueFactor).toFixed(
              channel.valueRounding
            );
        }
        channel.value.text = valueText;
      });
    },
    remap(value, from1, to1, from2, to2) {
      return ((value - from1) / (to1 - from1)) * (to2 - from2) + from2;
    },
    autoscale() {
      this.first_run = false;
      this.channels.forEach((channel) => {
        if (channel.autoscale) {
          channel.curve_max = Math.max.apply(null, channel.curve_data);
          channel.curve_min = Math.min.apply(null, channel.curve_data);
        } else {
          channel.curve_max = channel.max;
          channel.curve_min = channel.min;
        }

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

      // number x pixels available
      let nox = this.graphWidth - 0.2 * this.graphWidth;

      // number of needed datapoints for the requested time frame
      let ndp = this.dataWindowTime / this.dataUpdateInterval;

      // so we have nox pixels available for ndp number of datapoints
      // calculate the number of pixels per datapoint
      let step = nox / ndp;

      for (let i = 0; i < explain.modelData.length; i++) {
        this.currentData = explain.modelData[i];

        // determine the number of x coordinates available for the graph, so we have maximum of that number of data points

        this.channels.forEach((channel) => {
          // channel.curve_data.push(this.currentData[channel.curve_prop]);
          // if (channel.curve_data.length > ndp) {
          //   channel.curve_data.shift();
          // }
          if (channel.curve_data.length < ndp) {
            channel.curve_data.push(this.currentData[channel.curve_prop]);
            this.cursor = 0;
          } else {
            channel.curve_data[this.cursor] =
              this.currentData[channel.curve_prop];
          }
        });
        this.cursor += 1;
        if (this.cursor > ndp) {
          this.cursor = 0;
        }
      }

      // // now draw the datapoints, we have ndp data points available which is
      if (this.graphDrawCounter > this.graphDrawInterval) {
        this.graphDrawCounter = 0;
        this.channels.forEach((channel) => {
          channel.curve.clear();
          channel.curve.moveTo(0, 300);
          channel.curve.lineStyle(2, channel.curve_color, 1);
          for (let i = 0; i < channel.curve_data.length; i += 1) {
            let y_co =
              channel.curve_y_max -
              this.channel_height * 0.4 -
              (channel.curve_data[i] - channel.curve_min) *
                channel.curve_factor;
            if (y_co < channel.curve_y_min) {
              y_co = channel.curve_y_min;
            }
            channel.curve.lineTo(i * step, y_co);
          }
        });
      }
      if (!this.first_run) {
        this.graphDrawCounter += this.dataUpdateInterval;
      }

      if (this.autoscale_counter > this.autoscale_interval) {
        this.autoscale_interval = 3;
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

    this.$bus.on("monitors_off", () => {
      this.isEnabled = false;
    });
    this.$bus.on("monitors_on", () => {
      this.isEnabled = true;
    });
    this.$bus.on("restart", () => this.restartMonitor());
  },
};
</script>

<style>
#stagePatMon {
  width: 100%;
}
</style>
