import ModelBaseClass from "../helpers/ModelBaseClass";

import { BloodCompliance } from "./BloodCompliance";
import { Diffusor } from "./Diffusor";

export class Placenta extends ModelBaseClass {
  MaternalTo2 = 7.8;
  MaternalTco2 = 27.4;
  DifO2 = 0.01;
  DifCo2 = 0.01;
  Resistance = 250;
  Elastance = 5000;

  // flow
  UaFlow = 0.0;
  UaInFlow = 0.0;
  UaVelocity = 0.0;
  UaDiameter = 3.0;

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
    this._modelEngine.DataCollector.add_to_watchlist("Placenta.UaFlow");
    this._modelEngine.DataCollector.add_to_watchlist("Placenta.UaVelocity");
    this._modelEngine.DataCollector.add_to_watchlist("Placenta.UaInFlow");
    this._modelEngine.DataCollector.add_to_watchlist("Placenta.UaVelocity10");
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
    this._modelEngine.DataCollector.add_to_watchlist("Placenta.UaFlow");
    this._modelEngine.DataCollector.add_to_watchlist("Placenta.UaInFlow");
    this._modelEngine.DataCollector.add_to_watchlist("Placenta.UaVelocity");
    this._modelEngine.DataCollector.add_to_watchlist("Placenta.UaVelocity10");
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
    // set the resistance of the placenta
    this._modelEngine.Models["UA_PLF"].RFor = this.Resistance;
    this._modelEngine.Models["UA_PLF"].RBack = this.Resistance;
    this._modelEngine.Models["PLF_UV"].RFor = this.Resistance;
    this._modelEngine.Models["PLF_UV"].RBack = this.Resistance;
    this._modelEngine.Models["PLF"].ElBase = this.Elastance;

    // get the umbilical artery flow
    this.UaFlow = this._modelEngine.Models["AD_UA"].Flow;
    this.UaInFlow = this._modelEngine.Models["AD_UA"].FlowForwardSec;

    // calculate the radius in meters
    let radius_meters = this.UaDiameter / 2 / 1000.0;

    // calculate the umbilical artery flow velocity
    this.UaVelocity =
      this.UaFlow / 1000.0 / (Math.PI * Math.pow(radius_meters, 2.0));

    // set the maternal placenta o2 and co2 concentrations
    this._maternalPlacenta.To2 = this.MaternalTo2;
    this._maternalPlacenta.Tco2 = this.MaternalTco2;
  }
}
