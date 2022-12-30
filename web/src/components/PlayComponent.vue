<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <div v-if="!collapsed">
      <div class="q-mt-es row gutter text-overline justify-center">
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
      <q-card
        v-if="selectedGrouper == 'heart rhythm'"
        class="q-pa-xs q-ma-md"
        bordered
      >
        <div class="q-ma-sm">
          <q-select
            class="q-ma-sm"
            v-model="selected_rhythm"
            :options="rhythm_types"
            hide-bottom-space
            dense
            label="heart rhythm"
            style="width: 90%; font-size: 12px"
          />
        </div>
      </q-card>

      <q-card
        v-if="selectedGrouper == 'heart function'"
        class="q-pa-xs q-ma-md"
        bordered
      >
        <div class="q-ma-sm">
          <q-badge color="dark">
            left heart contractility: {{ contractility }}%
          </q-badge>
          <q-slider v-model="contractility" :min="0" :max="500" />
          <q-badge color="dark">
            right heart contractility: {{ contractility }}%
          </q-badge>
          <q-slider v-model="contractility" :min="0" :max="500" />
        </div>
      </q-card>

      <q-card
        v-if="selectedGrouper == 'heart anatomy'"
        class="q-pa-xs q-ma-md"
        bordered
      >
        <div class="q-ma-sm"></div>
      </q-card>

      <q-card
        v-if="selectedGrouper == 'circulation'"
        class="q-pa-xs q-ma-md"
        bordered
      >
        <div class="q-ma-sm">
          <q-badge color="dark">
            intravascular volume: {{ contractility }} mL/kg
          </q-badge>
          <q-slider v-model="contractility" :min="0" :max="500" />
          <q-badge color="dark">
            systemic vascular resistance: {{ contractility }}%
          </q-badge>
          <q-slider v-model="contractility" :min="0" :max="500" />
          <q-badge color="dark">
            pulmonary vascular resistance: {{ contractility }}%
          </q-badge>
          <q-slider v-model="contractility" :min="0" :max="500" />
          <q-badge color="dark">
            venous pool size: {{ contractility }}%
          </q-badge>
          <q-slider v-model="contractility" :min="0" :max="500" />
        </div>
      </q-card>

      <q-card
        v-if="selectedGrouper == 'shunts'"
        class="q-pa-xs q-ma-md"
        bordered
      >
        <div class="q-ma-sm">
          <q-badge color="dark">
            foramen ovale size: {{ contractility }} mm
          </q-badge>
          <q-slider v-model="contractility" :min="0" :max="500" />
          <q-badge color="dark">
            ductus arteriosus size: {{ contractility }} mm
          </q-badge>
          <q-slider v-model="contractility" :min="0" :max="500" />
          <q-badge color="dark"> lung shunt: {{ contractility }} % </q-badge>
          <q-slider v-model="contractility" :min="0" :max="500" />
          <q-badge color="dark">
            ventricular septal defect size: {{ contractility }} mm
          </q-badge>
          <q-slider v-model="contractility" :min="0" :max="500" />
        </div>
      </q-card>

      <div class="q-gutter-sm row text-overline justify-center q-mb-sm q-mt-sm">
        <q-btn color="secondary" size="sm" style="width: 70px">ADMIT</q-btn>
        <q-btn color="blue-10" size="sm" style="width: 70px">CANCEL</q-btn>
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
export default {
  components: {},
  data() {
    return {
      collapsed: false,
      relative: true,
      groupers: [
        "heart rhythm",
        "heart function",
        "heart anatomy",
        "circulation",
        "shunts",
        "lungs and chestwall",
        "mechanical ventilator",
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
