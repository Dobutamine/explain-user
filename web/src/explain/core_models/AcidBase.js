import { Brent } from "../helpers/BrentRootFinding";

export default class AcidBase {
  // class attributes
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
      this.net_charge_plasma,
      this._left_hp,
      this._right_hp,
      this._max_iterations,
      this._brent_accuracy
    );
    _result.Iterations = r[1];
    _result.Error = r[2];

    // if the brent root finding did not yield a value then return an error
    if (_result.Error) {
      return _result;
    }

    // complete the result object and return it
    _result.Ph = this._ph;
    _result.Pco2 = this._pco2;
    _result.Hco3 = this._hco3;

    return _result;
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
