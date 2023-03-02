import ModelBaseClass from "../helpers/ModelBaseClass";
import { GasCompliance } from "./GasCompliance";
import { GasResistor } from "./GasResistor";
import { GasExchanger } from "./GasExchanger";
import { SetAirComposition } from "../helpers/AirComposition";
import GasConnector from "src/components/ui-elements/GasConnector";

export class MembraneOxygenator extends ModelBaseClass {
  // independent variables
  Vol = 0.0;
  UVol = 0.0;
  ElBase = 0.0;
  ElK = 0.0;
  Pres0 = 0;
  PresMus = 0;
  PresExt = 0;
  PresCc = 0;
  Solutes = {};

  // dependent variables
  Pres = 0.0;
  PresInlet = 0;
  PresOutlet = 0;
  VolMax = 0.0;
  VolMin = 0.0;
  PresMax = 0.0;
  PresMin = 0.0;
  To2 = 0;
  Po2 = 0.0;
  So2 = 0.0;
  Tco2 = 0.0;
  Pco2 = 0.0;
  Ph = 0.0;
  Hco3 = 0.0;

  PAtm = 760.0;
  Fo2Dry = 0.205;
  Fco2Dry = 0.000392;
  Fn2Dry = 0.794608;
  FotherDry = 0;
  Humidity = 0.5;
  Temp = 20.0;
  SweepGasFlow = 1.4;

  // local parameters
  _temp_max_pres = -1000.0;
  _temp_min_pres = 1000.0;
  _temp_max_vol = -1000.0;
  _temp_min_vol = 1000.0;
  _update_counter = 0.0;
  _update_interval = 1.0;

  _gasSource = {};
  _gasIn = {};
  _gasCompartment = {};
  _gasOut = {};
  _gasExchanger = {};

  // model initializer
  InitModel(args) {
    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });

    // build the gas parts of the oxygenator
    this._gasSource = new GasCompliance(
      this._modelEngine,
      "OxyGasSource",
      "GasCompliance"
    );
    this.SetGasSource();

    this._gasCompartment = new GasCompliance(
      this._modelEngine,
      "OxyGas",
      "GasCompliance"
    );
    this.SetGasCompartment();

    this._gasExchanger = new GasExchanger(
      this._modelEngine,
      "OxyExchanger",
      "GasExchanger"
    );
    this.SetGasExchanger();

    // build the connectors
    this._gasIn = new GasResistor(
      this._modelEngine,
      "OxySource_Gas",
      "GasResistor"
    );
    this._gasOut = new GasResistor(
      this._modelEngine,
      "OxyGas_OUT",
      "GasResistor"
    );
    this.SetGasResistors();

    // set the flag to model is initialized
    this._is_initialized = true;

    console.log(this._modelEngine.Models);
  }

  SetGasExchanger() {
    this._gasExchanger.InitModel([
      { key: "Description", value: "oxygenator gas exchanger" },
      { key: "IsEnabled", value: this.IsEnabled },
      { key: "CompBlood", value: this.Name },
      { key: "CompGas", value: "OxyGas" },
      { key: "DifO2", value: 0.01 },
      { key: "DifCo2", value: 0.01 },
    ]);
    // add the model to the models object
    this._modelEngine.Models[this._gasExchanger.Name] = this._gasExchanger;
  }

  SetGasCompartment() {
    this._gasCompartment.InitModel([
      { key: "Description", value: "gas source for the membrane oxygenator" },
      { key: "IsEnabled", value: this.IsEnabled },
      { key: "Vol", value: 0.5 },
      { key: "UVol", value: 0.5 },
      { key: "ElBase", value: 25000 },
      { key: "ElK", value: 0.0 },
      { key: "Pres", value: this.PAtm },
      { key: "Pres0", value: this.PAtm },
      { key: "Humidity", value: this.Humidity },
      { key: "Temp", value: this.Temp },
      { key: "TargetTemp", value: this.Temp },
      { key: "FixedComposition", value: false },
    ]);

    SetAirComposition(
      this._gasCompartment,
      this.Humidity,
      this.Temp,
      this.Fo2Dry,
      this.Fco2Dry,
      this.Fn2Dry,
      this.FotherDry
    );

    // add the model to the models object
    this._modelEngine.Models[this._gasCompartment.Name] = this._gasCompartment;
  }

  SetGasSource() {
    this._gasSource.InitModel([
      { key: "Description", value: "gas source for the membrane oxygenator" },
      { key: "IsEnabled", value: this.IsEnabled },
      { key: "Vol", value: 5.2 },
      { key: "UVol", value: 5.0 },
      { key: "ElBase", value: 1000.0 },
      { key: "ElK", value: 0.0 },
      { key: "Pres", value: this.PAtm + 200.0 },
      { key: "Pres0", value: this.PAtm },
      { key: "Humidity", value: this.Humidity },
      { key: "Temp", value: this.Temp },
      { key: "TargetTemp", value: this.Temp },
      { key: "FixedComposition", value: true },
    ]);

    SetAirComposition(
      this._gasSource,
      this.Humidity,
      this.Temp,
      this.Fo2Dry,
      this.Fco2Dry,
      this.Fn2Dry,
      this.FotherDry
    );

    // add the model to the models object
    this._modelEngine.Models[this._gasSource.Name] = this._gasSource;
  }

  SetGasResistors() {
    let res = 200.0 / (this.SweepGasFlow / 60.0) - 25.0;

    this._gasIn.InitModel([
      { key: "IsEnabled", value: this.IsEnabled },
      { key: "RFor", value: res },
      { key: "RBack", value: res },
      { key: "Rk", value: 0.0 },
      { key: "NoFlow", value: false },
      { key: "NoBackFlow", value: false },
      { key: "CompFrom", value: "OxyGasSource" },
      { key: "CompTo", value: "OxyGas" },
    ]);

    this._gasOut.InitModel([
      { key: "IsEnabled", value: this.IsEnabled },
      { key: "RFor", value: 25.0 },
      { key: "RBack", value: 25.0 },
      { key: "Rk", value: 0.0 },
      { key: "NoFlow", value: false },
      { key: "NoBackFlow", value: false },
      { key: "CompFrom", value: "OxyGas" },
      { key: "CompTo", value: "OUT" },
    ]);

    // add the model to the models object
    this._modelEngine.Models[this._gasIn.Name] = this._gasIn;

    // add the model to the models object
    this._modelEngine.Models[this._gasOut.Name] = this._gasOut;
  }

  // override the base class CalcModel method
  CalcModel() {
    // calculate the pressure depending on the elastance
    this.Pres =
      this.ElBase *
        (1.0 + this.ElK * (this.Vol - this.UVol)) *
        (this.Vol - this.UVol) +
      this.Pres0 +
      this.PresExt +
      this.PresCc +
      this.PresMus;

    // reset the external pressures as they have to be set every model cycle
    this.Pres0 = 0.0;
    this.PresExt = 0.0;
    this.PresCc = 0.0;
    this.PresMus = 0.0;

    this.PresInlet = this.Pres;
    this.PresOutlet = this.Pres;

    // find the min and max values of the last update interval
    if (this.Pres > this._temp_max_pres) {
      this._temp_max_pres = this.Pres;
    }
    if (this.Pres < this._temp_min_pres) {
      this._temp_min_pres = this.Pres;
    }

    if (this.Vol > this._temp_max_vol) {
      this._temp_max_vol = this.Vol;
    }
    if (this.Vol < this._temp_min_vol) {
      this._temp_min_vol = this.Vol;
    }

    if (this._update_counter > this._update_interval) {
      this._update_counter = 0.0;
      this.PresMax = this._temp_max_pres;
      this.PresMin = this._temp_min_pres;
      this._temp_max_pres = -1000.0;
      this._temp_min_pres = 1000.0;

      this.VolMax = this._temp_max_vol;
      this.VolMin = this._temp_min_vol;
      this._temp_max_vol = -1000.0;
      this._temp_min_vol = 1000.0;
    }

    this._update_counter += this._t;
  }
  VolumeIn(dvol, modelFrom) {
    // increase the volume
    this.Vol += dvol;

    // calculate the change in To2 and Tco2
    let dTo2 = (modelFrom.To2 - this.To2) * dvol;
    this.To2 = (this.To2 * this.Vol + dTo2) / this.Vol;

    let dTco2 = (modelFrom.Tco2 - this.Tco2) * dvol;
    this.Tco2 = (this.Tco2 * this.Vol + dTco2) / this.Vol;

    // calculate the change in solutes concentrations
    for (const key in this.Solutes) {
      let dSol = (modelFrom.Solutes[key] - this.Solutes[key]) * dvol;
      this.Solutes[key] = (this.Solutes[key] * this.Vol + dSol) / this.Vol;
    }
  }
  VolumeOut(dvol) {
    // declare a volume deficit
    let vol_deficit = 0.0;

    // decrease the volume
    this.Vol -= dvol;

    // guard against negative volumes and a mass balance disturbance
    if (this.Vol < 0) {
      vol_deficit = -this.Vol;
      this.Vol = 0.0;
    }
    // return the volume deficit
    return vol_deficit;
  }
}
