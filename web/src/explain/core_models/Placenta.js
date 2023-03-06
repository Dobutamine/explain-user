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

    this._fetalPlacenta = new BloodCompliance(
      this._modelEngine,
      "FetalPlacenta",
      "BloodCompliance"
    );

    this.SetFetalPlacenta();

    this._maternalPlacenta = new BloodCompliance(
      this._modelEngine,
      "MaternalPlacenta",
      "BloodCompliance"
    );

    this.SetMaternalPlacenta();

    this._umbilicalVein = new BloodCompliance(
      this._modelEngine,
      "UmbilicalVein",
      "BloodCompliance"
    );

    this._gasExchangerPlacenta = new Diffusor(
      this._modelEngine,
      "GasExchangerPlacenta",
      "Diffusor"
    );

    this.SetGasExchangerPlacenta();

    // initialize the connectors
    this._uVIn = new BloodResistor(
      this._modelEngine,
      "UmbilicalVeinIn",
      "BloodResistor"
    );
    this._uVOut = new BloodResistor(
      this._modelEngine,
      "UmbilicalVeinOut",
      "BloodResistor"
    );

    this.SetUmbilicalVein();
    this.SetUmbilicalVeinResistors();

    this._umbilicalArteries = new BloodCompliance(
      this._modelEngine,
      "UmbilicalArteries",
      "BloodCompliance"
    );

    this._uAIn = new BloodResistor(
      this._modelEngine,
      "UmbilicalArteriesIn",
      "BloodResistor"
    );
    this._uAOut = new BloodResistor(
      this._modelEngine,
      "UmbilicalArteriesOut",
      "BloodResistor"
    );

    this.SetUmbilicalArteries();
    this.SetUmbilicalArteriesResistors();

    // // set the flag to model is initialized
    this._is_initialized = true;
  }

  SetGasExchangerPlacenta() {
    this._gasExchangerPlacenta.InitModel([
      { key: "Description", value: "gas exchanger placenta" },
      { key: "IsEnabled", value: this.IsEnabled },
      { key: "CompBlood1", value: "FetalPlacenta" },
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
  SetFetalPlacenta() {
    this._fetalPlacenta.InitModel([
      { key: "Description", value: "fetal placenta" },
      { key: "IsEnabled", value: this.IsEnabled },
      { key: "Vol", value: 0.08 },
      { key: "UVol", value: 0.08 },
      { key: "ElBase", value: 5000 },
      { key: "ElK", value: 0 },
    ]);

    this._modelEngine.Models["Blood"].SetSolutesOnModel(this._fetalPlacenta);

    if (this._modelEngine.Models[this._fetalPlacenta.Name]) {
      this._fetalPlacenta = this._modelEngine.Models[this._fetalPlacenta.Name];
    } else {
      this._modelEngine.Models[this._fetalPlacenta.Name] = this._fetalPlacenta;
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
  SetUmbilicalVein() {
    // 80-100 ml/kg volume

    this._umbilicalVein.InitModel([
      { key: "Description", value: "umbilical veins" },
      { key: "Vol", value: 0.275 },
      { key: "UVol", value: 0.275 },
      { key: "ElBase", value: 5000 },
      { key: "ElK", value: 0 },
      { key: "IsEnabled", value: this.IsEnabled },
    ]);

    this._modelEngine.Models["Blood"].SetSolutesOnModel(this._umbilicalVein);

    if (this._modelEngine.Models[this._umbilicalVein.Name]) {
      this._umbilicalVein = this._modelEngine.Models[this._umbilicalVein.Name];
    } else {
      this._modelEngine.Models[this._umbilicalVein.Name] = this._umbilicalVein;
    }
  }

  SetUmbilicalVeinResistors() {
    // resistors of the umbilical veins
    this._uVIn.InitModel([
      { key: "Description", value: "umbilical vein resistors in" },
      { key: "IsEnabled", value: this.IsEnabled },
      { key: "CompFrom", value: "FetalPlacenta" },
      { key: "CompTo", value: "UmbilicalVein" },
      { key: "RFor", value: 15000 },
      { key: "RBack", value: 15000 },
      { key: "Rk", value: 0.0 },
      { key: "NoFlow", value: true },
      { key: "NoBackFlow", value: false },
    ]);

    if (this._modelEngine.Models[this._uVIn.Name]) {
      this._uVIn = this._modelEngine.Models[this._uVIn.Name];
    } else {
      this._modelEngine.Models[this._uVIn.Name] = this._uVIn;
    }

    this._uVOut.InitModel([
      { key: "Description", value: "umbilical vein resistors out" },
      { key: "IsEnabled", value: this.IsEnabled },
      { key: "CompFrom", value: "UmbilicalVein" },
      { key: "CompTo", value: "IVCI" },
      { key: "RFor", value: 15000 },
      { key: "RBack", value: 15000 },
      { key: "Rk", value: 0.0 },
      { key: "NoFlow", value: true },
      { key: "NoBackFlow", value: false },
    ]);

    if (this._modelEngine.Models[this._uVOut.Name]) {
      this._uVOut = this._modelEngine.Models[this._uVOut.Name];
    } else {
      this._modelEngine.Models[this._uVOut.Name] = this._uVOut;
    }
  }
  SetUmbilicalArteries() {
    // 50 - 80 ml/kg
    this._umbilicalArteries.InitModel([
      { key: "Description", value: "umbilical arteries" },
      { key: "Vol", value: 0.175 },
      { key: "UVol", value: 0.175 },
      { key: "ElBase", value: 20000 },
      { key: "ElK", value: 0 },
      { key: "IsEnabled", value: this.IsEnabled },
    ]);

    this._modelEngine.Models["Blood"].SetSolutesOnModel(
      this._umbilicalArteries
    );

    if (this._modelEngine.Models[this._umbilicalArteries.Name]) {
      this._umbilicalArteries =
        this._modelEngine.Models[this._umbilicalArteries.Name];
    } else {
      this._modelEngine.Models[this._umbilicalArteries.Name] =
        this._umbilicalArteries;
    }
  }
  SetUmbilicalArteriesResistors() {
    // resistors of the umbilical veins
    this._uAIn.InitModel([
      { key: "Description", value: "umbilical arteries resistors in" },
      { key: "IsEnabled", value: this.IsEnabled },
      { key: "CompFrom", value: "AD" },
      { key: "CompTo", value: "UmbilicalArteries" },
      { key: "RFor", value: 15000 },
      { key: "RBack", value: 15000 },
      { key: "Rk", value: 0.0 },
      { key: "NoFlow", value: true },
      { key: "NoBackFlow", value: false },
    ]);

    if (this._modelEngine.Models[this._uAIn.Name]) {
      this._uAIn = this._modelEngine.Models[this._uAIn.Name];
    } else {
      this._modelEngine.Models[this._uAIn.Name] = this._uAIn;
    }

    // resistors of the umbilical veins
    this._uAOut.InitModel([
      { key: "Description", value: "umbilical arteries resistors out" },
      { key: "IsEnabled", value: this.IsEnabled },
      { key: "CompFrom", value: "UmbilicalArteries" },
      { key: "CompTo", value: "FetalPlacenta" },
      { key: "RFor", value: 15000 },
      { key: "RBack", value: 15000 },
      { key: "Rk", value: 0.0 },
      { key: "NoFlow", value: true },
      { key: "NoBackFlow", value: false },
    ]);

    if (this._modelEngine.Models[this._uAOut.Name]) {
      this._uAOut = this._modelEngine.Models[this._uAOut.Name];
    } else {
      this._modelEngine.Models[this._uAOut.Name] = this._uAOut;
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
