import ModelBaseClass from "../helpers/ModelBaseClass";

export class Blood extends ModelBaseClass {
  _updateCounter = 0.0;
  _updateInterval = 1.0;

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

  CalcModel() {
    if (this._updateCounter > this._updateInterval) {
      this._updateCounter = 0;

      // calculate the acid base and oxygenation properties of chemoreceptor site
      let ab = this._modelEngine.Models.AcidBase.calc_acid_base(
        this._modelEngine.Models["AD"].Tco2
      );

      if (!ab.Error) {
        this._modelEngine.Models["AD"].Pco2 = ab.Pco2;
        this._modelEngine.Models["AD"].Ph = ab.Ph;
        this._modelEngine.Models["AD"].Hco3 = ab.Hco3;
      }

      let ad_oxy = this._modelEngine.Models.Oxygenation.calc_oxygenation(
        this._modelEngine.Models["AD"].To2
      );
      // store the results of the calculations
      if (!ad_oxy.Error) {
        this._modelEngine.Models["AD"].Po2 = ad_oxy.Po2;
        this._modelEngine.Models["AD"].So2 = ad_oxy.So2;
      }
    }
    this._updateCounter += this._t;
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
        // if (model.To2 === 0) {
        //   console.log("To2 was zero in ", model);
        // }
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
      // if (model.To2 === 0) {
      //   console.log("To2 was zero in ", model);
      // }
      if (model.Tco2 === 0) {
        model.Tco2 = this.Tco2;
      }
    }
  }
}
