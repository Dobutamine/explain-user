import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    explain_version: 1.0,
    modeling_stepsize: 0.0005,
    core_models: {
      AcidBase: {},
      AutonomicNervousSystem: {
        parameters: {
          IsEnabled: { type: "Boolean", default: true },
          Description: { type: "String", default: "" },
        },
      },
      Blood: {
        parameters: {
          IsEnabled: { type: "Boolean", default: true },
          Description: { type: "String", default: "" },
        },
      },
      BloodCompliance: {
        parameters: {
          IsEnabled: { type: "Boolean", default: true },
          Description: { type: "String", default: "" },
          Vol: { type: "Number", default: 0.001, unit: "l" },
          UVol: { type: "Number", default: 0.0, unit: "l" },
          ElBase: { type: "Number", default: 0.0, unit: "mmHg/l" },
          ElK: { type: "Number", default: 0.0, unit: "mmHg/l" },
        },
      },
      BloodResistor: {
        parameters: {
          IsEnabled: { type: "Boolean", default: true },
          Description: { type: "String", default: "" },
          NoFlow: { type: "Boolean", default: false },
          NoBackFlow: { type: "Boolean", default: false },
          CompFrom: {
            type: "BloodCompliance|BloodTimeVaryingElastance",
            default: null,
          },
          CompTo: {
            type: "BloodCompliance|BloodTimeVaryingElastance",
            default: null,
          },
          RFor: { type: "Number", default: 0.0, unit: "mmHg/l*s" },
          RBack: { type: "Number", default: 0.0, unit: "mmHg/l*s" },
          Rk: { type: "Number", default: 0.0, unit: "mmHg/l*s" },
        },
      },
      BloodTimeVaryingElastance: {
        parameters: {
          IsEnabled: { type: "Boolean", default: true },
          Description: { type: "String", default: "" },
          Vol: { type: "Number", default: 0.001, unit: "l" },
          UVol: { type: "Number", default: 0.0, unit: "l" },
          ElMin: { type: "Number", default: 0.0, unit: "mmHg/l" },
          ElMax: { type: "Number", default: 0.0, unit: "mmHg/l" },
          ElK: { type: "Number", default: 0.0, unit: "mmHg/l" },
        },
      },
      Breathing: {
        parameters: {},
      },
      Container: {
        parameters: {
          IsEnabled: { type: "Boolean", default: true },
          Description: { type: "String", default: "" },
          ContainedModels: {
            type: "[BloodCompliance|BloodTimeVaryingElastance|GasCompliance|Container]",
            default: [],
            unit: "",
          },
          Vol: { type: "Number", default: 0.001, unit: "l" },
          VolExt: { type: "Number", default: 0.001, unit: "l" },
          UVol: { type: "Number", default: 0.0, unit: "l" },
          ElBase: { type: "Number", default: 0.0, unit: "mmHg/l" },
          ElK: { type: "Number", default: 0.0, unit: "mmHg/l" },
        },
      },
      Gas: {
        parameters: {
          IsEnabled: { type: "Boolean", default: true },
          Description: { type: "String", default: "" },
        },
      },
      GasCompliance: {
        parameters: {
          IsEnabled: { type: "Boolean", default: true },
          Description: { type: "String", default: "" },
          Vol: { type: "Number", default: 0.001, unit: "l" },
          UVol: { type: "Number", default: 0.0, unit: "l" },
          ElBase: { type: "Number", default: 0.0, unit: "mmHg/l" },
          ElK: { type: "Number", default: 0.0, unit: "mmHg/l" },
        },
      },
      GasExchanger: {
        parameters: {
          IsEnabled: { type: "Boolean", default: true },
          Description: { type: "String", default: "" },
          CompBlood: {
            type: "BloodCompliance|BloodTimeVaryingElastance",
            default: null,
          },
          CompGas: { type: "GasCompliance", default: null },
          DiffO2: { type: "Number", default: 0.01, unit: "" },
          DiffCo2: { type: "Number", default: 0.01, unit: "" },
        },
      },
      GasResistor: {
        parameters: {
          IsEnabled: { type: "Boolean", default: true },
          Description: { type: "String", default: "" },
          NoFlow: { type: "Boolean", default: false },
          NoBackFlow: { type: "Boolean", default: false },
          CompFrom: { type: "GasCompliance", default: null },
          CompTo: { type: "GasCompliance", default: null },
          RFor: { type: "Number", default: 0.0, unit: "mmHg/l*s" },
          RBack: { type: "Number", default: 0.0, unit: "mmHg/l*s" },
          Rk: { type: "Number", default: 0.0, unit: "mmHg/l*s" },
        },
      },
      Heart: {
        parameters: {
          IsEnabled: { type: "Boolean", default: true },
          Description: { type: "String", default: "" },
          RightAtrium: { type: "BloodTimeVaryingElastance", default: null },
          LeftAtrium: { type: "BloodTimeVaryingElastance", default: null },
          RightVentricle: { type: "BloodTimeVaryingElastance", default: null },
          LeftVentricle: { type: "BloodTimeVaryingElastance", default: null },
          Coronaries: { type: "BloodTimeVaryingElastance", default: null },
          HeartRate: { type: "Number", default: 0.0, unit: "/min" },
          HeartRateRef: { type: "Number", default: 0.0, unit: "/min" },
          HeartRateUpperLimit: { type: "Number", default: 0.0, unit: "/min" },
          VenticularEscapeRate: { type: "Number", default: 0.0, unit: "/min" },
          RhythmType: { type: "Number", default: 0.0, unit: "" },
          PqTime: { type: "Number", default: 0.0, unit: "s" },
          AvDelay: { type: "Number", default: 0.0, unit: "s" },
          QrsTime: { type: "Number", default: 0.0, unit: "s" },
          QtTime: { type: "Number", default: 0.0, unit: "s" },
          CqtTime: { type: "Number", default: 0.0, unit: "s" },
        },
      },
      MechanicalVentilator: {
        parameters: {
          IsEnabled: {
            type: "Boolean",
            default: true,
            unit: "",
            readonly: false,
          },
        },
      },
      Metabolism: {
        parameters: {
          IsEnabled: {
            type: "Boolean",
            default: true,
            unit: "",
            readonly: false,
          },
        },
      },
      Myocardium: {
        parameters: {
          IsEnabled: {
            type: "Boolean",
            default: true,
            unit: "",
            readonly: false,
          },
        },
      },
      Oxygenation: {
        parameters: {
          IsEnabled: {
            type: "Boolean",
            default: true,
            unit: "",
            readonly: false,
          },
        },
      },
      Pda: {
        parameters: {
          IsEnabled: {
            type: "Boolean",
            default: true,
            unit: "",
            readonly: false,
          },
        },
      },
    },
    exp_models: {
      ArtificalWhomb: {},
      Birth: {},
      ChestCompressions: {},
      Cvvh: {},
      Drugs: {},
      ECMO: {},
      IntrathoracicPressure: {},
      Kidneys: {},
      Placenta: {},
      Raas: {},
      Resuscitation: {},
    },
  }),

  getters: {},

  actions: {},
});
