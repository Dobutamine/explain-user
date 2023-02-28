import ModelBaseClass from "../helpers/ModelBaseClass";
import { GasCompliance } from "./GasCompliance";
import { GasResistor } from "./GasResistor";
import { SetAirComposition } from "../helpers/AirComposition";
import { GasExchanger } from "./GasExchanger";
import { BloodResistor } from "./BloodResistor";
import { BloodCompliance } from "./BloodCompliance";
import { BloodPump } from "./BloodPump";
import { MembraneOxygenator } from "./MembraneOxygenator";

export class Ecls extends ModelBaseClass {
  // swee[ air atmospheric pressure
  Patm = 760;

  // general settings
  EclsMode = "VA";
  DrainageSite = "RA";
  ReturnSite = "AAR";

  // sweep gas air composition when no co2 is added
  FiO2 = 0.205;
  Fo2Dry = 0.205;
  Fco2Dry = 0.000392;
  Fn2Dry = 0.794608;
  FotherDry = 0;
  Temp = 20;
  Humidity = 0.5;

  // PediVas
  PumpBloodVolume = 0.014; // in l
  PumpElastance = 25000;

  // oxygenator propertues
  DifO2 = 0.001; // in mmol/mmHg * s
  DifCo2 = 0.001; // in mmol/mmHg * s
  SweepGasFlow = 0.023; // in l/s   ==> 1.4 l/min
  Co2GasFlow = 0.00067; // in l/s => 40 mL/min
  OxyBloodVolume = 0.081; // in l
  OxyElastance = 25000;

  // tubing properties
  TubingInDiameter = 0.00635; // in m => 6.35 mm = 0.25 inch
  TubingInLength = 1.0; // in m
  TubingOutDiameter = 0.00635; // in m => 6.35 mm = 0.25 inch
  TubingOutLength = 1.0; // in m
  TubingElastance = 2500; // in mmHg/L

  // cannula properties
  // neonatal single lumen length = 25 cm, double lumen = 8 cm
  // 3-6 kg : arterial 10 fr and venous 12 Fr, double lumen 13 Fr
  DrainageCannulaDiameter = 0.004; // in m => 12 Fr cannula
  ReturnCannulaDiameter = 0.0033; // in m => 10 Fr cannula
  DrainageCannulaLength = 0.025; // in m
  ReturnCannulaLength = 0.025; // in m
  CannulaElastance = 25000; // in mmHg/L

  // state variables
  Rpm = 0.0;
  SetFlow = 0.0;
  Flow = 0.0;
  InletPres = 0.0;
  PreOxyPres = 0.0;
  PostOxyPres = 0.0;
  TransMembranePres = 0.0;
  PreOxySat = 0.75;
  PostOxySat = 1.0;
  PostOxyCo2 = 45;

  // local properties
  _outside = {};
  _drainageSite = {};
  _returnSite = {};
  _tubingIn = {};
  _bloodPump = {};
  _oxygenator = {};
  _tubingOut = {};

  // connectors
  _drainageSite_TubingIn = {};
  _tubingIn_Pump = {};
  _bloodPump_Oxy = {};
  _oxy_TubingOut = {};
  _tubingOut_ReturnSite = {};

  _updateCounter = 0;
  _updateInterval = 1.0;

  InitModel(args) {
    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });

    // get the outside air gas compartment
    this._outside = this._modelEngine.Models["OUT"];

    // get the drainage site
    this._drainageSite = this._modelEngine.Models[this.DrainageSite];

    // get the return site
    this._returnSite = this._modelEngine.Models[this.ReturnSite];

    // instantiate and initialize the tubingIn blood compliance
    this._tubingIn = new BloodCompliance(
      this._modelEngine,
      "EclsTubingIn",
      "BloodCompliance"
    );
    this.SetTubingIn();

    // initialize the bloodPump
    this._bloodPump = new BloodPump(this._modelEngine, "EclsPump", "BloodPump");
    this.SetBloodPump();

    // initialize  the oxygenator
    this._oxygenator = new MembraneOxygenator(
      this._modelEngine,
      "EclsOxy",
      "MembraneOxygenator"
    );
    this.SetOxygenator();

    // initialize the tubingOut blood compliance
    this._tubingOut = new BloodCompliance(
      this._modelEngine,
      "EclsTubingOut",
      "BloodCompliance"
    );
    this.SetTubingOut();

    // initialize the connectors
    this._drainageSite_TubingIn = new BloodResistor(
      this._modelEngine,
      "EclsDrainage_TubingIn",
      "BloodResistor"
    );
    this.SetDrainageTubingIn();

    // initialize the connectors
    this._tubingIn_Pump = new BloodResistor(
      this._modelEngine,
      "EclsTubingIn_Pump",
      "BloodResistor"
    );
    this.SetTubingInPump();

    // initialize the connectors
    this._bloodPump_Oxy = new BloodResistor(
      this._modelEngine,
      "EclsPump_Oxy",
      "BloodResistor"
    );
    this.SetPumpOxy();

    // initialize the connectors
    this._oxy_TubingOut = new BloodResistor(
      this._modelEngine,
      "EclsOxy_TubingOut",
      "BloodResistor"
    );
    this.SetOxyTubingOut();

    // initialize the connectors
    this._tubingOut_ReturnSite = new BloodResistor(
      this._modelEngine,
      "EclsTubingOut_Return",
      "BloodResistor"
    );
    this.SetTubingOutReturn();

    // set the flag to model is initialized
    this._is_initialized = true;

    console.log(this._modelEngine.Models);
  }

  SetDrainageTubingIn() {
    this._drainageSite_TubingIn.InitModel([
      { key: "Description", value: "Ecls drainage to tubing in" },
      { key: "NoFlow", value: false },
      { key: "NoBackFlow", value: false },
      { key: "RFor", value: 2500 },
      { key: "RBack", value: 2500 },
      { key: "Rk", value: 0 },
      { key: "CompFrom", value: "RA" },
      { key: "CompTo", value: "EclsTubingIn" },
      { key: "IsEnabled", value: this.IsEnabled },
    ]);
    // add the model to the models object
    this._modelEngine.Models[this._drainageSite_TubingIn.Name] =
      this._drainageSite_TubingIn;
  }
  SetTubingInPump() {
    this._tubingIn_Pump.InitModel([
      { key: "Description", value: "Ecls tubing in to pump" },
      { key: "NoFlow", value: false },
      { key: "NoBackFlow", value: false },
      { key: "RFor", value: 25 },
      { key: "RBack", value: 25 },
      { key: "Rk", value: 0 },
      { key: "CompFrom", value: "EclsTubingIn" },
      { key: "CompTo", value: "EclsPump" },
      { key: "IsEnabled", value: this.IsEnabled },
    ]);
    // add the model to the models object
    this._modelEngine.Models[this._tubingIn_Pump.Name] = this._tubingIn_Pump;
  }
  SetPumpOxy() {
    this._bloodPump_Oxy.InitModel([
      { key: "Description", value: "Ecls blood pump to oxy" },
      { key: "NoFlow", value: false },
      { key: "NoBackFlow", value: false },
      { key: "RFor", value: 25 },
      { key: "RBack", value: 25 },
      { key: "Rk", value: 0 },
      { key: "CompFrom", value: "EclsPump" },
      { key: "CompTo", value: "EclsOxy" },
      { key: "IsEnabled", value: this.IsEnabled },
    ]);
    // add the model to the models object
    this._modelEngine.Models[this._bloodPump_Oxy.Name] = this._bloodPump_Oxy;
  }
  SetOxyTubingOut() {
    this._oxy_TubingOut.InitModel([
      { key: "Description", value: "Oxy to tubing out" },
      { key: "NoFlow", value: false },
      { key: "NoBackFlow", value: false },
      { key: "RFor", value: 25 },
      { key: "RBack", value: 25 },
      { key: "Rk", value: 0 },
      { key: "CompFrom", value: "EclsOxy" },
      { key: "CompTo", value: "EclsTubingOut" },
      { key: "IsEnabled", value: this.IsEnabled },
    ]);
    // add the model to the models object
    this._modelEngine.Models[this._oxy_TubingOut.Name] = this._oxy_TubingOut;
  }
  SetTubingOutReturn() {
    this._tubingOut_ReturnSite.InitModel([
      { key: "Description", value: "Ecls tubing out to return" },
      { key: "NoFlow", value: false },
      { key: "NoBackFlow", value: false },
      { key: "RFor", value: 2500 },
      { key: "RBack", value: 2500 },
      { key: "Rk", value: 0 },
      { key: "CompFrom", value: "EclsTubingOut" },
      { key: "CompTo", value: "AAR" },
      { key: "IsEnabled", value: this.IsEnabled },
    ]);
    // add the model to the models object
    this._modelEngine.Models[this._tubingOut_ReturnSite.Name] =
      this._tubingOut_ReturnSite;
  }
  SetOxygenator() {
    this._oxygenator.InitModel([
      { key: "Description", value: "Ecls oxygenator" },
      { key: "Vol", value: this.OxyBloodVolume },
      { key: "UVol", value: this.OxyBloodVolume },
      { key: "ElBase", value: this.OxyElastance },
      { key: "ElK", value: 0 },
      { key: "IsEnabled", value: this.IsEnabled },
    ]);
    // now set the solutes on this blood models
    this._modelEngine.Models["Blood"].SetSolutesOnModel(this._oxygenator);

    // add the model to the models object
    this._modelEngine.Models[this._oxygenator.Name] = this._oxygenator;
  }
  SetBloodPump() {
    this._bloodPump.InitModel([
      { key: "Description", value: "Ecls pump" },
      { key: "Vol", value: this.PumpBloodVolume },
      { key: "UVol", value: this.PumpBloodVolume },
      { key: "ElBase", value: this.PumpElastance },
      { key: "ElK", value: 0 },
      { key: "IsEnabled", value: this.IsEnabled },
    ]);
    // now set the solutes on this blood models
    this._modelEngine.Models["Blood"].SetSolutesOnModel(this._bloodPump);

    // add the model to the models object
    this._modelEngine.Models[this._bloodPump.Name] = this._bloodPump;
  }
  SetTubingIn() {
    // calculate the properties of the tubing
    let tubingVolume =
      Math.PI *
      Math.pow(this.TubingInDiameter / 2, 2) *
      this.TubingInLength *
      1000;

    this._tubingIn.InitModel([
      { key: "Description", value: "Ecls tubing in" },
      { key: "Vol", value: tubingVolume },
      { key: "UVol", value: tubingVolume },
      { key: "ElBase", value: this.TubingElastance },
      { key: "ElK", value: 0 },
      { key: "IsEnabled", value: this.IsEnabled },
    ]);
    // now set the solutes on this blood models
    this._modelEngine.Models["Blood"].SetSolutesOnModel(this._tubingIn);

    // add the model to the models object
    this._modelEngine.Models[this._tubingIn.Name] = this._tubingIn;
  }
  SetTubingOut() {
    let tubingVolume =
      Math.PI *
      Math.pow(this.TubingOutDiameter / 2, 2) *
      this.TubingOutLength *
      1000;
    this._tubingOut.InitModel([
      { key: "Description", value: "Ecls tubing out" },
      { key: "Vol", value: tubingVolume },
      { key: "UVol", value: tubingVolume },
      { key: "ElBase", value: this.TubingElastance },
      { key: "ElK", value: 0 },
      { key: "IsEnabled", value: this.IsEnabled },
    ]);
    // now set the solutes on this blood models
    this._modelEngine.Models["Blood"].SetSolutesOnModel(this._tubingOut);

    // add the model to the models object
    this._modelEngine.Models[this._tubingOut.Name] = this._tubingOut;
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
  CalcModel() {}
}
