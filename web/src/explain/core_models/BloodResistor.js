import ModelBaseClass from "../helpers/ModelBaseClass";

export class BloodResistor extends ModelBaseClass {
  // state variables
  Flow = 0;
  Res = 0;

  // local parameters
  _comp_from = {};
  _comp_to = {};

  InitModel(model_ref) {
    // initialize the baseclass
    super.InitModel(model_ref);

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
