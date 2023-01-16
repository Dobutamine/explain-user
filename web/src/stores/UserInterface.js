import { defineStore } from "pinia";
import { explain } from "src/boot/explain";

export const useUserInterfaceStore = defineStore("userInterface", {
  state: () => ({
    models: {
      BloodTimeVaryingElastance: {
        properties: [
          {
            modelProp: "Vol",
            typeProp: "numeric",
            caption: "volume",
            unit: "mL",
            min: 0.0,
            step: 0.01,
            displayFactor: 1000.0,
            displayRounding: 2,
          },
          {
            modelProp: "UVol",
            caption: "unstressed volume",
            typeProp: "numeric",
            unit: "mL",
            min: 0.0,
            step: 0.01,
            displayFactor: 1000.0,
            displayRounding: 2,
          },
          {
            caption: "ElMin",
            modelProp: "ElMin",
            typeProp: "numeric",
            unit: "mmHg/mL",
            min: 0.0,
            step: 0.01,
            displayFactor: 0.001,
            displayRounding: 2,
          },
          {
            caption: "ElMax",
            modelProp: "ElMax",
            typeProp: "numeric",
            unit: "mmHg/mL",
            min: 0.0,
            step: 0.01,
            displayFactor: 0.001,
            displayRounding: 2,
          },
          {
            caption: "ElK",
            modelProp: "ElK",
            typeProp: "numeric",
            unit: "mmHg/mL",
            min: 0.0,
            step: 0.01,
            displayFactor: 0.001,
            displayRounding: 2,
          },
          {
            caption: "general state",
            modelProp: "IsEnabled",
            typeProp: "boolean",
          },
        ],
      },
      BloodCompliance: {
        properties: [
          {
            modelProp: "Vol",
            typeProp: "numeric",
            caption: "volume",
            unit: "mL",
            min: 0.0,
            step: 0.01,
            displayFactor: 1000.0,
            displayRounding: 2,
          },
          {
            modelProp: "UVol",
            caption: "UVol",
            typeProp: "numeric",
            unit: "mL",
            min: 0.0,
            step: 0.01,
            displayFactor: 1000.0,
            displayRounding: 2,
          },
          {
            caption: "ElBase",
            modelProp: "ElBase",
            typeProp: "numeric",
            unit: "mmHg/mL",
            min: 0.0,
            step: 0.01,
            displayFactor: 0.001,
            displayRounding: 2,
          },
          {
            caption: "ElK",
            modelProp: "ElK",
            typeProp: "numeric",
            unit: "mmHg/mL",
            min: 0.0,
            step: 0.01,
            displayFactor: 0.001,
            displayRounding: 2,
          },
          {
            caption: "Enabled",
            modelProp: "IsEnabled",
            typeProp: "boolean",
          },
        ],
      },
      BloodResistor: {
        properties: [
          {
            caption: "RFor",
            modelProp: "RFor",
            typeProp: "numeric",
            unit: "mL/mmHg*s",
            min: 0.02,
            step: 0.1,
            displayFactor: 0.001,
            displayRounding: 2,
          },
          {
            caption: "RBack",
            modelProp: "RBack",
            typeProp: "numeric",
            unit: "mL/mmHg*s",
            min: 0.02,
            step: 0.1,
            displayFactor: 0.001,
            displayRounding: 2,
          },
          {
            caption: "Rk",
            modelProp: "Rk",
            typeProp: "numeric",
            unit: "mL/mmHg*s",
            min: 0.02,
            step: 0.01,
            displayFactor: 0.001,
            displayRounding: 2,
          },
          {
            caption: "Enabled",
            modelProp: "IsEnabled",
            typeProp: "boolean",
          },
          {
            caption: "NoFlow",
            modelProp: "NoFlow",
            typeProp: "boolean",
          },
          {
            caption: "NoBackFlow",
            modelProp: "NoBackFlow",
            typeProp: "boolean",
          },
          {
            caption: "CompFrom",
            modelProp: "CompFrom",
            typeProp: "list",
            optionalModels: ["BloodCompliance", "BloodTimeVaryingElastance"],
          },
          {
            caption: "CompTo",
            modelProp: "CompTo",
            typeProp: "list",
            optionalModels: ["BloodCompliance", "BloodTimeVaryingElastance"],
          },
        ],
      },
      GasCompliance: {
        properties: [
          {
            modelProp: "Vol",
            typeProp: "numeric",
            caption: "volume",
            unit: "mL",
            min: 0.0,
            step: 0.01,
            displayFactor: 1000.0,
            displayRounding: 2,
          },
          {
            modelProp: "UVol",
            caption: "UVol",
            typeProp: "numeric",
            unit: "mL",
            min: 0.0,
            step: 0.01,
            displayFactor: 1000.0,
            displayRounding: 2,
          },
          {
            caption: "ElBase",
            modelProp: "ElBase",
            typeProp: "numeric",
            unit: "mmHg/mL",
            min: 0.0,
            step: 0.01,
            displayFactor: 0.001,
            displayRounding: 2,
          },
          {
            caption: "ElK",
            modelProp: "ElK",
            typeProp: "numeric",
            unit: "mmHg/mL",
            min: 0.0,
            step: 0.01,
            displayFactor: 0.001,
            displayRounding: 2,
          },
          {
            caption: "Enabled",
            modelProp: "IsEnabled",
            typeProp: "boolean",
          },
        ],
      },
      Container: {
        properties: [
          {
            modelProp: "Vol",
            typeProp: "numeric",
            caption: "volume",
            unit: "mL",
            min: 0.0,
            step: 0.01,
            displayFactor: 1000.0,
            displayRounding: 2,
          },
          {
            modelProp: "UVol",
            caption: "UVol",
            typeProp: "numeric",
            unit: "mL",
            min: 0.0,
            step: 0.01,
            displayFactor: 1000.0,
            displayRounding: 2,
          },
          {
            caption: "ElBase",
            modelProp: "ElBase",
            typeProp: "numeric",
            unit: "mmHg/mL",
            min: 0.0,
            step: 0.01,
            displayFactor: 0.001,
            displayRounding: 2,
          },
          {
            caption: "ElK",
            modelProp: "ElK",
            typeProp: "numeric",
            unit: "mmHg/mL",
            min: 0.0,
            step: 0.01,
            displayFactor: 0.001,
            displayRounding: 2,
          },
          {
            caption: "Enabled",
            modelProp: "IsEnabled",
            typeProp: "boolean",
          },
          {
            caption: "contained models",
            modelProp: "ContainedModels",
            typeProp: "multilist",
            optionalModels: [
              "BloodCompliance",
              "BloodTimeVaryingElastance",
              "GasCompliance",
              "Container",
            ],
          },
        ],
      },
      GasResistor: {
        properties: [
          {
            caption: "RFor",
            modelProp: "RFor",
            typeProp: "numeric",
            unit: "mL/mmHg*s",
            min: 0.001,
            step: 0.01,
            displayFactor: 0.001,
            displayRounding: 2,
          },
          {
            caption: "RBack",
            modelProp: "RBack",
            typeProp: "numeric",
            unit: "mL/mmHg*s",
            min: 0.001,
            step: 0.01,
            displayFactor: 0.001,
            displayRounding: 2,
          },
          {
            caption: "Rk",
            modelProp: "Rk",
            typeProp: "numeric",
            unit: "mL/mmHg*s",
            min: 0.001,
            step: 0.01,
            displayFactor: 0.001,
            displayRounding: 2,
          },
          {
            caption: "Enabled",
            modelProp: "IsEnabled",
            typeProp: "boolean",
          },
          {
            caption: "NoFlow",
            modelProp: "NoFlow",
            typeProp: "boolean",
          },
          {
            caption: "NoBackFlow",
            modelProp: "NoBackFlow",
            typeProp: "boolean",
          },
          {
            caption: "from",
            modelProp: "CompFrom",
            typeProp: "list",
            optionalModels: ["GasCompliance"],
          },
          {
            caption: "to",
            modelProp: "CompTo",
            typeProp: "list",
            optionalModels: ["GasCompliance"],
          },
        ],
      },
      GasExchanger: {
        properties: [
          {
            caption: "DifO2",
            modelProp: "DifO2",
            typeProp: "numeric",
            unit: "mmol/mmHg",
            min: 0.0,
            step: 0.01,
            displayFactor: 1000.0,
            displayRounding: 2,
          },
          {
            caption: "DifCo2",
            modelProp: "DifCo2",
            typeProp: "numeric",
            unit: "mmol/mmHg",
            min: 0.0,
            step: 0.01,
            displayFactor: 1000.0,
            displayRounding: 2,
          },
          {
            caption: "Gas",
            modelProp: "CompGas",
            typeProp: "list",
            optionalModels: ["GasCompliance"],
          },
          {
            caption: "Blood",
            modelProp: "CompBlood",
            typeProp: "list",
            optionalModels: ["BloodCompliance", "BloodTimeVaryingElastance"],
          },
        ],
      },
      ArtificialWhomb: {},
      AutonomicNervousSystem: {},
      Birth: {},
      Blood: {},
      Breathing: {},
      ChestCompressions: {},
      Cvvh: {},
      Drugs: {},
      ECMO: {},
      Gas: {},
      Heart: {},
      IntrathoracicPressure: {},
      Kidneys: {},
      MechanicalVentilator: {},
      Metabolism: {},
      Myocardium: {},
      Oxygenation: {},
      Pda: {},
      Placenta: {},
      Raas: {},
      Resuscitation: {},
    },
    groupers: {
      heart: {
        contraction: {
          typeGrouper: "slider",
          initialValueIndex: -1,
          caption: "Contraction",
          value: 32.0,
          unit: "%",
          step: 1.0,
          min: 0.0,
          max: 500.0,
          closable: false,
          properties: [
            {
              model: "LV",
              modelProp: "ElMax",
              typeProp: "numeric",
              factor: 1.0,
            },
            {
              model: "RV",
              modelProp: "ElMax",
              typeProp: "numeric",
              factor: 1.0,
            },
          ],
        },
        relaxation: {
          typeGrouper: "slider",
          initialValueIndex: -1,
          caption: "Relaxation",
          value: 64.0,
          unit: "%",
          step: 1.0,
          min: 0.0,
          max: 500.0,
          closable: false,
          properties: [
            {
              model: "LV",
              modelProp: "ElMin",
              typeProp: "numeric",
              factor: 1.0,
            },
            {
              model: "RV",
              modelProp: "ElMin",
              typeProp: "numeric",
              factor: 1.0,
            },
          ],
        },
      },
      heartRhythm: {
        rhythm: {
          typeGrouper: "heartRhythmGrouper",
          caption: "Rhythm",
          initialValueIndex: -1,
          unit: "%",
          min: 0.0,
          max: 10.0,
          step: 1.0,
          closable: false,
          options: ["sinus", "svt", "vt", "vf"],
          properties: [
            {
              model: "Heart",
              modelProp: "RhythmType",
              typeProp: "numeric",
              factor: 1.0,
            },
          ],
        },
        pqTime: {
          typeGrouper: "slider",
          caption: "pq time",
          initialValueIndex: 0,
          value: 0.3,
          unit: "sec",
          step: 0.01,
          min: 0.01,
          max: 1.0,
          closable: false,
          properties: [
            {
              model: "Heart",
              modelProp: "PqTime",
              typeProp: "numeric",
              factor: 1.0,
            },
          ],
        },
      },
      valves: {},
      pericardium: {},
      circulation: {
        intravascularVolume: {
          properties: [{}],
        },
        systemicVascularResistance: {
          properties: [{}],
        },
        pulmonaryVascularResistance: {
          properties: [{}],
        },
        coronaryVascularResistance: {
          properties: [{}],
        },
        venousPooling: {
          properties: [{}],
        },
        arterialCompliance: {
          properties: [{}],
        },
        venousCompliance: {
          properties: [{}],
        },
      },
      shunts: {
        pdaSize: {
          properties: [{}],
        },
        ofoSize: { properties: [{}] },
        vsdSize: {
          properties: [{}],
        },
        lungShuntSize: {
          properties: [{}],
        },
      },
      airways: {},
      breathing: {},
      ventilation: {},
      lungs: {},
      chestwall: {},
      gasexchange: {},
      intrathoracicPressure: {},
      mechanicalVentilator: {},
      metabolism: {},
      autonomicNervousSystem: {},
      acidbase: {},
      oxygenation: {},
      blood: {},
      gas: {},
      ecmo: {},
      artificialWhomb: {},
      drugs: {},
      kidneys: {},
      resuscitation: {},
      cvvh: {},
      placenta: {},
      raas: {},
      birth: {},
    },
    charts: {
      general: {
        _id: "general",
        enabled: false,
        caption: "TIME BASED CHART",
        channels: 3,
        collapsed: false,
        position: 2,
        analysisEnabled: true,
        autoscaleEnabled: true,
        multipliersEnabled: true,
        exportEnabled: true,
        models: [],
        props: [],
        selectedModel1: "",
        selectedPrimProp1: "",
        selectedSecProp1: "",
        selectedModel2: "",
        selectedPrimProp2: "",
        selectedSecProp2: "",
        selectedModel3: "",
        selectedPrimProp3: "",
        selectedSecProp3: "",
      },
      pressureProbe: {
        _id: "pressureProbe",
        enabled: true,
        caption: "PRESSURE PROBE",
        channels: 2,
        collapsed: true,
        position: 3,
        analysisEnabled: false,
        autoscaleEnabled: false,
        multipliersEnabled: false,
        exportEnabled: false,
        models: [
          "BloodCompliance",
          "BloodTimeVaryingElastance",
          "GasCompliance",
          "Container",
        ],
        props: ["Pres"],
        selectedModel1: "",
        selectedPrimProp1: "",
        selectedSecProp1: "",
        selectedModel2: "",
        selectedPrimProp2: "",
        selectedSecProp2: "",
        selectedModel3: "",
        selectedPrimProp3: "",
        selectedSecProp3: "",
      },
      flowProbe: {
        _id: "flowProbe",
        enabled: true,
        caption: "FLOW PROBE",
        channels: 2,
        collapsed: true,
        position: 3,
        analysisEnabled: false,
        autoscaleEnabled: false,
        multipliersEnabled: false,
        exportEnabled: false,
        models: ["BloodResistor", "GasResistor"],
        props: ["Flow"],
        selectedModel1: "",
        selectedPrimProp1: "",
        selectedSecProp1: "",
        selectedModel2: "",
        selectedPrimProp2: "",
        selectedSecProp2: "",
        selectedModel3: "",
        selectedPrimProp3: "",
        selectedSecProp3: "",
      },
    },
    monitors: {
      vitals: {
        enabled: true,
        collapsed: false,
        title: "VITALS",
        parameters: [
          {
            props: ["Heart.HeartRate"],
            label: "Heartrate",
            unit: "/min",
            value: 0,
            rounding: 0,
            factor: 1.0,
          },
          {
            props: ["AA.PresMax", "AA.PresMin"],
            label: "ABP",
            unit: "mmHg",
            value: 0,
            rounding: 0,
            factor: 1.0,
          },
          {
            props: ["AA.So2"],
            label: "SpO2",
            unit: "%",
            value: 0,
            rounding: 0,
            factor: 100,
          },
          {
            props: ["Breathing.RespRate"],
            label: "Resp Rate",
            unit: "/min",
            value: 0,
            rounding: 0,
            factor: 1.0,
          },
          {
            props: ["Metabolism.BodyTemp"],
            label: "Temp",
            unit: "C",
            value: 0,
            rounding: 1,
            factor: 1.0,
          },
          {
            props: ["MechanicalVentilator.EtCo2"],
            label: "EtCO2",
            unit: "kPa",
            value: 0,
            rounding: 1,
            factor: 0.3333,
          },
        ],
      },
      circulation: {
        enabled: true,
        collapsed: false,
        title: "CIRCULATION",
        parameters: [
          {
            props: ["LV_AA.Flow"],
            label: "LVO",
            unit: "/min",
            value: 0,
            rounding: 6,
            factor: 1000.0,
          },
        ],
      },
      acidbaseAndOxyMonitoring: {
        enabled: true,
        collapsed: true,
        title: "ACIDBASE AND OXYGENATION",
        parameters: [
          {
            props: ["AA.Ph"],
            label: "Ph",
            unit: "",
            value: 7.43,
            rounding: 2,
            factor: 1.0,
          },
          {
            props: ["AA.Pco2"],
            label: "PCO2",
            unit: "kPa",
            value: 45,
            rounding: 1,
            factor: 0.133,
          },
          {
            props: ["AA.Po2"],
            label: "PO2",
            unit: "kPa",
            value: 45,
            rounding: 1,
            factor: 0.133,
          },
          {
            props: ["AA.Hco3"],
            label: "HCO3",
            unit: "mmol/l",
            value: 20,
            rounding: 1,
            factor: 1,
          },
        ],
      },
    },
  }),

  getters: {},

  actions: {
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

        let id2 = "";
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

        let id3 = "";
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
      console.log(propIdsMonitors);
      console.log(propIdsCharts);
      explain.watchModelProperties(propIdsCharts);
      explain.watchModelPropertiesSlow(propIdsMonitors);
    },
  },
});
