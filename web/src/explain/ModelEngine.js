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

import DataCollector from "./helpers/DataCollector";
import TaskScheduler from "./helpers/TaskScheduler";

// store all imported models in a list to be able to instantiate them dynamically
const available_models = [];
Object.values(models).forEach((model) => available_models.push(model));

// declare a model object holding the current model
let model = {
  Models: {},
};

// declare a model engine object holding the engine properties
let modelEngine = {};

// declare a model definition object holding the properties of the current model
let modelDefinition = {};

// declare a model data object holding the high resolution model data
let modelData = {};

// declare a model data object holding the low resolution model data
let modelDataSlow = {};

// declare the model initialization flag
let modelInitialized = false;

// set the realtime updateinterval
let rtInterval = 0.015;
let rtSlowInterval = 1.0;
let rtSlowCounter = 0.0;
let rtClock = null;

// setup the communication channel with the parent
// the onmessage function is an event handler handling messages posted to the model engine worker thread.
// e is a MessageEvent object wich contains a data field containing the message
onmessage = function (e) {
  switch (e.data.type) {
    // command types
    case "command":
      if (e.data.message == "add_task") {
        addTaskToScheduler(JSON.parse(e.data.payload[0]));
        break;
      }
      if (e.data.message == "init_engine") {
        initEngine(JSON.parse(e.data.payload[0]));
        break;
      }
      if (e.data.message == "load_definition") {
        initModel(JSON.parse(e.data.payload[0]));
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
      if (e.data.message == "watch") {
        let prop = {
          label: e.data.payload[0] + "." + e.data.payload[1],
          model: model.Models[e.data.payload[0]],
          prop: e.data.payload[1],
        };
        model.DataCollector.add_to_watchlist(prop);

        break;
      }
      if (e.data.message == "watch_props") {
        e.data.payload.forEach((prop) => {
          let propsSplit = prop.split(".");
          let secProp = "";
          if (propsSplit.length == 3) {
            secProp = propsSplit[2];
          }
          let processedProp = {
            label: prop,
            model: model.Models[propsSplit[0]],
            prop: propsSplit[1],
            secProp: secProp,
          };
          try {
            model.DataCollector.add_to_watchlist(processedProp);
          } catch {}
        });

        break;
      }
      if (e.data.message == "watch_props_slow") {
        e.data.payload.forEach((prop) => {
          let propsSplit = prop.split(".");
          let secProp = "";
          if (propsSplit.length == 3) {
            secProp = propsSplit[2];
          }
          let processedProp = {
            label: prop,
            model: model.Models[propsSplit[0]],
            prop: propsSplit[1],
            secProp: secProp,
          };
          try {
            model.DataCollector.add_to_watchlist_slow(processedProp);
          } catch {}
        });

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
        getProperty(e.data.payload[0], e.data.payload[1]);
        break;
      }
      break;
    case "set":
      if ((e.data.message = "prop")) {
        setProperties(e.data.payload);
        break;
      }
  }
};

const addTaskToScheduler = function (new_task) {
  model.TaskScheduler.AddTask(new_task);
};

const initEngine = function (engine_definition) {
  modelEngine = engine_definition;
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
    getModelDataSlow();
  } else {
    postMessage({
      type: "status",
      message: `model not initialized.`,
      payload: [],
    });
  }
};

const setProperties = function (payload) {
  // process the new model properties list
  payload.forEach((newProp) => {
    // hand the property change to the task scheduler
    if (newProp.at === 0 && newProp.it === 0) {
      model.Models[newProp.m][newProp.p] = newProp.v;
    } else {
      model["TaskScheduler"].PropChange(newProp);
    }
  });
  postMessage({
    type: "status",
    message: `properties updated.`,
    payload: [],
  });
  // refresh the model state on the model instance
  getModelState();
};

const getProperty = function (m, p) {
  let value = model.Models[m][p];
  if (value) {
    postMessage({
      type: "state",
      message: "",
      payload: [{ model: m, prop: p, value: value }],
    });
  }
};

const getModelState = function () {
  // refresh the model state on the model instance
  postMessage({
    type: "state",
    message: "",
    payload: [model],
  });
};

const getModelDataRt = function () {
  // refresh the model data on the model instance
  modelData = model.DataCollector.get_model_data();

  // send data to the ui
  postMessage({
    type: "rt",
    message: "",
    payload: [modelData],
  });
};

const getModelDataRtSlow = function () {
  // refresh the model data on the model instance
  modelDataSlow = model.DataCollector.get_model_data_slow();

  // send data to the ui
  postMessage({
    type: "rt",
    message: "",
    payload: [modelDataSlow],
  });
};

const getModelData = function () {
  // refresh the model data on the model instance
  modelData = model.DataCollector.get_model_data();

  // send data to the ui
  postMessage({
    type: "data",
    message: "",
    payload: [modelData],
  });
};

const getModelDataSlow = function () {
  // refresh the model data on the model instance
  modelDataSlow = model.DataCollector.get_model_data_slow();

  // send data to the ui
  postMessage({
    type: "data_slow",
    message: "",
    payload: [modelDataSlow],
  });
};

const initModel = function (model_definition) {
  // store the model definition
  modelDefinition = model_definition;

  // reset error flag
  let error = false;

  // clear current model object
  model = {
    Models: {},
  };

  // clear model data
  modelData = {};
  modelDataSlow = {};

  // set the modeling stepsize
  model["ModelingStepsize"] = modelEngine.modeling_stepsize;

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
    // initialize all model components
    Object.values(modelDefinition.Models).forEach((component) => {
      // check whether the model is in the model engine list
      if (Object.keys(modelEngine.core_models).includes(component.ModelType)) {
        // check if the model is available in the available model list
        let index = available_models.findIndex(
          (model) => model.name === component.ModelType
        );

        // if the component model was found then instantiate a model
        if (index > -1) {
          // instantiate the new component and give it a name, pass the model type and a reference to the whole model
          let newComponent = new available_models[index](
            model,
            component.Name,
            component.ModelType
          );
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
      }
    });

    if (!error) {
      // now initialize all the models with the correct properties stored in the model definition
      Object.values(model.Models).forEach((model_comp) => {
        // // find the arguments for the model in the model definition
        let args = [];
        for (const [key, value] of Object.entries(
          modelDefinition.Models[model_comp.Name]
        )) {
          args.push({ key, value });
        }
        // set the arguments
        try {
          model_comp.InitModel(args);
        } catch (e) {
          console.log(`Error initializing model ${model_comp.Name}`);
          console.log(e);
          postMessage({
            type: "status",
            message: "Model initialization error!",
            payload: [e],
          });
        }
      });

      // add a datacollector instance to the model object
      model["DataCollector"] = new DataCollector(model);

      // add a task scheduler instance to the model object
      model["TaskScheduler"] = new TaskScheduler(model);

      // if no error signal the parent that everything went ok
      modelInitialized = true;

      // update the status
      postMessage({
        type: "status",
        message: "Model engine initialized!",
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

const modelStep = function () {
  // iterate over all models
  Object.values(model.Models).forEach((model_component) => {
    model_component.StepModel();
  });

  // update the data collector
  model["DataCollector"].collect_data(model.ModelTimeTotal);

  // update the Task Scheduler
  model["TaskScheduler"].update(model.ModelTimeTotal);

  // increase the model time
  model.ModelTimeTotal += model.ModelingStepsize;
};

const modelStepRt = function () {
  // so the rt_interval determines how often the model is calculated
  const noOfSteps = rtInterval / model.ModelingStepsize;
  for (let i = 0; i < noOfSteps; i++) {
    modelStep();
  }
  // get model data
  getModelDataRt();

  // get slow model data
  if (rtSlowCounter > rtSlowInterval) {
    rtSlowCounter = 0;
    getModelDataSlow();
  }
  rtSlowCounter += rtInterval;
};
