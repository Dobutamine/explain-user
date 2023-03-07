import ModelBaseClass from "../helpers/ModelBaseClass";

export class Breathing extends ModelBaseClass {
  // local parameters
  _eMin4 = Math.pow(Math.E, -4);
  _insp_timer = 0.0;
  _insp_running = false;
  _exp_timer = 0.0;
  _exp_running = false;
  _ti = 0.0;
  _te = 0.0;
  _ncc_insp = 0;
  _ncc_exp = 0;
  _breath_timer = 0.0;
  ExpTidalVolume = 0;
  InspTidalVolume = 0;
  MinuteVolume = 0;
  _temp_exp_volume = 0;
  _temp_insp_volume = 0;

  // model initializer
  InitModel(args) {
    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });

    this.Dependencies = [];
    this.Dependencies.push("MOUTH_DS");
    this.Dependencies.push(this.TidalVolumeSource);
    this.Targets.forEach((t) => {
      this.Dependencies.push(t);
    });

    // set the flag to model is initialized
    this._is_initialized = true;
  }

  SwitchBreathing(state) {
    if (state) {
      this.IsEnabled = true;
      this._modelEngine.Models["MOUTH_DS"].IsEnabled = true;
      this._modelEngine.Models["MOUTH_DS"].NoFlow = false;
    } else {
      this.IsEnabled = false;
      this._modelEngine.Models["MOUTH_DS"].IsEnabled = false;
      this._modelEngine.Models["MOUTH_DS"].NoFlow = true;
    }
  }
  CalcModel() {
    // check whether the patient is intubted
    this._modelEngine.Models["MOUTH_DS"].NoFlow = this.Intubated;

    // calculate the respiratory rate and target tidal volume from the target minute volume
    this.VtRrController();

    // calculate the inspiratory and expiratory time
    let breath_interval = 60.0;
    if (this.RespRate > 0) {
      breath_interval = 60.0 / this.RespRate;
      this._ti = this.IeRatio * breath_interval; // in seconds
      this._te = breath_interval - this._ti; // in seconds
    }

    // is it time to start a breath?
    if (this._breath_timer > breath_interval) {
      // reset the breath timer
      this._breath_timer = 0.0;

      // signal that the inspiration is starting
      this._insp_running = true;
      this._insp_timer = 0.0;

      // reset the activation curve counter for the inspiration
      this._ncc_insp = 0.0;
    }

    // has the inspiration time elapsed?
    if (this._insp_timer > this._ti) {
      // reset the inspiration timer
      this._insp_timer = 0.0;

      // signal that the inspiration has stopped
      this._insp_running = false;

      // signal that the expiration has started
      this._exp_running = true;

      // reset the activation curve counter for the expiration
      this._ncc_exp = 0.0;

      // reset the expiratory volume counter
      this._temp_exp_volume = 0;

      // store the inspiratory tidal volume
      this.InspTidalVolume = this._temp_insp_volume;
    }

    // has the expiration time elapsed?
    if (this._exp_timer > this._te) {
      // reset the expiration timer
      this._exp_timer = 0.0;

      // signal that the expiration has stopped
      this._exp_running = false;

      // reset the inspiratory volume counter
      this._temp_insp_volume = 0;

      // store the expiratory tidal volume
      this.ExpTidalVolume = -this._temp_exp_volume;
    }

    // increase the timers
    this._breath_timer += this._t;

    if (this._insp_running) {
      this._insp_timer += this._t;
      this._ncc_insp += 1.0;

      // calculate the inspiratory  volume
      if (this._modelEngine.Models[this.TidalVolumeSource].Flow > 0) {
        this._temp_insp_volume +=
          this._modelEngine.Models[this.TidalVolumeSource].Flow * this._t;
      }
    }

    if (this._exp_running) {
      this._exp_timer += this._t;
      this._ncc_exp += 1.0;

      // calculate the expiratory  volume
      if (this._modelEngine.Models[this.TidalVolumeSource].Flow < 0) {
        this._temp_exp_volume +=
          this._modelEngine.Models[this.TidalVolumeSource].Flow * this._t;
      }
    }

    // reset respiratory muscle pressure
    this.RespMusclePressure = 0;

    // calculate the new respiratory muscle pressure
    if (this.BreathingEnabled) {
      this.CalcRespMusclePressure();
    } else {
      this.RespRate = 0;
      this.TargetTidalVolume = 0;
    }

    // transfer muscle pressure to the targets
    for (let i = 0; i < this.Targets.length; i++) {
      this._modelEngine.Models[this.Targets[i]].PresExt =
        -this.RespMusclePressure;
    }
  }

  CalcRespMusclePressure() {
    // inspiration
    if (this._insp_running) {
      this.RespMusclePressure =
        (this._ncc_insp / (this._ti / this._t)) * this.RmpGain;
    }

    // expiration
    if (this._exp_running) {
      this.RespMusclePressure =
        ((Math.pow(Math.E, -4.0 * (this._ncc_exp / (this._te / this._t))) -
          this._eMin4) /
          (1.0 - this._eMin4)) *
        this.RmpGain;
    }
  }

  VtRrController() {
    // calculate the spontaneous resp rate depending on the target minute volume (from ANS) and the set vt-rr ratio
    this.RespRate = Math.sqrt(this.TargetMinuteVolume / this.VtRrRatio);

    // calculate the target tidal volume depending on the target resp rate and target minute volume (from ANS)
    if (this.RespRate > 0) {
      this.TargetTidalVolume = this.TargetMinuteVolume / this.RespRate;
    }
  }

  ToggleIntubation(intubated) {
    if (intubated) {
      // close connection between dead space and mouth
      this._modelEngine.Models["MOUTH_DS"].NoFlow = true;
    } else {
      this._modelEngine.Models["MOUTH_DS"].NoFlow = false;
    }
  }
}
