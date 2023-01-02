/* eslint-disable */

// This is a dedicated web worker instance for the physiological model engine
// Web workers run in a separate thread for performance reasons and have no access to the DOM nor the window object
// The scope is defined by self and communication with the main thread by a message channel
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers#web_workers_api

// Communication with the script which spawned the web worker takes place through a com channel
// Messages are received in the onmessage event and are sent by the SendMessage function

// Explain message object :
/* {
  type:       <string> stating the type of message (set/get/cmd)
  message:    <string> stating the component of the model for which the message is intended (p.e. 'datalogger'/'interventions')
  payload:    <object> containing data to pass to the action
}
*/

// import all models present in the model_index module
import * as models from "./ModelIndex";

import AcidBase from "./core_models/AcidBase";
import Oxygenation from "./core_models/Oxygenation";
import DataCollector from "./helpers/DataCollector";
import Interface from "./helpers/Interface";

// store all imported models in a list to be able to instantiate them dynamically
const available_models = [];
Object.values(models).forEach((model) => available_models.push(model));

// declare a model object holding the current model
let model = {
  Models: {},
};

// declare a model data object
let modelData = {};

// declare the model initialization flag
let modelInitialized = false;

// set the realtime updateinterval
let rtInterval = 0.015;
let rtClock = null;

// setup the communication channel with the parent
// the onmessage function is an event handler handling messages posted to the model engine worker thread.
// e is a MessageEvent object wich contains a data field containing the message
onmessage = function (e) {
  switch (e.data.type) {
    // command types
    case "command":
      if (e.data.message == "init") {
        initModel(e.data.payload[0]);
        break;
      }
      if (e.data.message == "start") {
        start();
        break;
      }
      if (e.data.message == "stop") {
        stop();
        break;
      }
      if (e.data.message == "calculate") {
        calculate(e.data.payload[0]);
        break;
      }
      break;
    case "get":
      if (e.data.message == "state") {
        getModelState();
        break;
      }
      if (e.data.message == "data") {
        getModelData();
        break;
      }
      if (e.data.message == "prop") {
        getProperty(payload[0], payload[1]);
        break;
      }
      break;
    case "set":
      if ((e.data.message = "prop")) {
        setProperty(payload[0], payload[1], payload[2]);
        break;
      }
  }
};

const start = function () {
  // start the model in realtime
  if (modelInitialized) {
    // call the modelStep every rt_interval seconds
    rtClock = setInterval(modelStepRt, rtInterval * 1000.0);
    // send status update
    postMessage({
      type: "status",
      message: `realtime model started.`,
      payload: [],
    });
  } else {
    postMessage({
      type: "status",
      message: `model not initialized.`,
      payload: [],
    });
  }
};

const stop = function () {
  // stop the realtime model
  if (modelInitialized) {
    clearInterval(rtClock);
    rtClock = null;
    postMessage({
      type: "status",
      message: `realtime model stopped.`,
      payload: [],
    });
  }
};

const calculate = function (timeToCalculate = 10.0) {
  // calculate a number of seconds of the model
  if (modelInitialized) {
    let noOfSteps = timeToCalculate / model.ModelingStepsize;
    postMessage({
      type: "status",
      message: `calculating ${timeToCalculate} sec. in ${noOfSteps} steps.`,
      payload: [],
    });
    const start = performance.now();
    for (let i = 0; i < noOfSteps; i++) {
      modelStep();
    }
    const end = performance.now();
    const step_time = (end - start) / noOfSteps;
    postMessage({
      type: "status",
      message: `calculation ready (execution time: ${(end - start).toFixed(
        1
      )} ms, model step: ${step_time.toFixed(4)} ms)`,
      payload: [],
    });
    // get the model data from the engine
    getModelData();
  } else {
    postMessage({
      type: "status",
      message: `model not initialized.`,
      payload: [],
    });
  }
};

const setProperty = function (m, p, v) {
  let current_value = model.Models[m][p];
  if (current_value) {
    model.Models[m][p] = v;
  } else {
    postMessage({
      type: "error",
      message: m + "." + p + " not found!",
      payload: [],
    });
  }
};

const getProperty = function (m, p) {
  let value = model.Models[m][p];
  if (value) {
    postMessage({
      type: "state",
      message: "",
      payload: [{ model: m, prop: p, value: value }],
    });
  } else {
    postMessage({
      type: "error",
      message: m + "." + p + " not found!",
      payload: [],
    });
  }
};

const getModelState = function () {
  postMessage({
    type: "state",
    message: "",
    payload: [model],
  });
};

const getModelData = function () {
  postMessage({
    type: "data",
    message: "",
    payload: [modelData],
  });
};

const initModel = function (modelDefinition) {
  // reset error flag
  let error = false;

  // clear current model object
  model = {
    Models: {},
  };

  // clear model initialized flag
  modelInitialized = false;

  // try to process the modelDefinition object
  try {
    // initialize the model parameters, except the model components key which needs special processing
    for (const [key, value] of Object.entries(modelDefinition)) {
      if (key !== "Models") {
        // copy model parameter to the model object
        model[key] = value;
      }
    }
    // add a datacollector instance to the model object
    model["DataCollector"] = new DataCollector(model);

    // initialize all model components
    Object.values(modelDefinition.Models).forEach((component) => {
      // check if the model is available in the available model list
      let index = available_models.findIndex(
        (model) => model.name === component.ModelType
      );

      // if the component model was found then instantiate a model
      if (index > -1) {
        // copy the properties of the modeldefinition file to an args object
        let args = [];
        for (const [key, value] of Object.entries(component)) {
          args.push({ key, value });
        }
        // instantiate the new component with the args array and a reference to the model object
        let newComponent = new available_models[index](args, model);

        // add the new component to the model object
        model.Models[component.Name] = newComponent;
      } else {
        // process any errors
        error = true;
        postMessage({
          type: "error",
          message: component.ModelType + " model not found",
          payload: [],
        });
      }
    });

    if (!error) {
      // if no error signal the parent that everything went ok
      modelInitialized = true;
      postMessage({
        type: "status",
        message: "Model engine initialized",
        payload: [model],
      });
    }
  } catch (e) {
    // if error signal the parent that there was an error
    modelInitialized = false;
    postMessage({
      type: "error",
      message: "Invalid model definition",
      payload: [e],
    });
  }
};

const modelStep = function () {};

const modelStepRt = function () {
  // so the rt_interval determines how often the model is calculated
  const noOfSteps = rtInterval / model.ModelingStepsize;
  for (let i = 0; i < noOfSteps; i++) {
    modelStep();
  }
  // get model data
  getModelData();
};
