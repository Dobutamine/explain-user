import ModelBaseClass from "../helpers/ModelBaseClass";
import { GasCompliance } from "./GasCompliance";
import { GasResistor } from "./GasResistor";
import { SetAirComposition } from "../helpers/AirComposition";

export class MechanicalVentilator extends ModelBaseClass {
  _inspiration = true;
  _expiration = false;
  _prevInspiration = false;
  _prevExpiration = false;
  _inspCounter = 0.0;
  _expCounter = 0.0;
  _expTime = 0.0;
  _vti_counter = 0.0;
  _vte_counter = 0.0;
  _temp_pres_max = -1000;
  _temp_pres_min = 1000;
  _temp_vol_max = -1000;
  _temp_vol_min = 1000;
  _trigger_counter = 0;

  // properties
  Patm = 760;
  VentRate = 30;
  MeasuredVentRate = 30;
  TidalVolume = 0.015;
  Pip = 14.7;
  PipMax = 40.0;
  Peep = 3.7;
  InspTime = 0.4;
  InspFlow = 10;
  ExpFlow = 3;
  Mode = "PC";
  FiO2 = 0.21;
  Fo2Dry = 0.205;
  Fco2Dry = 0.000392;
  Fn2Dry = 0.794608;
  FotherDry = 0;
  Temp = 37;
  Humidity = 1;
  TubingLength = 1.6;
  TubingDiameter = 0.0102;
  TubingElastance = 1160;
  TubingVolume = 0.13;
  TubeDiameter = 0.0035;
  TubeLength = 0.15;
  TubeElastance = 30000;
  TubeVolume = 0.0;
  TriggerVolume = 0.005;
  OutsideAirHumidity = 0.5;
  OutsideAirTemp = 20.0;
  OutsideAitFo2Dry = 0.21;
  OutsideAirFco2Dry = 0.0004;
  OutsideAirFn2Dry = 0.78;
  OutsideAirFotherDry = 0.0096;
  YPieceVol = 0.011;
  YPieceElastance = 25000;
  YPieceResistance = 25;
  EtTubeResistance = 25;
  VolumeGaranteed = false;
  VolumeControl = false;
  PresMax = 0;
  PresMin = 0;
  Pres = 0;
  Flow = 0;
  Volume = 0;
  EtCo2Curve = 0;
  VtInsp = 0;
  VtExp = 0;
  Leak = 0;
  MV = 0;
  Freq = 0;
  FreqSpont = 0;
  EtCo2 = 0;

  // delcare objects holding the ventilator components
  VentIn = {};
  TubingIn = {};
  YPiece = {};
  TubingOut = {};
  EtTube = {};
  VentOut = {};
  ValveInsp = {};
  ValveExp = {};
  TubingIn_YPiece = {};
  YPiece_EtTube = {};
  YPiece_TubingOut = {};
  EtTube_DS = {};
  TubingOut_VentOut = {};
  FlowSensor = {};
  PressureSensor = {};

  InitModel(args) {
    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });

    // instantiate the internal ventilator compliance
    this._modelEngine.Models.VentIn = new GasCompliance(
      this._modelEngine,
      "VentIn",
      "GasCompliance"
    );

    this._modelEngine.Models.TubingIn = new GasCompliance(
      this._modelEngine,
      "TubingIn",
      "GasCompliance"
    );

    this._modelEngine.Models.YPiece = new GasCompliance(
      this._modelEngine,
      "YPiece",
      "GasCompliance"
    );

    this._modelEngine.Models.EtTube = new GasCompliance(
      this._modelEngine,
      "EtTube",
      "GasCompliance"
    );

    this._modelEngine.Models.TubingOut = new GasCompliance(
      this._modelEngine,
      "TubingOut",
      "GasCompliance"
    );

    this._modelEngine.Models.VentOut = new GasCompliance(
      this._modelEngine,
      "VentOut",
      "GasCompliance"
    );

    this._modelEngine.Models.EtTube_DS = new GasResistor(
      this._modelEngine,
      "EtTube_DS",
      "GasResistor"
    );
    this._modelEngine.Models.ValveExp = new GasResistor(
      this._modelEngine,
      "ValveExp",
      "GasResistor"
    );
    this._modelEngine.Models.YPiece_TubingOut = new GasResistor(
      this._modelEngine,
      "YPiece_TubingOut",
      "GasResistor"
    );
    this._modelEngine.Models.YPiece_EtTube = new GasResistor(
      this._modelEngine,
      "YPiece_EtTube",
      "GasResistor"
    );
    this._modelEngine.Models.TubingIn_YPiece = new GasResistor(
      this._modelEngine,
      "TubingIn_YPiece",
      "GasResistor"
    );
    this._modelEngine.Models.ValveInsp = new GasResistor(
      this._modelEngine,
      "ValveInsp",
      "GasResistor"
    );

    this.FlowSensor = this._modelEngine.Models["YPiece_EtTube"];
    this.PressureSensor = this._modelEngine.Models["TubingIn"];

    this.SetVentIn();
    this.SetTubing();
    this.SetYPiece();
    this.SetEtTube();
    this.SetVentOut();
    this.SetYPieceResistors();
    this.SetEtTubeResistors();
    this.SetValveInsp();
    this.SetValveExp();

    // set the flag to model is initialized
    this._is_initialized = true;
  }
  CalcModel() {
    // calculate the expiration time
    this._expTime = 60.0 / this.VentRate - this.InspTime;

    // do the time cycling
    if (this._inspCounter > this.InspTime) {
      // reset the inspiration counter
      this._inspCounter = 0;
      // set flag to inspiration and disable expiration
      this._inspiration = false;
      this._expiration = true;
    }

    if (this._expCounter > this._expTime) {
      // reset the expiration counter
      this._expCounter = 0;
      // set flag to expiration and disable inspiration
      this._inspiration = true;
      this._expiration = false;
    }

    // increase the counter
    if (this._inspiration) {
      this._inspCounter += this._t;
      // increase the inspiratory tidal volume
      if (this.FlowSensor.Flow > 0) {
        this._vti_counter += this.FlowSensor.Flow * this._t;
      }
      if (this.PressureSensor.Pres > this._temp_pres_max) {
        this._temp_pres_max = this.PressureSensor.Pres;
      }
      // reset the triggering counter
      this._trigger_counter = 0;
    }

    if (this._expiration) {
      this._expCounter += this._t;
      // increase the experitory tidal volume
      if (this.FlowSensor.Flow < 0) {
        this._vte_counter += this.FlowSensor.Flow * this._t;
      }
      if (this.PressureSensor.Pres < this._temp_pres_min) {
        this._temp_pres_min = this.PressureSensor.Pres;
      }
      // Detect triggering
      this.Triggering();
    }

    // pressure controlled ventilation
    switch (this.Mode) {
      case "PC":
        this.PressureControl();
        break;
      case "PRVC":
        this.VolumeGaranteed = true;
        this.PressureRegulatedVolumeControl();
        break;
      case "VC":
        this.VolumeGaranteed = false;
        this.VolumeControlled();
        break;
    }

    // analyze breaths and report
    this.Reporting();

    // store this state
    this._prevInspiration = this._inspiration;
    this._prevExpiration = this._expiration;
  }
  Triggering() {
    if (this.FlowSensor.Flow > 0) {
      this._trigger_counter += this.FlowSensor.Flow * this._t;
    }
    if (this._trigger_counter > this.TriggerVolume) {
      this._trigger_counter = 0;
      this._expCounter = this._expTime + 0.1;
      console.log("Tiggered breath");
    }
  }
  Reporting() {
    if (this._prevExpiration && this._inspiration) {
      // inspiration starts
      this.VtExp = Math.abs(this._vte_counter);
      this._vte_counter = 0;

      this.PresMin = this._temp_pres_min - this.Patm;
      this._temp_pres_min = 1000;

      if (this.VolumeGaranteed) {
        this.RegulateVolume();
      }

      this.MV = this.VentRate * this.VtExp;
      this.Leak = (1 - this.VtExp / this.VtInsp) * 100;
      if (this.Leak < 0) {
        this.Leak = 0;
      }
      this.EtCo2 = this._modelEngine.Models["EtTube"].Pco2;
    }
    if (this._prevInspiration && this._expiration) {
      // expiration starts
      this.VtInsp = this._vti_counter;
      this._vti_counter = 0;
      this.PresMax = this._temp_pres_max - this.Patm;
      this._temp_pres_max = -1000;
    }
    this.EtCo2Curve = this._modelEngine.Models["EtTube"].Pco2;
    this.Volume += this.FlowSensor.Flow * this._t;
    this.Pres = this.PressureSensor.Pres;
    this.Flow = this.FlowSensor.Flow;
  }
  RegulateVolume() {
    let delta = this.VtExp - this.TidalVolume;
    if (delta > 0.0005) {
      this.Pip -= 1.0;
      if (this.Pip - this.Peep < 2.0) {
        this.Pip = this.Peep + 2.0;
      }
    }
    if (delta < -0.0005) {
      this.Pip += 1.0;
      if (this.Pip - this.Peep < 2.0) {
        this.Pip = this.Peep + 2.0;
      }
      if (this.Pip > this.PipMax) {
        this.Pip = this.PipMax;
      }
    }
  }
  VolumeControlled() {
    if (this._inspiration) {
      // open the inspiratory valve
      // calculate the inspiratory valve position depending on the desired flow
      let res = 200.0 / (this.InspFlow / 60.0);

      this._modelEngine.Models.ValveInsp.NoFlow = false;
      this._modelEngine.Models.ValveInsp.NoBackFlow = true;
      this._modelEngine.Models.ValveInsp.RFor = res;
      if (this._vti_counter > this.TidalVolume) {
        this._modelEngine.Models.ValveInsp.NoFlow = true;
      }

      // close the expiratory valve
      this._modelEngine.Models.ValveExp.NoFlow = true;
      this._modelEngine.Models.ValveExp.NoBackFlow = true;
      this._modelEngine.Models.ValveExp.RFor = 25.0;
    }

    if (this._expiration) {
      // close the inspiratory valve
      this._modelEngine.Models.ValveInsp.NoFlow = true;
      this._modelEngine.Models.ValveInsp.NoBackFlow = true;
      this._modelEngine.Models.ValveInsp.RFor = 25.0;

      // open the expiratory valve
      this._modelEngine.Models.ValveExp.NoFlow = false;
      this._modelEngine.Models.ValveExp.NoBackFlow = true;
      this._modelEngine.Models.ValveExp.RFor = 25.0;
      if (this._modelEngine.Models["TubingOut"].Pres < this.Peep + this.Patm) {
        this._modelEngine.Models.ValveExp.NoFlow = true;
      }
    }
  }

  PressureRegulatedVolumeControl() {
    if (this._inspiration) {
      // open the inspiratory valve
      // calculate the inspiratory valve position depending on the desired flow
      let res = 200.0 / (this.InspFlow / 60.0);

      this._modelEngine.Models.ValveInsp.NoFlow = false;
      this._modelEngine.Models.ValveInsp.NoBackFlow = true;
      this._modelEngine.Models.ValveInsp.RFor = res;
      if (this._modelEngine.Models["TubingIn"].Pres > this.Pip + this.Patm) {
        this._modelEngine.Models.ValveInsp.NoFlow = true;
      }

      // close the expiratory valve
      this._modelEngine.Models.ValveExp.NoFlow = true;
      this._modelEngine.Models.ValveExp.NoBackFlow = true;
      this._modelEngine.Models.ValveExp.RFor = 25.0;
    }

    if (this._expiration) {
      // close the inspiratory valve
      this._modelEngine.Models.ValveInsp.NoFlow = true;
      this._modelEngine.Models.ValveInsp.NoBackFlow = true;
      this._modelEngine.Models.ValveInsp.RFor = 25.0;

      // open the expiratory valve
      this._modelEngine.Models.ValveExp.NoFlow = false;
      this._modelEngine.Models.ValveExp.NoBackFlow = true;
      this._modelEngine.Models.ValveExp.RFor = 25.0;
      if (this._modelEngine.Models["TubingOut"].Pres < this.Peep + this.Patm) {
        this._modelEngine.Models.ValveExp.NoFlow = true;
      }
    }
  }
  PressureControl() {
    if (this._inspiration) {
      // open the inspiratory valve
      // calculate the inspiratory valve position depending on the desired flow
      let res = 200.0 / (this.InspFlow / 60.0);

      this._modelEngine.Models.ValveInsp.NoFlow = false;
      this._modelEngine.Models.ValveInsp.NoBackFlow = true;
      this._modelEngine.Models.ValveInsp.RFor = res;
      if (this._modelEngine.Models["TubingIn"].Pres > this.Pip + this.Patm) {
        this._modelEngine.Models.ValveInsp.NoFlow = true;
      }

      // close the expiratory valve
      this._modelEngine.Models.ValveExp.NoFlow = true;
      this._modelEngine.Models.ValveExp.NoBackFlow = true;
      this._modelEngine.Models.ValveExp.RFor = 25.0;
    }

    if (this._expiration) {
      // close the inspiratory valve
      this._modelEngine.Models.ValveInsp.NoFlow = true;
      this._modelEngine.Models.ValveInsp.NoBackFlow = true;
      this._modelEngine.Models.ValveInsp.RFor = 25.0;

      // open the expiratory valve
      this._modelEngine.Models.ValveExp.NoFlow = false;
      this._modelEngine.Models.ValveExp.NoBackFlow = true;
      this._modelEngine.Models.ValveExp.RFor = 25.0;
      if (this._modelEngine.Models["TubingOut"].Pres < this.Peep + this.Patm) {
        this._modelEngine.Models.ValveExp.NoFlow = true;
      }
    }
  }
  SetVentIn() {
    // this is the internal reservoir of the ventilator which is set at a
    // fixed composition and volume with a pressure of 200 mmHg above atmospheric pressure
    this._modelEngine.Models.VentIn.InitModel([
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
      this._modelEngine.Models.VentIn,
      this.Humidity,
      this.Temp,
      this.Fo2Dry,
      this.Fco2Dry,
      this.Fn2Dry,
      this.FotherDry
    );
  }
  SetTubing() {
    this.TubingVolume =
      Math.PI * Math.pow(this.TubingDiameter / 2, 2) * this.TubingLength * 1000;
    this._modelEngine.Models.TubingIn.InitModel([
      { key: "Vol", value: this.TubingVolume },
      { key: "UVol", value: this.TubingVolume },
      { key: "ElBase", value: this.TubingElastance },
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
      this._modelEngine.Models.TubingIn,
      this.Humidity,
      this.Temp,
      this.Fo2Dry,
      this.Fco2Dry,
      this.Fn2Dry,
      this.FotherDry
    );
    this._modelEngine.Models.TubingOut.InitModel([
      { key: "Vol", value: this.TubingVolume },
      { key: "UVol", value: this.TubingVolume },
      { key: "ElBase", value: this.TubingElastance },
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
      this._modelEngine.Models.TubingOut,
      this.Humidity,
      this.Temp,
      this.Fo2Dry,
      this.Fco2Dry,
      this.Fn2Dry,
      this.FotherDry
    );
  }
  SetVentOut() {
    // this is the external reservoir of the ventilator which is set at a
    // fixed composition and volume with a pressure of 200 mmHg above atmospheric pressure
    this._modelEngine.Models.VentOut.InitModel([
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
      this._modelEngine.Models.VentOut,
      this.OutsideAirHumidity,
      this.OutsideAirTemp,
      this.OutsideAitFo2Dry,
      this.OutsideAirFco2Dry,
      this.OutsideAirFn2Dry,
      this.OutsideAirFotherDry
    );
  }
  SetYPiece() {
    this._modelEngine.Models.YPiece.InitModel([
      { key: "Vol", value: this.YPieceVol },
      { key: "UVol", value: this.YPieceVol },
      { key: "ElBase", value: this.YPieceElastance },
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
      this._modelEngine.Models.YPiece,
      this.Humidity,
      this.Temp,
      this.Fo2Dry,
      this.Fco2Dry,
      this.Fn2Dry,
      this.FotherDry
    );
  }
  SetEtTube() {
    this.TubeVolume =
      Math.PI * Math.pow(this.TubeDiameter / 2, 2) * this.TubeLength * 1000;
    this._modelEngine.Models.EtTube.InitModel([
      { key: "Vol", value: this.TubeVolume },
      { key: "UVol", value: this.TubeVolume },
      { key: "ElBase", value: this.TubeElastance },
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
      this._modelEngine.Models.EtTube,
      this.Humidity,
      this.Temp,
      this.Fo2Dry,
      this.Fco2Dry,
      this.Fn2Dry,
      this.FotherDry
    );
  }
  SetEtTubeResistors() {
    this._modelEngine.Models.EtTube_DS.InitModel([
      { key: "IsEnabled", value: this.IsEnabled },
      { key: "RFor", value: this.EtTubeResistance },
      { key: "RBack", value: this.EtTubeResistance },
      { key: "Rk", value: 0.0 },
      { key: "NoFlow", value: false },
      { key: "NoBackFlow", value: false },
      { key: "CompFrom", value: "EtTube" },
      { key: "CompTo", value: "DS" },
    ]);
  }
  SetYPieceResistors() {
    this._modelEngine.Models.YPiece_EtTube.InitModel([
      { key: "IsEnabled", value: this.IsEnabled },
      { key: "RFor", value: this.YPieceResistance },
      { key: "RBack", value: this.YPieceResistance },
      { key: "Rk", value: 0.0 },
      { key: "NoFlow", value: false },
      { key: "NoBackFlow", value: false },
      { key: "CompFrom", value: "YPiece" },
      { key: "CompTo", value: "EtTube" },
    ]);
    this._modelEngine.Models.TubingIn_YPiece.InitModel([
      { key: "IsEnabled", value: this.IsEnabled },
      { key: "RFor", value: this.YPieceResistance },
      { key: "RBack", value: this.YPieceResistance },
      { key: "Rk", value: 0.0 },
      { key: "NoFlow", value: false },
      { key: "NoBackFlow", value: false },
      { key: "CompFrom", value: "TubingIn" },
      { key: "CompTo", value: "YPiece" },
    ]);
    this._modelEngine.Models.YPiece_TubingOut.InitModel([
      { key: "IsEnabled", value: this.IsEnabled },
      { key: "RFor", value: this.YPieceResistance },
      { key: "RBack", value: this.YPieceResistance },
      { key: "Rk", value: 0.0 },
      { key: "NoFlow", value: false },
      { key: "NoBackFlow", value: false },
      { key: "CompFrom", value: "YPiece" },
      { key: "CompTo", value: "TubingOut" },
    ]);
  }
  SetValveInsp() {
    this._modelEngine.Models.ValveInsp.InitModel([
      { key: "IsEnabled", value: this.IsEnabled },
      { key: "RFor", value: 25000 },
      { key: "RBack", value: 25000 },
      { key: "Rk", value: 0.0 },
      { key: "NoFlow", value: false },
      { key: "NoBackFlow", value: false },
      { key: "CompFrom", value: "VentIn" },
      { key: "CompTo", value: "TubingIn" },
    ]);
  }
  SetValveExp() {
    this._modelEngine.Models.ValveExp.InitModel([
      { key: "IsEnabled", value: this.IsEnabled },
      { key: "RFor", value: 25.0 },
      { key: "RBack", value: 25.0 },
      { key: "Rk", value: 0.0 },
      { key: "NoFlow", value: false },
      { key: "NoBackFlow", value: false },
      { key: "CompFrom", value: "TubingOut" },
      { key: "CompTo", value: "VentOut" },
    ]);
  }
}
