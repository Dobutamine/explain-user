import { mode } from "simple-statistics";
import ModelBaseClass from "../helpers/ModelBaseClass";

export class Heart extends ModelBaseClass {
  // external properties
  NccAtrial = -1;
  NccVentricular = -1;
  Aaf = 0.0;
  Vaf = 0.0;
  HeartPeriodChangeAns = 0.0;
  HeartPeriodChangeTemp = 0.0;
  HeartPeriodChangeMyo = 0.0;
  EcgSignal = 0;

  // local properties
  _kn = 0.579;
  _ra = {};
  _la = {};
  _rv = {};
  _lv = {};
  _cor = {};
  _sa_node_period_limit = 0.2;
  _sa_node_timer = 0.0;
  _pq_running = false;
  _pq_timer = 0.0;
  _qrs_timer = 0.0;
  _qrs_running = false;
  _ventricle_is_refractory = false;
  _qt_timer = 0.0;
  _qt_running = false;
  _prev_p_signal = 0;
  _prev_qrs_signal = 0;
  _prev_t_signal = 0;

  amp_p = 1;
  skew_p = 2.5;
  width_p = 20;
  amp_q = -0.5;
  width_q = 20;
  skew_q = 2;
  amp_r = 10;
  width_r = 20;
  skew_r = 2.5;
  amp_s = -1.5;
  width_s = 20;
  skew_s = 10;
  amp_t = 2;
  skew_t = 2;
  width_t = 25;
  q_interval = 0;
  r_interval = 0;
  s_interval = 0;

  InitModel(args) {
    // model initializer

    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });

    // set the flag to model is initialized
    this._is_initialized = true;

    // find the references to the atrial and ventricular models
    this._ra = this._modelEngine.Models[this.RightAtrium];
    this._la = this._modelEngine.Models[this.LeftAtrium];
    this._rv = this._modelEngine.Models[this.RightVentricle];
    this._lv = this._modelEngine.Models[this.LeftVentricle];
    this._cor = this._modelEngine.Models[this.Coronaries];

    // determine the maximal heartrate
    this._sa_node_period_limit = 60.0 / this.HeartRateUpperLimit;
  }

  CalcModel() {
    // calculate the qtc time depending on the heartrate
    this.CqtTime = this.Qtc();

    // calculate the sinus node interval in seconds depending on the heart rate
    let sa_node_period =
      60.0 / this.HeartRateRef +
      this.HeartPeriodChangeAns +
      this.HeartPeriodChangeTemp +
      this.HeartPeriodChangeMyo;

    // limit the heart period depending on the HeartRateUpperLimit property
    // if (sa_node_period < this._sa_node_period_limit) {
    //   sa_node_period = this._sa_node_period_limit;
    // }

    // calculate the current heartrate
    this.HeartRate = 60.0 / sa_node_period;

    // has the sinus node period elapsed?
    if (this._sa_node_timer > sa_node_period) {
      // reset the sinus node timer
      this._sa_node_timer = 0.0;
      // signal that the pq-time starts running
      this._pq_running = true;
      // reset the atrial activation curve counter
      this.NccAtrial = -1;
    }

    // has the pq time elapsed + the av delay time
    if (this._pq_timer > this.PqTime + this.AvDelay) {
      // reset the pq timer
      this._pq_timer = 0.0;
      // signal that the pq timer has stopped
      this._pq_running = false;
      // check whether the ventricles are in a refractory state
      if (!this._ventricle_is_refractory) {
        // signal that the qrs time starts running
        this._qrs_running = true;
        // reset the ventricular activation curve
        this.NccVentricular = -1;
      }
    }

    // has the qrs time elapsed?
    if (this._qrs_timer > this.QrsTime) {
      // reset the qrs timer
      this._qrs_timer = 0.0;
      // signal that the qrs timer has stopped
      this._qrs_running = false;
      // signal that the qt time starts running
      this._qt_running = true;
      // signal that the ventricles are now in a refractory state
      this._ventricle_is_refractory = true;
    }

    // has the qt time elapsed?
    if (this._qt_timer > this.CqtTime) {
      // reset the qt timer
      this._qt_timer = 0.0;
      // signal that the qt timer has stopped
      this._qt_running = false;
      // signal that the ventricles are coming out of their refractory state
      this._ventricle_is_refractory = false;
    }

    // increase the timers with the modeling stepsize as set by the model base class
    this._sa_node_timer += this._t;

    // increase the qt timer if their running
    if (this._pq_running) {
      this._pq_timer += this._t;
      this.buildDynamicPWave();
    }
    if (this._qrs_running) {
      this._qrs_timer += this._t;
      this.buidlDynamicQRSWave();
    }
    if (this._qt_running) {
      this._qt_timer += this._t;
      this.buildDynamicTWave();
    }

    if (!this._pq_running && !this._qrs_running && !this._qt_running) {
      this.EcgSignal = 0;
    }
    // increase the heart activation function counters
    this.NccAtrial += 1;
    this.NccVentricular += 1;

    // calculate the varying elastance function
    let atrial_duration = this.PqTime;
    let ventricular_duration = this.QrsTime + this.CqtTime;

    // calculate the atrial activation function factor
    if (this.NccAtrial >= 0 && this.NccAtrial < this.PqTime / this._t) {
      this.Aaf = Math.sin(
        Math.PI * (this.NccAtrial / (atrial_duration / this._t))
      );
    } else {
      this.Aaf = 0.0;
    }
    // calculate the ventricular activation function factor
    if (
      this.NccVentricular >= 0 &&
      this.NccVentricular < ventricular_duration / this._t
    ) {
      this.Vaf =
        (this.NccVentricular / (this._kn * (ventricular_duration / this._t))) *
        Math.sin(
          Math.PI * (this.NccVentricular / (ventricular_duration / this._t))
        );
    } else {
      this.Vaf = 0.0;
    }
    // transfer the varying elastance activation function factors to the heart models
    this._ra.ActFactor = this.Aaf;
    this._la.ActFactor = this.Aaf;
    this._rv.ActFactor = this.Vaf;
    this._lv.ActFactor = this.Vaf;
    this._cor.ActFactor = this.Vaf;
  }

  Qtc() {
    if (this.HeartRate > 10.0) {
      return this.QtTime * Math.sqrt(60.0 / this.HeartRate);
    } else {
      return this.QtTime * Math.sqrt(6.0);
    }
  }
  buildDynamicPWave() {
    let duration = this.PqTime;
    let amp_p = this.amp_p;
    let width_p = this.width_p;
    let skew_p = this.skew_p;

    let new_p_signal =
      amp_p *
      Math.exp(
        -width_p *
          (Math.pow(this._pq_timer - duration / skew_p, 2) /
            Math.pow(duration, 2))
      );
    let delta_p = new_p_signal - this._prev_p_signal;
    this.EcgSignal += delta_p;
    this._prev_p_signal = new_p_signal;
  }
  buidlDynamicQRSWave() {
    let new_qrs_signal = 0;
    this.q_interval = this.QrsTime / 3;
    this.r_interval = this.QrsTime / 3;
    this.s_interval = this.QrsTime / 3;

    // do the q wave
    if (this._qrs_timer < this.q_interval) {
      new_qrs_signal =
        this.amp_q *
        Math.exp(
          -this.width_q *
            (Math.pow(this._qrs_timer - this.q_interval / this.skew_q, 2) /
              Math.pow(this.q_interval, 2))
        );
    }

    // do the r wave
    if (
      this._qrs_timer > this.q_interval &&
      this._qrs_timer < this.q_interval + this.r_interval
    ) {
      new_qrs_signal =
        this.amp_r *
        Math.exp(
          -this.width_r *
            (Math.pow(
              this._qrs_timer - this.q_interval - this.r_interval / this.skew_r,
              2
            ) /
              Math.pow(this.r_interval, 2))
        );
    }

    // do the s wave
    if (
      this._qrs_timer > this.q_interval + this.r_interval &&
      this._qrs_timer < this.q_interval + this.r_interval + this.s_interval
    ) {
      new_qrs_signal =
        this.amp_s *
        Math.exp(
          -this.width_s *
            (Math.pow(
              this._qrs_timer -
                this.q_interval -
                this.r_interval -
                this.s_interval / this.skew_s,
              2
            ) /
              Math.pow(this.s_interval, 2))
        );
    }

    let delta_qrs = new_qrs_signal - this._prev_qrs_signal;
    this.EcgSignal += delta_qrs;
    this._prev_qrs_signal = new_qrs_signal;
  }
  buildDynamicTWave() {
    let duration = this.CqtTime;
    let amp_t = this.amp_t;
    let width_t = this.width_t;
    let skew_t = this.skew_t;

    let new_t_signal =
      amp_t *
      Math.exp(
        -width_t *
          (Math.pow(this._qt_timer - duration / skew_t, 2) /
            Math.pow(duration, 2))
      );
    let delta_t = new_t_signal - this._prev_t_signal;
    this.EcgSignal += delta_t;
    this._prev_t_signal = new_t_signal;
  }
}
