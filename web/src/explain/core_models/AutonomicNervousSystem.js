import ModelBaseClass from "../helpers/ModelBaseClass";
import { ActivationFunction } from "../helpers/ActivationFunction";

export class AutonomicNervousSystem extends ModelBaseClass {
  // local parameters
  _baroreceptor = {};
  _chemoreceptor = {};
  _heart = {};
  _breathing = {};
  _systemic_resistors = {};
  _unstressed_volumes = {};
  _hpBaroActivationFunction = {};
  _hpPo2ActivationFunction = {};
  _hpPco2ActivationFunction = {};
  _vePo2ActivationFunction = {};
  _vePco2ActivationFunction = {};
  _vePhActivationFunction = {};
  _veLungStretchActivationFunction = {};
  _update_timer = 0.0;

  HeartPeriodChangeAns = 0;
  TargetMinuteVolume = 0;

  InitModel(args) {
    // initialize the baseclass
    // model initializer
    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });

    this.Dependencies = [];
    this.Dependencies.push(this.BaroreceptorLocation);
    this.Dependencies.push(this.ChemoreceptorLocation);
    this.Dependencies.push(this.HeartModelName);
    this.Dependencies.push(this.BreathingModelName);
    this.LungCompartments.forEach((c) => {
      this.Dependencies.push(c);
    });
    this.SystemicResistors.forEach((c) => {
      this.Dependencies.push(c);
    });
    this.UnstressedVolumes.forEach((c) => {
      this.Dependencies.push(c);
    });

    // set the flag to model is initialized
    this._is_initialized = true;

    // find the input sites
    this._baroreceptor = this._modelEngine.Models[this.BaroreceptorLocation];
    this._chemoreceptor = this._modelEngine.Models[this.ChemoreceptorLocation];

    // initialize the controller which controls the heart period using the baro receptor
    this._hpBaroActivationFunction = new ActivationFunction(
      this.SetBaro,
      this.MinBaro,
      this.MaxBaro,
      this.GHpBaro,
      this.TcHpBaro,
      this.UpdateInterval
    );

    // initialize the controller which controls the heart period using the po2
    this._hpPo2ActivationFunction = new ActivationFunction(
      this.SetPo2,
      this.MinPo2,
      this.MaxPo2,
      this.GHpPo2,
      this.TcHpPo2,
      this.UpdateInterval
    );

    // initialize the controller which controls the heart period using the pco2
    this._hpPco2ActivationFunction = new ActivationFunction(
      this.SetPco2,
      this.MinPco2,
      this.MaxPco2,
      this.GHpPco2,
      this.TcHpPco2,
      this.UpdateInterval
    );

    // initialize the controller which controls the exhaled minute volume by the pco2
    this._vePco2ActivationFunction = new ActivationFunction(
      this.SetPco2,
      this.MinPco2,
      this.MaxPco2,
      this.GVePco2,
      this.TcVePco2,
      this.UpdateInterval
    );

    // initialize the controller which controls the exhaled minute volume by the po2
    this._vePo2ActivationFunction = new ActivationFunction(
      this.SetPo2,
      this.MinPo2,
      this.MaxPo2,
      this.GVePo2,
      this.TcVePo2,
      this.UpdateInterval
    );

    // initialize the controller which controls the exhaled minute volume by the pco2
    this._vePco2ActivationFunction = new ActivationFunction(
      this.SetPco2,
      this.MinPco2,
      this.MaxPco2,
      this.GVePco2,
      this.TcVePco2,
      this.UpdateInterval
    );

    // initialize the controller which controls the exhaled minute volume by the pH
    this._vePhActivationFunction = new ActivationFunction(
      this.SetPh,
      this.MinPh,
      this.MaxPh,
      this.GVePh,
      this.TcVePh,
      this.UpdateInterval
    );

    // initialize the controller which controls the exhaled minute volume by the lung stretch receptor
    this._veLungStretchActivationFunction = new ActivationFunction(
      this.SetLungStretch,
      this.MinLungStretch,
      this.MaxLungStretch,
      this.GVeLungStretch,
      this.TcVeLungStretch,
      this.UpdateInterval
    );

    // find the effector sites
    this._heart = this._modelEngine.Models[this.HeartModelName];
    this._breathing = this._modelEngine.Models[this.BreathingModelName];
  }

  CalcModel() {
    // the autonomic nervous system updates slower for performance reasons
    if (this._update_timer > this.UpdateInterval) {
      // reset the update timer
      this._update_timer = 0.0;
      // do the calculations
      this.CalcAutonomicControl();
    }

    // increase the update timer
    this._update_timer += this._t;
  }

  CalcAutonomicControl() {
    // calculate the acid base and oxygenation properties of chemoreceptor site
    let ab = this._modelEngine.Models.AcidBase.CalcAcidBase(
      this._baroreceptor.Tco2
    );

    if (!ab.Error) {
      this._chemoreceptor.Pco2 = ab.Pco2;
      this._chemoreceptor.Ph = ab.Ph;
      this._chemoreceptor.Hco3 = ab.Hco3;
    }

    let oxy = this._modelEngine.Models.Oxygenation.CalcOxygenation(
      this._baroreceptor.To2
    );

    // store the results of the calculations
    if (!oxy.Error) {
      this._chemoreceptor.Po2 = oxy.Po2;
      this._chemoreceptor.So2 = oxy.So2;
    }

    // calculate the mean. In neonates the most accurate mean is given by MAP = DBP + (0.466 * (SBP-DBP))
    // map = _baroreceptor.PresMin  + 0.466 * (_baroreceptor.PresMax - _baroreceptor.PresMin);
    let map = this._baroreceptor.Pres;

    // get the lung volume for the lung stretch receptor
    let lung_volume = 0.0;
    for (let i = 0; i < this.LungCompartments.length; i++) {
      lung_volume += this._modelEngine.Models[this.LungCompartments[i]].Vol;
    }

    // calculate the effect of the mean arterial pressure, po2, pco2 and pH on the heart period.
    this._heart.HeartPeriodChangeAns =
      this._hpBaroActivationFunction.Update(map) +
      this._hpPo2ActivationFunction.Update(this._baroreceptor.Po2) +
      this._hpPco2ActivationFunction.Update(this._baroreceptor.Pco2);

    // calculate the effect of the po2, pco2, pH and lung stretch on the exhaled minute volume
    this._breathing.TargetMinuteVolume =
      this._breathing.RefMinuteVolume +
      this._vePhActivationFunction.Update(this._chemoreceptor.Ph) +
      this._vePco2ActivationFunction.Update(this._chemoreceptor.Pco2) +
      this._vePo2ActivationFunction.Update(this._chemoreceptor.Po2) +
      this._veLungStretchActivationFunction.Update(lung_volume);

    if (this._breathing.TargetMinuteVolume <= 0) {
      this._breathing.TargetMinuteVolume = 0;
    }

    this.HeartPeriodChangeAns = this._heart.HeartPeriodChangeAns;

    this.TargetMinuteVolume = this._breathing.TargetMinuteVolume;
  }
}
