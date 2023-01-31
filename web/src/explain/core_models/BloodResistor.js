import ModelBaseClass from "../helpers/ModelBaseClass";

export class BloodResistor extends ModelBaseClass {
  // state variables
  Flow = 0;
  FlowForwardSec = 0;
  FlowBackwardSec = 0;
  FlowSec = 0;
  Res = 0;

  // local parameters
  _comp_from = {};
  _comp_to = {};
  _tempFlow = 0;
  _tempFlowForward = 0;
  _tempFlowBackward = 0;
  _update_counter = 0.0;
  _update_interval = 2.0;

  InitModel(model_ref, args) {
    // model initializer

    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });

    // store a reference to the model object
    this._modelEngine = model_ref;

    // set the flag to model is initialized
    this._is_initialized = true;

    // find the blood components which this resistors connects to
    this._comp_from = this._modelEngine.Models[this.CompFrom];
    this._comp_to = this._modelEngine.Models[this.CompTo];
  }

  CalcModel() {
    // get the pressures from the connected blood compliances
    let p_u = this._comp_from.Pres;
    let p_d = this._comp_to.Pres;

    // calculate the flow in l/s
    if (p_u > p_d) {
      this.Res = this.RFor * (1.0 + this.Rk * this.Flow);
      this.Flow = (p_u - p_d) / this.Res;
    } else {
      if (!this.NoBackFlow) {
        this.Res = this.RBack * (1.0 + this.Rk * this.Flow);
        this.Flow = (p_u - p_d) / this.Res;
      } else {
        this.Flow = 0;
      }
    }
    if (this.NoFlow) {
      this.Flow = 0;
    }
    // calculate the absolute flow in the model step
    let dvol = this.Flow * this._t;

    if (this._modelEngine.Models["Heart"].NccAtrial == 1) {
      this.FlowSec = this._tempFlow / this._update_counter;
      this.FlowForwardSec = this._tempFlowForward / this._update_counter;
      this.FlowBackwardSec = -this._tempFlowBackward / this._update_counter;
      this._tempFlow = 0;
      this._tempFlowForward = 0;
      this._tempFlowBackward = 0;
      this._update_counter = 0;
    }

    this._tempFlow += this.Flow * this._t;
    if (this.Flow > 0) {
      this._tempFlowForward += this.Flow * this._t;
    }
    if (this.Flow < 0) {
      this._tempFlowBackward += this.Flow * this._t;
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
