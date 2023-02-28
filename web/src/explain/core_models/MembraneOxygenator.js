import ModelBaseClass from "../helpers/ModelBaseClass";

export class MembraneOxygenator extends ModelBaseClass {
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
