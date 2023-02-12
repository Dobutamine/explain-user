import ModelBaseClass from "../helpers/ModelBaseClass";

import { BloodCompliance } from "./BloodCompliance";
import { BloodResistor } from "./BloodResistor";
import { GasCompliance } from "./GasCompliance";
import { GasResistor } from "./GasResistor";
import { GasExchanger } from "./GasExchanger";

import { BloodPump } from "./BloodPump";

export class Ecls extends ModelBaseClass {
  GasIn = {};
  GasLung = {};
  GasOut = {};
  GasExLung = {};
  BloodLung = {};
  BloodTubingIn = {};
  BloodPump = {};
  BloodTubingOut = {};
}
