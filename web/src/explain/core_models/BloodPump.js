import ModelBaseClass from "../helpers/ModelBaseClass";

export class BloodPump extends ModelBaseClass {
  // independent variables
  Vol = 0.0;
  VolInlet = 0.0;
  VolOutlet = 0.0;
  UVol = 0.0;
  ElBase = 0.0;
  ElK = 0.0;
  Pres0 = 0;
  PresExt = 0;
  Solutes = {};
  Mode = 0; // 0 = centrifugal, 1 = roller pump
  PumpPressure = 0.0;

  // dependent variables
  Pres = 0.0;
  PresInlet = 0;
  PresOutlet = 0;

  VolMax = 0.0;
  VolMin = 0.0;
  PresMax = 0.0;
  PresMin = 0.0;
  To2 = 0;
  Po2 = 0.0;
  So2 = 0.0;
  Tco2 = 0.0;
  Pco2 = 0.0;
  Ph = 0.0;
  Hco3 = 0.0;

  // local parameters
  _temp_max_pres = -1000.0;
  _temp_min_pres = 1000.0;
  _temp_max_vol = -1000.0;
  _temp_min_vol = 1000.0;
  _update_counter = 0.0;
  _update_interval = 1.0;

  // model initializer
  InitModel(args) {
    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });

    // set the flag to model is initialized
    this._is_initialized = true;
  }

  // override the base class CalcModel method
  CalcModel() {
    // calculate the pressure depending on the elastance
    this.Pres =
      this.ElBase *
        (1.0 + this.ElK * (this.Vol - this.UVol)) *
        (this.Vol - this.UVol) +
      this.Pres0 +
      this.PresExt;

    // reset the external pressures as they have to be set every model cycle
    // this.Pres0 = 0.0;
    this.PresExt = 0.0;

    if (this.Mode === 0) {
      this.PresInlet = this.Pres + this.PumpPressure;
      this.PresOutlet = this.Pres;
    } else {
      this.PresInlet = this.Pres;
      this.PresOutlet = this.Pres + this.PumpPressure;
    }

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

    // calculate the change in To2 and Tco2
    let dTo2 = (modelFrom.To2 - this.To2) * dvol;
    this.To2 = (this.To2 * this.Vol + dTo2) / this.Vol;

    let dTco2 = (modelFrom.Tco2 - this.Tco2) * dvol;
    this.Tco2 = (this.Tco2 * this.Vol + dTco2) / this.Vol;

    // calculate the change in solutes concentrations
    for (const key in this.Solutes) {
      let dSol = (modelFrom.Solutes[key] - this.Solutes[key]) * dvol;
      this.Solutes[key] = (this.Solutes[key] * this.Vol + dSol) / this.Vol;
    }
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
