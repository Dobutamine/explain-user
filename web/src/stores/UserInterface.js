import { defineStore } from "pinia";

export const useUserInterfaceStore = defineStore("userInterface", {
  state: () => ({
    charts: {
      bloodFlowProbe: {
        enabled: true,
        collapsed: true,
        title: "FLOW PROBE",
        model_types: [],
        model_props: [],
      },
      bloodPressureProbe: {
        enabled: true,
        collapsed: true,
        title: "PRESSURE PROBE",
        model_types: [],
        model_props: [],
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
            model: "AA",
            prop: "Ph",
            label: "Ph",
            unit: "",
            value: 7.43,
            rounding: 2,
          },
          {
            model: "AA",
            prop: "Pco2",
            label: "Pco2",
            unit: "mmHg",
            value: 45,
            rounding: 0,
          },
          {
            model: "AA",
            prop: "Hco3",
            label: "Hco3",
            unit: "mmol/l",
            value: 23.1,
            rounding: 1,
          },
          {
            model: "AA",
            prop: "Po2",
            label: "Po2",
            unit: "mmHg",
            value: 100,
            rounding: 0,
          },
          {
            model: "AA",
            prop: "So2",
            label: "So2",
            unit: "%",
            value: 97,
            rounding: 0,
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

  actions: {},
});
