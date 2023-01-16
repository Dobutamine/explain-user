import { Brent } from "../helpers/BrentRootFinding";

export default class Oxygenation {
  // class attributes
  Hemoglobin = 0.0;
  Dpg = 0.0;

  // set the brent root finding properties
  _brent_accuracy = 1e-8;
  _max_iterations = 100;
  _left_o2 = 0.01;
  _right_o2 = 100.0;

  // set constants
  _mmol_to_ml = 22.2674;
  _gas_constant = 62.36367;

  // independent parameters
  _to2 = 0;
  _ph = 0;
  _temp = 0;
  _be = 0;

  // dependent parameters
  _so2 = 0;
  _po2 = 0;
  _pres = 760;

  calc_oxygenation(
    to2,
    hb = 8.0,
    temp = 37.0,
    ph = 7.4,
    dpg = 5,
    be = 0.0,
    pres = 760
  ) {
    // define a result object
    let _result = new OxyResult();

    // import the parameters
    this._to2 = to2;
    this._hemoglobin = hb;
    this._temp = temp;
    this._ph = ph;
    this._dpg = dpg;
    this._be = be;
    this._pres = pres;

    // find the po2 and so2 and using a brent root finding procedure

    // the brent root finding returns a tuple (result: float, iterations: float, error: bool)
    let r = Brent(
      (po2) => this.oxygen_content(po2),
      this._left_o2,
      this._right_o2,
      this._max_iterations,
      this._brent_accuracy
    );
    // if the brent root finding did not yield a value then return an error
    if (r.Error) {
      return _result;
    }

    // complete the result object and return it
    r.Po2 = this._po2;
    r.So2 = this._so2;

    return r;
  }

  oxygen_content(po2) {
    // calculate the saturation from the current po2 from the current po2 estimate
    this._so2 = this.oxygen_dissociation_curve(po2);

    // store the current po2 estimate as mmHg
    this._po2 = po2 / 0.13333;

    // calculate the to2 from the current po2 estimate
    // convert the hemoglobin unit from mmol/l to g/dL
    // convert the po2 from kPa to mmHg
    // convert to output from ml O2/dL blood to ml O2/l blood
    let to2_new_estimate =
      (0.0031 * (po2 / 0.1333) +
        1.36 * (this._hemoglobin / 0.6206) * this._so2) *
      10.0;

    // convert the ml O2/l to mmol/l with the gas law with (GasConstant * (273.15 + _temp)) / Pres) / to2 (mol/l)
    let _mmolToMl = (this._gas_constant * (273.15 + this._temp)) / this._pres;

    // calculate ml O2 / ml blood.
    to2_new_estimate = to2_new_estimate / this._mmol_to_ml;

    // calculate the difference between the real to2 and the to2 based on the new po2 estimate and return it to the brent root finding function
    let dto2 = this._to2 - to2_new_estimate;

    // return the difference
    return dto2;
  }

  oxygen_dissociation_curve(po2) {
    // calculate the saturation from the po2 depending on the ph, be, temperature and dpg level.
    let a =
      1.04 * (7.4 - this._ph) + 0.005 * this._be + 0.07 * (this._dpg - 5.0);
    let b = 0.055 * (this._temp + 273.15 - 310.15);
    let y0 = 1.875;
    let x0 = 1.875 + a + b;
    let h0 = 3.5 + a;
    let k = 0.5343;
    let x = Math.log(po2, Math.E);
    let y = x - x0 + h0 * Math.tanh(k * (x - x0)) + y0;
    return 1.0 / (Math.pow(Math.E, -y) + 1.0);
  }
}

class OxyResult {
  Po2 = 0;
  So2 = 0;
  Error = true;
  Iterations = 0;
}
