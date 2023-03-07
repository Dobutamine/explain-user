export default class Model {
  // declare an object holding the worker thread which does the heavy llifting
  modelEngine = {};

  // declare an object holding the model definition as loaded from the server
  modelDefinition = {};

  // declare an object holding the model data coming from the engine (high and low resolution data)
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
      type: "add_task",
      message: "",
      payload: [JSON.stringify(new_task)],
    });
  }

  addScriptToTaskScheduler(new_script) {
    new_script.forEach((task) => {
      this.addToTaskScheduler(task);
    });
  }

  call(model, method, args = []) {
    this.sendMessage({
      type: "call",
      message: "",
      payload: [model, method, args],
    });
  }
  start() {
    // start realtime model
    this.sendMessage({
      type: "start",
      message: "",
      payload: [],
    });
  }

  stop() {
    // stop the realtime model
    this.sendMessage({
      type: "stop",
      message: "",
      payload: [],
    });
  }

  calculate(time_to_calculate) {
    this.sendMessage({
      type: "calculate",
      message: "",
      payload: [time_to_calculate],
    });
  }

  watchModelProperties(propsArray) {
    this.sendMessage({
      type: "watch_props",
      message: "",
      payload: propsArray,
    });
  }

  watchModelProperty(model, prim_prop, sec_prop) {
    this.sendMessage({
      type: "watch",
      message: "",
      payload: [model, prim_prop, sec_prop],
    });
  }

  watchModelPropertiesSlow(propsArray) {
    this.sendMessage({
      type: "watch_props_slow",
      message: "",
      payload: propsArray,
    });
  }

  unwatchModelProperty(model, prim_prop, sec_prop) {
    this.sendMessage({
      type: "unwatch",
      message: "",
      payload: [model, prim_prop, sec_prop],
    });
  }

  rewireResistor(newProperties) {
    this.sendMessage({
      type: "rewire",
      message: "resistor",
      payload: newProperties,
    });
  }

  setModelProperties(newProperties) {
    // newProperties is an array of ojects containing the new settings with form {m: model, p: prop, v: value, at: time, it: time}
    this.sendMessage({
      type: "set_prop",
      message: "",
      payload: newProperties,
    });
  }

  getModelState() {
    this.sendMessage({
      type: "get_state",
      message: "",
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
      type: "get_data",
      message: "",
      payload: [],
    });
  }

  enable(model) {
    this.sendMessage({
      type: "enable",
      message: "",
      payload: [model],
    });
  }

  disable(model) {
    this.sendMessage({
      type: "disable",
      message: "",
      payload: [model],
    });
  }

  initModelEngine(engine_definition) {
    this.sendMessage({
      type: "init_engine",
      message: "",
      payload: [JSON.stringify(engine_definition)],
    });
  }

  injectModelDefinition(explain_definition) {
    // build explain_definition object
    this.sendMessage({
      type: "load_definition",
      message: "",
      payload: [JSON.stringify(explain_definition)],
    });
  }

  setUpComChannel() {
    if (this.modelEngine) {
      this.modelEngine.onmessage = (e) => {
        switch (e.data.type) {
          case "status":
            if (e.data.message.includes("dependency error")) {
              this.statusMessage =
                "dependency error: (" + e.data.payload.toString() + ")";
            } else {
              this.statusMessage = e.data.message;
            }

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
