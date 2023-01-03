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
      <div class="q-mt-xs q-mb-sm row gutter text-overline justify-center">
        <q-select
          class="q-ml-md q-mr-md"
          label-color="red-6"
          v-model="selectedGrouper"
          :options="groupers"
          hide-bottom-space
          dense
          label="category"
          style="width: 90%; font-size: 12px"
        />
      </div>
      <HeartRhythmComponentVue
        v-if="selectedGrouper == 'heart rhythm'"
      ></HeartRhythmComponentVue>

      <HeartFunctionComponentVue v-if="selectedGrouper == 'heart function'">
      </HeartFunctionComponentVue>

      <CirculationComponentVue
        v-if="selectedGrouper == 'circulation'"
      ></CirculationComponentVue>

      <ShuntsComponentVue
        v-if="selectedGrouper == 'shunts'"
      ></ShuntsComponentVue>
    </div>
  </q-card>
</template>

<script>
import HeartRhythmComponentVue from "./groupers/HeartRhythmGrouperComponent.vue";
import HeartFunctionComponentVue from "./groupers/HeartFunctionGrouperComponent.vue";
import CirculationComponentVue from "./groupers/CirculationGrouperComponent.vue";
import ShuntsComponentVue from "./groupers/ShuntsGrouperComponent.vue";

export default {
  components: {
    HeartRhythmComponentVue,
    HeartFunctionComponentVue,
    CirculationComponentVue,
    ShuntsComponentVue,
  },
  data() {
    return {
      title: "GROUPED MODEL PROPS",
      collapsed: false,
      relative: true,
      groupers: [
        "heart rhythm",
        "heart function",
        "heart anatomy",
        "circulation",
        "shunts",
        "breathing",
        "lungs and chestwall",
        "airways and dead space",
        "mechanical ventilator",
        "gas exchange",
        "metabolism",
        "autonomic nervous system",
        "acidbase and oxygenation",
        "blood composition",
        "gas composition",
        "pericardium",
        "coronary circulation",
        "ecmo",
        "pda",
        "artificial whomb",
      ],
      selectedGrouper: "",
      contractility: 100,
      rhythm_types: ["sinus", "svt", "vt"],
      selected_rhythm: "sinus",
      statusMessage: "",
    };
  },
  methods: {},
  mounted() {},
};
</script>

<style></style>
