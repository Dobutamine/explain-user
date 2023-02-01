<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      class="bg-indigo-10 text-white headerCustomStyle"
      height-hint="68"
    >
      <q-toolbar>
        <q-toolbar-title class="text-subtitle2">
          Explanatory models in neonatology
        </q-toolbar-title>
        <div class="text-bold text-subtitle2 q-ml-sm">{{ user.name }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-grey-8 text-white footerCustomStyle">
      <q-toolbar>
        <q-toolbar-title class="text-overline">
          <div>{{ statusMessage }}</div>
        </q-toolbar-title>
        <div class="q-mr-lg text-overline">
          {{ this.definition.name }}
        </div>

        <q-btn
          :disable="rtState"
          flat
          round
          dense
          size="sm"
          icon="fa-solid fa-download"
          class="q-mr-sm"
          @click="getAllModelStates"
        />

        <q-btn
          :disable="rtState"
          flat
          round
          dense
          size="sm"
          icon="fa-solid fa-upload"
          class="q-mr-sm"
          @click="openPopUp"
        />
        <q-btn
          flat
          round
          dense
          size="sm"
          :icon="butIcon"
          :color="butColor"
          class="q-mr-sm"
          @click="togglePlay"
        />
        <q-btn
          flat
          round
          dense
          :icon="butCalcIcon"
          size="sm"
          @click="calculate"
          :color="butCalcColor"
          class="q-mr-sm"
        />
        <q-select
          class="q-ml-md q-mr-md"
          label-color="white"
          v-model="selectedDuration"
          :options="durations"
          hide-bottom-space
          dense
          label="calculate (sec.)"
          style="width: 130px; font-size: 12px"
        />
      </q-toolbar>
    </q-footer>

    <q-popup-edit
      v-if="showPopUpServer"
      fit
      touch-position
      model-value="sylisgek"
    >
      <q-card bordered dark style="width: 300px">
        <div class="row text-overline justify-center">
          available model states on server
        </div>
        <div class="row">
          <q-select
            class="q-ml-md q-mr-md"
            label-color="red-6"
            v-model="selectedModelStateOnServer"
            :options="availableModelStatesOnServer"
            hide-bottom-space
            dense
            label="available model states"
            style="width: 90%; font-size: 12px"
          />
        </div>
        <div
          class="q-gutter-sm row text-overline justify-center q-mt-xs q-mb-sm"
        >
          <q-btn
            color="primary"
            size="sm"
            style="width: 50px"
            @click="getModelState"
            icon="fa-solid fa-download"
          ></q-btn>
          <q-btn
            color="negative"
            size="sm"
            style="width: 50px"
            @click="deleteModelStateFromServer"
            icon="fa-solid fa-trash-can"
          ></q-btn>
          <q-btn
            color="grey-14"
            size="sm"
            style="width: 50px"
            @click="closeServerCommunication"
            icon="fa-solid fa-xmark"
          ></q-btn>
        </div>
        <div
          class="q-gutter-sm row text-overline justify-center q-mb-xs"
          style="font-size: 10px"
        ></div>
      </q-card>
    </q-popup-edit>
    <q-popup-edit
      v-if="showPopUpSave"
      fit
      touch-position
      model-value="sylisgek"
    >
      <q-card bordered dark style="width: 300px">
        <div class="row text-overline justify-center">model state name</div>
        <q-input
          class="row q-ma-sm"
          v-model="stateName"
          square
          hide-hint
          dense
          dark
          stack-label
        />
        <div
          class="q-gutter-sm row text-overline justify-center q-mt-xs q-mb-sm"
        >
          <q-btn
            color="secondary"
            dense
            size="sm"
            style="width: 50px"
            icon="fa-solid fa-upload"
            @click="saveModelState"
          ></q-btn>

          <q-btn
            color="grey-14"
            size="sm"
            style="width: 50px"
            @click="closePopUp"
            icon="fa-solid fa-xmark"
          ></q-btn>
        </div>
        <div
          class="q-gutter-sm row text-overline justify-center q-mb-xs"
          style="font-size: 10px"
        ></div>
      </q-card>
    </q-popup-edit>
  </q-layout>
</template>

<script>
import { useUserStore } from "src/stores/user";
import { useConfigStore } from "src/stores/config";
import { explain } from "../boot/explain";
import { useDiagramStore } from "../stores/diagram";
import { useEngineStore } from "../stores/engine";
import { useDefinitionStore } from "src/stores/definition";
import { useGeneralStore } from "src/stores/general";

export default {
  setup() {
    const user = useUserStore();
    const uiConfig = useConfigStore();
    const diagram = useDiagramStore();
    const engine = useEngineStore();
    const definition = useDefinitionStore();
    const general = useGeneralStore();

    return {
      user,
      uiConfig,
      diagram,
      engine,
      definition,
      general,
    };
  },
  data() {
    return {
      selectedModelStateOnServer: "",
      availableModelStatesOnServer: [],
      showPopUpServer: false,
      showPopUpSave: false,
      stateName: "",
      playArmed: false,
      calcRunning: false,
      rtState: false,
      butCaption: "PLAY",
      butColor: "white",
      butCalcColor: "white",
      butIcon: "fa-solid fa-play",
      butCalcIcon: "fa-solid fa-calculator",
      butCalcCaption: "CALCULATE",
      statusMessage: "",
      selectedDuration: 3,
      durations: [1, 2, 3, 5, 10, 20, 30, 60, 120, 240, 360, 600, 1200, 1800],
    };
  },
  methods: {
    loadModelStateFromServer() {},
    async deleteModelStateFromServer() {
      const url = `${this.general.apiUrl}/api/definitions/remove_definition?token=${this.user.token}`;
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          engine_version: this.engine.engine_version,
          name: this.selectedModelStateOnServer,
          user: this.user.name,
        }),
      });
      if (response.status === 200) {
        let data = await response.json();
        switch (data.message) {
          case "deleted":
            this.statusMessageLoad = "Model state deleted from server.";
            this.showPopUpServer = false;

            break;
          case "not deleted":
            this.statusMessageLoad = "Model state was protected or not found.";
            this.showPopUpServer = false;

            break;
        }
        return true;
      } else {
        this.statusMessage = "Model state was not found or protected.";
        this.showPopUpServer = false;
        return false;
      }
    },
    closeServerCommunication() {
      this.showPopUpServer = false;
    },

    openPopUp() {
      this.stateName = this.definition.name;
      this.showPopUpSave = true;
    },
    closePopUp() {
      this.showPopUpSave = false;
    },
    async getAllModelStates() {
      this.showPopUpServer = true;
      // do a server request
      const url = `${this.general.apiUrl}/api/definitions/get_definitions?token=${this.user.token}`;
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          engine_version: this.engine.engine_version,
          user: this.user.name,
        }),
      });
      if (response.status === 200) {
        let data = await response.json();
        this.availableModelStatesOnServer = [];
        data.forEach((state) =>
          this.availableModelStatesOnServer.push(state.name)
        );

        return true;
      } else {
        return false;
      }
    },
    async getModelState() {
      if (this.selectedModelStateOnServer === "") {
        alert("No model state selected!");
        return;
      }

      // stop the realtime model
      explain.stop();
      this.rtState = false;
      this.butColor = "white";
      this.butIcon = "fa-solid fa-play";
      this.butCaption = "PLAY";

      // do a server request
      const url = `${this.general.apiUrl}/api/definitions/get_definition?token=${this.user.token}`;
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          engine_version: this.engine.engine_version,
          name: this.selectedModelStateOnServer,
          user: this.user.name,
        }),
      });
      if (response.status === 200) {
        let data = await response.json();
        this.definition.engine_version = data.engine_version;
        this.definition.name = data.name;
        this.definition.description = data.description;
        this.definition.protected = data.protected;
        this.definition.shared = data.shared;
        this.definition.user = data.user;
        this.definition.weight = data.weight;
        this.definition.models = { ...data.models };
        // process the result
        this.restartModelWithNewDefinition();
        this.statusMessage = "Model state loaded from server.";
        this.showPopUpServer = false;
        return true;
      } else {
        return false;
      }
    },
    async saveModelState() {
      if (
        this.stateName === this.definition.name &&
        this.definition.protected
      ) {
        alert("This model state is protected! Choose a different name.");
        return;
      }
      if (this.stateName !== "") {
        this.definition.name = this.stateName;
        this.definition.protected = false;
      }

      let newModelState = this.buildModelState();
      const url = `${this.general.apiUrl}/api/definitions/update_definition?token=${this.user.token}`;
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          engine_version: newModelState.engine_version,
          name: newModelState.name,
          description: newModelState.description,
          weight: newModelState.weight,
          user: newModelState.user,
          protected: newModelState.protected,
          shared: newModelState.shared,
          models: { ...newModelState.models },
        }),
      });
      if (response.status === 200) {
        let data = await response.json();
        switch (data.message) {
          case "new":
            this.statusMessage = "Model state uploaded to server.";
            this.showPopUpSave = false;

            break;
          case "update":
            this.statusMessage = "Model state updated on server.";
            this.showPopUpSave = false;
            break;
        }
      }
    },
    restartModelWithNewDefinition() {
      // initialize the modelengine
      explain.initModelEngine(this.engine.getEngineObject());

      // inject the explain definition into the model engine
      explain.injectModelDefinition(this.definition.getDefinitionObject());
    },
    buildModelState() {
      // save the model state to the server
      let modelState = { ...explain.modelState };

      // build a new model definition object
      let newModelState = {
        engine_version: 0.1,
        name: this.definition.name,
        description: this.definition.description,
        weight: this.definition.weight,
        user: this.user.name,
        protected: this.definition.protected,
        shared: this.definition.shared,
        models: {},
      };
      // iterate over the models in the modelState object
      Object.entries(modelState.Models).forEach(([model_name, model]) => {
        let modelType = model.ModelType;
        newModelState.models[model_name] = {};
        // find the modelType in the engine definition file
        Object.entries(this.engine.base_model_settings).forEach(
          ([prop_name, prop]) => {
            // get the value of this input from the current modelstate
            let current_value = modelState.Models[model_name][prop_name];
            // set the current_value in the models object
            newModelState.models[model_name][prop_name] = current_value;
          }
        );
        Object.entries(this.engine.core_models[modelType].inputs).forEach(
          ([input_name, input]) => {
            // get the value of this input from the current modelstate
            let current_value = modelState.Models[model_name][input_name];
            if (current_value !== undefined) {
              // set the current_value in the models object
              newModelState.models[model_name][input_name] = current_value;
            }
          }
        );
        if (this.engine.core_models[modelType].outputs !== undefined) {
          Object.entries(this.engine.core_models[modelType].outputs).forEach(
            ([output_name, input]) => {
              try {
                // get the value of this input from the current modelstate
                let current_value = modelState.Models[model_name][output_name];
                if (current_value !== undefined) {
                  // set the current_value in the models object
                  newModelState.models[model_name][output_name] = current_value;
                }
              } catch {}
            }
          );
        }
      });
      return newModelState;
    },
    statusUpdate() {
      this.statusMessage = "STATUS: " + explain.statusMessage;

      this.calculationReady();
    },
    togglePlay() {
      this.rtState = !this.rtState;
      if (this.rtState) {
        this.uiConfig.updateDataCollector();
        this.diagram.updateDataCollector();
        this.playArmed = true;
        this.calculate();
        this.butColor = "negative";
        this.butIcon = "fa-solid fa-stop";
        this.butCaption = "STOP";
      } else {
        explain.stop();
        this.butColor = "white";
        this.butIcon = "fa-solid fa-play";
        this.butCaption = "PLAY";
        explain.getModelState();
      }
    },
    calculate() {
      this.calcRunning = !this.calcRunning;
      if (this.calcRunning) {
        this.butCalcColor = "negative";
        this.uiConfig.updateDataCollector();
        this.diagram.updateDataCollector();
        explain.calculate(parseInt(this.selectedDuration));
      }
    },
    calculationReady(e) {
      if (this.statusMessage.includes("calculation ready")) {
        this.calcRunning = false;
        this.butCalcCaption = "CALCULATE";
        this.butCalcColor = "white";

        explain.getModelState();
        if (this.playArmed) {
          this.playArmed = false;
          explain.start();
        }
      }
    },
    dataUpdate(e) {},
  },
  beforeUnmount() {
    document.removeEventListener("status", this.statusUpdate);
  },
  mounted() {
    try {
      document.removeEventListener("status", this.statusUpdate);
    } catch {}
    document.addEventListener("status", this.statusUpdate);
  },
};
</script>

<style scoped>
.headerCustomStyle {
  height: 30px !important;
  display: flex;
  align-items: center !important;
}
.footerCustomStyle {
  height: 30px !important;
  display: flex;
  align-items: center !important;
}
</style>
