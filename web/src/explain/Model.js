export default class Model {
  // declare an object holding the worker thread
  modelEngine = {};

  // declare an object holding the model definition
  modelDefinition = {};

  // declare an object holding the model data coming from the engine
  modelData = [];

  // declare an object holding the model components coming from the engine
  modelState = [];

  // declare an object holding the model realtime data coming from the engine
  modelDataRT = [];

  // declare the events
  rt_event = new CustomEvent("rt");
  data_event = new CustomEvent("data");
  state_event = new CustomEvent("state");
  status_event = new CustomEvent("status");
  error_event = new CustomEvent("error");

  // declare an object holding the status log
  statusMessage = "";
  statusLog = [];
  maxStatusLog = 10;

  // decalre an object holding the error log
  errorMessage = "";
  errorLog = [];
  maxErrorLog = 10;

  constructor(explain_definition = "normal_neonate.json") {
    // spin up a model engine
    this.modelEngine = new Worker(new URL("./ModelEngine.js", import.meta.url));

    // setup a communication channel with the model engine
    this.setUpComChannel();

    // inject the explain definition into the model engine
    this.injectModelDefinition(explain_definition);
  }

  start() {
    // start realtime model
    this.sendMessage({
      type: "command",
      message: "start",
      payload: [],
    });
  }

  stop() {
    // stop the realtime model
    this.sendMessage({
      type: "command",
      message: "stop",
      payload: [],
    });
  }

  calculate(time_to_calculate) {
    this.sendMessage({
      type: "command",
      message: "calculate",
      payload: [time_to_calculate],
    });
  }

  watchModelProperty(model, prim_prop, sec_prop) {
    this.sendMessage({
      type: "command",
      message: "watch",
      payload: [model, prim_prop, sec_prop],
    });
  }

  unwatchModelProperty(model, prim_prop, sec_prop) {
    this.sendMessage({
      type: "command",
      message: "unwatch",
      payload: [model, prim_prop, sec_prop],
    });
  }

  setModelProperties(newProperties) {
    // newProperties is an array of ojects containing the new settings with form {m: model, p: prop, v: value, at: time, it: time}
    this.sendMessage({
      type: "set",
      message: "prop",
      payload: newProperties,
    });
  }

  getModelState() {
    this.sendMessage({
      type: "get",
      message: "state",
      payload: [],
    });
  }

  deactivateModelComponent(model) {
    this.sendMessage({
      type: "deactivate",
      message: "",
      payload: [model],
    });
  }

  deleteModelComponent(model) {
    this.sendMessage({
      type: "del",
      message: "",
      payload: [model],
    });
  }

  getModelData() {
    this.sendMessage({
      type: "get",
      message: "data",
      payload: [],
    });
  }

  injectModelDefinition(explain_definition) {
    // load model definition file
    fetch(explain_definition).then((response) =>
      response.json().then((data) => {
        this.sendMessage({
          type: "command",
          message: "init",
          payload: [data],
        });
      })
    );
  }

  setUpComChannel() {
    if (this.modelEngine) {
      this.modelEngine.onmessage = (e) => {
        switch (e.data.type) {
          case "status":
            this.statusMessage = e.data.message;
            this.statusLog.push(e.data.message);
            if (this.statusLog.length > this.maxStatusLog) {
              this.statusLog.shift();
            }
            // raise a status event
            document.dispatchEvent(this.status_event);
            break;
          case "error":
            this.errorMessage = e.data.message;
            this.errorLog.push(e.data.message);
            if (this.errorLog.length > this.maxErrorLog) {
              this.errorLog.shift();
            }
            // raise error event
            document.dispatchEvent(this.error_event);
            break;
          case "data":
            this.modelData = e.data.payload[0];
            // raise data ready event
            document.dispatchEvent(this.data_event);
            break;
          case "state":
            this.modelState = e.data.payload[0];
            document.dispatchEvent(this.state_event);
            break;
          case "rt":
            this.modelData = e.data.payload;
            document.dispatchEvent(this.rt_event);
            break;
        }
      };
    }
  }

  sendMessage(message) {
    if (this.modelEngine) {
      this.modelEngine.postMessage(message);
    }
  }
}
