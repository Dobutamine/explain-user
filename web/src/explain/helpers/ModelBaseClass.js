export default class ModelBaseClass {
  // Name of model by which the model is identified (must be unique)
  Name = "";

  // Name of the type of the model
  ModelType = "";

  // Optional description of the model
  Description = "";

  // Switch to enable or disable the model
  IsEnabled = false;

  // Array holding the names of the models on which this model depends
  Dependencies = [];

  // reference the model engine object
  _modelEngine = {};

  // store the modeling stepsize for easy referencing
  _t = 0.0005;

  // flag whether or not this model is correctly initialized
  _is_initialized = false;

  // the constructor builds a bare bone modelobject of the correct type and with the correct name and stores a reference to the modelengine object
  constructor(model_ref, name = "", type = "") {
    // name of the model
    this.Name = name;
    // model type
    this.ModelType = type;
    // reference to the model engine
    this._modelEngine = model_ref;
  }

  // model initializer with an argument list containing the model parameters in a list of objects with a structur of { key: "", value: ""}
  // override this method if you want a custom initializer for your model but always do the steps in this method.
  InitModel(args) {
    // process the parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });

    // set the modeling step size
    this._t = this._modelEngine.ModelingStepsize;

    // set the flag to model is initialized
    this._is_initialized = true;
  }

  // this method is called by the model engine during the execution of a model step
  StepModel() {
    if (this.IsEnabled && this._is_initialized) {
      this.CalcModel();
    }
  }

  // this method contains the actual calculations of this model and should almost always be overriden by the child
  CalcModel() {}

  // this method enables the model. It can be overriden if the model contains submodels which should be enabled
  Enable() {
    this.IsEnabled = true;
  }

  // this method disables the model. It can be overriden if the model contains submodels which should be disabled
  Disable() {
    this.IsEnabled = false;
  }
}
