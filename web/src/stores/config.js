import { _themeLoaderDuskInLapland } from "@arction/lcjs";
import { defineStore } from "pinia";
import { explain } from "src/boot/explain";

export const useConfigStore = defineStore("config", {
  state: () => ({
    engine_version: 0,
    engine_name: "",
    name: "",
    user: "",
    definition: "",
    groupers: {},
    charts: {},
    monitors: {},
    patient_monitor: [],
    trends_monitor: [],
  }),

  getters: {},

  actions: {
    getConfigObject() {
      return {
        engine_version: this.engine_version,
        engine_name: this.engine_name,
        name: this.name,
        user: this.user,
        definition: this.definition,
        groupers: this.groupers,
        charts: this.charts,
        monitors: this.monitors,
        patient_monitor: this.patient_monitor,
        trends_monitor: this.trends_monitor,
      };
    },
    async getConfig(
      apiUrl,
      engine_version,
      engine_name,
      configName,
      userName,
      token
    ) {
      const url = `${apiUrl}/api/configs/get_config?token=${token}`;
      // get the user login data
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          engine_version: engine_version,
          engine_name: engine_name,
          name: configName,
          user: userName,
        }),
      });

      if (response.status === 200) {
        let data = await response.json();
        this.engine_version = data.engine_version;
        this.engine_name = data.engine_name;
        this.name = data.name;
        this.user = data.user;
        this.definition = data.definition;
        this.apiUrl = data.apiUrl;
        this.groupers = data.groupers;
        this.charts = data.charts;
        this.monitors = data.monitors;
        this.patient_monitor = data.patient_monitor;
        this.trends_monitor = data.trends_monitor;
        return true;
      } else {
        return false;
      }
    },
    updateDataCollector(propsArray) {
      // get all the props from charts
      let propIdsCharts = [];
      let propIdsMonitors = [];

      let id1 = "";
      let id2 = "";
      let id3 = "";

      // charts
      Object.values(this.charts).forEach((chart) => {
        if (chart.selectedModel1 && chart.selectedPrimProp1) {
          id1 = chart.selectedModel1 + "." + chart.selectedPrimProp1;
        }
        if (
          chart.selectedModel1 &&
          chart.selectedPrimProp1 &&
          chart.selectedSecProp1
        ) {
          id1 =
            chart.selectedModel1 +
            "." +
            chart.selectedPrimProp1 +
            "." +
            chart.selectedSecProp1;
        }

        id2 = "";
        if (chart.selectedModel2 && chart.selectedPrimProp2) {
          id2 = chart.selectedModel2 + "." + chart.selectedPrimProp2;
        }
        if (
          chart.selectedModel2 &&
          chart.selectedPrimProp2 &&
          chart.selectedSecProp2
        ) {
          id2 =
            chart.selectedModel2 +
            "." +
            chart.selectedPrimProp2 +
            "." +
            chart.selectedSecProp2;
        }

        id3 = "";
        if (chart.selectedModel3 && chart.selectedPrimProp3) {
          id3 = chart.selectedModel3 + "." + chart.selectedPrimProp3;
        }
        if (
          chart.selectedModel3 &&
          chart.selectedPrimProp3 &&
          chart.selectedSecProp3
        ) {
          id3 =
            chart.selectedModel3 +
            "." +
            chart.selectedPrimProp3 +
            "." +
            chart.selectedSecProp3;
        }

        if (id1 != "") {
          if (!propIdsCharts.includes(id1)) {
            propIdsCharts.push(id1);
          }
        }
        if (id2 != "") {
          if (!propIdsCharts.includes(id2)) {
            propIdsCharts.push(id2);
          }
        }
        if (id3 != "") {
          if (!propIdsCharts.includes(id3)) {
            propIdsCharts.push(id3);
          }
        }
      });

      // monitors
      Object.values(this.monitors).forEach((monitor) => {
        if (monitor.parameters.length > 0) {
          monitor.parameters.forEach((parameter) => {
            parameter.props.forEach((prop) => {
              if (!propIdsMonitors.includes(prop)) {
                propIdsMonitors.push(prop);
              }
            });
          });
        }
      });

      explain.watchModelProperties(propIdsCharts);
      explain.watchModelPropertiesSlow(propIdsMonitors);
    },
  },
});
