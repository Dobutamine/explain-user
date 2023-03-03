import ModelBaseClass from "../helpers/ModelBaseClass";

export class Diffusor extends ModelBaseClass {
  FluxO2 = 0;
  FluxCo2 = 0;

  // local parameters
  _flux_o2 = 0.0;
  _flux_co2 = 0.0;

  // model initializer
  InitModel(args) {
    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });

    // set the flag to model is initialized
    this._is_initialized = true;
  }

  CalcModel() {
    // get the total oxygen and carbon dioxide content from the blood components
    let to2_blood1 = this._modelEngine.Models[this.CompBlood1].To2;
    let tco2_blood1 = this._modelEngine.Models[this.CompBlood1].Tco2;

    // calculate the partial pressures of oxygen and carbon dioxide from the total content
    let ab1 = this._modelEngine.Models.AcidBase.calc_acid_base(tco2_blood1);
    let oxy1 =
      this._modelEngine.Models.Oxygenation.calc_oxygenation(to2_blood1);

    let po2_blood1 = 0;
    let pco2_blood1 = 0;

    if (!oxy1.Error) {
      po2_blood1 = oxy1.Po2;
    } else {
      po2_blood1 = this._modelEngine.Models[this.CompBlood1].Po2;
    }

    if (!ab1.Error) {
      pco2_blood1 = ab1.Pco2;
    } else {
      pco2_blood1 = this._modelEngine.Models[this.CompBlood1].Pco2;
    }

    this._modelEngine.Models[this.CompBlood1].Po2 = po2_blood1;
    this._modelEngine.Models[this.CompBlood1].Pco2 = pco2_blood1;

    // get the total oxygen and carbon dioxide content from the blood components
    let to2_blood2 = this._modelEngine.Models[this.CompBlood2].To2;
    let tco2_blood2 = this._modelEngine.Models[this.CompBlood2].Tco2;

    // calculate the partial pressures of oxygen and carbon dioxide from the total content
    let ab2 = this._modelEngine.Models.AcidBase.calc_acid_base(tco2_blood2);
    let oxy2 =
      this._modelEngine.Models.Oxygenation.calc_oxygenation(to2_blood2);

    let po2_blood2 = 0;
    let pco2_blood2 = 0;

    if (!oxy2.Error) {
      po2_blood2 = oxy2.Po2;
    } else {
      po2_blood2 = this._modelEngine.Models[this.CompBlood2].Po2;
    }

    if (!ab2.Error) {
      pco2_blood2 = ab2.Pco2;
    } else {
      pco2_blood2 = this._modelEngine.Models[this.CompBlood2].Pco2;
    }

    this._modelEngine.Models[this.CompBlood2].Po2 = po2_blood2;
    this._modelEngine.Models[this.CompBlood2].Pco2 = pco2_blood2;

    // calculate the O2 flux from the blood to the gas compartment
    this._flux_o2 = (po2_blood1 - po2_blood2) * this.DifO2 * this._t;

    // calculate the CO2 flux from the blood to the gas compartment
    this._flux_co2 = (pco2_blood1 - pco2_blood2) * this.DifCo2 * this._t;

    // calculate the new O2 concentrations of the gas and blood compartments
    let new_to2_blood1 =
      (to2_blood1 * this._modelEngine.Models[this.CompBlood1].Vol -
        this._flux_o2) /
      this._modelEngine.Models[this.CompBlood1].Vol;
    if (new_to2_blood1 < 0) {
      new_to2_blood1 = 0;
    }

    let new_to2_blood2 =
      (to2_blood2 * this._modelEngine.Models[this.CompBlood2].Vol +
        this._flux_o2) /
      this._modelEngine.Models[this.CompBlood2].Vol;
    if (new_to2_blood2 < 0) {
      new_to2_blood2 = 0;
    }

    // calculate the new Co2 concentrations of the gas and blood compartments
    let new_tco2_blood1 =
      (tco2_blood1 * this._modelEngine.Models[this.CompBlood1].Vol -
        this._flux_co2) /
      this._modelEngine.Models[this.CompBlood1].Vol;
    if (new_tco2_blood1 < 0) {
      new_tco2_blood1 = 0;
    }

    let new_tco2_blood2 =
      (tco2_blood2 * this._modelEngine.Models[this.CompBlood2].Vol +
        this._flux_co2) /
      this._modelEngine.Models[this.CompBlood2].Vol;
    if (new_tco2_blood2 < 0) {
      new_tco2_blood2 = 0;
    }

    this.FluxO2 = this._flux_o2;
    this.FluxCo2 = this._flux_co2;

    // transfer the new concentrations
    this._modelEngine.Models[this.CompBlood1].To2 = new_to2_blood1;
    this._modelEngine.Models[this.CompBlood1].Tco2 = new_tco2_blood1;
    this._modelEngine.Models[this.CompBlood2].To2 = new_to2_blood2;
    this._modelEngine.Models[this.CompBlood2].Tco2 = new_tco2_blood2;
  }
}
