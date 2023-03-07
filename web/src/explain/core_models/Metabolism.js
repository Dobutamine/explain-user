import ModelBaseClass from "../helpers/ModelBaseClass";

export class Metabolism extends ModelBaseClass {
  // model initializer
  InitModel(args) {
    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });

    this.Dependencies = [];
    Object.keys(this.MetabolicActiveModels).forEach((m) =>
      this.Dependencies.push(m)
    );
    // set the flag to model is initialized
    this._is_initialized = true;
  }

  CalcModel() {
    // translate the VO2 in ml/kg/min to VO2 in mmol for this stepsize (assumption is 37 degrees and atmospheric pressure)
    let vo2_step =
      ((0.039 * this.Vo2 * this._modelEngine.Weight) / 60.0) * this._t;

    // do the metabolism for each active blood compliance
    Object.entries(this.MetabolicActiveModels).forEach(([met_model, fvo2]) => {
      // get the to2 from the blood compartment
      let to2 = this._modelEngine.Models[met_model].To2;

      // calculate the change in oxygen concentration in this step
      let dto2 = vo2_step * fvo2;

      // calculate the new oxygen concentration in blood
      let new_to2 =
        (to2 * this._modelEngine.Models[met_model].Vol - dto2) /
        this._modelEngine.Models[met_model].Vol;
      // guard against negative values
      if (new_to2 < 0) {
        new_to2 = 0;
      }

      // get the tco2 from the blood compartment
      let tco2 = this._modelEngine.Models[met_model].Tco2;

      // calculate the change in co2 concentration in this step
      let dtco2 = vo2_step * fvo2 * this.RespQ;

      // calculate the new oxygen concentration in blood
      let new_tco2 =
        (tco2 * this._modelEngine.Models[met_model].Vol + dtco2) /
        this._modelEngine.Models[met_model].Vol;
      // guard against negative values
      if (new_tco2 < 0) {
        new_tco2 = 0;
      }

      // store the new to2 and tco2
      this._modelEngine.Models[met_model].To2 = new_to2;
      this._modelEngine.Models[met_model].Tco2 = new_tco2;
    });
  }
}
