import ModelBaseClass from "../helpers/ModelBaseClass";

export class Blood extends ModelBaseClass {
  InitModel(args) {
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });

    // set the flag to model is initialized
    this._is_initialized = true;

    // find all blood compliances and blood time varying elastances and transfer the solutes to the compartments
    this.SetSolutes();

    //set pCO2 and pO2 in the lung compliances
    this._modelEngine.Models.LL.Po2 = 100.0;
    this._modelEngine.Models.LL.Po2 = 45.0;

    this._modelEngine.Models.RL.Po2 = 100.0;
    this._modelEngine.Models.RL.Po2 = 45.0;
  }

  SetSolutes() {
    Object.values(this._modelEngine.Models).forEach((model) => {
      if (
        model.ModelType === "BloodCompliance" ||
        model.ModelType === "BloodPump" ||
        model.ModelType === "BloodTimeVaryingElastance" ||
        model.ModelType === "MembraneOxygenator"
      ) {
        // only set the solutes when the rest is zero
        if (Object.keys(model.Solutes).length === 0) {
          model.Solutes = { ...this.Solutes };
        }
        if (model.To2 === 0) {
          console.log("To2 was zero in ", model);
        }
        if (model.Tco2 === 0) {
          model.Tco2 = this.Tco2;
        }
      }
    });
  }

  SetSolutesOnModel(model) {
    if (
      model.ModelType === "BloodCompliance" ||
      model.ModelType === "BloodPump" ||
      model.ModelType === "BloodTimeVaryingElastance" ||
      model.ModelType === "MembraneOxygenator"
    ) {
      // only set the solutes when the rest is zero
      if (Object.keys(model.Solutes).length === 0) {
        model.Solutes = { ...this.Solutes };
      }
      if (model.To2 === 0) {
        console.log("To2 was zero in ", model);
      }
      if (model.Tco2 === 0) {
        model.Tco2 = this.Tco2;
      }
    }
  }
}
