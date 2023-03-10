<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <div
      class="row text-overline justify-center"
      @click="collapsed = !collapsed"
    >
      {{ title }}
      <q-icon
        v-if="collapsed"
        class="q-ml-sm q-mt-sm"
        name="fa-solid fa-chevron-down"
      ></q-icon>
      <q-icon
        v-if="!collapsed"
        class="q-ml-sm q-mt-sm"
        name="fa-solid fa-chevron-up"
      ></q-icon>
    </div>
    <div v-if="!collapsed">
      <div
        v-if="definition.name === ''"
        class="row text-overline justify-center"
      >
        no model definition loaded
      </div>
      <!-- topline buttons -->
      <div
        v-if="definition.name !== ''"
        class="q-pa-sm q-mt-xs q-mb-sm q-ml-md q-mr-md row text-overline justify-center"
      >
        <!-- <q-btn color="primary" class="col q-mr-sm" label="add" dark size="sm">
          <q-menu dark>
            <q-list dense>
              <div v-for="(modelType, index) in modelTypeNames" :key="index">
                <q-item clickable dense>
                  <q-item-section
                    clickable
                    v-close-popup
                    @click="selectModelType(modelType)"
                  >
                    {{ modelType }}
                  </q-item-section>
                </q-item>
              </div>
            </q-list>
          </q-menu>
        </q-btn> -->
        <q-btn
          color="grey-9"
          label="select model"
          style="width: 60%"
          dark
          size="sm"
        >
          <q-menu dark>
            <q-list dense>
              <div v-for="(modelName, index) in modelNames" :key="index">
                <q-item clickable dense>
                  <q-item-section
                    clickable
                    v-close-popup
                    @click="selectModel(modelName)"
                  >
                    {{ modelName }}
                  </q-item-section>
                </q-item>
              </div>
            </q-list>
          </q-menu>
        </q-btn>
        <!-- <q-btn color="negative" class="col" label="delete" dark size="sm">
          <q-menu dark>
            <q-list dense>
              <div v-for="(modelType, index) in modelTypeNames" :key="index">
                <q-item clickable dense>
                  <q-item-section
                    clickable
                    v-close-popup
                    @click="selectModelType(modelType)"
                  >
                    {{ modelType }}
                  </q-item-section>
                </q-item>
              </div>
            </q-list>
          </q-menu>
        </q-btn> -->
      </div>
      <div class="q-ma-sm q-gutter-sm row items-center">
        <ModelEditorComponent
          v-if="editMode === 1"
          :modelProps="selectedModelItems"
          :modelName="selectedModelName"
          :modelType="selectedModelType"
          @cancel="cancelBuild"
        >
        </ModelEditorComponent>
        <!-- <NewModelComponent
          v-if="editMode === 0"
          :modelProps="selectedModelItems"
          :modelName="selectedModelName"
          :modelType="selectedModelType"
          @cancel="cancelBuild"
        >
        </NewModelComponent> -->
      </div>
    </div>
  </q-card>
</template>

<script>
import { explain } from "../boot/explain";
import ModelEditorComponent from "./ModelEditorComponent.vue";
import { useDefinitionStore } from "src/stores/definition";
import { useEngineStore } from "src/stores/engine";
export default {
  components: {
    ModelEditorComponent,
  },
  setup() {
    const definition = useDefinitionStore();
    const engine = useEngineStore();
    return {
      definition,
      engine,
    };
  },
  data() {
    return {
      notyet: true,
      title: "MODEL PROPERTIES",
      collapsed: true,
      modelsTree: {},
      selectedModelName: "",
      selectedModelType: "",
      selectedModelItems: [],
      editMode: 0,
      modelTypeNames: [],
      modelNames: [],
    };
  },
  methods: {
    cancelBuild() {
      this.selectedModelItems = [];
    },
    selectModel(modelName) {
      // store the selected model name
      this.selectedModelName = modelName;

      // clear the selected model type
      this.selectedModelType = "";

      // we now have to build an array of the selected model props
      this.selectedModelItems = [];

      // set the edit mode to 1 signaling an existing model
      this.editMode = 1;

      // find the basemodel settings
      Object.entries(this.engine.base_model_settings).forEach(
        ([name, input]) => {
          let modelObject = { ...input };
          modelObject["name"] = name;
          // find the current value
          modelObject["current_value"] =
            explain.modelState.Models[modelName][name];
          this.selectedModelItems.push(modelObject);
        }
      );

      // find the model type to extract the inputs
      this.selectedModelType = explain.modelState.Models[modelName].ModelType;
      Object.entries(
        this.engine.core_models[this.selectedModelType].inputs
      ).forEach(([name, input]) => {
        let modelObject = { ...input };
        modelObject["name"] = name;
        // find the current value
        modelObject["current_value"] =
          explain.modelState.Models[modelName][name];
        this.selectedModelItems.push(modelObject);
      });
    },
    selectModelType(modeltype) {
      // clear the model name as this is a new model
      this.selectedModelName = "";

      // store the selected type
      this.selectedModelType = modeltype;

      // we now have to build an array of the modeltype props
      this.selectedModelItems = [];

      // set the edit mode to 0 signaling a new model
      this.editMode = 0;

      // find the basemodel settings
      Object.entries(this.engine.base_model_settings).forEach(
        ([name, input]) => {
          let modelObject = { ...input };
          modelObject["name"] = name;
          // set the default value
          modelObject["current_value"] = input.default;
          modelObject["model_type"] = modeltype;
          this.selectedModelItems.push(modelObject);
        }
      );

      // we now have to build an array of the selected modeltype inputs
      Object.entries(this.engine.core_models[modeltype].inputs).forEach(
        ([name, input]) => {
          let modelObject = input;
          modelObject["name"] = name;
          modelObject["current_value"] = input.default;
          this.selectedModelItems.push(modelObject);
        }
      );
    },
    buildModelItemTree() {
      // reset all lists
      this.modelTypes = [];
      this.modelNames = [];
      // find all model types and model names
      for (let model in explain.modelState.Models) {
        // push the model instance name to the model list
        this.modelNames.push(model);
        // find the model type
        let modelType = explain.modelState.Models[model].ModelType;
        // if not already in the list push this modeltype name to the list
        if (!this.modelTypeNames.includes(modelType)) {
          this.modelTypeNames.push(modelType);
        }
      }
      // sort the modelnames
      this.modelNames.sort();
    },
  },
  beforeUnmount() {
    // remove the model state event listener
    document.removeEventListener("state", this.buildModelItemTree);
  },
  mounted() {
    try {
      document.removeEventListener("state", this.buildModelItemTree);
    } catch {}
    // add an event listener for when the model state is ready
    document.addEventListener("state", this.buildModelItemTree);
    // get the model state
    explain.getModelState();
  },
};
</script>

<style></style>
