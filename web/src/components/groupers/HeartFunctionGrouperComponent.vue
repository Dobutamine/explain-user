<template>
  <q-card class="q-pa-xs q-ma-md" bordered>
    <div
      class="row text-overline justify-center"
      @click="collapsed = !collapsed"
    >
      {{ title }}
    </div>
    <div class="q-ma-sm">
      <DoubleSliderComponentVue
        caption="heart contractility"
        unit="%"
        :min="0"
        :max="500"
        :step="1"
        :connected="true"
      >
      </DoubleSliderComponentVue>
      <DoubleSliderComponentVue
        caption="heart relaxation"
        unit="%"
        :min="0"
        :max="500"
        :step="1"
        :connected="true"
      >
      </DoubleSliderComponentVue>
    </div>
  </q-card>
</template>

<script>
import DoubleSliderComponentVue from "../ui-elements/DoubleSliderComponent.vue";
import SliderComponentVue from "../ui-elements/SliderComponent.vue";

export default {
  components: {
    DoubleSliderComponentVue,
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
