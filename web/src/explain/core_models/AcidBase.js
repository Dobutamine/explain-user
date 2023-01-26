import { Brent } from "../helpers/BrentRootFinding";
import ModelBaseClass from "../helpers/ModelBaseClass";

export default class AcidBase extends ModelBaseClass {
  // class attributes
  IsEnabled = true;
  AlphaCo2P = 0.03067;

  // set the brent root finding properties
  _brent_accuracy = 1e-8;
  _max_iterations = 100;
  _left_hp = Math.pow(10.0, -7.8) * 1000.0;
  _right_hp = Math.pow(10.0, -6.8) * 1000.0;

  // set acid base constants
  _kw = Math.pow(10.0, -13.6) * 1000.0;
  _kc = Math.pow(10.0, -6.1) * 1000.0;
  _kd = Math.pow(10.0, -10.22) * 1000.0;

  // blood gas
  _tco2 = 0;
  _sid = 0;
  _albumin = 0;
  _phosphates = 0;
  _uma = 0;
  _ph = 0;
  _pco2 = 0;
  _hco3 = 0;
  _cco2 = 0;
  _cco3 = 0;
  _oh = 0;
  _is_initialized = true;

  // calculate step
  calc_acid_base(tco2, sid = 35.9, alb = 25.0, pi = 1.64, u = 0.0) {
    // declare a new blood gas instance
    let _result = new BloodGas();

    // store the parameters
    this._tco2 = tco2;
    this._sid = sid;
    this._phosphates = pi;
    this._albumin = alb;
    this._uma = u;

    // find the hp concentration
    let r = Brent(
      (hp) => this.net_charge_plasma(hp),
      this._left_hp,
      this._right_hp,
      this._max_iterations,
      this._brent_accuracy
    );

    // if the brent root finding did not yield a value then return an error
    if (r.Error) {
      return _result;
    }

    // complete the result object and return it
    r.Ph = this._ph;
    r.Pco2 = this._pco2;
    r.Hco3 = this._hco3;

    return r;
  }
  net_charge_plasma(h) {
    // calculate the plasma co2 concentration based on the total co2 in the plasma, hydrogen concentration and the constants Kc and Kd
    this._cco2 =
      this._tco2 /
      (1.0 + this._kc / h + (this._kc * this._kd) / Math.pow(h, 2.0));
    // calculate the plasma hco3(-) concentration (bicarbonate)
    this._hco3 = (this._kc * this._cco2) / h; // Eq.3
    // calculate the plasma co3(2-) concentration (carbonate)
    this._cco3 = (this._kd * this._hco3) / h; // Eq.4
    // calculate the plasma OH(-) concentration (water dissociation)
    this._oh = this._kw / h; // Eq.7
    // calculate the pco2 of the plasma
    this._pco2 = this._cco2 / this.AlphaCo2P; // Eq.13
    // calculate the pH
    this._ph = -Math.log10(h / 1000.0); // Eq. 9
    // calculate the weak acids (albumin and phosphates)
    let a =
      this._albumin * (0.123 * this._ph - 0.631) +
      this._phosphates * (0.309 * this._ph - 0.469); //Eq.8
    let ac = h - this._hco3 - a - this._oh - 2.0 * this._cco3; // Eq.10
    // calculate the net charge of the plasma. If the netcharge is zero than the current hp_estimate is the correct one.
    let nc = ac + this._sid - this._uma; // Eq. 12
    // return the net charge
    return nc;
  }
}

class BloodGas {
  Ph = 0;
  Pco2 = 0;
  Hco3 = 0;
  Be = 0;
  Iterations = 0;
  Error = true;
}
