<template>
  <q-card class="q-pa-xs q-ma-md" bordered>
    <div
      class="row text-overline justify-center"
      @click="collapsed = !collapsed"
    >
      {{ title }}
    </div>
    <div class="q-ma-sm">
      <SliderComponentVue
        caption="heart contractility"
        caption1="L"
        caption2="R"
        unit="%"
        :min="0"
        :max="500"
        :step="1"
        :single="true"
        :splittable="true"
        :closable="false"
      >
      </SliderComponentVue>
      <SliderComponentVue
        caption="heart relaxation"
        caption1="L"
        caption2="R"
        unit="%"
        :min="0"
        :max="100"
        :step="1"
        :single="true"
        :splittable="true"
        :closable="false"
      >
      </SliderComponentVue>
      <SliderComponentVue
        caption="aortic valve resistance"
        caption1="L"
        caption2="R"
        unit="%"
        :min="10"
        :max="1000"
        :step="1"
        :single="true"
        :splittable="false"
        :closable="true"
      >
      </SliderComponentVue>
      <NumberInputComponentVue
        caption="LV pressure"
        unit="mmHg"
        :min="0.1"
        :max="1000.0"
        :step="0.1"
        :relative="false"
      >
      </NumberInputComponentVue>
      <KnobComponentVue
        caption="LV pressure"
        unit="mmHg"
        :min="0"
        :max="100.0"
        :step="1"
        :startValue="50"
      >
      </KnobComponentVue>
      <NumberOutputComponentVue
        caption="LV pressure"
        unit="mmHg"
        :value1="60"
        :value2="40"
        :relative="false"
        :single="false"
      >
      </NumberOutputComponentVue>
      <ModelPropSelectorComponentVue></ModelPropSelectorComponentVue>
    </div>
  </q-card>
</template>

<script>
import ModelPropSelectorComponentVue from "../ui-elements/ModelPropSelectorComponent.vue";
import KnobComponentVue from "../ui-elements/KnobComponent.vue";
import SliderComponentVue from "../ui-elements/SliderComponent.vue";
import NumberOutputComponentVue from "../ui-elements/NumberOutputComponent.vue";
import NumberInputComponentVue from "../ui-elements/NumberInputComponent.vue";
export default {
  components: {
    SliderComponentVue,
    NumberOutputComponentVue,
    NumberInputComponentVue,
    KnobComponentVue,
    ModelPropSelectorComponentVue,
  },
  data() {
    return {
      title: "HEART FUNCTION",
      collapsed: false,
      options: ["sinus", "svt", "vt"],
      selection: "sinus",
    };
  },
};
</script>

<style></style>
