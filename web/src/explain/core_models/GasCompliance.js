import ModelBaseClass from "../helpers/ModelBaseClass";

export class GasCompliance extends ModelBaseClass {
  // state variables
  Pres = 0;
  PresMax = 0;
  PresMin = 0;
  VolMax = 0;
  VolMin = 0;
  Humidity = 1.0;
  Temp = 37.0;
  TargetTemp = 37.0;

  Ctotal = 0;
  Co2 = 0;
  Cco2 = 0;
  Cn2 = 0;
  Ch2o = 0;
  Cother = 0;

  Po2 = 0;
  Pco2 = 0;
  Pn2 = 0;
  Ph2o = 0;
  Pother = 0;

  Fo2 = 0;
  Fco2 = 0;
  Fn2 = 0;
  Fh2o = 0;
  Fother = 0;

  // external parameters
  Pres0 = 0;
  PresMus = 0;
  PresExt = 0;
  PresCc = 0;
  FixedComposition = false;

  // local parameters
  _gasConstant = 62.36367;
  _temp_max_pres = -1000.0;
  _temp_min_pres = 1000.0;
  _temp_max_vol = -1000.0;
  _temp_min_vol = 1000.0;
  _update_counter = 0.0;
  _update_interval = 1.0;

  CalcModel() {
    // add heat to the gas
    this.AddHeat();

    // add water vapour to the gas
    this.AddWaterVapour();

    // calculate the pressure depending on the elastance
    this.Pres =
      this.ElBase *
        (1.0 + this.ElK * (this.Vol - this.UVol)) *
        (this.Vol - this.UVol) +
      this.Pres0 +
      this.PresExt +
      this.PresCc +
      this.PresMus;

    // reset the external pressures as they have to be set every model cycle except for Pres0
    this.PresExt = 0.0;
    this.PresCc = 0.0;
    this.PresMus = 0.0;

    // calculate the new gas composition
    this.CalcGasComposition();

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

  AddHeat() {
    // calculate a temperature change depending on the target temperature and the current temperature
    let dT = (this.TargetTemp - this.Temp) * 0.0005;
    this.Temp += dT;

    // change the volume as the temperature changes
    if (this.Pres != 0) {
      // as Ctotal is in mmol/l we have convert it as the gas constant is in mol
      let dV = (this.Ctotal * this.Vol * this._gasConstant * dT) / this.Pres;
      this.Vol += dV / 1000.0;

      // guard against negative volumes
      if (this.Vol < 0) {
        this.Vol = 0;
      }
    }
  }

  AddWaterVapour() {
    // Calculate water vapour pressure at compliance temperature
    let pH2Ot = this.CalcWaterVapourPressure(this.Temp);

    // do the diffusion from water vapour depending on the tissue water vapour and gas water vapour pressure
    let dH2O = 0.00001 * (pH2Ot - this.Ph2o) * this._t;
    if (this.Vol != 0) {
      this.Ch2o = (this.Ch2o * this.Vol + dH2O) / this.Vol;
    }

    // as the water vapour also takes volume this is added to the compliance
    if (this.Pres != 0) {
      // as dH2O is in mmol/l we have convert it as the gas constant is in mol
      this.Vol +=
        ((this._gasConstant * (273.15 + this.Temp)) / this.Pres) *
        (dH2O / 1000.0);
    }
  }

  CalcGasComposition() {
    // calculate Ctotal sum of all concentrations
    this.Ctotal = this.Ch2o + this.Co2 + this.Cco2 + this.Cn2;

    // protect against division by zero
    if (this.Ctotal == 0) {
      return;
    }

    // calculate the partial pressures
    this.Ph2o = (this.Ch2o / this.Ctotal) * this.Pres;
    this.Po2 = (this.Co2 / this.Ctotal) * this.Pres;
    this.Pco2 = (this.Cco2 / this.Ctotal) * this.Pres;
    this.Pn2 = (this.Cn2 / this.Ctotal) * this.Pres;
    this.Pother = (this.Cother / this.Ctotal) * this.Pres;

    // calculate the fractions
    this.Fh2o = this.Ch2o / this.Ctotal;
    this.Fo2 = this.Co2 / this.Ctotal;
    this.Fco2 = this.Cco2 / this.Ctotal;
    this.Fn2 = this.Cn2 / this.Ctotal;
    this.Fother = this.Cother / this.Ctotal;
  }

  CalcWaterVapourPressure(temp) {
    // calculate the water vapour pressure in air depending on the temperature
    return Math.pow(Math.E, 20.386 - 5132 / (temp + 273));
  }

  VolumeIn(dvol, modelFrom) {
    if (!this.FixedComposition) {
      // increase the volume
      this.Vol += dvol;

      // guard against negative values or zero
      if (this.Vol < 0 || this.Vol == 0.0) {
        this.Vol = 0.0;
        this.Co2 = 0.0;
        this.Cco2 = 0.0;
        this.Cn2 = 0.0;
        this.Ch2o = 0.0;
        this.Cother = 0.0;
        this.Ctotal = 0.0;
      } else {
        // change the gas concentrations
        let dCo2 = (modelFrom.Co2 - this.Co2) * dvol;
        this.Co2 = (this.Co2 * this.Vol + dCo2) / this.Vol;

        let dCco2 = (modelFrom.Cco2 - this.Cco2) * dvol;
        this.Cco2 = (this.Cco2 * this.Vol + dCco2) / this.Vol;

        let dCn2 = (modelFrom.Cn2 - this.Cn2) * dvol;
        this.Cn2 = (this.Cn2 * this.Vol + dCn2) / this.Vol;

        let dCh2o = (modelFrom.Ch2o - this.Ch2o) * dvol;
        this.Ch2o = (this.Ch2o * this.Vol + dCh2o) / this.Vol;

        let dCother = (modelFrom.Cother - this.Cother) * dvol;
        this.Cother = (this.Cother * this.Vol + dCother) / this.Vol;

        // change temperature due to influx of gas
        let dTemp = (modelFrom.Temp - this.Temp) * dvol;
        this.Temp = (this.Temp * this.Vol + dTemp) / this.Vol;
      }
    }
  }

  VolumeOut(dvol) {
    // declare a volume deficit
    let vol_deficit = 0.0;

    if (!this.FixedComposition) {
      // decrease the volume
      this.Vol -= dvol;

      // guard against negative volumes and a mass balance disturbance
      if (this.Vol < 0) {
        vol_deficit = -this.Vol;
        this.Vol = 0.0;
      }
    }

    // return the volume deficit
    return vol_deficit;
  }
}
