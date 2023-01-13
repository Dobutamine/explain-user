import ModelBaseClass from "../helpers/ModelBaseClass";

export class Container extends ModelBaseClass {
  // state variables
  Pres = 0;
  PresMax = 0.0;
  PresMin = 0.0;
  VolMax = 0.0;
  VolMin = 0.0;

  // external parameters
  Pres0 = 0;
  PresMus = 0;
  PresExt = 0;
  PresCc = 0;

  // local parameter
  _temp_max_pres = -1000.0;
  _temp_min_pres = 1000.0;
  _temp_max_vol = -1000.0;
  _temp_min_vol = 1000.0;
  _update_counter = 0.0;
  _update_interval = 1.0;

  CalcModel() {
    // set the volume to the externally added volume
    this.Vol = this.VolExt;

    // calculate the current volume of the container
    for (let i = 0; i < this.ContainedModels.length; i++) {
      this.Vol += this._modelEngine.Models[this.ContainedModels[i]].Vol;
    }

    // calculate the pressure depending on the elastance
    this.Pres =
      this.ElBase *
        (1.0 + this.ElK * (this.Vol - this.UVol)) *
        (this.Vol - this.UVol) +
      this.Pres0 +
      this.PresExt +
      this.PresCc +
      this.PresMus;

    // transfer the pressures to the models the container contains
    for (let i = 0; i < this.ContainedModels.length; i++) {
      this._modelEngine.Models[this.ContainedModels[i]].PresExt += this.Pres;
    }

    // reset the external pressures as they have to be set every model cycle
    this.Pres0 = 0.0;
    this.PresExt = 0.0;
    this.PresCc = 0.0;
    this.PresMus = 0.0;

    // find the min and max values of the last update interval
    if (this.Pres > this._temp_max_pres) {
      this._temp_max_pres = this.Pres;
    }
    if (this.Pres < this._temp_min_pres) {
      this._temp_min_pres = this.Pres;
    }

    if (this.Vol > this._temp_max_vol) {
      this._temp_max_vol = this.Vol;
    }
    if (this.Vol < this._temp_min_vol) {
      this._temp_min_vol = this.Vol;
    }

    if (this._update_counter > this._update_interval) {
      this._update_counter = 0.0;
      this.PresMax = this._temp_max_pres;
      this.PresMin = this._temp_min_pres;
      this._temp_max_pres = -1000.0;
      this._temp_min_pres = 1000.0;

      this.VolMax = this._temp_max_vol;
      this.VolMin = this._temp_min_vol;
      this._temp_max_vol = -1000.0;
      this._temp_min_vol = 1000.0;
    }

    this._update_counter += this._t;
  }
}
