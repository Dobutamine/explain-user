export default class TaskScheduler {
  // define an object which has reference to the model
  model = {};

  // define a array holding a list with tasks which should run
  task = {};

  constructor(_model) {
    this.model = _model;
  }

  PropChange(prop_change) {
    console.log(prop_change);
  }
  AddTask() {}

  RemoveTask() {}

  UpdateTasks() {}
}
