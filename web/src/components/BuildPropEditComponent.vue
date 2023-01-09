<template>
  <q-card class="q-ma-sm">
    <div>
      <q-input
        v-if="selectedModelItems.length > 0"
        class="row q-mb-md"
        dense
        v-model="newModelName"
        label="new model name"
        :style="{ 'font-size': '12px', width: '100%' }"
      />
      <div
        v-for="(selectedModelItem, index) in selectedModelItems"
        :key="index"
      >
        <div v-if="selectedModelItem.typeProp == 'numeric'" class="row q-mt-sm">
          <NumberInputComponentVue
            :modelName="newModelName"
            :caption="selectedModelItem.caption"
            :modelProp="selectedModelItem.modelProp"
            :unit="selectedModelItem.unit"
            :min="selectedModelItem.min"
            :step="selectedModelItem.step"
            :value="0.0"
            :initValue="0.0"
            :displayFactor="selectedModelItem.displayFactor"
            :displayRounding="selectedModelItem.displayRounding"
          >
          </NumberInputComponentVue>
        </div>
        <div v-if="selectedModelItem.typeProp == 'boolean'" class="row q-mt-sm">
          <BooleanInputComponentVue
            :caption="selectedModelItem.caption"
            :modelName="newModelName"
            :modelProp="selectedModelItem.modelProp"
            :value="false"
            :initValue="false"
          >
          </BooleanInputComponentVue>
        </div>
        <div v-if="selectedModelItem.typeProp == 'list'" class="row q-mt-sm">
          <ListInputComponentVue
            :caption="selectedModelItem.caption"
            :modelName="newModelName"
            :modelProp="selectedModelItem.modelProp"
            :options="selectedModelItem.optionalModels"
            value=""
            initValue=""
          >
          </ListInputComponentVue>
        </div>
        <div
          v-if="selectedModelItem.typeProp == 'multilist'"
          class="row q-mt-sm"
        >
          <MultipleListInputComponentVue
            :caption="selectedModelItem.caption"
            :modelName="newModelName"
            :modelProp="selectedModelItem.modelProp"
            :options="selectedModelItem.optionalModels"
            :value="[]"
            :initValue="[]"
          >
          </MultipleListInputComponentVue>
        </div>
      </div>
    </div>

    <div v-if="selectedModelItems.length > 0">
      <div class="q-gutter-sm row text-overline justify-center q-mt-sm q-mb-sm">
        <q-btn color="red-10" size="sm" style="width: 70px" @click="addToModel"
          >ADD</q-btn
        >
        <q-btn color="indigo-10" size="sm" style="width: 70px" @click="cancel"
          >CANCEL</q-btn
        >
      </div>
      <div
        class="q-gutter-sm row text-overline justify-center q-mb-xs"
        style="font-size: 10px"
      >
        {{ statusMessage }}
      </div>
    </div>
  </q-card>
</template>

<script>
import { explain } from "../boot/explain";
import MultipleListInputComponentVue from "./ui-elements/MultipleListInputComponent.vue";
import ListInputComponentVue from "./ui-elements/ListInputComponent.vue";
import BooleanInputComponentVue from "./ui-elements/BooleanInputComponent.vue";
import NumberInputComponentVue from "./ui-elements/NumberInputComponent.vue";
import { useScriptStore } from "stores/script";
import { useUserInterfaceStore } from "src/stores/userInterface";

export default {
  setup() {
    const script = useScriptStore();
    const uiConfig = useUserInterfaceStore();
    return {
      script,
      uiConfig,
    };
  },
  components: {
    MultipleListInputComponentVue,
    ListInputComponentVue,
    NumberInputComponentVue,
    BooleanInputComponentVue,
  },
  props: {
    selectedModelItems: Array,
  },
  data() {
    return {
      newModelName: "",
      statusMessage: "",
    };
  },
  methods: {
    addToModel() {
      if (this.newModelName === "") {
        alert("Give your model component a name!");
      }
    },
    cancel() {
      this.$emit("cancelbuild");
    },
  },
};
</script>

<style></style>
