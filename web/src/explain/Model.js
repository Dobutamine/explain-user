export default class Model {
  // declare an object holding the worker thread
  modelEngine = {};

  // declare an object holding the model definition
  modelDefinition = {};

  // declare an object holding the model data coming from the engine
  modelData = [];
  modelDataSlow = [];

  // declare an object holding the model components coming from the engine
  modelState = [];

  // declare an object holding the model realtime data coming from the engine
  modelDataRT = [];

  // declare the events
  rt_event = new CustomEvent("rt");
  data_event = new CustomEvent("data");
  data_slow_event = new CustomEvent("data_slow");
  state_event = new CustomEvent("state");
  status_event = new CustomEvent("status");
  error_event = new CustomEvent("error");
  script_event = new CustomEvent("script");

  // declare an object holding the status log
  statusMessage = "";
  statusLog = [];
  maxStatusLog = 10;

  // decalre an object holding the error log
  errorMessage = "";
  errorLog = [];
  maxErrorLog = 10;

  // declare a object holding the finished scripts ids
  finishedScripts = [];

  constructor() {
    // spin up a model engine
    this.modelEngine = new Worker(new URL("./ModelEngine.js", import.meta.url));

    // setup a communication channel with the model engine
    this.setUpComChannel();
  }

  addToTaskScheduler(new_task) {
    this.sendMessage({
      type: "command",
      message: "add_task",
      payload: [JSON.stringify(new_task)],
    });
  }
  addScriptToTaskScheduler(new_script) {
    new_script.forEach((task) => {
      this.addToTaskScheduler(task);
    });
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

  watchModelProperties(propsArray) {
    this.sendMessage({
      type: "command",
      message: "watch_props",
      payload: propsArray,
    });
  }
  watchModelPropertiesSlow(propsArray) {
    this.sendMessage({
      type: "command",
      message: "watch_props_slow",
      payload: propsArray,
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
  initModelEngine(engine_definition) {
    this.sendMessage({
      type: "command",
      message: "init_engine",
      payload: [JSON.stringify(engine_definition)],
    });
  }

  injectModelDefinition(explain_definition) {
    // build explain_definition object
    this.sendMessage({
      type: "command",
      message: "load_definition",
      payload: [JSON.stringify(explain_definition)],
    });
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
          case "data_slow":
            this.modelDataSlow = e.data.payload[0];
            // raise data ready event
            document.dispatchEvent(this.data_slow_event);
            break;
          case "state":
            this.modelState = e.data.payload[0];
            document.dispatchEvent(this.state_event);
            break;
          case "rt":
            this.modelData = e.data.payload[0];
            document.dispatchEvent(this.rt_event);
            break;
          case "script":
            this.finishedScripts.push(e.data.payload[0]);
            document.dispatchEvent(this.script_event);
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
