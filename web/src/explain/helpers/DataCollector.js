export default class DataCollector {
  collected_data = [];
  collected_data_slow = [];
  sample_interval = 0.005;
  sample_interval_slow = 1.0;
  watch_list = [];
  watch_list_slow = [];

  // common local parameters
  _modelEngine = {};
  _t = 0.0005;
  _interval_counter = 0;
  _interval_counter_slow = 0;

  constructor(model_ref) {
    // store a reference to the model instance
    this._modelEngine = model_ref;
    // define the watch list
    this.watch_list = {};
    // define the data sample interval
    this.sample_interval = 0.005;
    this._interval_counter = 0;
    // get the modeling stepsize from the model
    this._t = this._modelEngine.ModelingStepsize;
    // try to add two always needed ecg properties to the watchlist
    try {
      this.ncc_ventricular = {
        label: "Heart.NccVentricular",
        model: this._modelEngine.Models["Heart"],
        prop: "NccVentricular",
      };
      this.ncc_atrial = {
        label: "Heart.NccAtrial",
        model: this._modelEngine.Models["Heart"],
        prop: "NccAtrial",
      };
    } catch {
      this.ncc_ventricular = { label: "", model: None, prop: "", secProp: "" };
      this.ncc_atrial = { label: "", model: None, prop: "", secProp: "" };
    }
    // add the two always there
    this.watch_list[this.ncc_atrial] = this.ncc_atrial;
    this.watch_list[this.ncc_ventricular] = this.ncc_ventricular;

    this.watch_list_slow[this.ncc_atrial] = this.ncc_atrial;
    this.watch_list_slow[this.ncc_ventricular] = this.ncc_ventricular;

    // define the data list
    this.collected_data = [];
    this.collected_data_slow = [];
  }

  clear_data() {
    this.collected_data = [];
  }

  clear_data_slow() {
    this.collected_data_slow = [];
  }

  clear_watchlist_slow() {
    // first clear all data
    this.clear_data_slow();

    // empty the watch list
    this.watch_list_slow = {};

    this.watch_list_slow[this.ncc_atrial] = this.ncc_atrial;
    this.watch_list_slow[this.ncc_ventricular] = this.ncc_ventricular;
  }

  clear_watchlist() {
    // first clear all data
    this.clear_data();

    // empty the watch list
    this.watch_list = {};

    this.watch_list[this.ncc_atrial] = this.ncc_atrial;
    this.watch_list[this.ncc_ventricular] = this.ncc_ventricular;
  }

  get_model_data() {
    // make a copy of the current data object
    let data = [...this.collected_data];
    // clear the current collection
    this.collected_data = [];
    // return the data object
    return data;
  }
  get_model_data_slow() {
    // make a copy of the current data object
    let data = [...this.collected_data_slow];
    // clear the current collection
    this.collected_data_slow = [];
    // return the data object
    return data;
  }

  set_sample_interval(new_interval) {
    this.sample_interval = new_interval;
  }

  add_to_watchlist(property) {
    // first clear all data
    this.clear_data();

    // check whether the property exists
    if (property.model) {
      this.watch_list[property.label] = property;
    }
  }

  add_to_watchlist_slow(property) {
    // first clear all data
    this.clear_data();

    if (property.model) {
      this.watch_list_slow[property.label] = property;
    }
  }

  clean_up() {
    let disabledModels = [];

    Object.entries(this.watch_list).forEach(([dc_name, dc_item]) => {
      if (!dc_item.model.IsEnabled) {
        // remove this item from the data-collector
        disabledModels.push(dc_name);
      }
    });

    // remove the disabled models
    disabledModels.forEach((dm) => {
      delete this.watch_list[dm];
    });
  }

  collect_data(model_clock) {
    // check whether the datacollector update counter has expired
    if (this._interval_counter_slow >= this.sample_interval_slow) {
      // reset the counter
      this._interval_counter_slow = 0;
      // define a data object
      let data_object = { time: parseFloat(model_clock.toFixed(3)) };
      // iterate over the watchlist
      Object.values(this.watch_list_slow).forEach((slow_item) => {
        let value = slow_item.model[slow_item.prop];
        if (slow_item.secProp) {
          value = slow_item.model[slow_item.prop][slow_item.secProp];
        }
        data_object[slow_item.label] = value;
        data_object["scripts"] = [];
        this._modelEngine.TaskScheduler.tasks.forEach((task) => {
          data_object["scripts"].push(task);
        });
      });
      // add the script to the data_object
      this.collected_data_slow.push(data_object);
    }

    if (this._interval_counter >= this.sample_interval) {
      // reset the counter
      this._interval_counter = 0;
      // define a data object
      let data_object = { time: parseFloat(model_clock.toFixed(3)) };
      // iterate over the watchlist
      Object.values(this.watch_list).forEach((fast_item) => {
        let value = fast_item.model[fast_item.prop];
        if (fast_item.secProp) {
          value = fast_item.model[fast_item.prop][fast_item.secProp];
        }
        // complete the data_object
        data_object[fast_item.label] = value;
      });
      this.collected_data.push(data_object);
    }
    this._interval_counter += this._t;
    this._interval_counter_slow += this._t;
  }
}
