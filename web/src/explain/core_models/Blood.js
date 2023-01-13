import ModelBaseClass from "../helpers/ModelBaseClass";

export class Blood extends ModelBaseClass {
  InitModel(model_ref) {
    // initialize the baseclass
    super.InitModel(model_ref);

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
        model.ModelType === "BloodTimeVaryingElastance"
      ) {
        model.Solutes = { ...this.Solutes };
        model.To2 = this.To2;
        model.Tco2 = this.Tco2;
      }
    });
  }
}
