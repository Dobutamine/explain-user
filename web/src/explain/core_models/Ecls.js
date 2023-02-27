import ModelBaseClass from "../helpers/ModelBaseClass";
import { GasCompliance } from "./GasCompliance";
import { GasResistor } from "./GasResistor";
import { SetAirComposition } from "../helpers/AirComposition";
import { GasExchanger } from "./GasExchanger";
import { BloodResistor } from "./BloodResistor";
import { BloodCompliance } from "./BloodCompliance";
import { BloodPump } from "./BloodPump";

export class Ecls extends ModelBaseClass {
  // swee[ air atmospheric pressure
  Patm = 760;

  // general settings
  EclsMode = "VA";
  DrainageSites = ["RA"];
  ReturnSites = ["AAR"];

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
  _drainageSites = [];
  _returnSites = [];
  _tubingIn = {};
  _lung = {};
  _tubingPumpLung = {};
  _pumpIn = {};
  _pumpOut = {};

  _tubingOut = {};

  _updateCounter = 0;
  _updateInterval = 1.0;

  InitModel(args) {
    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });

    //

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
  CalcModel() {}
}
