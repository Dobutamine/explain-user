import ModelBaseClass from "../helpers/ModelBaseClass";
import { SetAirComposition } from "../helpers/AirComposition";
import { BloodResistor } from "./BloodResistor";
import { BloodCompliance } from "./BloodCompliance";
import { BloodPump } from "./BloodPump";
import { MembraneOxygenator } from "./MembraneOxygenator";

export class ArtificialWhomb extends ModelBaseClass {
  _bloodDensity = 1060; // kg * m-3
  _gravity = 9.81; // m * s-2
  _viscosity = 5.5;

  // sweep gas air composition when no co2 is added
  FiO2 = 0.205;
  Fo2Dry = 0.205;
  Fco2Dry = 0.000392;
  Fn2Dry = 0.794608;
  FotherDry = 0;
  Temp = 20;
  Humidity = 0.5;

  // PediVas

  _pumpElastance = 25000;
  _cannulaElastance = 25000; // in mmHg/L
  _oxyElastance = 25000;
  _bedHeightPressureDrop = 0.0;

  // state variables
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

  _o2ToLung = 0.0;
  _o2FromLung = 0.0;

  OER = 0.0;

  Enable() {
    this.IsEnabled = true;

    this._tubingIn.IsEnabled = true;
    this._bloodPump.IsEnabled = true;
    this._oxygenator.IsEnabled = true;
    this._oxygenator.Enable();
    this._tubingOut.IsEnabled = true;

    this._drainageSite_TubingIn.IsEnabled = true;
    this._tubingIn_Pump.IsEnabled = true;
    this._bloodPump_Oxy.IsEnabled = true;
    this._oxy_TubingOut.IsEnabled = true;
    this._tubingOut_ReturnSite.IsEnabled = true;
  }

  Disable() {
    this.IsEnabled = false;

    this._tubingIn.IsEnabled = false;
    this._bloodPump.IsEnabled = false;
    this._oxygenator.IsEnabled = false;
    this._oxygenator.Disable();
    this._tubingOut.IsEnabled = false;

    this._drainageSite_TubingIn.IsEnabled = false;
    this._tubingIn_Pump.IsEnabled = false;
    this._bloodPump_Oxy.IsEnabled = false;
    this._oxy_TubingOut.IsEnabled = false;
    this._tubingOut_ReturnSite.IsEnabled = false;
  }

  InitModel(args) {
    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });

    this.Dependencies = [];
    this.Dependencies.push("OUT");
    this.Dependencies.push(this.DrainageSite);
    this.Dependencies.push(this.ReturnSite);

    // get the outside air gas compartment
    this._outside = this._modelEngine.Models["OUT"];

    // get the drainage site
    this._drainageSite = this._modelEngine.Models[this.DrainageSite];

    // get the return site
    this._returnSite = this._modelEngine.Models[this.ReturnSite];

    // instantiate and initialize the tubingIn blood compliance
    this._tubingIn = new BloodCompliance(
      this._modelEngine,
      "AwTubingIn",
      "BloodCompliance"
    );
    this.SetTubingIn();

    // initialize the bloodPump
    this._bloodPump = new BloodPump(this._modelEngine, "AwPump", "BloodPump");
    this.SetBloodPump();

    // initialize  the oxygenator
    this._oxygenator = new MembraneOxygenator(
      this._modelEngine,
      "AwOxy",
      "MembraneOxygenator"
    );
    this.SetOxygenator();

    // initialize the tubingOut blood compliance
    this._tubingOut = new BloodCompliance(
      this._modelEngine,
      "AwTubingOut",
      "BloodCompliance"
    );
    this.SetTubingOut();

    // initialize the connectors
    this._drainageSite_TubingIn = new BloodResistor(
      this._modelEngine,
      "AwDrainage_TubingIn",
      "BloodResistor"
    );
    this.SetDrainageTubingIn();

    // initialize the connectors
    this._tubingIn_Pump = new BloodResistor(
      this._modelEngine,
      "AwTubingIn_Pump",
      "BloodResistor"
    );
    this.SetTubingInPump();

    // initialize the connectors
    this._bloodPump_Oxy = new BloodResistor(
      this._modelEngine,
      "AwPump_Oxy",
      "BloodResistor"
    );
    this.SetPumpOxy();

    // initialize the connectors
    this._oxy_TubingOut = new BloodResistor(
      this._modelEngine,
      "AwOxy_TubingOut",
      "BloodResistor"
    );
    this.SetOxyTubingOut();

    // initialize the connectors
    this._tubingOut_ReturnSite = new BloodResistor(
      this._modelEngine,
      "AwTubingOut_Return",
      "BloodResistor"
    );
    this.SetTubingOutReturn();

    // set the flag to model is initialized
    this._is_initialized = true;
  }

  SetDrainageTubingIn() {
    // calculate the cannula resistance
    let cannulaResistance = this.CalcResistance(
      this.DrainageCannulaDiameter,
      this.DrainageCannulaLength
    );
    this._drainageSite_TubingIn.InitModel([
      { key: "Description", value: "Aw drainage to tubing in" },
      { key: "NoFlow", value: true },
      { key: "NoBackFlow", value: false },
      { key: "RFor", value: cannulaResistance },
      { key: "RBack", value: cannulaResistance },
      { key: "Rk", value: 0 },
      { key: "CompFrom", value: this.DrainageSite },
      { key: "CompTo", value: "AwTubingIn" },
      { key: "IsEnabled", value: this.IsEnabled },
    ]);
    // add the model to the models object
    if (this._modelEngine.Models[this._drainageSite_TubingIn.Name]) {
      this._drainageSite_TubingIn =
        this._modelEngine.Models[this._drainageSite_TubingIn.Name];
    } else {
      this._modelEngine.Models[this._drainageSite_TubingIn.Name] =
        this._drainageSite_TubingIn;
    }
  }

  SetTubingInPump() {
    // calculate the tubing resistance
    let tubingResistance = this.CalcResistance(
      this.TubingDiameter,
      this.TubingInLength
    );
    this._tubingIn_Pump.InitModel([
      { key: "Description", value: "aw tubing in to pump" },
      { key: "NoFlow", value: false },
      { key: "NoBackFlow", value: false },
      { key: "RFor", value: tubingResistance },
      { key: "RBack", value: tubingResistance },
      { key: "Rk", value: 0 },
      { key: "CompFrom", value: "AwTubingIn" },
      { key: "CompTo", value: "AwPump" },
      { key: "IsEnabled", value: this.IsEnabled },
    ]);
    // add the model to the models object
    if (this._modelEngine.Models[this._tubingIn_Pump.Name]) {
      this._tubingIn_Pump = this._modelEngine.Models[this._tubingIn_Pump.Name];
    } else {
      this._modelEngine.Models[this._tubingIn_Pump.Name] = this._tubingIn_Pump;
    }
  }

  SetPumpOxy() {
    this._bloodPump_Oxy.InitModel([
      { key: "Description", value: "aw blood pump to oxy" },
      { key: "NoFlow", value: false },
      { key: "NoBackFlow", value: true },
      { key: "RFor", value: 25 },
      { key: "RBack", value: 250 },
      { key: "Rk", value: 0 },
      { key: "CompFrom", value: "AwPump" },
      { key: "CompTo", value: "AwOxy" },
      { key: "IsEnabled", value: this.IsEnabled },
    ]);
    // add the model to the models object
    if (this._modelEngine.Models[this._bloodPump_Oxy.Name]) {
      this._bloodPump_Oxy = this._modelEngine.Models[this._bloodPump_Oxy.Name];
    } else {
      this._modelEngine.Models[this._bloodPump_Oxy.Name] = this._bloodPump_Oxy;
    }
  }

  SetOxyTubingOut() {
    // calculate the tubing resistance
    let tubingResistance = this.CalcResistance(
      this.TubingDiameter,
      this.TubingOutLength
    );
    this._oxy_TubingOut.InitModel([
      { key: "Description", value: "oxy to tubing out" },
      { key: "NoFlow", value: false },
      { key: "NoBackFlow", value: false },
      { key: "RFor", value: tubingResistance },
      { key: "RBack", value: tubingResistance },
      { key: "Rk", value: 0 },
      { key: "CompFrom", value: "AwOxy" },
      { key: "CompTo", value: "AwTubingOut" },
      { key: "IsEnabled", value: this.IsEnabled },
    ]);
    // add the model to the models object
    if (this._modelEngine.Models[this._oxy_TubingOut.Name]) {
      this._oxy_TubingOut = this._modelEngine.Models[this._oxy_TubingOut.Name];
    } else {
      this._modelEngine.Models[this._oxy_TubingOut.Name] = this._oxy_TubingOut;
    }
  }

  SetTubingOutReturn() {
    // calculate the cannula resistance
    let cannulaResistance = this.CalcResistance(
      this.ReturnCannulaDiameter,
      this.ReturnCannulaLength
    );
    this._tubingOut_ReturnSite.InitModel([
      { key: "Description", value: "aw tubing out to return" },
      { key: "NoFlow", value: true },
      { key: "NoBackFlow", value: false },
      { key: "RFor", value: cannulaResistance },
      { key: "RBack", value: cannulaResistance },
      { key: "Rk", value: 0 },
      { key: "CompFrom", value: "AwTubingOut" },
      { key: "CompTo", value: this.ReturnSite },
      { key: "IsEnabled", value: this.IsEnabled },
    ]);
    // add the model to the models object
    if (this._modelEngine.Models[this._tubingOut_ReturnSite.Name]) {
      this._tubingOut_ReturnSite =
        this._modelEngine.Models[this._tubingOut_ReturnSite.Name];
    } else {
      this._modelEngine.Models[this._tubingOut_ReturnSite.Name] =
        this._tubingOut_ReturnSite;
    }
  }

  SetOxygenator() {
    this._oxygenator.InitModel([
      { key: "Description", value: "aw oxygenator" },
      { key: "Vol", value: this.OxyBloodVolume },
      { key: "UVol", value: this.OxyBloodVolume },
      { key: "ElBase", value: this._oxyElastance },
      { key: "ElK", value: 0 },
      { key: "SweepGasFlow", value: this.SweepGasFlow },
      { key: "Co2GasFlow", value: this.Co2GasFlow },
      { key: "Fo2", value: this.Fo2 },
      { key: "DifO2", value: this.DifO2 },
      { key: "DifCo2", value: this.DifCo2 },
      { key: "IsEnabled", value: this.IsEnabled },
    ]);

    if (this._modelEngine.Models[this._oxygenator.Name]) {
      this._oxygenator = this._modelEngine.Models[this._oxygenator.Name];
    } else {
      // now set the solutes on this blood models
      this._modelEngine.Models["Blood"].SetSolutesOnModel(this._oxygenator);

      // add the model to the models object
      this._modelEngine.Models[this._oxygenator.Name] = this._oxygenator;
    }
  }

  SetBloodPump() {
    this._bloodPump.InitModel([
      { key: "Description", value: "aw pump" },
      { key: "Vol", value: this.PumpBloodVolume },
      { key: "UVol", value: this.PumpBloodVolume },
      { key: "ElBase", value: this._pumpElastance },
      { key: "ElK", value: 0 },
      { key: "IsEnabled", value: this.IsEnabled },
    ]);

    if (this._modelEngine.Models[this._bloodPump.Name]) {
      this._bloodPump = this._modelEngine.Models[this._bloodPump.Name];
    } else {
      // set the pump to centrifugal mode
      this._bloodPump.Mode = 0;

      // now set the solutes on this blood models
      this._modelEngine.Models["Blood"].SetSolutesOnModel(this._bloodPump);

      // add the model to the models object
      this._modelEngine.Models[this._bloodPump.Name] = this._bloodPump;
    }
  }

  SetTubingIn() {
    // calculate the properties of the tubing
    let tubingVolume =
      Math.PI *
      Math.pow(this.TubingDiameter / 2, 2) *
      this.TubingInLength *
      1000;

    this._tubingIn.InitModel([
      { key: "Description", value: "aw tubing in" },
      { key: "Vol", value: tubingVolume },
      { key: "UVol", value: tubingVolume },
      { key: "ElBase", value: this.TubingElastance },
      { key: "ElK", value: 0 },
      { key: "IsEnabled", value: this.IsEnabled },
    ]);

    if (this._modelEngine.Models[this._tubingIn.Name]) {
      this._tubingIn = this._modelEngine.Models[this._tubingIn.Name];
    } else {
      // now set the solutes on this blood models
      this._modelEngine.Models["Blood"].SetSolutesOnModel(this._tubingIn);

      // add the model to the models object
      this._modelEngine.Models[this._tubingIn.Name] = this._tubingIn;
    }
  }

  SetTubingOut() {
    let tubingVolume =
      Math.PI *
      Math.pow(this.TubingDiameter / 2, 2) *
      this.TubingOutLength *
      1000;
    this._tubingOut.InitModel([
      { key: "Description", value: "aw tubing out" },
      { key: "Vol", value: tubingVolume },
      { key: "UVol", value: tubingVolume },
      { key: "ElBase", value: this.TubingElastance },
      { key: "ElK", value: 0 },
      { key: "IsEnabled", value: this.IsEnabled },
    ]);

    if (this._modelEngine.Models[this._tubingOut.Name]) {
      this._tubingOut = this._modelEngine.Models[this._tubingOut.Name];
    } else {
      // now set the solutes on this blood models
      this._modelEngine.Models["Blood"].SetSolutesOnModel(this._tubingOut);

      // add the model to the models object
      this._modelEngine.Models[this._tubingOut.Name] = this._tubingOut;
    }
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
      this._modelEngine.Models["AwGasIn"],
      this.Humidity,
      this.Temp,
      newFiO2,
      this.FiCo2,
      this.Fn2Dry,
      this.FotherDry
    );
  }

  CalcResistance(diameter, length) {
    // calculate the resistance of the cannula where the cannula is modeled as a perfect tube with a diameter and a length in millimeters
    // the viscosity is in centiPoise

    // resistance is calculated using Poiseuille's Law : R = (8 * n * L) / (PI * r^4)

    // we have to watch the units carefully where we have to make sure that the units in the formula are
    // resistance is in mmHg * s / l
    // L = length in meters from millimeters
    // r = radius in meters from millimeters
    // n = viscosity in mmHg * s from centiPoise

    let resistance = 25;

    // convert the length to meters
    let length_meters = length;

    // calculate the radius in meters
    let radius_meters = diameter / 2.0;

    // convert viscosity from centiPoise to mmHg * s
    let n_mmhgs = this._viscosity * 0.001 * 0.00750062;

    // calculate the resistance using Poiseuille's Law, the resistance is now in mmHg * s/mm^3
    resistance =
      (8.0 * n_mmhgs * length_meters) / (Math.PI * Math.pow(radius_meters, 4));

    // convert resistance of mmHg * s / mm^3 to mmHg *s / l
    resistance = resistance / 1000.0;

    return resistance;
  }

  UpdateProperties() {
    // drainage cannula
    let cannulaResistanceDrainage = this.CalcResistance(
      this.DrainageCannulaDiameter,
      this.DrainageCannulaLength
    );
    this._drainageSite_TubingIn.RFor = cannulaResistanceDrainage;
    this._drainageSite_TubingIn.RBack = cannulaResistanceDrainage;

    // return cannula
    let cannulaResistanceReturn = this.CalcResistance(
      this.ReturnCannulaDiameter,
      this.ReturnCannulaLength
    );
    this._tubingOut_ReturnSite.RFor = cannulaResistanceReturn;
    this._tubingOut_ReturnSite.RBack = cannulaResistanceReturn;

    // tubing resistance
    let tubingInResistance = this.CalcResistance(
      this.TubingDiameter,
      this.TubingInLength
    );
    this._tubingIn_Pump.RFor = tubingInResistance;
    this._tubingIn_Pump.RBack = tubingInResistance;

    // tubing resistance
    let tubingOutResistance = this.CalcResistance(
      this.TubingDiameter,
      this.TubingOutLength
    );
    this._oxy_TubingOut.RFor = tubingOutResistance;
    this._oxy_TubingOut.RBack = tubingOutResistance;

    // tubing elastance
    this._tubingIn.ElBase = this.TubingElastance;
    this._tubingOut.ElBase = this.TubingElastance;

    // tubing unstressed volume
    let tubingVolume =
      Math.PI *
      Math.pow(this.TubingDiameter / 2, 2) *
      this.TubingOutLength *
      1000;

    this._tubingIn.UVol = tubingVolume;
    this._tubingOut.UVol = tubingVolume;

    // oxy bloodvolume
    this._oxygenator.UVol = this.OxyBloodVolume;
    this._bloodPump.UVol = this.PumpBloodVolume;

    // bed height
    this._bedHeightPressureDrop =
      this._bloodDensity * this._gravity * this.BedHeight * 0.00750062;

    // fio2 of the gas
    let co2Factor = this.Fco2Dry / (1.0 - this.Fo2Dry);
    let n2Factor = this.Fn2Dry / (1.0 - this.Fo2Dry);
    let otherFactor = this.FotherDry / (1.0 - this.Fo2Dry);

    let newFo2 = this.Fo2;
    let newFco2 = co2Factor * (1.0 - this.Fo2);
    let newFn2 = n2Factor * (1.0 - this.Fo2);
    let newFother = otherFactor * (1.0 - this.Fo2);

    SetAirComposition(
      this._oxygenator._gasSource,
      this.Humidity,
      this.Temp,
      newFo2,
      newFco2,
      newFn2,
      newFother
    );

    // sweep
    let resSweep = 200.0 / (this.SweepGasFlow / 60.0) - 25.0;
    this._oxygenator._gasIn.RFor = resSweep;
    this._oxygenator._gasIn.RBack = resSweep;

    // co2
    let resCo2 = 200.0 / (this.Co2GasFlow / 60.0) - 25.0;
    this._oxygenator._co2In.RFor = resCo2;
    this._oxygenator._co2In.RBack = resCo2;
    // temp
  }

  CalcPostOxyGas() {
    // calculate the acid base and oxygenation properties of chemoreceptor site
    let ab = this._modelEngine.Models.AcidBase.CalcAcidBase(
      this._modelEngine.Models["AwTubingOut"].Tco2
    );

    if (!ab.Error) {
      this._modelEngine.Models["AwTubingOut"].Pco2 = ab.Pco2;
      this._modelEngine.Models["AwTubingOut"].Ph = ab.Ph;
      this._modelEngine.Models["AwTubingOut"].Hco3 = ab.Hco3;
    }

    let ad_oxy = this._modelEngine.Models.Oxygenation.CalcOxygenation(
      this._modelEngine.Models["AwTubingOut"].To2
    );
    // store the results of the calculations
    if (!ad_oxy.Error) {
      this._modelEngine.Models["AwTubingOut"].Po2 = ad_oxy.Po2;
      this._modelEngine.Models["AwTubingOut"].So2 = ad_oxy.So2;
    }
  }

  CalcModel() {
    // enable all submodels if not already done

    // set the pres0 on the ecls compartments depending on the bed height
    this._bloodPump.Pres0 = -this._bedHeightPressureDrop;
    this._oxygenator.Pres0 = -this._bedHeightPressureDrop;

    // set the pump to centrifugal mode
    this._bloodPump.Mode = 0;
    this._bloodPump.Rpm = this.Rpm;

    // calculate OER
    this._o2ToLung = this._bloodPump_Oxy.Flow * this._bloodPump.To2;
    this._o2FromLung = this._oxy_TubingOut.Flow * this._oxygenator.To2;
    if (this._o2FromLung > 0) {
      this.OER = this._o2ToLung / this._o2FromLung;
    }

    if (this._updateCounter > this._updateInterval) {
      this._updateCounter = 0;
      this.UpdateProperties();
      this.CalcPostOxyGas();
    }
    this._updateCounter += this._t;
  }
}
