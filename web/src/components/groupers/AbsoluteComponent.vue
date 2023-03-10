<template>
  <q-card class="q-mt-xs" bordered dark :style="{ width: '100%' }">
    <div class="row q-pa-xs" :style="{ width: '100%' }">
      <div :style="{ 'font-size': '12px', width: '100%' }">
        <div class="items-left row">
          <q-badge
            class="q-mt-sm col text-bold"
            color="dark"
            @click="toggleVisibility"
          >
            {{ grouperItem.properties.caption }}
          </q-badge>
        </div>
        <div
          class="q-gutter-sm"
          v-for="(prop, index) in properties"
          :key="index"
        >
          <NumberInputAdvancedComponent
            v-if="prop.type == 'numeric'"
            :name="prop.name"
            unit=""
            :default="prop.current_value"
            :value="prop.current_value"
            @propupdate="propUpdate"
          ></NumberInputAdvancedComponent>
          <BooleanInputAdvancedComponent
            v-if="prop.type == 'boolean'"
            :name="prop.name"
            unit=""
            :default="prop.current_value"
            :value="prop.current_value"
            @propupdate="propUpdate"
          >
          </BooleanInputAdvancedComponent>
        </div>
      </div>
      <q-btn
        class="q-ma-sm col"
        color="grey-9"
        size="xs"
        dense
        @click="deleteMe"
        >remove grouper</q-btn
      >
    </div>
  </q-card>
</template>

<script>
import { explain } from "src/boot/explain";
import NumberInputAdvancedComponent from "../ui-elements/NumberInputAdvancedComponent.vue";
import BooleanInputAdvancedComponent from "../ui-elements/BooleanInputAdvancedComponent.vue";
export default {
  props: {
    grouperItem: Object,
  },
  components: {
    NumberInputAdvancedComponent,
    BooleanInputAdvancedComponent,
  },
  data() {
    return {
      visible: true,
      value_caption: "",
      closed: false,
      properties: [],
      butClosedColor: "secondary",
      butClosedCap: "fa-solid fa-lock-open",
      butColor: "negative",
      butCap: "",
      value: 100,
      prev_value: 100,
      props: {},
    };
  },
  methods: {
    deleteMe() {
      this.$emit(
        "removegrouperitemdirect",
        this.grouperItem.group,
        this.grouperItem.grouperItem
      );
    },
    propUpdate(name, new_value) {
      this.props[name] = new_value;
      this.$emit("grouperItemUpdateDirect", this.props);
    },
    toggleVisibility() {
      this.visible = !this.visible;
    },
  },
  mounted() {
    this.props = {};
    // this.value = this.grouperItem.value;
    this.butCap = "fa-solid fa-square-share-nodes";
    this.butColor = "negative";
    this.value = this.grouperItem.properties.value;

    this.grouperItem.properties.properties.forEach((item) => {
      this.properties.push({
        name: item.model + "." + item.modelProp,
        type: item.typeProp,
        current_value: explain.modelState.Models[item.model][item.modelProp],
      });
      this.props[item.model + "." + item.modelProp] =
        explain.modelState.Models[item.model][item.modelProp];
    });
  },
};
</script>

<style></style>
