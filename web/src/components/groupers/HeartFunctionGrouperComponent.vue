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
    </div>
  </q-card>
</template>

<script>
import SliderComponentVue from "../ui-elements/SliderComponent.vue";

export default {
  components: {
    SliderComponentVue,
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
