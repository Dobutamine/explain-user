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
  ExecutionList: {},
  DependencyList: [],
};

// flag to rebuild the execution list
let rebuildExecutionList = true;

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
    case "add_task":
      addTaskToScheduler(JSON.parse(e.data.payload[0]));
      break;

    case "init_engine":
      initEngine(JSON.parse(e.data.payload[0]));
      break;

    case "load_definition":
      initModel(JSON.parse(e.data.payload[0]));
      break;

    case "start":
      start();
      break;

    case "stop":
      stop();
      break;

    case "calculate":
      calculate(e.data.payload[0]);
      break;

    case "watch":
      let prop = {
        label: e.data.payload[0] + "." + e.data.payload[1],
        model: model.Models[e.data.payload[0]],
        prop: e.data.payload[1],
      };
      model.DataCollector.add_to_watchlist(prop);
      break;

    case "watch_props":
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

    case "watch_props_slow":
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

    case "get_data":
      getModelData();
      break;

    case "get_state":
      getModelState();
      break;

    case "get_prop":
      getProperty(e.data.payload[0], e.data.payload[1]);
      break;

    case "set_prop":
      setProperties(e.data.payload);
      break;

    case "rewire":
      if (e.data.message == "resistor") {
        rewireResistor(e.data.payload);
      }
      break;

    case "enable":
      let m_enabled = e.data.payload[0];
      model.Models[m_enabled].Enable();
      rebuildExecutionList = true;
      console.log("enabled model ", m_enabled);
      break;

    case "disable":
      let m_disabled = e.data.payload[0];
      model.Models[m_disabled].Disable();
      rebuildExecutionList = true;
      console.log("disabled model ", m_disabled);
      break;

    case "call":
      let model_call = e.data.payload[0];
      let method_call = e.data.payload[1];
      let args = e.data.payload[2];
      model.Models[model_call][method_call](args);
      console.log(
        `called method ${method_call} on model ${model_call} with args ${args}`
      );
      break;
  }
};

// add a new task to the task scheduler
const addTaskToScheduler = function (new_task) {
  // flag that the execution list needs to be rebuils
  rebuildExecutionList = true;

  model.TaskScheduler.AddTask(new_task);
};

// initialize the model engine with the loaded engine definition
const initEngine = function (engine_definition) {
  modelEngine = engine_definition;
};

// start the realtime model
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

// stop the realtime model
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

// calculate a certain amount of time of the model
const calculate = function (timeToCalculate = 10.0) {
  // check whether the execution list needs to be rebuild
  let exec_check = false;

  // build the execution list
  exec_check = prepareForExecution();

  // if the dependency or execution list composition check fails return and don't execute the model run
  if (!exec_check) {
    return;
  }

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

// rewire a blood or gasresistor
const rewireResistor = function (payload) {
  payload.forEach((data) => {
    if (data.m.includes(".")) {
      let [m, p] = data.m.split(".");
      if (data.p === "CompFrom") {
        model.Models[m][p].CompFrom = data.v;
        model.Models[m][p]._comp_from = model.Models[data.v];
      }
      if (data.p === "CompTo") {
        model.Models[m][p].CompTo = data.v;
        model.Models[m][p]._comp_to = model.Models[data.v];
      }
      if (data.p === "CompBlood") {
        model.Models[m][p].CompBlood = data.v;
      }
      if (data.p === "CompGas") {
        model.Models[m][p].CompGas = data.v;
      }
    } else {
      if (data.p === "CompFrom") {
        model.Models[data.m][data.p] = data.v;
        model.Models[data.m]._comp_from = model.Models[data.v];
      }
      if (data.p === "CompTo") {
        model.Models[data.m][data.p] = data.v;
        model.Models[data.m]._comp_to = model.Models[data.v];
      }
      if (data.p === "CompBlood") {
        model.Models[data.m][data.p] = data.v;
      }
      if (data.p === "CompGas") {
        model.Models[data.m][data.p] = data.v;
      }
    }
  });
};

// set multiple model properties
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
  // flag that the execution list needs to be rebuild
  rebuildExecutionList = true;

  // refresh the model state on the model instance
  getModelState();
};

// get a model property value
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

// get the current whole model state
const getModelState = function () {
  // refresh the model state on the model instance
  postMessage({
    type: "state",
    message: "",
    payload: [model],
  });
};

// get the realtime model data from the datacollector
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

// get the model data from the datacollector
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

// get the slow update model data from the datacollector
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

// initialize the model using the loaded model definition
const initModel = function (model_definition) {
  // store the model definition
  modelDefinition = model_definition;

  // reset error flag
  let error = false;

  // clear current model object
  model = {
    Models: {},
    ExecutionList: {},
    DependencyList: [],
  };

  // flag that the execution list needs to be rebuild
  rebuildExecutionList = true;

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
        //console.log(component.ModelType, index);
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

      console.log(model);
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

// do a single model step
const modelStep = function () {
  // iterate over all models
  Object.values(model.ExecutionList).forEach((model_component) => {
    model_component.StepModel();
  });

  // update the data collector
  model["DataCollector"].collect_data(model.ModelTimeTotal);

  // update the Task Scheduler
  model["TaskScheduler"].update(model.ModelTimeTotal);

  // increase the model time
  model.ModelTimeTotal += model.ModelingStepsize;
};

// prepare for a model run
const prepareForExecution = function () {
  // empty the execution list
  model.ExecutionList = {};

  // iterate over the models and add the models which should be executed to the list
  Object.values(model.Models).forEach((model_comp) => {
    if (model_comp.IsEnabled) {
      let key = model_comp.Name;
      model.ExecutionList[key] = model_comp;
    }
  });

  // build the dependency list
  buildDependencyList();

  // check the dependencies against the execution list
  let check_result = checkDependencies();

  // handle the check result
  if (check_result.length > 0) {
    postMessage({
      type: "status",
      message: `dependency error`,
      payload: check_result,
    });
    // flag that the execution list needs to be rebuild as there were errors
    rebuildExecutionList = true;
    return false;
  }

  // flag that the execution list does not have to be rebuilt
  rebuildExecutionList = false;

  // return that everything went well
  return true;
};

// check whether or not all dependencies of met
const checkDependencies = function () {
  let dep_not_found = [];
  // check whether the models in the executionlist match the dependency list
  model.DependencyList.forEach((dep) => {
    // check whether this dependency is in the execution list
    let dep_found = false;
    Object.values(model.ExecutionList).forEach((model_comp) => {
      if (model_comp.Name === dep) {
        dep_found = true;
      }
    });
    if (!dep_found) {
      dep_not_found.push(dep);
    }
  });

  return dep_not_found;
};

// build the dependency list
const buildDependencyList = function () {
  model.DependencyList = [];
  let depList = [];
  Object.values(model.ExecutionList).forEach((model_comp) => {
    // // process the dependencies
    model_comp.Dependencies.forEach((dep) => {
      depList.push(dep);
    });
    // remove duplicates
    model.DependencyList = depList.filter(
      (item, index) => depList.indexOf(item) === index
    );
  });
};

// do a realtime model step
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
