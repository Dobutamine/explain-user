import ModelBaseClass from "../helpers/ModelBaseClass";

export class BloodTimeVaryingElastance extends ModelBaseClass {
  // state variables
  Pres = 0;
  PresEd = 0;
  PresEs = 0;
  PresMax = 0.0;
  PresMin = 0.0;
  VolMax = 0.0;
  VolMin = 0.0;

  // external parameters
  Pres0 = 0;
  PresMus = 0;
  PresExt = 0;
  PresCc = 0;
  ActFactor = 0;
  Solutes = {};
  To2 = 0.0;
  Po2 = 0.0;
  So2 = 0.0;
  Tco2 = 0.0;
  Pco2 = 0.0;
  Ph = 0.0;

  // local parameter
  _temp_max_pres = -1000.0;
  _temp_min_pres = 1000.0;
  _temp_max_vol = -1000.0;
  _temp_min_vol = 1000.0;
  _update_counter = 0.0;
  _update_interval = 1.0;

  CalcModel() {
    // calculate the end diastolic pressure
    this.PresEd =
      this.ElMin *
      (1.0 + this.ElK * (this.Vol - this.UVol)) *
      (this.Vol - this.UVol);

    // calculate the end systolic pressure
    this.PresEs = this.ElMax * (this.Vol - this.UVol);

    // calculate the pressure depending on the elastance
    this.Pres =
      this.ActFactor * (this.PresEs - this.PresEd) +
      this.PresEd +
      this.Pres0 +
      this.PresExt +
      this.PresCc +
      this.PresMus;

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

  VolumeIn(dvol, modelFrom) {
    // increase the volume
    this.Vol += dvol;

    // // calculate the change in To2 and Tco2
    // dTo2 = (modelFrom.To2 - this.To2) * dvol
    // this.To2 = (this.To2 * this.Vol + dTo2) / this.Vol

    // dTco2 = (modelFrom.Tco2 - this.Tco2) * dvol
    // this.Tco2 = (this.Tco2 * this.Vol + dTco2) / this.Vol

    // // calculate the change in solutes concentrations
    // for solute, value in this.Solutes.items():
    //     dSol = (modelFrom.Solutes[solute] - value) * dvol
    //     this.Solutes[solute] = ((value * this.Vol) + dSol) / this.Vol
  }
  VolumeOut(dvol) {
    // declare a volume deficit
    let vol_deficit = 0.0;

    // decrease the volume
    this.Vol -= dvol;

    // guard against negative volumes and a mass balance disturbance
    if (this.Vol < 0) {
      vol_deficit = -this.Vol;
      this.Vol = 0.0;
    }

    // return the volume deficit
    return vol_deficit;
  }
}
