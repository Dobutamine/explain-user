export default class ModelBaseClass {
  // common class parameters
  Name = "";
  Description = "";
  ModelType = "";
  IsEnabled = false;
  Description = "";

  // common local parameters
  _modelEngine = {};
  _t = 0.0005;
  _is_initialized = false;

  constructor(args) {
    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });
  }

  // model initializer
  InitModel(model_ref, args) {
    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });

    // store a reference to the model object
    this._modelEngine = model_ref;

    // set the flag to model is initialized
    this._is_initialized = true;
  }

  // model step
  StepModel() {
    if (this.IsEnabled && this._is_initialized) {
      this.CalcModel();
    }
  }

  // calculate step
  CalcModel() {}
}
