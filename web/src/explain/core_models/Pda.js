import ModelBaseClass from "../helpers/ModelBaseClass";

export class Pda extends ModelBaseClass {
  // local parameters
  _pda = {};
  _res = 1.0;

  Res = 0;
  Velocity = 0;
  Flow = 0;

  InitModel(args) {
    // model initializer

    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });

    // set the flag to model is initialized
    this._is_initialized = true;

    // reference the blood resister
    this._pda = this._modelEngine.Models[this.Model];
  }

  CalcModel() {
    // calculate the resistance of the ductus arteriousus where
    // the duct is modeled as a perfect tube with a diameter and a length in millimeters
    // the viscosity is in centiPoise

    // resistance is calculated using Poiseuille's Law : R = (8 * n * L) / (PI * r^4)

    // we have to watch the units carefully where we have to make sure that the units in the formula are
    // resistance is in mmHg * s / l
    // L = length in meters from millimeters
    // r = radius in meters from millimeters
    // n = viscosity in mmHg * s from centiPoise

    if (this.Diameter <= 0) {
      this.Res = 100000000;
      this.Flow = 0.0;
      this.Velocity = 0.0;
      this._pda.NoFlow = true;
      return;
    }

    // convert viscosity from centiPoise to mmHg * s
    let n_mmhgs = this.Viscosity * 0.001 * 0.00750062;

    // convert the length to meters
    let length_meters = this.Length / 1000.0;

    // calculate the radius in meters
    let radius_meters = this.Diameter / 2 / 1000.0;

    // calculate the resistance using Poiseuille's Law, the resistance is now in mmHg * s/mm^3
    this._res =
      (8.0 * n_mmhgs * length_meters) / (Math.PI * Math.pow(radius_meters, 4));

    // convert resistance of mmHg * s / mm^3 to mmHg *s / l
    this._res = this._res / 1000.0;
    this.Res = this._res;

    // transfer the resistance to the ductus arteriosus blood connector and enable flow
    this._pda.IsEnabled = this.IsEnabled;
    this._pda.NoFlow = !this.IsEnabled;
    this._pda.RFor = this._res;
    this._pda.RBack = this._res;

    // store the pda flow in l / s
    this.Flow = this._pda.Flow;

    // calculate the velocity in m/s, for that we have to convert the flow to mm^3/sec
    // velocity = flow_rate (in mm^3/s) / (pi * radius^2)     in m/s
    this.Velocity =
      this._pda.Flow / 1000.0 / (Math.PI * Math.pow(radius_meters, 2.0));
    this.Velocity10 = this.Velocity * 10.0;
  }
}
