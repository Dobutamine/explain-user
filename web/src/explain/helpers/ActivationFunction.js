export class ActivationFunction {
  // specific model attributes
  SetPoint = 0.0;
  Min = 0.0;
  Max = 0.0;
  Gain = 0.0;
  TimeConstant = 0.0;
  Output = 0.0;
  UpdateInterval = 0.0;

  // local parameters
  _activation = 0.0;

  constructor(set_point, min, max, gain, time_constant, update_interval) {
    // set the parameters
    this.SetPoint = set_point;
    this.Max = max;
    this.Min = min;
    this.Gain = gain;
    this.TimeConstant = time_constant;
    this.UpdateInterval = update_interval;
  }

  Update(sensor_value) {
    // calculate the sensor activity
    let a = this.CalcActivation(sensor_value);

    // calculate the sensor output
    this._activation =
      this.UpdateInterval *
        ((1.0 / this.TimeConstant) * (-this._activation + a)) +
      this._activation;

    // Apply the gain
    this.Output = this._activation * this.Gain;

    //return the sensor output
    return this.Output;
  }

  CalcActivation(value) {
    // set the activation factor
    let a = 0.0;

    // calculate the activation factor
    if (value >= this.Max) {
      a = this.Max - this.SetPoint;
    } else {
      if (value <= this.Min) {
        a = this.Min - this.SetPoint;
      } else {
        a = value - this.SetPoint;
      }
    }

    // return the activation factor
    return a;
  }
}
