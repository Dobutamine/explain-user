export default class DataCollector {
  collected_data = [];
  sample_interval = 0.005;
  watch_list = [];

  // common local parameters
  _modelEngine = {};
  _t = 0.0005;
  _interval_counter = 0;

  constructor(model_ref) {
    // store a reference to the model instance
    this._modelEngine = model_ref;
    // define the watch list
    this.watch_list = [];
    // define the data sample interval
    this.sample_interval = 0.015;
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
      this.ncc_ventricular = { label: "", model: None, prop: "" };
      this.ncc_atrial = { label: "", model: None, prop: "" };
    }
    // add the two always there
    this.watch_list.push(this.ncc_atrial);
    this.watch_list.push(this.ncc_ventricular);

    // tester
    this.watch_list.push({
      label: "AA.Pres",
      model: this._modelEngine.Models["AA"],
      prop: "Pres",
    });
    // define the data list
    this.collected_data = [];
  }

  clear_data() {
    this.collected_data = [];
  }

  clear_watchlist() {
    // first clear all data
    this.clear_data();

    // empty the watch list
    this.watch_list = [];

    // add the two always there
    this.watch_list.push(this.ncc_atrial);
    this.watch_list.push(this.ncc_ventricular);
  }

  get_model_data() {
    // make a copy of the current data object
    let data = [...this.collected_data];
    // clear the current collection
    this.collected_data = [];
    // return the data object
    return data;
  }

  set_sample_interval(new_interval) {
    this.sample_interval = new_interval;
  }

  add_to_watchlist(property) {
    // first clear all data
    this.clear_data();

    // add to the watchlist
    this.watch_list.push(property);
  }

  collect_data(model_clock) {
    // check whether the datacollector update counter has expired
    if (this._interval_counter >= this.sample_interval) {
      // reset the counter
      this._interval_counter = 0;
      // define a data object
      let data_object = { time: parseFloat(model_clock.toFixed(3)) };
      // iterate over the watchlist
      for (let i = 0; i < this.watch_list.length; i++) {
        let value = this.watch_list[i].model[this.watch_list[i].prop];
        // // if the watched prop is volume (expressed per weight) or flow (expressed per minute)
        // if (this.watch_list[i].prop == "Flow") {
        //   value = (value / this._modelEngine.Weight) * 60.0;
        // }
        // if (this.watch_list[i].prop == "Vol") {
        //   value = value / this._modelEngine.Weight;
        // }
        // complete the data_object
        data_object[this.watch_list[i].label] = value;
      }
      this.collected_data.push(data_object);
    }
    this._interval_counter += this._t;
  }
}
