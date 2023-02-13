import ModelBaseClass from "../helpers/ModelBaseClass";
import { SetAirComposition } from "../helpers/AirComposition";

export class Gas extends ModelBaseClass {
  // local parameters
  _gasConstant = 62.36367;

  InitModel(args) {
    // process the arguments/parameters
    args.forEach((arg) => {
      this[arg["key"]] = arg["value"];
    });

    // set the flag to model is initialized
    this._is_initialized = true;

    // check whether the parameters are already set by loading a state, otherwise reinitialize with the settings in the gas settings
    if (this.Pres0 === 0) {
      // set the temperatures
      this.SetTemperatures();

      // // set the humidities
      this.SetHumidity();

      // // initialize the gas compliances holding the inspired air
      this.SetInspiredAir();
    }
  }

  SetTemperatures() {
    // set the temperatures
    Object.entries(this.TempSettings).forEach(([model, temp]) => {
      this._modelEngine.Models[model].Temp = temp;
      this._modelEngine.Models[model].TargetTemp = temp;
    });
  }

  SetHumidity() {
    // set the humidities
    Object.entries(this.HumiditySettings).forEach(([model, hum]) => {
      this._modelEngine.Models[model].Humidity = hum;
    });
  }

  SetInspiredAir() {
    Object.values(this._modelEngine.Models).forEach((model) => {
      if (model.ModelType == "GasCompliance") {
        // set the atmospheric pressure
        model.Pres0 = this.PresAtm;

        // first calculate the pressures
        model.StepModel();

        // set the inspired air composition to all gas compliances

        SetAirComposition(
          model,
          model.Humidity,
          model.Temp,
          this.DryAir["Fo2"],
          this.DryAir["Fco2"],
          this.DryAir["Fn2"],
          this.DryAir["Fother"]
        );
      }
    });
  }
}
