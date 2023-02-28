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

  // oxygenator propertues
  DifO2 = 0.001; // in mmol/mmHg * s
  DifCo2 = 0.001; // in mmol/mmHg * s
  SweepGasFlow = 0.023; // in l/s   ==> 1.4 l/min
  Co2GasFlow = 0.00067; // in l/s => 40 mL/min
  LungBloodVolume = 0.1; // in l

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
  _bloodPump_Oxy = {};
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

    // initialize the tubingIn blood compliance
    this._tubingIn = new BloodCompliance(
      this._modelEngine,
      "TubingIn",
      "BloodCompliance"
    );

    // initialize the bloodPump
    this._bloodPump = new BloodPump(this._modelEngine, "EclsPump", "BloodPump");

    // initialize  the oxygenator
    this._oxygenator = new MembraneOxygenator(
      this._modelEngine,
      "EclsOxy",
      "MembraneOxygenator"
    );

    // initialize the tubingOut blood compliance
    this._tubingOut = new BloodCompliance(
      this._modelEngine,
      "TubingOut",
      "BloodCompliance"
    );

    // initialize the connectors
    this._drainageSite_TubingIn = new BloodResistor(
      this._modelEngine,
      "Drainage_TubingIn",
      "BloodResistor"
    );

    // initialize the connectors
    this._bloodPump_Oxy = new BloodResistor(
      this._modelEngine,
      "EclsBloodPump_EclsOxy",
      "BloodResistor"
    );

    // initialize the connectors
    this._tubingOut_ReturnSite = new BloodResistor(
      this._modelEngine,
      "TubingOut_Return",
      "BloodResistor"
    );

    // set the flag to model is initialized
    this._is_initialized = true;

    console.log(this._tubingIn);
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
