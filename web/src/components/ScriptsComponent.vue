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

      <q-card
        v-if="script.scriptLines.length > 0"
        class="q-pb-xs q-pt-xs q-ma-md"
      >
        <q-list bordered separator dark>
          <div v-for="(script_line, index) in script.scriptLines" :key="index">
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label
                  >{{ script_line.m }}.{{ script_line.p }}</q-item-label
                >
                <q-item-label caption
                  >set to {{ script_line.v }} from {{ script_line.o }} in
                  {{ script_line.it }} sec. at
                  {{ script_line.at }} sec.</q-item-label
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
import { useScriptStore } from "stores/script";

export default {
  setup() {
    const script = useScriptStore();
    return {
      script,
    };
  },
  components: {},
  data() {
    return {
      collapsed: false,
      relative: true,
      script_names: ["PDA"],
      selectedScript: "PDA",
      statusMessage: "",
    };
  },
  methods: {
    clearScript() {
      this.selectedScript = "";
      this.script = [];
    },
    updateScriptFromStore() {},
  },
  mounted() {},
};
</script>

<style></style>
