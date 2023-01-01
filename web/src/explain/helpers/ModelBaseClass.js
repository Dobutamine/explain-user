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

  constructor(args, model_ref) {
    // store a reference to the model object
    this._model = model_ref;

    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });
  }
}
