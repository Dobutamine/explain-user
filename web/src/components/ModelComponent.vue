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
        v-if="definition.name !== ''"
        class="row text-overline justify-center"
      >
        {{ definition.name }}
      </div>
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
        <q-btn color="primary" class="col q-mr-sm" label="add" dark size="sm">
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
        </q-btn>
        <q-btn
          color="secondary"
          class="col q-mr-sm"
          label="edit"
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
        <q-btn color="negative" class="col" label="delete" dark size="sm">
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
        </q-btn>
      </div>
      <div class="q-ma-sm q-gutter-sm row items-center">
        <ModelEditorComponent
          :selectedModelItems="selectedModelItems"
          :modelName="selectedModelName"
          :modelType="selectedModelType"
          :editMode="editMode"
          @cancelbuild="cancelBuild"
        >
        </ModelEditorComponent>
      </div>
    </div>
  </q-card>
</template>

<script>
import { explain } from "../boot/explain";
import ModelEditorComponent from "./ModelEditorComponent.vue";
import { useConfigStore } from "src/stores/config";
import { useDefinitionStore } from "src/stores/definition";
import { useEngineStore } from "src/stores/engine";
export default {
  components: {
    ModelEditorComponent,
  },
  setup() {
    const uiConfig = useConfigStore();
    const definition = useDefinitionStore();
    const engine = useEngineStore();
    return {
      uiConfig,
      definition,
      engine,
    };
  },
  data() {
    return {
      notyet: true,
      title: "MODEL EDITOR",
      collapsed: false,
      modelsTree: {},
      selectedModelType: "",
      selectedModelItems: [],
      editMode: 0,
      modelTypeNames: [],
      modelNames: [],
      selectedModelName: "",
    };
  },
  methods: {
    cancelBuild() {},
    selectModel(modelName) {
      this.editMode = 1;
      // we now have to build an array of the selected model props
      this.selectedModelItems = [];
      // find the

      this.selectedModelName = modelName;
    },
    selectModelType(modeltype) {
      this.selectedModelItems = [];
      // search the properties needed for this modeltype in the uiconfig
      this.editMode = 0;
      // we now have to build an array pf the selected modeltype inputs
      Object.entries(this.engine.core_models[modeltype].inputs).forEach(
        ([name, input]) => {
          let modelObject = input;
          modelObject["name"] = name;
          modelObject["value"] = input.default;
          this.selectedModelItems.push(modelObject);
        }
      );
      console.log(this.selectedModelItems);
      // this.selectedModelItems = this.engine.core_models[modeltype].inputs;
      // this.selectedModelType = modeltype;
    },
    removeAllProps() {},
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
