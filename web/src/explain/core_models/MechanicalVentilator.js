import ModelBaseClass from "../helpers/ModelBaseClass";
import { SetAirComposition } from "../helpers/AirComposition";

export class MechanicalVentilator extends ModelBaseClass {
  // model dependent parameters
  Inspiration = true;
  Expiration = false;
  VtInsp = 0.0;
  VtExp = 0.0;
  EtCo2_signal = 0.0;
  EtCo2 = 0.0;
  ExpTime = 1.0;
  Flow = 0.0;
  Pres = 0.0;
  Vol = 0.0;
  Fo2Dry = 0.0;
  Fco2Dry = 0.0;
  Fn2Dry = 0.0;
  FotherDry = 0.0;
  EtRes = 37.9;

  // local parameters
  _insp_timer = 0.0;
  _exp_timer = 0.0;
  _vt_insp_counter = 0.0;
  _vt_exp_counter = 0.0;
  _ventin = {};
  _ventout = {};
  _tubingin = {};
  _tubingout = {};
  _ypiece = {};
  _insp_valve = {};
  _exp_valve = {};
  _flow_sensor = {};
  _pressure_sensor = {};
  _internal_pressure_sensor = {};
  _internal_volume_counter = 0;
  _etco2_sensor = {};
  _insp_valve_flow_reduction = 1.0;
  InitModel(model_ref) {
    // initialize the baseclass
    super.InitModel(model_ref);

    // get a reference to all the gas compliances and gas resistors for easy access
    this._ventin = this._modelEngine.Models["VENTIN"];
    this._ventout = this._modelEngine.Models["VENTOUT"];
    this._tubingin = this._modelEngine.Models["TUBINGIN"];
    this._tubingout = this._modelEngine.Models["TUBINGOUT"];
    this._ypiece = this._modelEngine.Models["YPIECE"];
    this._insp_valve = this._modelEngine.Models["VENTIN_TUBINGIN"];
    this._exp_valve = this._modelEngine.Models["TUBINGOUT_VENTOUT"];
    this._flow_sensor = this._modelEngine.Models["YPIECE_DS"];
    this._pressure_sensor = this._modelEngine.Models["YPIECE"];
    this._internal_pressure_sensor = this._modelEngine.Models["TUBINGIN"];
    this._internal_flow_sensor = this._modelEngine.Models["VENTIN_TUBINGIN"];
    this._etco2_sensor = this._modelEngine.Models["DS"];

    // initialize the internal reservoir of the mechanical ventilator
    this.SetVentIn();

    // initialize the tubing
    this.SetTubing();

    // initialize the Y-piece
    this.SetYPiece();

    // set the expiratory reservoir
    this.SetVentOut();

    // set the initial state of the in- and expiratory valves
    this.PressureLimited();
  }

  CalcModel() {
    // calculate the expiration time
    this.ExpTime = 60.0 / this.Freq - this.InspTime;

    // has the inspiration time elapsed?
    if (this._insp_timer >= this.InspTime) {
      // reset inspiration timer
      this._insp_timer = 0.0;
      // signal that the inspiration has ended and the expiration has started
      this.Inspiration = false;
      this.Expiration = true;
      // report the vti
      this.VtInsp = this._vt_insp_counter;
      // reset the vti counter
      this._vt_insp_counter = 0.0;
    }

    // has the expiration time elapsed
    if (this._exp_timer > this.ExpTime) {
      // reset the expiration time
      this._exp_timer = 0.0;
      // signal that the expiration has ended and the inspiration has started
      this.Inspiration = true;
      this.Expiration = false;
      // report the vte
      this.VtExp = this._vt_exp_counter;
      // change pip when in prvc mode
      if (this.VolumeGuaranteed) {
        this.PressureRegulatedVolumeControl();
      }
      // report the end tidal co2
      this.EtCo2 = this._etco2_sensor.Pco2;
      // reset the vti counter
      this._vt_exp_counter = 0.0;
      // reset the volume counter
      this.Volume = 0.0;
    }
    // increase the timers
    if (this.Inspiration) {
      // increase the timer
      this._insp_timer += this._t;
      // increase the vti counter
      this._vt_insp_counter += this._flow_sensor.Flow * this._t;
    }

    if (this.Expiration) {
      this._exp_timer += this._t;
      // increase the vte counter
      this._vt_exp_counter += -this._flow_sensor.Flow * this._t;
    }

    // store etco2 signal
    this.EtCo2_signal = this._etco2_sensor.Pco2;
    this.Flow = this._flow_sensor.Flow * 60.0; // convert to l/min
    this.Pres = (this._pressure_sensor.Pres - this.PresAtm) * 1.35951; // convert to cmH2O relative to atmospheric pressure
    this.Vol += this._flow_sensor.Flow * this._t * 1000.0; // convert to ml

    // calculate the endotracheal tube resistance
    this.EtTubeResistance(this.Flow);

    this.PressureLimited();
  }

  SwitchVentilator(state) {
    // turn on or turn off the ventilator
    if (state) {
      this.IsEnabled = true;
      this._modelEngine.Models["YPIECE_DS"].IsEnabled = true;
      this._modelEngine.Models["YPIECE_DS"].NoFlow = false;
    } else {
      this.IsEnabled = false;
      this._modelEngine.Models["YPIECE_DS"].IsEnabled = false;
      this._modelEngine.Models["YPIECE_DS"].NoFlow = true;
    }
  }

  SetYPiece() {
    // set the humidity and temperature of the internal reservoir
    this._ypiece.Humidity = this.Humidity;
    this._ypiece.Temp = this.Temp;
    this._ypiece.TargetTemp = this.Temp;
    this._ypiece.Pres0 = this.PresAtm;

    // set the mechanical properties
    this._ypiece.Vol = this.YPieceSettings["Volume"];
    this._ypiece.UVol = this.YPieceSettings["Volume"];
    this._ypiece.ElBase = this.YPieceSettings["Elastance"];

    // calculate the pressure
    this._ypiece.StepModel();

    // calculate the composition
    SetAirComposition(
      this._ypiece,
      this.Humidity,
      this.Temp,
      this.Fo2Dry,
      this.Fco2Dry,
      this.Fn2Dry,
      this.FotherDry
    );
  }

  SetVentIn() {
    // set the humidity and temperature of the internal reservoir
    this._ventin.Humidity = this.Humidity;
    this._ventin.Temp = this.Temp;
    this._ventin.TargetTemp = this.Temp;
    this._ventin.Pres0 = this.PresAtm;

    // set the mechanical properties
    this._ventin.UVol = this.VentInSettings["Volume"];
    this._ventin.ElBase = this.VentInSettings["Elastance"];

    // calculate the volume of the internal reservoir to reach the desired internal pressure
    this._ventin.Vol =
      this.VentInSettings["InternalPressure"] / this._ventin.ElBase +
      this._ventin.UVol;

    // calculate the pressure
    this._ventin.StepModel();

    // calculate the composition
    SetAirComposition(
      this._ventin,
      this.Humidity,
      this.Temp,
      this.Fo2Dry,
      this.Fco2Dry,
      this.Fn2Dry,
      this.FotherDry
    );

    // fix the composition as this compartment is continuously refreshed
    this._insp_valve.NoBackflow = true;
    this._ventin.FixedComposition = true;
  }

  SetVentOut() {
    // set the humidity and temperature of the internal reservoir
    this._ventout.Humidity = this.Humidity;
    this._ventout.Temp = this.Temp;
    this._ventout.TargetTemp = this.Temp;
    this._ventout.Pres0 = this.PresAtm;

    // set the mechanical properties
    this._ventout.Vol = this.VentOutSettings["Volume"];
    this._ventout.UVol = this.VentOutSettings["Volume"];
    this._ventout.ElBase = this.VentOutSettings["Elastance"];

    // calculate the pressure
    this._ventout.StepModel();

    // calculate the composition
    SetAirComposition(
      this._ventout,
      this.VentOutSettings["Humidity"],
      this.VentOutSettings["Temp"],
      this.VentOutSettings["Fo2Dry"],
      this.VentOutSettings["Fco2Dry"],
      this.VentOutSettings["Fn2Dry"],
      this.VentOutSettings["FotherDry"]
    );

    // fix the composition as this compartment is continuously refreshed
    this._exp_valve.NoBackflow = true;
    this._ventout.FixedComposition = true;
  }

  SetTubing() {
    // set the humidity, temperature and atmospheric pressure of the tubing
    this._tubingin.Humidity = this.Humidity;
    this._tubingin.Temp = this.Temp;
    this._tubingin.TargetTemp = this.Temp;
    this._tubingin.Pres0 = this.PresAtm;

    // calculate the volume and unstressed volume of the tubing
    this._tubingin.Vol =
      Math.PI *
      (Math.pow(this.TubingSettings["InnerDiameter"], 2) / 4.0) *
      this.TubingSettings["Length"] *
      1000.0;
    this._tubingin.UVol = this._tubingin.Vol;
    this._tubingin.ElBase = this.TubingSettings["Elastance"];

    // calculate the pressures
    this._tubingin.StepModel();

    // set the air composition
    SetAirComposition(
      this._tubingin,
      this.Humidity,
      this.Temp,
      this.Fo2Dry,
      this.Fco2Dry,
      this.Fn2Dry,
      this.FotherDry
    );

    // set the humidity, temperature and atmospheric pressure of the tubing
    this._tubingout.Humidity = this.Humidity;
    this._tubingout.Temp = this.Temp;
    this._tubingout.TargetTemp = this.Temp;
    this._tubingout.Pres0 = this.PresAtm;

    // calculate the volume and unstressed volume of the tubing
    this._tubingout.Vol =
      Math.PI *
      (Math.pow(this.TubingSettings["InnerDiameter"], 2) / 4.0) *
      this.TubingSettings["Length"] *
      1000.0;
    this._tubingout.UVol = this._tubingout.Vol;
    this._tubingout.ElBase = this.TubingSettings["Elastance"];

    // calculate the pressures
    this._tubingout.StepModel();

    // set the air composition
    SetAirComposition(
      this._tubingout,
      this.Humidity,
      this.Temp,
      this.Fo2Dry,
      this.Fco2Dry,
      this.Fn2Dry,
      this.FotherDry
    );
  }

  EtTubeResistance() {
    let res5 = 37.9;
    let res10 = 57.3;

    let a = (10.0 - 5.0) / ((res10 - res5) * 0.735559);
    let b = res5 * 0.735559 - a * 5.0;

    if (Math.abs(flow) < 0.5) {
      flow = 0.5;
    }

    this.EtRes = Math.abs(flow) * a + b;

    this._modelEngine.Models["YPIECE_DS"].RFor = this.EtRes;
    this._modelEngine.Models["YPIECE_DS"].RBack = this.EtRes;
  }

  PressureRegulatedVolumeControl() {
    // is the tidal volume reached
    if (this.VtExp > this.VtSet + 0.001) {
      // decrease pip
      this.Pip -= 1.0;
      // guard against too low pip
      if (this.Pip - this.Peep < 4.0) {
        this.Pip = this.Peep + 4.0;
      }
    }
    if (this.VtExp < this.VtSet - 0.001) {
      // increase pip
      this.Pip += 1.0;
      // guard against too high pip
      if (this.Pip > this.PipMax) {
        this.Pip = this.PipMax;
      }
    }
  }

  VolumeControl() {}

  HFOV() {}

  PressureLimited() {
    if (this.Inspiration) {
      // calculate the inspiratory valve resistance to achieve the desired inspiratory flow

      // pressure gradient over the respiratory system
      let delta_p =
        this._modelEngine.Models["VENTIN"].Pres -
        this._modelEngine.Models["VENTOUT"].Pres;

      // calculate the resistance of the inspiratory valve
      let res = 100000000000;
      if (this._insp_valve_flow_reduction <= 0.0) {
        res = 100000000000;
      } else {
        res = delta_p / (this.InspFlow / 60.0) - this._exp_valve.RFor - 50.0;
      }

      // set the inspiratory valve resistance
      this._insp_valve.RFor = res;

      // make sure the valve is open and make sure no backflow can occur
      this._insp_valve.NoFlow = false;
      this._insp_valve.NoBackflow = true;

      // close the expiratory valve
      this._exp_valve.NoFlow = true;

      let threshold = this.Pip + this.PresAtm + 1.0;
      if (this._internal_pressure_sensor.Pres >= threshold) {
        this._insp_valve.NoFlow = true;
      }
    }
    if (this.Expiration) {
      // calculate the inspiratory valve resistance to achieve the desired expiratory bias flow

      // pressure gradient over the respiratory system
      let delta_p =
        this._modelEngine.Models["VENTIN"].Pres -
        this._modelEngine.Models["VENTOUT"].Pres;

      // calculate the resistance of the inspiratory valve
      let res = delta_p / (this.ExpFlow / 60.0) - this._exp_valve.RFor - 50.0;

      // set the inspiratory valve resistance
      this._insp_valve.RFor = res;

      // make sure the valve is open and make sure no backflow can occur
      this._insp_valve.NoFlow = false;
      this._insp_valve.NoBackflow = true;

      // make sure the expiratory valve is open and make sure no backflow can occur
      this._exp_valve.RFor = 25.0;
      this._exp_valve.NoFlow = false;
      this._exp_valve.NoBackflow = true;

      // guard the positive end expiratory pressure
      if (this._pressure_sensor.Pres < this.Peep + this.PresAtm) {
        // close the expiration valve when the pressure falls below the positive end expiratory pressure
        this._exp_valve.NoFlow = true;
      }
    }
  }

  SetInspTime(time) {
    this.InspTime = time;
  }

  SetFreq(freq) {
    this.Freq = freq;
  }

  SetInspFlow(flow) {
    this.InspFlow = flow;
  }

  SetExpFlow(flow) {
    this.ExpFlow = flow;
  }

  SetFiO2(fio2) {
    this.Fo2Dry = fio2;
  }

  SetPip(pip) {
    this.Pip = pip / 1.35951;
  }

  SetPeep(peep) {
    this.Peep = peep / 1.35951;
  }

  SetTemp(temp) {
    this.Temp = temp;
  }

  SetHumidity(humidity) {
    this.Humidity = humidity;
  }

  SetTargetVt(vt) {
    this.VtSet = vt / 1000.0;
  }

  SetMode(mode) {
    if (mode == "PC") {
      this.VolumeGuaranteed = false;
    }

    if (mode == "PRVC") {
      this.VolumeGuaranteed = true;
    }
  }

  SetTubingDiameter(diameter) {
    this.TubingSettings["InnerDiameter"] = diameter / 1000.0;
  }

  SetTubingLength(length) {
    this.TubingSettings["Length"] = length;
  }

  SetTubingCompliance(comp) {
    this.TubingSettings["Elastance"] = 1.0 / comp;
  }

  SetTubeSize(tube_size) {
    pass;
  }
}
