export default class TaskScheduler {
  // define an object which has reference to the model
  model = {};

  // define a array holding a list with tasks which should run
  tasks = [];
  tasksReady = false;

  _completed_tasks = [];

  _updateInterval = 0.015;
  _updateCounter = 0.0;
  _modelingStepsize = 0.0005;

  _cleanUpInterval = 1.0;
  _cleanUpCounter = 0.0;

  constructor(_model) {
    // get a reference to the whole model
    this.model = _model;

    // store the modeling stepsize
    this._modelingStepsize = _model.ModelingStepsize;
  }

  update(modelTimeTotal) {
    if (this._updateCounter >= this._updateInterval) {
      this._updateCounter = 0;
      this.doTasks();
    }
    this._updateCounter += this._modelingStepsize;

    // garbage collector
    if (this._cleanUpCounter >= this._cleanUpInterval) {
      this.cleanUp;
    }
    this._cleanUpCounter += this._modelingStepsize;
  }

  cleanUp() {
    this._cleanUpCounter = 0;
    this._completed_tasks.forEach((id) => {
      let index = -1;
      this.tasks.forEach((task, i) => {
        if (task.id == id) {
          index = i;
        }
      });
      if (index > -1) {
        this.tasks.splice(index, 1);
      }
    });
  }
  doTasks() {
    this.tasks.forEach((task, index) => {
      if (task.status !== "completed") {
        if (task.at > 0) {
          task.status = "waiting";
          task.at -= this._updateInterval;
        } else {
          task.at = 0;
          task.status = "running";
          task.it -= this._updateInterval;
          switch (task.type) {
            case "number":
              if (Math.abs(task.v - task.t) < Math.abs(task.step)) {
                task.v = parseFloat(task.t);
                task.status = "completed";
                this.tasksReady = true;
                this._completed_tasks.push(task.id);
              }
              task.v += task.step;
              // update the property
              try {
                this.model.Models[task.m][task.p] = parseFloat(task.v);
              } catch {
                task.status = "completed";
                task.it = 0;
                task.at = 0;
                this.tasksReady = true;
                this._completed_tasks.push(task.id);
              }

              break;
            case "boolean":
              if (task.it <= 0) {
                task.v = task.t;
                task.status = "completed";
                this.tasksReady = true;
                // update the property
                this.model.Models[task.m][task.p] = task.v;
                this._completed_tasks.push(task.id);
              }
              break;
            case "string":
              if (task.it <= 0) {
                task.v = task.t;
                task.status = "completed";
                this.tasksReady = true;
                // update the property
                this.model.Models[task.m][task.p] = task.v;
                this._completed_tasks.push(task.id);
              }
              break;
          }
        }
      }
    });
  }

  AddTask(new_task) {
    // first cleanup
    this.cleanUp();

    // build tasl
    let task = {
      id: new_task.id,
      m: new_task.m,
      p: new_task.p,
      o: new_task.o,
      v: new_task.o,
      t: new_task.v,
      it: parseFloat(new_task.it),
      at: parseFloat(new_task.at),
      status: "waiting",
      step: 0,
      type: typeof new_task.v,
    };

    if (task.type === "number") {
      if (task.it > 0) {
        task.step = (task.t - task.o) / (task.it / this._updateInterval);
      }
    }
    this.tasks.push(task);
  }
}
