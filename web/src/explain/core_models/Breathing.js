import ModelBaseClass from "../helpers/ModelBaseClass";

export class Breathing extends ModelBaseClass {
  // local parameters
  EMin4 = Math.pow(Math.E, -4);
  _insp_timer = 0.0;
  _insp_running = false;
  _exp_timer = 0.0;
  _exp_running = false;
  _ti = 0.0;
  _te = 0.0;
  _ncc_insp = 0;
  _ncc_exp = 0;
  _breath_timer = 0.0;

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
    }

    // has the expiration time elapsed?
    if (this._exp_timer > this._te) {
      // reset the expiration timer
      this._exp_timer = 0.0;

      // signal that the expiration has stopped
      this._exp_running = false;
    }

    // increase the timers
    this._breath_timer += this._t;

    if (this._insp_running) {
      this._insp_timer += this._t;
      this._ncc_insp += 1.0;
    }

    if (this._exp_running) {
      this._exp_timer += this._t;
      this._ncc_exp += 1.0;
    }

    // calculate the respiratory muscle pressure
    this.CalcRespMusclePressure();

    // transfer muscle pressure to the targets
    for (let i = 0; i < this.Targets.length; i++) {
      this._modelEngine.Models[this.Targets[i]].PresExt =
        -this.RespMusclePressure;
    }
  }

  CalcRespMusclePressure() {
    // reset respiratory muscle pressure
    this.RespMusclePressure = 0;

    // inspiration
    if (this._insp_running) {
      this.RespMusclePressure =
        (this._ncc_insp / (this._ti / this._t)) * this.RmpGain;
    }

    // expiration
    if (this._exp_running) {
      this.RespMusclePressure =
        ((Math.pow(Math.E, -4.0 * (this._ncc_exp / (this._te / this._t))) -
          this.EMin4) /
          (1.0 - this.EMin4)) *
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
}
