<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <div
      class="q-mt-es q-mb-sm row gutter text-overline justify-center"
      @click="isEnabled = !isEnabled"
    >
      TRENDS MONITOR
    </div>
    <div class="stageTrends" :style="{ display: display }">
      <canvas id="stageTrends"></canvas>
    </div>
  </q-card>
</template>

<script>
import { PIXI } from "../boot/pixi";
import { explain } from "../boot/explain";
import { useConfigStore } from "src/stores/config";

let canvasTrends = null;
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
      dataUpdateInterval: 1.0,
      dataWindowTime: 300,
      channels: {},
      no_channels: 4,
      channel_height: 100,
    };
  },
  methods: {
    initMonitor() {
      if (this.pixiApp) {
        this.pixiApp.destroy();
      }
      // get the reference to the canvas
      canvasTrends = document.getElementById("stageTrends");
      // set the resolution of the pix application
      PIXI.settings.RESOLUTION = 1;
      // define a pixi app with the canvas as view
      this.pixiApp = new PIXI.Application({
        transparent: false,
        antialias: true,
        backgroundColor: 0x111111,
        view: canvasTrends,
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
      this.config.trends_monitor.forEach((channel) => {
        // configure the watchers
        explain.watchModelPropertiesSlow([channel.value_prop1]);
        if (channel.value_prop2 != "") {
          explain.watchModelPropertiesSlow([channel.value_prop2]);
        }

        // configure the channel label
        let channelLabelStyle = new PIXI.TextStyle({
          fill: channel.channel_label_color,
          fontSize: channel.channel_label_font_size,
          fontFamily: "Arial",
          strokeThickness: 0,
        });
        let channelLabel = new PIXI.Text(
          channel.channel_label,
          channelLabelStyle
        );
        channelLabel.x = this.graphWidth * 0.8;
        channelLabel.y = 10;
        if (channel.channel_no > 1) {
          channelLabel.y =
            10 +
            (this.graphHeight / this.no_channels) * (channel.channel_no - 1);
        }
        this.pixiApp.stage.addChild(channelLabel);

        // configure the curve label
        let curveLabelStyle = new PIXI.TextStyle({
          fill: channel.curve_label_color,
          fontSize: channel.curve_label_font_size,
          fontFamily: "Arial",
          strokeThickness: 0,
        });
        let curveLabel = new PIXI.Text(channel.curve_label, curveLabelStyle);
        curveLabel.x = 35;
        curveLabel.y = 10;
        if (channel.channel_no > 1) {
          curveLabel.y =
            10 +
            (this.graphHeight / this.no_channels) * (channel.channel_no - 1);
        }
        this.pixiApp.stage.addChild(curveLabel);

        // set the grid
        let gridLabelValue = channel.value_max;
        let gridLabelStep = (channel.value_max - channel.value_min) / 5;
        let grid = {};
        let gridLabelStyle = new PIXI.TextStyle({
          fill: channel.curve_label_color,
          fontSize: 12,
          fontFamily: "Arial",
          strokeThickness: 0,
        });
        if (channel.grid) {
          grid = new PIXI.Graphics();
          grid.lineStyle(1, parseInt(channel.grid_color, 16), 0.2);
          let y = 0;
          if (channel.channel_no > 1) {
            y = this.channel_height * (channel.channel_no - 1);
          }
          // grid.moveTo(0, y);
          // grid.lineTo(this.graphWidth - 0.2 * this.graphWidth, y);
          // let gridLabel1 = new PIXI.Text(gridLabelValue, gridLabelStyle);
          // gridLabel1.x = 10;
          // gridLabel1.y = y;
          // this.pixiApp.stage.addChild(gridLabel1);

          y = y + this.channel_height / 5;
          grid.moveTo(0, y);
          grid.lineTo(this.graphWidth - 0.2 * this.graphWidth, y);
          gridLabelValue -= gridLabelStep;
          let gridLabel2 = new PIXI.Text(
            gridLabelValue.toFixed(0),
            gridLabelStyle
          );
          gridLabel2.x = 10;
          gridLabel2.y = y;
          this.pixiApp.stage.addChild(gridLabel2);

          y = y + this.channel_height / 5;
          grid.moveTo(0, y);
          grid.lineTo(this.graphWidth - 0.2 * this.graphWidth, y);
          gridLabelValue -= gridLabelStep;
          let gridLabel3 = new PIXI.Text(
            gridLabelValue.toFixed(0),
            gridLabelStyle
          );
          gridLabel3.x = 10;
          gridLabel3.y = y;
          this.pixiApp.stage.addChild(gridLabel3);

          y = y + this.channel_height / 5;
          grid.moveTo(0, y);
          grid.lineTo(this.graphWidth - 0.2 * this.graphWidth, y);
          gridLabelValue -= gridLabelStep;
          let gridLabel4 = new PIXI.Text(gridLabelValue, gridLabelStyle);
          gridLabel4.x = 10;
          gridLabel4.y = y;
          this.pixiApp.stage.addChild(gridLabel4);

          y = y + this.channel_height / 5;
          grid.moveTo(0, y);
          grid.lineTo(this.graphWidth - 0.2 * this.graphWidth, y);
          gridLabelValue -= gridLabelStep;
          let gridLabel5 = new PIXI.Text(gridLabelValue, gridLabelStyle);
          gridLabel5.x = 10;
          gridLabel5.y = y;
          this.pixiApp.stage.addChild(gridLabel5);

          this.pixiApp.stage.addChild(grid);
        }
        // initialize the curve
        let curve = new PIXI.Graphics();
        this.pixiApp.stage.addChild(curve);
        let curve2 = new PIXI.Graphics();
        this.pixiApp.stage.addChild(curve2);
        let connect = new PIXI.Graphics();
        this.pixiApp.stage.addChild(connect);

        // store the channel
        this.channels.push({
          channel_no: channel.channel_no,
          curveLabel: curveLabel,
          channelLabel: channelLabel,
          valueFactor: channel.value_factor,
          valueRounding: channel.value_rounding,
          grid: grid,
          curve: curve,
          curve2: curve2,
          connect: connect,
          curve_min: channel.value_min,
          curve_max: channel.value_max,
          curve_factor: 1,
          curve_y: 0,
          curve_y_min: 0,
          curve_y_max: 100,
          curve_color: parseInt(channel.curve_color, 16),
          value_prop1: channel.value_prop1,
          value_prop2: channel.value_prop2,
          curve_data: [],
          curve2_data: [],
        });
      });
    },

    dataUpdate() {
      for (let i = 0; i < explain.modelDataSlow.length; i++) {
        this.currentData = explain.modelDataSlow[i];
        // determine the number of x coordinates available for the graph, so we have maximum of that number of data points

        // number x pixels available
        let nox = this.graphWidth - 0.2 * this.graphWidth;

        // number of needed datapoints for the requested time frame
        let ndp = this.dataWindowTime / this.dataUpdateInterval;

        // so we have nox pixels available for ndp number of datapoints
        // calculate the number of pixels per datapoint
        let step = nox / ndp;

        this.channels.forEach((channel) => {
          channel.curve_data.push(
            this.currentData[channel.value_prop1] * channel.valueFactor
          );
          if (channel.value_prop2 !== "")
            channel.curve2_data.push(
              this.currentData[channel.value_prop2] * channel.valueFactor
            );
          if (channel.curve_data.length > ndp) {
            channel.curve_data.shift();
          }
          if (channel.curve2_data.length > ndp) {
            channel.curve2_data.shift();
          }
        });

        // // now draw the datapoints, we have ndp data points available which is
        if (this.graphDrawCounter > this.graphDrawInterval) {
          this.graphDrawCounter = 0;
          this.channels.forEach((channel) => {
            channel.curve_y_min =
              this.channel_height * (channel.channel_no - 1);
            channel.curve_y_max = this.channel_height * channel.channel_no;

            channel.curve_factor =
              (channel.curve_y_max - channel.curve_y_min) /
              (channel.curve_max - channel.curve_min);

            channel.curve.clear();
            channel.curve2.clear();
            channel.connect.clear();
            let first_y =
              channel.curve_y_max -
              (channel.curve_data[0] - channel.curve_min) *
                channel.curve_factor;
            if (first_y < channel.curve_y_min) {
              first_y = channel.curve_y_min;
            }
            channel.curve.moveTo(0, first_y);

            if (channel.value_prop2 != "") {
              let first_y2 =
                channel.curve_y_max -
                (channel.curve2_data[0] - channel.curve_min) *
                  channel.curve_factor;
              if (first_y2 < channel.curve_y_min) {
                first_y2 = channel.curve_y_min;
              }
              channel.curve2.moveTo(0, first_y2);
            }
            channel.curve.lineStyle(2, channel.curve_color, 1);
            channel.curve2.lineStyle(2, channel.curve_color, 1);
            channel.connect.lineStyle(2, channel.curve_color, 0.1);

            for (let i = 0; i < channel.curve_data.length; i += 1) {
              let y_co =
                channel.curve_y_max -
                (channel.curve_data[i] - channel.curve_min) *
                  channel.curve_factor;
              if (y_co < channel.curve_y_min) {
                y_co = channel.curve_y_min;
              }
              if (channel.value_prop2 != "") {
                let y_co2 =
                  channel.curve_y_max -
                  (channel.curve2_data[i] - channel.curve_min) *
                    channel.curve_factor;
                if (y_co < channel.curve_y_min) {
                  y_co = channel.curve_y_min;
                }
                channel.curve.lineTo(i * step, y_co);
                channel.connect.moveTo(i * step, y_co);
                channel.connect.lineTo(i * step, y_co2);
                channel.curve2.lineTo(i * step, y_co2);
              } else {
                channel.curve.lineTo(i * step, y_co);
              }
            }

            // connector
          });
        }
        if (this.isEnabled) {
          this.graphDrawCounter += this.dataUpdateInterval;
        }
      }
    },
    stateUpdate() {},
  },
  beforeUnmount() {
    document.removeEventListener("data_slow", this.dataUpdate);
    document.removeEventListener("state", this.stateUpdate);
  },
  mounted() {
    this.isEnabled = !this.collapsed;

    try {
      document.removeEventListener("data_slow", this.dataUpdate);
      document.removeEventListener("state", this.stateUpdate);
    } catch {}

    document.addEventListener("data_slow", this.dataUpdate);
    document.addEventListener("state", this.stateUpdate);

    this.initMonitor();

    this.$bus.on("monitors_off", () => {
      this.isEnabled = false;
      console.log("monitors switch off");
    });
    this.$bus.on("monitors_on", () => {
      this.isEnabled = true;
      console.log("monitors switch on");
    });
  },
};
</script>

<style>
#stageTrends {
  width: 100%;
}
</style>
