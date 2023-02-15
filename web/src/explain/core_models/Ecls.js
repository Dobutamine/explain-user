import ModelBaseClass from "../helpers/ModelBaseClass";
import { GasCompliance } from "./GasCompliance";
import { GasResistor } from "./GasResistor";
import { SetAirComposition } from "../helpers/AirComposition";
import { GasExchanger } from "./GasExchanger";

export class Ecls extends ModelBaseClass {
  // properties
  Patm = 760;

  FiO2 = 0.205;
  FiCo2 = 0.0392;
  Fo2Dry = 0.205;
  Fco2Dry = 0.0392;
  Fn2Dry = 0.794608;
  FotherDry = 0;
  Temp = 20;
  Humidity = 0.5;
  DifO2 = 0.001;
  DifCo2 = 0.001;
  SweepGasFlow = 1.4;

  GasLungVolume = 1.0;
  _gasLungElastance = 10000;

  BloodLungVolume = 0;
  _bloodLungElastance = 0;

  TubingInDiameter = 0;
  TubingLengthDiameter = 0;
  TubingOutDiameter = 0;
  TubingOutLength = 0;
  TubingElastance = 0;

  DrainageCannulaDiameter = 0;
  ReturnCannulaDiameter = 0;
  DrainageCannulaLength = 0;
  ReturnCannulaLength = 0;
  CannulaElastance = 0;

  _outsideAirHumidity = 0.5;
  _outsideAirTemp = 20.0;
  _outsideAirFo2Dry = 0.21;
  _outsideAirFco2Dry = 0.0004;
  _outsideAirFn2Dry = 0.78;
  _outsideAirFotherDry = 0.0096;

  // delcare objects holding the ventilator components
  EclsGasIn = {};
  EclsGasIn_EclsGasLung = {};
  EclsGasLung = {};
  EclsGasLung_Out = {};
  EclsGasEx = {};

  _updateCounter = 0;
  _updateInterval = 1.0;

  InitModel(args) {
    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });

    // instantiate the internal ventilator compliance
    this._modelEngine.Models.EclsGasIn = new GasCompliance(
      this._modelEngine,
      "EclsGasIn",
      "GasCompliance"
    );

    this._modelEngine.Models.EclsGasLung = new GasCompliance(
      this._modelEngine,
      "EclsGasLung",
      "GasCompliance"
    );

    this._modelEngine.Models.EclsGasIn_EclsGasLung = new GasResistor(
      this._modelEngine,
      "EclsGasIn_EclsGasLung",
      "GasResistor"
    );
    this._modelEngine.Models.EclsGasLung_EclsGasOut = new GasResistor(
      this._modelEngine,
      "EclsGasLung_EclsGasOut",
      "GasResistor"
    );

    this._modelEngine.Models.EclsGasEx = new GasExchanger(
      this._modelEngine,
      "EclsGasEx",
      "GasExchanger"
    );

    this.FlowSensor = this._modelEngine.Models["EclsGasIn_EclsGasLung"];
    this.PressureSensor = this._modelEngine.Models["EclsGasLung"];

    this.SetEclsGasIn();
    this.SetEclsGasLung();
    this.SetEclsGasResistors();
    this.SetGasExchanger();

    // set the flag to model is initialized
    this._is_initialized = true;
  }
  SetGasMixture() {
    let sum = 1.0 - this.FiCo2 - this.FiO2;
    this.Fn2Dry = 0;
    let newFiO2 = this.FiO2;
    if (sum < 0) {
      newFiO2 = this.FiO2 + sum;
    } else {
      this.Fn2Dry = sum;
    }

    SetAirComposition(
      this._modelEngine.Models["EclsGasIn"],
      this.Humidity,
      this.Temp,
      newFiO2,
      this.FiCo2,
      this.Fn2Dry,
      this.FotherDry
    );
  }
  CalcModel() {
    // calculate the resistance depending on the desired sweep gas flow
    let res = 500 / (this.SweepGasFlow / 60.0);
    this._modelEngine.Models.EclsGasIn_EclsGasLung.RFor = res - 25;
    this._modelEngine.Models.EclsGasIn_EclsGasLung.NoBackFlow = true;

    this._modelEngine.Models.EclsGasLung_EclsGasOut.RFor = 25;
    this._modelEngine.Models.EclsGasLung_EclsGasOut.NoBackFlow = true;

    // update gas
    if (this._updateCounter >= this._updateInterval) {
      this._updateCounter = 0;
      // set the diffusion coefficients
      this._modelEngine.Models.EclsGasEx.DifCo2 = this.DifCo2;
      this._modelEngine.Models.EclsGasEx.DifO2 = this.DifO2;
      // set the gas mixture
      this.SetGasMixture();
    }
    this._updateCounter += this._t;
  }

  SetEclsGasIn() {
    // this is the internal reservoir of the ventilator which is set at a
    // fixed composition and volume with a pressure of 200 mmHg above atmospheric pressure
    this._modelEngine.Models.EclsGasIn.InitModel([
      { key: "Vol", value: 5.2 },
      { key: "UVol", value: 5.0 },
      { key: "ElBase", value: 1000.0 },
      { key: "ElK", value: 0.0 },
      { key: "Humidity", value: this.Humidity },
      { key: "Temp", value: this.Temp },
      { key: "FixedComposition", value: true },
      { key: "Pres", value: this.Patm + 200.0 },
      { key: "Pres0", value: this.Patm },
      { key: "IsEnabled", value: this.IsEnabled },
    ]);
    let fn2 = 1.0 - this.FiO2 - this.FiCo2;
    if (fn2 < 0) {
      fn2 = 0;
    }
    SetAirComposition(
      this._modelEngine.Models.EclsGasIn,
      this.Humidity,
      this.Temp,
      this.FiO2,
      this.FiCo2,
      fn2,
      0
    );
  }
  SetGasExchanger() {
    this._modelEngine.Models.EclsGasEx.InitModel([
      { key: "CompBlood", value: "RLB" },
      { key: "CompGas", value: "EclsGasLung" },
      { key: "DifCo2", value: this.DifCo2 },
      { key: "DifO2", value: this.DifO2 },
      { key: "IsEnabled", value: this.IsEnabled },
    ]);
  }

  SetEclsGasLung() {
    this._modelEngine.Models.EclsGasLung.InitModel([
      { key: "Vol", value: this.GasLungVolume },
      { key: "UVol", value: this.GasLungVolume },
      { key: "ElBase", value: this._gasLungElastance },
      { key: "ElK", value: 0.0 },
      { key: "Humidity", value: this.Humidity },
      { key: "Temp", value: this.Temp },
      { key: "TargetTemp", value: this.Temp },
      { key: "FixedComposition", value: false },
      { key: "Pres", value: this.Patm },
      { key: "Pres0", value: this.Patm },
      { key: "IsEnabled", value: this.IsEnabled },
    ]);
    SetAirComposition(
      this._modelEngine.Models.EclsGasLung,
      this.Humidity,
      this.Temp,
      this.Fo2Dry,
      this.Fco2Dry,
      this.Fn2Dry,
      this.FotherDry
    );
  }
  SetEclsGasResistors() {
    this._modelEngine.Models.EclsGasIn_EclsGasLung.InitModel([
      { key: "IsEnabled", value: this.IsEnabled },
      { key: "RFor", value: 25000 },
      { key: "RBack", value: 25000 },
      { key: "Rk", value: 0.0 },
      { key: "NoFlow", value: false },
      { key: "NoBackFlow", value: false },
      { key: "CompFrom", value: "EclsGasIn" },
      { key: "CompTo", value: "EclsGasLung" },
    ]);
    this._modelEngine.Models.EclsGasLung_EclsGasOut.InitModel([
      { key: "IsEnabled", value: this.IsEnabled },
      { key: "RFor", value: 25000 },
      { key: "RBack", value: 25000 },
      { key: "Rk", value: 0.0 },
      { key: "NoFlow", value: false },
      { key: "NoBackFlow", value: false },
      { key: "CompFrom", value: "EclsGasLung" },
      { key: "CompTo", value: "OUT" },
    ]);
  }
}
