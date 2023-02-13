import ModelBaseClass from "../helpers/ModelBaseClass";
import { GasCompliance } from "./GasCompliance";
import { GasResistor } from "./GasResistor";
import { SetAirComposition } from "../helpers/AirComposition";

export class MechanicalVentilator extends ModelBaseClass {
  // properties
  Patm = 760;
  VentRate = 30;
  TidalVolume = 0.015;
  Pip = 14.7;
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
  TubeElastance = 5000;
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

  InitModel(args) {
    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });

    // instantiate the components
    this._modelEngine.Models.VentIn = new GasCompliance(
      this._modelEngine,
      "VentIn",
      "GasCompliance"
    );

    this._modelEngine.Models.ValveInsp = new GasResistor(
      this._modelEngine,
      "ValveInsp",
      "GasResistor"
    );
    this._modelEngine.Models.TubingIn = new GasCompliance(
      this._modelEngine,
      "TubingIn",
      "GasCompliance"
    );
    this._modelEngine.Models.TubingIn_YPiece = new GasResistor(
      this._modelEngine,
      "TubingIn_YPiece",
      "GasResistor"
    );
    this._modelEngine.Models.YPiece = new GasCompliance(
      this._modelEngine,
      "YPiece",
      "GasCompliance"
    );
    this._modelEngine.Models.YPiece_EtTube = new GasResistor(
      this._modelEngine,
      "YPiece_EtTube",
      "GasResistor"
    );
    this._modelEngine.Models.EtTube = new GasCompliance(
      this._modelEngine,
      "EtTube",
      "GasCompliance"
    );
    this._modelEngine.Models.EtTube_DS = new GasResistor(
      this._modelEngine,
      "EtTube_DS",
      "GasResistor"
    );
    this._modelEngine.Models.YPiece_TubingOut = new GasResistor(
      this._modelEngine,
      "YPiece_TubingOut",
      "GasResistor"
    );
    this._modelEngine.Models.TubingOut = new GasCompliance(
      this._modelEngine,
      "TubingOut",
      "GasCompliance"
    );
    this._modelEngine.Models.ValveExp = new GasResistor(
      this._modelEngine,
      "ValveExp",
      "GasResistor"
    );
    this._modelEngine.Models.VentOut = new GasCompliance(
      this._modelEngine,
      "VentOut",
      "GasCompliance"
    );

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
    this._modelEngine.Models.YPiece_EtTube.InitModel([
      { key: "IsEnabled", value: this.IsEnabled },
      { key: "RFor", value: 25.0 },
      { key: "RBack", value: 25.0 },
      { key: "Rk", value: 0.0 },
      { key: "NoFlow", value: false },
      { key: "NoBackFlow", value: false },
      { key: "CompFrom", value: "YPiece" },
      { key: "CompTo", value: "EtTube" },
    ]);
    this._modelEngine.Models.EtTube_DS.InitModel([
      { key: "IsEnabled", value: this.IsEnabled },
      { key: "RFor", value: 25.0 },
      { key: "RBack", value: 25.0 },
      { key: "Rk", value: 0.0 },
      { key: "NoFlow", value: false },
      { key: "NoBackFlow", value: false },
      { key: "CompFrom", value: "EtTube" },
      { key: "CompTo", value: "DS" },
    ]);
  }
  SetYPieceResistors() {
    this._modelEngine.Models.TubingIn_YPiece.InitModel([
      { key: "IsEnabled", value: this.IsEnabled },
      { key: "RFor", value: 25.0 },
      { key: "RBack", value: 25.0 },
      { key: "Rk", value: 0.0 },
      { key: "NoFlow", value: false },
      { key: "NoBackFlow", value: false },
      { key: "CompFrom", value: "TubingIn" },
      { key: "CompTo", value: "YPiece" },
    ]);
    this._modelEngine.Models.YPiece_TubingOut.InitModel([
      { key: "IsEnabled", value: this.IsEnabled },
      { key: "RFor", value: 25.0 },
      { key: "RBack", value: 25.0 },
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
      { key: "RFor", value: 25.0 },
      { key: "RBack", value: 25.0 },
      { key: "Rk", value: 0.0 },
      { key: "NoFlow", value: true },
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
      { key: "NoFlow", value: true },
      { key: "NoBackFlow", value: false },
      { key: "CompFrom", value: "TubingOut" },
      { key: "CompTo", value: "VentOut" },
    ]);
  }
}

//     // first build the components
//     this.VentIn = new GasCompliance([
//       { key: "Name", value: "VentIn" },
//       { key: "Description", value: "internal ventilator reservoir" },
//       { key: "ModelType", value: "GasCompliance" },
//       { key: "IsEnabled", value: true },
//     ]);
//     this.VentOut = new GasCompliance([
//       { key: "Name", value: "VentOut" },
//       { key: "Description", value: "external ventilator reservoir" },
//       { key: "ModelType", value: "GasCompliance" },
//       { key: "IsEnabled", value: true },
//     ]);
//     this.TubingIn = new GasCompliance([
//       { key: "Name", value: "TubingIn" },
//       { key: "Description", value: "inspiratory tubing" },
//       { key: "ModelType", value: "GasCompliance" },
//       { key: "IsEnabled", value: true },
//     ]);
//     this.TubingOut = new GasCompliance([
//       { key: "Name", value: "TubingIn" },
//       { key: "Description", value: "expiratory tubing" },
//       { key: "ModelType", value: "GasCompliance" },
//       { key: "IsEnabled", value: true },
//     ]);
//     this.YPiece = new GasCompliance([
//       { key: "Name", value: "YPiece" },
//       { key: "Description", value: "y-piece" },
//       { key: "ModelType", value: "GasCompliance" },
//       { key: "IsEnabled", value: true },
//     ]);
//     this.EtTube = new GasCompliance([
//       { key: "Name", value: "EtTube" },
//       { key: "Description", value: "endotracheal tubing" },
//       { key: "ModelType", value: "GasCompliance" },
//       { key: "IsEnabled", value: true },
//     ]);

//     //   this.VentOut.InitModel(model_ref, [
//     //     { key: "Vol", value: 5000.0 },
//     //     { key: "UVol", value: 5000.0 },
//     //     { key: "ElBase", value: 1000.0 },
//     //     { key: "ElK", value: 0 },
//     //     { key: "FixedComposition", value: true },
//     //   ]);

//     //   // initialize the vent in
//     //   this.VentIn.InitModel(model_ref, [
//     //     { key: "Vol", value: 5.0 },
//     //     { key: "UVol", value: 5.0 },
//     //     { key: "ElBase", value: 1000.0 },
//     //     { key: "ElK", value: 0 },
//     //     { key: "FixedComposition", value: true },
//     //   ]);

//     //   this.SetInternalReservoir();

//     //   this.TubingIn = new GasCompliance([
//     //     { key: "Name", value: "TubingIn" },
//     //     { key: "Description", value: "inspiratory tubing" },
//     //     { key: "ModelType", value: "GasCompliance" },
//     //     { key: "IsEnabled", value: true },
//     //   ]);
//     //   this.TubingIn.InitModel(model_ref, [
//     //     { key: "UVol", value: 0.0 },
//     //     { key: "ElBase", value: this.TubingElastance },
//     //     { key: "ElK", value: 0.0 },
//     //   ]);

//     //   this.TubingOut = new GasCompliance([
//     //     { key: "Name", value: "TubingOut" },
//     //     { key: "Description", value: "expiratory tubing" },
//     //     { key: "ModelType", value: "GasCompliance" },
//     //     { key: "IsEnabled", value: true },
//     //   ]);
//     //   this.TubingOut.InitModel(model_ref, [
//     //     { key: "UVol", value: 0.0 },
//     //     { key: "ElBase", value: this.TubingElastance },
//     //     { key: "ElK", value: 0.0 },
//     //   ]);
//     //   // calculate the tubing volume : v = pi*r^2*h
//     //   this.TubingOut.UVol =
//     //     Math.PI *
//     //     Math.pow(this.TubingDiameter / 2, 2) *
//     //     this.TubingLength *
//     //     1000.0;
//     //   this.TubingOut.Vol = this.TubingOut.UVol;
//     //   this.TubingOut.Pres0 = 760.0;
//     //   this.TubingOut.Pres = 760;
//     //   // calculate teh air composition
//     //   SetAirComposition(
//     //     this.TubingOut,
//     //     this.Humidity,
//     //     this.Temp,
//     //     this.Fo2Dry,
//     //     this.Fco2Dry,
//     //     this.Fn2Dry,
//     //     this.FotherDry
//     //   );

//     //   this.EtTube = new GasCompliance([
//     //     { key: "Name", value: "EtTube" },
//     //     { key: "Description", value: "endotracheal tube" },
//     //     { key: "ModelType", value: "GasCompliance" },
//     //     { key: "IsEnabled", value: true },
//     //   ]);
//     //   this.EtTube.InitModel(model_ref, [
//     //     { key: "UVol", value: 0.011 },
//     //     { key: "ElBase", value: 5000 },
//     //     { key: "ElK", value: 0.0 },
//     //   ]);
//     //   // calculate the tubing volume : v = pi*r^2*h
//     //   this.EtTube.UVol =
//     //     Math.PI * Math.pow(this.TubeDiameter / 2, 2) * this.TubeLength * 1000.0;
//     //   this.EtTube.Vol = this.EtTube.UVol;
//     //   this.EtTube.Pres0 = 760.0;
//     //   this.EtTube.Pres = 760;
//     //   // calculate teh air composition
//     //   SetAirComposition(
//     //     this.EtTube,
//     //     this.Humidity,
//     //     this.Temp,
//     //     this.Fo2Dry,
//     //     this.Fco2Dry,
//     //     this.Fn2Dry,
//     //     this.FotherDry
//     //   );

//     //   this.YPiece = new GasCompliance([
//     //     { key: "Name", value: "YPiece" },
//     //     { key: "Description", value: "YPiece" },
//     //     { key: "ModelType", value: "GasCompliance" },
//     //     { key: "IsEnabled", value: true },
//     //   ]);
//     //   this.YPiece.InitModel(model_ref, [
//     //     { key: "UVol", value: 0.011 },
//     //     { key: "ElBase", value: 25000 },
//     //     { key: "ElK", value: 0.0 },
//     //   ]);
//     //   // calculate the tubing volume : v = pi*r^2*h
//     //   this.YPiece.UVol = 0.011;
//     //   this.YPiece.Vol = this.YPiece.UVol;
//     //   this.YPiece.Pres0 = 760.0;
//     //   this.YPiece.Pres = 760;
//     //   // calculate teh air composition
//     //   SetAirComposition(
//     //     this.YPiece,
//     //     this.Humidity,
//     //     this.Temp,
//     //     this.Fo2Dry,
//     //     this.Fco2Dry,
//     //     this.Fn2Dry,
//     //     this.FotherDry
//     //   );

//     //   // calculate the tubing volume depending on the diameter and elastance
//     //   // initialize the vent in

//     //   // calculate the volume depending on the desired internal pressure
//     //   this.VentOut.Vol = this.Peep / this.VentIn.ElBase + this.VentIn.UVol;
//     //   // set the atmospheric pressure
//     //   this.VentOut.Pres0 = 760.0;
//     //   // the pressure including the atmospheric pressure
//     //   this.VentOut.Pres = this.Peep;

//     //   // calculate teh air composition
//     //   SetAirComposition(
//     //     this.VentOut,
//     //     this.Humidity,
//     //     this.Temp,
//     //     this.Fo2Dry,
//     //     this.Fco2Dry,
//     //     this.Fn2Dry,
//     //     this.FotherDry
//     //   );

//     //   // // connect the components
//     //   // this.VentIn_TubingIn = new GasConnector();
//     //   // this.TubingIn_YPiece = new GasConnector();
//     //   // this.YPiece_EtTube = new GasConnector();
//     //   // this.YPiece_TubingOut = new GasConnector();
//     //   // this.TubingOut_VentOut = new GasConnector();
//     //   // store a reference to the model object
//     //   this._modelEngine = model_ref;
//     //   // set the flag to model is initialized
//     //   this._is_initialized = true;
//     // }

//     // SetInternalReservoir() {
//     //   // calculate the volume depending on the desired internal pressure
//     //   this.VentIn.Vol = 200.0 / this.VentIn.ElBase + this.VentIn.UVol;
//     //   // set the atmospheric pressure
//     //   this.VentIn.Pres0 = 760.0;
//     //   // the pressure including the atmospheric pressure
//     //   this.VentIn.Pres = 960.0;

//     //   // calculate teh air composition
//     //   SetAirComposition(
//     //     this.VentIn,
//     //     this.Humidity,
//     //     this.Temp,
//     //     this.Fo2Dry,
//     //     this.Fco2Dry,
//     //     this.Fn2Dry,
//     //     this.FotherDry
//     //   );
//     // }

//     // SetTubing() {
//     //   // calculate the tubing volume : v = pi*r^2*h
//     //   this.TubingIn.ElBase =  this.TubingElastance
//     //   this.TubingIn.UVol =
//     //     Math.PI *
//     //     Math.pow(this.TubingDiameter / 2, 2) *
//     //     this.TubingLength *
//     //     1000.0;
//     //   this.TubingIn.Vol = this.TubingIn.UVol;
//     //   this.TubingIn.Pres0 = 760.0;
//     //   this.TubingIn.Pres = 760;
//     //   // calculate teh air composition
//     //   SetAirComposition(
//     //     this.TubingIn,
//     //     this.Humidity,
//     //     this.Temp,
//     //     this.Fo2Dry,
//     //     this.Fco2Dry,
//     //     this.Fn2Dry,
//     //     this.FotherDry
//     //   );
//     // }

//     // SetEtTube() {}
//   }
// }
