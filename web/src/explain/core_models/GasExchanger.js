import ModelBaseClass from "../helpers/ModelBaseClass";

export class GasExchanger extends ModelBaseClass {
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
    let to2_blood = this._modelEngine.Models[this.CompBlood].To2;
    let tco2_blood = this._modelEngine.Models[this.CompBlood].Tco2;

    let po2_blood = 0;
    let pco2_blood = 0;

    // calculate the partial pressures of oxygen and carbon dioxide from the total content
    let ab = this._modelEngine.Models.AcidBase.calc_acid_base(tco2_blood);
    let oxy = this._modelEngine.Models.Oxygenation.calc_oxygenation(to2_blood);

    if (!oxy.Error) {
      po2_blood = oxy.Po2;
    } else {
      po2_blood = this._modelEngine.Models[this.CompBlood].Po2;
    }

    if (!ab.Error) {
      pco2_blood = ab.Pco2;
    } else {
      pco2_blood = this._modelEngine.Models[this.CompBlood].Pco2;
    }

    this._modelEngine.Models[this.CompBlood].Po2 = po2_blood;
    this._modelEngine.Models[this.CompBlood].Pco2 = pco2_blood;

    // get the partial pressures from the gas components
    let co2_gas = this._modelEngine.Models[this.CompGas].Co2;
    let cco2_gas = this._modelEngine.Models[this.CompGas].Cco2;
    let po2_gas = this._modelEngine.Models[this.CompGas].Po2;
    let pco2_gas = this._modelEngine.Models[this.CompGas].Pco2;

    // calculate the O2 flux from the blood to the gas compartment
    this._flux_o2 = (po2_blood - po2_gas) * this.DifO2 * this._t;

    // calculate the CO2 flux from the blood to the gas compartment
    this._flux_co2 = (pco2_blood - pco2_gas) * this.DifCo2 * this._t;

    // calculate the new O2 concentrations of the gas and blood compartments
    let new_to2_blood =
      (to2_blood * this._modelEngine.Models[this.CompBlood].Vol -
        this._flux_o2) /
      this._modelEngine.Models[this.CompBlood].Vol;
    if (new_to2_blood < 0) {
      new_to2_blood = 0;
    }

    let new_co2_gas =
      (co2_gas * this._modelEngine.Models[this.CompGas].Vol + this._flux_o2) /
      this._modelEngine.Models[this.CompGas].Vol;
    if (new_co2_gas < 0) {
      new_co2_gas = 0;
    }

    // calculate the new Co2 concentrations of the gas and blood compartments
    let new_tco2_blood =
      (tco2_blood * this._modelEngine.Models[this.CompBlood].Vol -
        this._flux_co2) /
      this._modelEngine.Models[this.CompBlood].Vol;
    if (new_tco2_blood < 0) {
      new_tco2_blood = 0;
    }

    let new_cco2_gas =
      (cco2_gas * this._modelEngine.Models[this.CompGas].Vol + this._flux_co2) /
      this._modelEngine.Models[this.CompGas].Vol;
    if (new_cco2_gas < 0) {
      new_cco2_gas = 0;
    }

    this.FluxO2 = this._flux_o2;
    this.FluxCo2 = this._flux_co2;

    // transfer the new concentrations
    this._modelEngine.Models[this.CompBlood].To2 = new_to2_blood;
    this._modelEngine.Models[this.CompBlood].Tco2 = new_tco2_blood;
    this._modelEngine.Models[this.CompGas].Co2 = new_co2_gas;
    this._modelEngine.Models[this.CompGas].Cco2 = new_cco2_gas;
  }
}
