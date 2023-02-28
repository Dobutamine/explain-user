import ModelBaseClass from "../helpers/ModelBaseClass";

export class MembraneOxygenator extends ModelBaseClass {
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

  // local parameters
  _temp_max_pres = -1000.0;
  _temp_min_pres = 1000.0;
  _temp_max_vol = -1000.0;
  _temp_min_vol = 1000.0;
  _update_counter = 0.0;
  _update_interval = 1.0;

  InitModel(args) {
    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });

    // set the flag to model is initialized
    this._is_initialized = true;
  }

  CalcModel() {}
}
