import ModelBaseClass from "../helpers/ModelBaseClass";

import { BloodResistor } from "./BloodResistor";
import { BloodCompliance } from "./BloodCompliance";
import { Diffusor } from "./Diffusor";

export class Placenta extends ModelBaseClass {
  // independent variables
  Vol = 0.0;
  UVol = 0.0;
  ElBase = 0.0;
  ElK = 0.0;
  Pres0 = 0;
  PresMus = 0;
  PresExt = 0;
  PresCc = 0;
  Solutes = {};

  // dependent variables
  Pres = 0.0;
  PresInlet = 0;
  PresOutlet = 0;
  VolMax = 0.0;
  VolMin = 0.0;
  PresMax = 0.0;
  PresMin = 0.0;
  To2 = 0;
  Po2 = 0.0;
  So2 = 0.0;
  Tco2 = 0.0;
  Pco2 = 0.0;
  Ph = 0.0;
  Hco3 = 0.0;

  PAtm = 760.0;
  Fo2Dry = 0.205;
  Fco2Dry = 0.000392;
  Fn2Dry = 0.794608;
  FotherDry = 0;
  Humidity = 0.5;
  Temp = 20.0;

  // local parameters
  _temp_max_pres = -1000.0;
  _temp_min_pres = 1000.0;
  _temp_max_vol = -1000.0;
  _temp_min_vol = 1000.0;
  _update_counter = 0.0;
  _update_interval = 1.0;

  _umbilicalVein = {};
  _umbilicalArteries = {};
  _uVIn = {};
  _uVOut = {};
  _uAIn = {};
  _uAOut = {};

  _maternalPlacenta = {};
  _fetalPlacenta = {};
  _maternalPlacenta = {};
  _gasExchangerPlacenta = {};

  // model initializer
  InitModel(args) {
    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });

    this.Dependencies = [];
    this.Dependencies.push("AD");
    this.Dependencies.push("IVCI");
    this.Dependencies.push("PL");
    this.Dependencies.push("UA");
    this.Dependencies.push("UV");
    this.Dependencies.push("AD_UA");
    this.Dependencies.push("UA_PL");
    this.Dependencies.push("PL_UV");
    this.Dependencies.push("UV_IVCI");

    this._maternalPlacenta = new BloodCompliance(
      this._modelEngine,
      "MaternalPlacenta",
      "BloodCompliance"
    );

    this.SetMaternalPlacenta();

    this._gasExchangerPlacenta = new Diffusor(
      this._modelEngine,
      "GasExchangerPlacenta",
      "Diffusor"
    );

    this.SetGasExchangerPlacenta();

    // // set the flag to model is initialized
    this._is_initialized = true;
  }

  SetGasExchangerPlacenta() {
    this._gasExchangerPlacenta.InitModel([
      { key: "Description", value: "gas exchanger placenta" },
      { key: "IsEnabled", value: this.IsEnabled },
      { key: "CompBlood1", value: "PL" },
      { key: "CompBlood2", value: "MaternalPlacenta" },
      { key: "DifO2", value: 0.01 },
      { key: "DifCo2", value: 0.01 },
    ]);

    if (this._modelEngine.Models[this._gasExchangerPlacenta.Name]) {
      this._gasExchangerPlacenta =
        this._modelEngine.Models[this._gasExchangerPlacenta.Name];
    } else {
      this._modelEngine.Models[this._gasExchangerPlacenta.Name] =
        this._gasExchangerPlacenta;
    }
  }

  SetMaternalPlacenta() {
    // chatGPT output
    // This information can be found in various medical textbooks and research articles.
    // For example, a study published in the journal Placenta in 2017 reported that the mean placental volume of the
    // maternal side was 496 cc in 172 pregnancies studied.
    // Another study published in the same journal in 2013 reported that the
    // mean placental volume of the maternal side was 470 cc in 109 pregnancies studied.

    this._maternalPlacenta.InitModel([
      { key: "Description", value: "umbilical veins" },
      { key: "IsEnabled", value: this.IsEnabled },
      { key: "Vol", value: 0.5 },
      { key: "UVol", value: 0.5 },
      { key: "ElBase", value: 5000 },
      { key: "ElK", value: 0 },
    ]);

    this._modelEngine.Models["Blood"].SetSolutesOnModel(this._maternalPlacenta);

    if (this._modelEngine.Models[this._maternalPlacenta.Name]) {
      this._maternalPlacenta =
        this._modelEngine.Models[this._maternalPlacenta.Name];
    } else {
      this._modelEngine.Models[this._maternalPlacenta.Name] =
        this._maternalPlacenta;
    }
  }

  // program a root finding procedure

  // override the base class CalcModel method
  CalcModel() {
    this.PlacentalGasExchange();
  }
  PlacentalGasExchange() {
    this._maternalPlacenta.To2 = 7.8;
  }
}
