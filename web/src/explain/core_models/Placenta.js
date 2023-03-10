import ModelBaseClass from "../helpers/ModelBaseClass";

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
  _gasExchangerPlacenta = {};

  Enable() {
    this._modelEngine.Models["Placenta"].IsEnabled = true;
    this._modelEngine.Models["AD_UA"].IsEnabled = true;
    this._modelEngine.Models["AD_UA"].NoFlow = false;
    this._modelEngine.Models["UA"].IsEnabled = true;
    this._modelEngine.Models["UA_PLF"].IsEnabled = true;
    this._modelEngine.Models["PLF"].IsEnabled = true;
    this._modelEngine.Models["PLF_UV"].IsEnabled = true;
    this._modelEngine.Models["UV"].IsEnabled = true;
    this._modelEngine.Models["UV_IVCI"].IsEnabled = true;
    this._modelEngine.Models["UV_IVCI"].NoFlow = false;
    this._maternalPlacenta.IsEnabled = true;
    this._gasExchangerPlacenta.IsEnabled = true;
  }

  Disable() {
    this._modelEngine.Models["Placenta"].IsEnabled = false;
    this._modelEngine.Models["AD_UA"].IsEnabled = false;
    this._modelEngine.Models["AD_UA"].NoFlow = true;
    this._modelEngine.Models["UA"].IsEnabled = false;
    this._modelEngine.Models["UA_PLF"].IsEnabled = false;
    this._modelEngine.Models["PLF"].IsEnabled = false;
    this._modelEngine.Models["PLF_UV"].IsEnabled = false;
    this._modelEngine.Models["UV"].IsEnabled = false;
    this._modelEngine.Models["UV_IVCI"].IsEnabled = false;
    this._modelEngine.Models["UV_IVCI"].NoFlow = true;
    this._maternalPlacenta.IsEnabled = false;
    this._gasExchangerPlacenta.IsEnabled = false;
  }

  // model initializer
  InitModel(args) {
    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });

    this.Dependencies = [];
    this.Dependencies.push("AD");
    this.Dependencies.push("IVCI");
    this.Dependencies.push("PLF");
    this.Dependencies.push("UA");
    this.Dependencies.push("UV");
    this.Dependencies.push("AD_UA");
    this.Dependencies.push("UA_PLF");
    this.Dependencies.push("PLF_UV");
    this.Dependencies.push("UV_IVCI");

    this._maternalPlacenta = new BloodCompliance(
      this._modelEngine,
      "PLM",
      "BloodCompliance"
    );

    this.SetMaternalPlacenta();

    this._gasExchangerPlacenta = new Diffusor(
      this._modelEngine,
      "GASEX_PL",
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
      { key: "CompBlood1", value: "PLF" },
      { key: "CompBlood2", value: "PLM" },
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

    console.log(this._gasExchangerPlacenta);
  }

  SetMaternalPlacenta() {
    // chatGPT output
    // This information can be found in various medical textbooks and research articles.
    // For example, a study published in the journal Placenta in 2017 reported that the mean placental volume of the
    // maternal side was 496 cc in 172 pregnancies studied.
    // Another study published in the same journal in 2013 reported that the
    // mean placental volume of the maternal side was 470 cc in 109 pregnancies studied.

    this._maternalPlacenta.InitModel([
      { key: "Description", value: "maternal placenta" },
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
  // override the base class CalcModel method
  CalcModel() {
    this.PlacentalGasExchange();
  }

  PlacentalGasExchange() {
    this._maternalPlacenta.To2 = 7.8;
    this._maternalPlacenta.Tco2 = 27.4;
  }
}
