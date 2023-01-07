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
      <div class="q-mt-xs q-mb-sm row text-overline justify-center">
        <q-btn
          color="secondary"
          dark
          label="select model"
          style="width: 80%"
          size="sm"
        >
          <q-menu dark>
            <q-list dense>
              <div v-for="(model, index) in modelsTree" :key="index">
                <q-item clickable dense>
                  <q-item-section>
                    {{ model.model }}
                  </q-item-section>
                  <q-item-section side>
                    <q-icon name="keyboard_arrow_right" />
                  </q-item-section>

                  <q-menu dark anchor="top end" self="top start">
                    <q-list dense>
                      <div v-for="(prop, i) in model.props" :key="i">
                        <q-item clickable dense>
                          <q-item-section
                            clickable
                            v-close-popup
                            @click="addModelProp(model.model, prop)"
                          >
                            {{ prop }}
                          </q-item-section>
                        </q-item>
                      </div>
                    </q-list>
                  </q-menu>
                </q-item>
              </div>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
      <div class="q-ma-sm q-gutter-sm row items-center">
        <GrouperUpdaterComponentVue
          v-if="!notyet"
          :groupers="selectedGroupers"
          style="width: 100%"
        ></GrouperUpdaterComponentVue>
      </div>
    </div>
  </q-card>
</template>

<script>
import { explain } from "../boot/explain";
import GrouperUpdaterComponentVue from "./GrouperUpdaterComponent.vue";
import { useUserInterfaceStore } from "src/stores/userInterface";
export default {
  components: {
    GrouperUpdaterComponentVue,
  },
  setup() {
    const uiConfig = useUserInterfaceStore();
    return {
      uiConfig,
    };
  },
  data() {
    return {
      notyet: true,
      title: "MODEL PROPS",
      collapsed: true,
      modelsTree: {},
      selectedModelItems: [],
    };
  },
  methods: {
    removeModelProp(model, prop) {
      // make sure the object does exits
      let index = -1;
      for (let gi in this.selectedModelItems) {
        if (
          this.selectedModelItems[gi].model == model &&
          this.selectedModelItems[gi].modelProp == prop
        ) {
          index = gi;
        }
      }
      // if the grouperItem is found then remove it from the list
      if (index > -1) {
        this.selectedModelItems.splice(index, 1);
      }

      console.log(this.selectedModelItems);
    },
    addModelProp(model, prop) {
      // make sure the object doesn't exist
      let index = -1;
      for (let gi in this.selectedModelItems) {
        if (
          this.selectedModelItems[gi].model == model &&
          this.selectedModelItems[gi].prop == prop
        ) {
          index = gi;
        }
      }
      // if the grouperItem is not found add it the list
      if (index < 0) {
        this.selectedModelItems.push({
          model: model,
          prop: prop,
        });
      }

      console.log(this.selectedModelItems);
    },
    buildGrouperItemTree() {
      // build the grouperItem tree from the ui store
      this.modelsTree = {};
      // first find all models

      console.log("buif");
      for (let model in explain.modelState.Models) {
        let modelType = explain.modelState.Models[model].ModelType;
        let props = [];
        if (this.uiConfig.models[modelType]) {
          for (let prop in this.uiConfig.models[modelType].properties) {
            props.push(
              this.uiConfig.models[modelType].properties[prop].modelProp
            );
          }
          this.modelsTree[model] = { model: model, props: props };
        }
      }
    },
  },
  beforeUnmount() {
    // remove the model state event listener
    document.removeEventListener("state", this.buildGrouperItemTree);
  },
  mounted() {
    // add an event listener for when the model state is ready
    document.addEventListener("state", this.buildGrouperItemTree);
    // get the model state
    explain.getModelState();
    console.log("yep");
  },
};
</script>

<style></style>
