<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <div v-if="!collapsed">
      <div class="q-mt-es row gutter text-overline justify-center">
        <q-select
          class="q-ml-md q-mr-md"
          label-color="red-6"
          v-model="selectedScript"
          :options="script_names"
          hide-bottom-space
          dense
          label="scripts"
          style="width: 90%; font-size: 12px"
        />
      </div>

      <q-card v-if="script.length > 0" class="q-pb-xs q-pt-xs q-ma-md">
        <q-list bordered separator dark>
          <div v-for="(script_line, index) in script" :key="index">
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label
                  >{{ script_line.model }}.{{
                    script_line.property
                  }}</q-item-label
                >
                <q-item-label caption
                  >set to {{ script_line.target }} from
                  {{ script_line.current }} in {{ script_line.timeIn }} sec. at
                  {{ script_line.timeAt }} sec.</q-item-label
                >
              </q-item-section>
            </q-item>
          </div>
        </q-list>
      </q-card>
      <div class="q-gutter-sm row text-overline justify-center q-mb-sm q-mt-sm">
        <q-btn color="secondary" size="sm" style="width: 70px">RUN</q-btn>
        <q-btn color="red-10" size="sm" style="width: 70px">SAVE</q-btn>
        <q-btn
          color="grey-14"
          size="sm"
          style="width: 70px"
          @click="clearScript"
          >CLEAR</q-btn
        >
        <q-btn color="blue-10" size="sm" style="width: 70px">DELETE</q-btn>
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
      script_names: ["PDA"],
      selectedScript: "PDA",
      statusMessage: "",
      script: [
        {
          model: "AA",
          property: "ElBase",
          current: 1000,
          target: 1000,
          timeIn: 30,
          timeAt: 60,
          admitted: false,
        },
        {
          model: "PDA",
          property: "Diameter",
          current: 5.0,
          target: 0.0,
          timeIn: 60,
          timeAt: 0,
          admitted: false,
        },
      ],
    };
  },
  methods: {
    clearScript() {
      this.selectedScript = "";
      this.script = [];
    },
  },
  mounted() {},
};
</script>

<style></style>
