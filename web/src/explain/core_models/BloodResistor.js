import ModelBaseClass from "../helpers/ModelBaseClass";

export class BloodResistor extends ModelBaseClass {
  // state variables
  Flow = 0;
  FlowO2 = 0;
  FlowForwardSec = 0;
  FlowBackwardSec = 0;
  FlowO2ForwardSec = 0;
  FlowO2BackwardSec = 0;
  FlowSec = 0;
  FlowO2Sec = 0;
  Res = 0;

  RForFactor = 1.0;
  RBackFactor = 1.0;
  RkFactor = 1.0;

  // local parameters
  _comp_from = {};
  _comp_to = {};
  _tempFlow = 0;
  _tempFlowO2 = 0;
  _tempFlowForward = 0;
  _tempFlowForwardO2 = 0;
  _tempFlowBackward = 0;
  _tempFlowBackwardO2 = 0;
  _update_counter = 0.0;
  _update_interval = 2.0;

  InitModel(args) {
    // model initializer

    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });

    // set the flag to model is initialized
    this._is_initialized = true;

    // find the blood components which this resistors connects to
    this._comp_from = this._modelEngine.Models[this.CompFrom];
    this._comp_to = this._modelEngine.Models[this.CompTo];

    // clear and refill the dependencies
    this.Dependencies = [];

    // push the depencies
    this.Dependencies.push(this.CompFrom);
    this.Dependencies.push(this.CompTo);
  }

  CalcModel() {
    // get the pressures from the connected blood compliances
    let p_u = this._comp_from.Pres;
    let p_d = this._comp_to.Pres;

    // if blood resistor is connected to a blood pump or membrane oxygenator
    if (
      this._comp_from.ModelType === "BloodPump" ||
      this._comp_from.ModelType === "MembraneOxygenator"
    ) {
      p_u = this._comp_from.PresOutlet;
    }

    if (
      this._comp_to.ModelType === "BloodPump" ||
      this._comp_to.ModelType === "MembraneOxygenator"
    ) {
      p_d = this._comp_to.PresInlet;
    }

    // calculate the flow in l/s
    if (p_u > p_d) {
      this.Res =
        this.RFor *
        this.RForFactor *
        (1.0 + this.Rk * this.RkFactor * this.Flow);
      this.Flow = (p_u - p_d) / this.Res;
      this.FlowO2 = this.Flow * this._comp_from.To2;
    } else {
      if (!this.NoBackFlow) {
        this.Res =
          this.RBack *
          this.RBackFactor *
          (1.0 + this.Rk * this.RkFactor * this.Flow);
        this.Flow = (p_u - p_d) / this.Res;
        this.FlowO2 = this.Flow * this._comp_to.To2;
      } else {
        this.Flow = 0;
        this.FlowO2 = 0;
      }
    }
    if (this.NoFlow) {
      this.Flow = 0;
      this.FlowO2 = 0;
    }
    // calculate the absolute flow in the model step
    let dvol = this.Flow * this._t;

    if (this._modelEngine.Models["Heart"].NccAtrial == 1) {
      this.FlowSec = this._tempFlow / this._update_counter;
      this.FlowSecO2 = this._tempFlowO2 / this._update_counter;
      this.FlowForwardSec = this._tempFlowForward / this._update_counter;
      this.FlowForwardSecO2 = this._tempFlowForwardO2 / this._update_counter;
      this.FlowBackwardSec = -this._tempFlowBackward / this._update_counter;
      this.FlowBackwardSecO2 = -this._tempFlowBackwardO2 / this._update_counter;
      this._tempFlow = 0;
      this._tempFlowO2 = 0;
      this._tempFlowForward = 0;
      this._tempFlowForwardO2 = 0;
      this._tempFlowBackward = 0;
      this._tempFlowBackwardO2 = 0;
      this._update_counter = 0;
    }

    this._tempFlow += this.Flow * this._t;
    this._tempFlowO2 += this.FlowO2 * this._t;

    if (this.Flow > 0) {
      this._tempFlowForward += this.Flow * this._t;
      this._tempFlowForwardO2 += this.FlowO2 * this._t;
    }
    if (this.Flow < 0) {
      this._tempFlowBackward += this.Flow * this._t;
      this._tempFlowBackwardO2 += this.FlowO2 * this._t;
    }
    this._update_counter += this._t;

    // change the volumes of the connected compliances
    if (dvol > 0) {
      let mb_pos = this._comp_from.VolumeOut(dvol);
      this._comp_to.VolumeIn(dvol - mb_pos, this._comp_from);
    } else {
      let mb_neg = this._comp_to.VolumeOut(-dvol);
      this._comp_from.VolumeIn(-(dvol - mb_neg), this._comp_to);
    }
  }
}
