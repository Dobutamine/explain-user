import ModelBaseClass from "../helpers/ModelBaseClass";
import { GasCompliance } from "./GasCompliance";
import { GasResistor } from "./GasResistor";
import { SetAirComposition } from "../helpers/AirComposition";

export class Ecls extends ModelBaseClass {
  // properties
  Patm = 760;

  Fo2Dry = 0.205;
  Fco2Dry = 0.000392;
  Fn2Dry = 0.794608;
  FotherDry = 0;
  Temp = 37;
  Humidity = 1;

  OutsideAirHumidity = 0.5;
  OutsideAirTemp = 20.0;
  OutsideAirFo2Dry = 0.21;
  OutsideAirFco2Dry = 0.0004;
  OutsideAirFn2Dry = 0.78;
  OutsideAirFotherDry = 0.0096;

  SweepGasFlow = 1.4;

  // delcare objects holding the ventilator components
  EclsGasIn = {};
  EclsGasIn_EclsGasLung = {};
  EclsGasLung = {};
  EclsGasLung_EclsGasOut = {};
  EclsGasOut = {};
  EclsGasEx = {};

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

    this._modelEngine.Models.EclsGasOut = new GasCompliance(
      this._modelEngine,
      "EclsGasOut",
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

    this.FlowSensor = this._modelEngine.Models["EclsGasIn_EclsGasLung"];
    this.PressureSensor = this._modelEngine.Models["EclsGasLung"];

    this.SetEclsGasIn();
    this.SetEclsGasLung();
    this.SetEclsGasOut();
    this.SetEclsGasResistors();

    // set the flag to model is initialized
    this._is_initialized = true;

    console.log("Ecls initialized");
  }
  SetFiO2() {
    let co2Factor = this.Fco2Dry / (1.0 - this.Fo2Dry);
    let n2Factor = this.Fn2Dry / (1.0 - this.Fo2Dry);
    let otherFactor = this.FotherDry / (1.0 - this.Fo2Dry);

    let newFo2 = this.FiO2;
    let newFco2 = co2Factor * (1.0 - this.FiO2);
    let newFn2 = n2Factor * (1.0 - this.FiO2);
    let newFother = otherFactor * (1.0 - this.FiO2);

    SetAirComposition(
      this._modelEngine.Models["EclsGasIn"],
      this.Humidity,
      this.Temp,
      newFo2,
      newFco2,
      newFn2,
      newFother
    );
  }
  CalcModel() {
    // calculate the resistance depending on the desired sweep gas flow
    let res = 200.0 / (this.SweepGasFlow / 60.0);
    this._modelEngine.Models.EclsGasIn_EclsGasLung.RFor = res - 25;
    this._modelEngine.Models.EclsGasIn_EclsGasLung.NoBackFlow = true;

    this._modelEngine.Models.EclsGasLung_EclsGasOut.RFor = 25;
    this._modelEngine.Models.EclsGasLung_EclsGasOut.NoBackFlow = true;
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
    SetAirComposition(
      this._modelEngine.Models.EclsGasIn,
      this.Humidity,
      this.Temp,
      this.Fo2Dry,
      this.Fco2Dry,
      this.Fn2Dry,
      this.FotherDry
    );
  }
  SetEclsGasOut() {
    // this is the external reservoir of the ventilator which is set at a
    // fixed composition and volume with a pressure of 200 mmHg above atmospheric pressure
    this._modelEngine.Models.EclsGasOut.InitModel([
      { key: "Vol", value: 5.0 },
      { key: "UVol", value: 5.0 },
      { key: "ElBase", value: 1000.0 },
      { key: "ElK", value: 0.0 },
      { key: "Humidity", value: this.OutsideAirHumidity },
      { key: "Temp", value: this.OutsideAirTemp },
      { key: "TargetTemp", value: this.OutsideAirTemp },
      { key: "FixedComposition", value: true },
      { key: "Pres", value: this.Patm },
      { key: "Pres0", value: this.Patm },
      { key: "IsEnabled", value: this.IsEnabled },
    ]);
    SetAirComposition(
      this._modelEngine.Models.EclsGasOut,
      this.OutsideAirHumidity,
      this.OutsideAirTemp,
      this.OutsideAirFo2Dry,
      this.OutsideAirFco2Dry,
      this.OutsideAirFn2Dry,
      this.OutsideAirFotherDry
    );
  }

  SetEclsGasLung() {
    this._modelEngine.Models.EclsGasLung.InitModel([
      { key: "Vol", value: this.GasLungVolume },
      { key: "UVol", value: this.GasLungVolume },
      { key: "ElBase", value: this.GasLungElastance },
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
      { key: "CompTo", value: "EclsGasOut" },
    ]);
  }
}
