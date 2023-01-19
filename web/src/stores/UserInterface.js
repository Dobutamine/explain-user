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
      Pda: {
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
        ],
      },
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
        analysisEnabled: true,
        autoscaleEnabled: true,
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
        collapsed: true,
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
        collapsed: true,
        title: "BLOOD FLOWS",
        parameters: [
          {
            props: ["LV_AA.FlowForwardSec"],
            label: "LVO",
            unit: "ml/min",
            value: 0,
            rounding: 0,
            factor: 60000.0,
          },
          {
            props: ["RV_PA.FlowForwardSec"],
            label: "RVO",
            unit: "ml/min",
            value: 0,
            rounding: 0,
            factor: 60000.0,
          },
          {
            props: ["SVC_RA.FlowForwardSec"],
            label: "SVC Flow",
            unit: "ml/min",
            value: 0,
            rounding: 0,
            factor: 60000.0,
          },
          {
            props: ["IVCI_RA.FlowForwardSec"],
            label: "IVC Flow",
            unit: "ml/min",
            value: 0,
            rounding: 0,
            factor: 60000.0,
          },
          {
            props: ["COR_RA.FlowForwardSec"],
            label: "Coronaries",
            unit: "ml/min",
            value: 0,
            rounding: 1,
            factor: 60000.0,
          },
          {
            props: ["AAR_BR.FlowForwardSec"],
            label: "Brain",
            unit: "ml/min",
            value: 0,
            rounding: 0,
            factor: 60000.0,
          },
          {
            props: ["AD_KID.FlowForwardSec"],
            label: "Kidneys",
            unit: "ml/min",
            value: 0,
            rounding: 0,
            factor: 60000.0,
          },
        ],
      },
      ventilation: {
        enabled: true,
        collapsed: true,
        title: "SPONTANEOUS BREATHING",
        parameters: [
          {
            props: ["Breathing.RespRate"],
            label: "Resp rate",
            unit: "/min",
            value: 0,
            rounding: 0,
            factor: 1.0,
          },
          {
            props: ["Breathing.ExpTidalVolume"],
            label: "Tidal volume",
            unit: "ml",
            value: 0,
            rounding: 1,
            factor: 1000.0,
          },
          {
            props: ["MOUTH_DS.FlowBackwardSec"],
            label: "Minute volume",
            unit: "ml/min",
            value: 0,
            rounding: 0,
            factor: 60000.0,
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
    diagram: {
      settings: {
        backgroundColor: 0x333333,
        editingMode: 1,
        scaling: 0.1,
        grid: false,
        gridSize: 10.0,
        snapToGrid: true,
        skeleton: true,
        skeletonColor: 0x444444,
        pathColor: 0x444444,
        radius: 0.6,
      },
      components: {
        LA: {
          label: "LA",
          models: ["LA"],
          compType: "BloodCompartment",
          layout: {
            type: "arc",
            x: 0,
            y: 0,
            dgs: 345,
          },
        },
        LV: {
          label: "LV",
          models: ["LV"],
          compType: "BloodCompartment",
          layout: {
            type: "arc",
            x: 0,
            y: 0,
            dgs: 0,
          },
        },
        AA: {
          label: "AA",
          models: ["AA"],
          compType: "BloodCompartment",
          layout: {
            type: "arc",
            x: 0,
            y: 0,
            dgs: 15,
          },
        },
        AAR: {
          label: "AAR",
          models: ["AAR"],
          compType: "BloodCompartment",
          layout: {
            type: "arc",
            x: 0,
            y: 0,
            dgs: 30,
          },
        },
        AD: {
          label: "AD",
          models: ["AD"],
          compType: "BloodCompartment",
          layout: {
            type: "arc",
            x: 0,
            y: 0,
            dgs: 55,
          },
        },
        LB: {
          label: "LB",
          models: ["RLB"],
          compType: "BloodCompartment",
          layout: {
            type: "arc",
            x: 0,
            y: 0,
            dgs: 90,
          },
        },
        KID: {
          label: "KID",
          models: ["KID"],
          compType: "BloodCompartment",
          layout: {
            type: "rel",
            x: 0,
            y: 210,
            dgs: 90,
          },
        },
        INT: {
          label: "INT",
          models: ["INT"],
          compType: "BloodCompartment",
          layout: {
            type: "rel",
            x: 0,
            y: 180,
            dgs: 90,
          },
        },
        LS: {
          label: "LS",
          models: ["LS"],
          compType: "BloodCompartment",
          layout: {
            type: "rel",
            x: 0,
            y: 150,
            dgs: 90,
          },
        },
        COR: {
          label: "COR",
          models: ["COR"],
          compType: "BloodCompartment",
          layout: {
            type: "rel",
            x: 0,
            y: 30,
            dgs: 90,
          },
        },
        IVCE: {
          label: "IVCE",
          models: ["IVCE"],
          compType: "BloodCompartment",
          layout: {
            type: "arc",
            x: 0,
            y: 120,
            dgs: 125,
          },
        },
        IVCI: {
          label: "IVCI",
          models: ["IVCI"],
          compType: "BloodCompartment",
          layout: {
            type: "arc",
            x: 0,
            y: 120,
            dgs: 150,
          },
        },
        RA: {
          label: "RA",
          models: ["RA"],
          compType: "BloodCompartment",
          layout: {
            type: "arc",
            x: 0,
            y: 120,
            dgs: 180,
          },
        },
        RV: {
          label: "RV",
          models: ["RV"],
          compType: "BloodCompartment",
          layout: {
            type: "arc",
            x: 0,
            y: 120,
            dgs: 195,
          },
        },
        PA: {
          label: "PA",
          models: ["PA"],
          compType: "BloodCompartment",
          layout: {
            type: "arc",
            x: 0,
            y: 120,
            dgs: 225,
          },
        },
        LL: {
          label: "LL",
          models: ["LL"],
          compType: "BloodCompartment",
          layout: {
            type: "arc",
            x: 0,
            y: 120,
            dgs: 270,
          },
        },
        RL: {
          label: "RL",
          models: ["RL"],
          compType: "BloodCompartment",
          layout: {
            type: "rel",
            x: 0,
            y: -200,
            dgs: 270,
          },
        },
        PV: {
          label: "PV",
          models: ["PV"],
          compType: "BloodCompartment",
          layout: {
            type: "arc",
            x: 0,
            y: -200,
            dgs: 315,
          },
        },
        BR: {
          label: "BR",
          models: ["BR"],
          compType: "BloodCompartment",
          layout: {
            type: "rel",
            x: 0,
            y: 70,
            dgs: 315,
          },
        },
        UB: {
          label: "UB",
          models: ["RUB"],
          compType: "BloodCompartment",
          layout: {
            type: "rel",
            x: 0,
            y: 100,
            dgs: 315,
          },
        },
        SVC: {
          label: "SVC",
          models: ["SVC"],
          compType: "BloodCompartment",
          layout: {
            type: "rel",
            x: -135,
            y: 90,
            dgs: 315,
          },
        },
        CHEST_L: {
          label: "",
          models: ["CHEST_L"],
          compType: "Container",
          layout: {
            type: "rel",
            x: -135,
            y: -220,
            dgs: 270,
          },
        },
        CHEST_R: {
          label: "",
          models: ["CHEST_R"],
          compType: "Container",
          layout: {
            type: "rel",
            x: 135,
            y: -220,
            dgs: 270,
          },
        },
        ALL: {
          label: "ALL",
          models: ["ALL"],
          compType: "GasCompartment",
          layout: {
            type: "rel",
            x: -135,
            y: -90,
            dgs: 270,
          },
        },
        ALR: {
          label: "ALR",
          models: ["ALR"],
          compType: "GasCompartment",
          layout: {
            type: "rel",
            x: 135,
            y: -90,
            dgs: 270,
          },
        },
        DS: {
          label: "DS",
          models: ["DS"],
          compType: "GasCompartment",
          layout: {
            type: "arc",
            x: -135,
            y: 90,
            dgs: 270,
          },
        },

        LA_LV: {
          label: "LA_LV",
          models: ["LA_LV"],
          compType: "BloodConnector",
          dbcFrom: "LA",
          dbcTo: "LV",
        },
        LV_AA: {
          label: "LV_AA",
          models: ["LV_AA"],
          compType: "BloodConnector",
          dbcFrom: "LV",
          dbcTo: "AA",
        },
        AD_LB: {
          label: "AD_LB",
          models: ["AD_RLB"],
          compType: "BloodConnector",
          dbcFrom: "AD",
          dbcTo: "LB",
        },
        AD_KID: {
          label: "AD_KID",
          models: ["AD_KID"],
          compType: "BloodConnector",
          dbcFrom: "AD",
          dbcTo: "KID",
        },
        AD_INT: {
          label: "AD_INT",
          models: ["AD_INT"],
          compType: "BloodConnector",
          dbcFrom: "AD",
          dbcTo: "INT",
        },
        AD_LS: {
          label: "AD_LS",
          models: ["AD_LS"],
          compType: "BloodConnector",
          dbcFrom: "AD",
          dbcTo: "LS",
        },
        AA_COR: {
          label: "AA_COR",
          models: ["AA_COR"],
          compType: "BloodConnector",
          dbcFrom: "AA",
          dbcTo: "COR",
        },
        AA_AAR: {
          label: "AA_AAR",
          models: ["AA_AAR"],
          compType: "BloodConnector",
          dbcFrom: "AA",
          dbcTo: "AAR",
        },
        AAR_AD: {
          label: "AAR_AD",
          models: ["AAR_AD"],
          compType: "BloodConnector",
          dbcFrom: "AAR",
          dbcTo: "AD",
        },
        LB_IVCE: {
          label: "LB_IVCE",
          models: ["RLB_IVCE"],
          compType: "BloodConnector",
          dbcFrom: "LB",
          dbcTo: "IVCE",
        },
        KID_IVCE: {
          label: "KID_IVCE",
          models: ["KID_IVCE"],
          compType: "BloodConnector",
          dbcFrom: "KID",
          dbcTo: "IVCE",
        },
        LS_IVCE: {
          label: "LS_IVCE",
          models: ["LS_IVCE"],
          compType: "BloodConnector",
          dbcFrom: "LS",
          dbcTo: "IVCE",
        },
        INT_IVCE: {
          label: "INT_IVCE",
          models: ["INT_IVCE"],
          compType: "BloodConnector",
          dbcFrom: "INT",
          dbcTo: "IVCE",
        },
        IVCE_IVCE: {
          label: "IVCE_IVCE",
          models: ["IVCE_IVCI"],
          compType: "BloodConnector",
          dbcFrom: "IVCE",
          dbcTo: "IVCI",
        },
        IVCI_RA: {
          label: "IVCI_RA",
          models: ["IVCI_RA"],
          compType: "BloodConnector",
          dbcFrom: "IVCI",
          dbcTo: "RA",
        },
        RA_RV: {
          label: "RA_RV",
          models: ["RA_RV"],
          compType: "BloodConnector",
          dbcFrom: "RA",
          dbcTo: "RV",
        },
        RV_PA: {
          label: "RV_PA",
          models: ["RV_PA"],
          compType: "BloodConnector",
          dbcFrom: "RV",
          dbcTo: "PA",
        },
        PA_LL: {
          label: "PA_LL",
          models: ["PA_LL"],
          compType: "BloodConnector",
          dbcFrom: "PA",
          dbcTo: "LL",
        },
        PA_RL: {
          label: "PA_RL",
          models: ["PA_RL"],
          compType: "BloodConnector",
          dbcFrom: "PA",
          dbcTo: "RL",
        },
        LL_PV: {
          label: "LL_PV",
          models: ["LL_PV"],
          compType: "BloodConnector",
          dbcFrom: "LL",
          dbcTo: "PV",
        },
        RL_PV: {
          label: "RL_PV",
          models: ["RL_PV"],
          compType: "BloodConnector",
          dbcFrom: "RL",
          dbcTo: "PV",
        },
        PV_LA: {
          label: "PV_LA",
          models: ["PV_LA"],
          compType: "BloodConnector",
          dbcFrom: "PV",
          dbcTo: "LA",
        },
        SVC_RA: {
          label: "SVC_RA",
          models: ["SVC_RA"],
          compType: "BloodConnector",
          dbcFrom: "SVC",
          dbcTo: "RA",
        },
        UB_SVC: {
          label: "UB_SVC",
          models: ["RUB_SVC"],
          compType: "BloodConnector",
          dbcFrom: "UB",
          dbcTo: "SVC",
        },
        BR_SVC: {
          label: "BR_SVC",
          models: ["BR_SVC"],
          compType: "BloodConnector",
          dbcFrom: "BR",
          dbcTo: "SVC",
        },
        AAR_BR: {
          label: "AAR_BR",
          models: ["AAR_BR"],
          compType: "BloodConnector",
          dbcFrom: "AAR",
          dbcTo: "BR",
        },
        AAR_UB: {
          label: "AAR_UB",
          models: ["AAR_RUB"],
          compType: "BloodConnector",
          dbcFrom: "AAR",
          dbcTo: "UB",
        },
        COR_RA: {
          label: "COR_RA",
          models: ["COR_RA"],
          compType: "BloodConnector",
          dbcFrom: "COR",
          dbcTo: "RA",
        },
        DA: {
          label: "DA",
          models: ["DA"],
          compType: "Shunt",
          dbcFrom: "AAR",
          dbcTo: "PA",
        },
        FO: {
          label: "FO",
          models: ["FO"],
          compType: "Shunt",
          dbcFrom: "LA",
          dbcTo: "RA",
        },
        IPS: {
          label: "IPS",
          models: ["IPS"],
          compType: "Shunt",
          dbcFrom: "PA",
          dbcTo: "PV",
        },
        DS_ALL: {
          label: "DS_ALL",
          models: ["DS_ALL"],
          compType: "GasConnector",
          dbcFrom: "DS",
          dbcTo: "ALL",
        },
        DS_ALR: {
          label: "DS_ALR",
          models: ["DS_ALR"],
          compType: "GasConnector",
          dbcFrom: "DS",
          dbcTo: "ALR",
        },
        GASEX_LL: {
          label: "",
          models: ["GASEX_LL"],
          compType: "GasExchanger",
          gas: "O2",
          layout: {
            type: "arc",
            x: 0,
            y: 0,
            dgs: 300,
          },
        },
        GASEX_LR: {
          label: "",
          models: ["GASEX_LR"],
          compType: "GasExchanger",
          gas: "O2",
          layout: {
            type: "arc",
            x: 0,
            y: 0,
            dgs: 300,
          },
        },
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

      // diagrams
      Object.values(this.diagram.components).forEach((component) => {
        switch (component.compType) {
          case "BloodCompartment":
            component.models.forEach((model) => {
              propIdsCharts.push(model + ".Vol");
              propIdsCharts.push(model + ".To2");
            });
            break;
          case "BloodConnector":
            component.models.forEach((model) => {
              propIdsCharts.push(model + ".Flow");
            });
            break;
          case "Shunt":
            component.models.forEach((model) => {
              propIdsCharts.push(model + ".Flow");
            });
            break;
          case "Container":
            component.models.forEach((model) => {
              propIdsCharts.push(model + ".Vol");
            });
            break;
          case "GasCompartment":
            component.models.forEach((model) => {
              propIdsCharts.push(model + ".Vol");
              propIdsCharts.push(model + ".Po2");
            });
            break;
          case "GasConnector":
            component.models.forEach((model) => {
              propIdsCharts.push(model + ".Flow");
            });
            break;
          case "GasExchanger":
            component.models.forEach((model) => {
              if ((component.gas = "O2")) {
                propIdsCharts.push(model + ".FluxO2");
              }
              if ((component.gas = "Co2")) {
                propIdsCharts.push(model + ".FluxCo2");
              }
            });
            break;
        }
      });
      explain.watchModelProperties(propIdsCharts);
      explain.watchModelPropertiesSlow(propIdsMonitors);
    },
  },
});
