import ModelBaseClass from "../helpers/ModelBaseClass";
import { GasCompliance } from "./GasCompliance";
import { GasResistor } from "./GasResistor";

export class MechanicalVentilator extends ModelBaseClass {
  // delcare objects holding the ventilator components
  VentIn = {};
  TubingIn = {};
  YPiece = {};
  TubingOut = {};
  EtTube = {};
  VentOut = {};
  VentIn_TubingIn = {};
  TubingIn_YPiece = {};
  YPiece_EtTube = {};
  YPiece_TubingOut = {};
  TubingOut_VentOut = {};

  InitModel(model_ref, args) {
    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });
    // first build the gas compliances and the gas connectors
    this.VentIn = new GasCompliance([
      { key: "Name", value: "VentIn" },
      { key: "Description", value: "internal ventilator reservoir" },
      { key: "ModelType", value: "GasCompliance" },
      { key: "IsEnabled", value: true },
      { key: "Vol", value: 5.0 },
      { key: "UVol", value: 5.0 },
      { key: "ElBase", value: 5000.0 },
      { key: "ElK", value: 0 },
    ]);

    this.TubingIn = new GasCompliance([
      { key: "Name", value: "TubingIn" },
      { key: "Description", value: "inspiratory tubing" },
      { key: "ModelType", value: "GasCompliance" },
      { key: "IsEnabled", value: true },
    ]);
    this.YPiece = new GasCompliance([
      { key: "Name", value: "YPiece" },
      { key: "Description", value: "y-piece of the tubing" },
      { key: "ModelType", value: "GasCompliance" },
      { key: "IsEnabled", value: true },
    ]);
    this.TubingOut = new GasCompliance([
      { key: "Name", value: "TubingOut" },
      { key: "Description", value: "expieratory tubing" },
      { key: "ModelType", value: "GasCompliance" },
      { key: "IsEnabled", value: true },
    ]);
    this.VentOut = new GasCompliance([
      { key: "Name", value: "VentOut" },
      { key: "Description", value: "expiratory ventilator reservoir" },
      { key: "ModelType", value: "GasCompliance" },
      { key: "IsEnabled", value: true },
    ]);
    this.EtTube = new GasCompliance([
      { key: "Name", value: "EtTube" },
      { key: "Description", value: "endotracheal tube" },
      { key: "ModelType", value: "GasCompliance" },
      { key: "IsEnabled", value: true },
    ]);

    // // connect the components
    // this.VentIn_TubingIn = new GasConnector();
    // this.TubingIn_YPiece = new GasConnector();
    // this.YPiece_EtTube = new GasConnector();
    // this.YPiece_TubingOut = new GasConnector();
    // this.TubingOut_VentOut = new GasConnector();
    // store a reference to the model object
    this._modelEngine = model_ref;
    // set the flag to model is initialized
    this._is_initialized = true;
  }
}
