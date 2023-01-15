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
        enabled: true,
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
      gasFlowChart: {
        _id: "gasFlowChart",
        enabled: true,
        caption: "GAS FLOWS",
        channels: 1,
        collapsed: true,
        position: 3,
        analysisEnabled: false,
        autoscaleEnabled: false,
        multipliersEnabled: false,
        exportEnabled: false,
        models: ["GasResistor"],
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
      bloodPresChart: {
        _id: "bloodPresChart",
        enabled: true,
        caption: "BLOOD PRESSURE",
        channels: 2,
        collapsed: false,
        position: 3,
        analysisEnabled: false,
        autoscaleEnabled: false,
        multipliersEnabled: false,
        exportEnabled: false,
        models: ["BloodCompliance", "BloodTimeVaryingElastance"],
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
    },
    monitors: {
      heartMonitoring: {
        enabled: false,
        collapsed: true,
        title: "HEART",
        parameters: [],
      },
      hemodynamicMonitoring: {
        enabled: false,
        collapsed: true,
        title: "HEMODYNAMICS",
        parameters: [],
      },
      respirationMonitoring: {
        enabled: false,
        collapsed: true,
        title: "RESPIRATION",
        parameters: [],
      },
      lungChestwallMonitoring: {
        enabled: false,
        collapsed: true,
        title: "LUNG AND CHESTWALL",
        parameters: [],
      },
      acidbaseAndOxyMonitoring: {
        enabled: true,
        collapsed: true,
        title: "ACIDBASE AND OXYGENATION",
        parameters: [
          {
            prop: "AA.Ph",
            label: "Ph",
            unit: "",
            value: 7.43,
            rounding: 2,
          },
          {
            prop: "AA.Pco2",
            label: "PCO2",
            unit: "mmHg",
            value: 45,
            rounding: 0,
          },
          {
            prop: "AA.Po2",
            label: "PO2",
            unit: "mmHg",
            value: 45,
            rounding: 0,
          },
          {
            prop: "AA.So2",
            label: "SO2",
            unit: "%",
            value: 20,
            rounding: 2,
          },
        ],
      },
      ecmoMonitoring: {
        enabled: false,
        collapsed: true,
        title: "ECMO",
        parameters: [
          {
            model: "LV_AA",
            prop: "Flow",
            label: "Flow",
            unit: "l/min",
            value: 250,
            rounding: 0,
          },
        ],
      },
      drugMonitoring: {
        enabled: false,
        collapsed: true,
        title: "DRUGS",
        parameters: [],
      },
      kidneyMonitoring: {
        enabled: false,
        collapsed: true,
        title: "KIDNEYS",
        parameters: [],
      },
      artificialWhombMonitoring: {
        enabled: false,
        collapsed: true,
        title: "ARTIFICIAL WHOMB",
        parameters: [],
      },
      brainMonitoring: {
        enabled: false,
        collapsed: true,
        title: "BRAIN",
        parameters: [],
      },
      resuscitationMonitoring: {
        enabled: false,
        collapsed: true,
        title: "RESUSCITATION",
        parameters: [],
      },
      birthMonitoring: {
        enabled: false,
        collapsed: true,
        title: "BIRTH",
        parameters: [],
      },
      ansMonitoring: {
        enabled: false,
        collapsed: true,
        title: "AUTONOMIC NERVOUS SYSTEM",
        parameters: [],
      },
      ventilatorMonitoring: {
        enabled: false,
        collapsed: true,
        title: "MECHANICAL VENTILATOR",
        parameters: [],
      },
    },
  }),

  getters: {},

  actions: {
    updateDataCollector(propsArray) {
      // get all the props from charts
      let propIds = [];
      let id1 = "";
      let id2 = "";
      let id3 = "";

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
          if (!propIds.includes(id1)) {
            propIds.push(id1);
          }
        }
        if (id2 != "") {
          if (!propIds.includes(id2)) {
            propIds.push(id2);
          }
        }
        if (id3 != "") {
          if (!propIds.includes(id3)) {
            propIds.push(id3);
          }
        }
      });
      explain.watchModelProperties(propIds);
    },
  },
});
