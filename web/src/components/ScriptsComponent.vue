<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <div v-if="!collapsed">
      <div class="q-mt-es row justify-center">
        <q-input
          class="q-ml-md q-mr-md q-mt-sm"
          v-model="script.scriptName"
          label-color="red"
          label="current script"
          filled
          square
          hide-hint
          dense
          dark
          stack-label
          style="width: 90%; font-size: 12px"
        />
      </div>

      <q-card
        v-if="script.scriptLines.length > 0"
        class="q-pb-xs q-pt-xs q-ma-md q-mt-xs"
      >
        <q-list bordered separator dark style="font-size: 10px">
          <div v-for="(script_line, index) in script.scriptLines" :key="index">
            <div class="row">
              <q-item class="col-8" clickable v-ripple>
                <q-item-section>
                  <q-item-label
                    >{{ script_line.m }}.{{ script_line.p }}
                  </q-item-label>
                  <q-item-label caption>
                    {{ script_line.o }} -> {{ script_line.v }} in
                    {{ script_line.it }} s. at {{ script_line.at }} s.
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-btn
                size="xs"
                dense
                icon="fa-solid fa-edit"
                @click="scriptLineSelected(index)"
              ></q-btn>
              <q-btn
                size="xs"
                dense
                icon="fa-solid fa-trash"
                @click="scriptLineDelete(index)"
              ></q-btn>
              <q-btn
                size="xs"
                dense
                icon="fa-solid fa-angle-up"
                @click="scriptLineUp(index)"
              ></q-btn>
              <q-btn
                size="xs"
                dense
                icon="fa-solid fa-angle-down"
                @click="scriptLineDown(index)"
              ></q-btn>
            </div>
          </div>
        </q-list>
      </q-card>
      <div
        v-if="script.scriptLines.length > 0"
        class="q-gutter-sm row text-overline justify-center q-mb-sm q-mt-sm"
      >
        <q-btn
          color="secondary"
          size="sm"
          style="width: 70px"
          icon="fa-solid fa-play"
        ></q-btn>
        <q-btn
          color="red-10"
          size="sm"
          style="width: 70px"
          icon="fa-solid fa-upload"
        ></q-btn>
        <q-btn
          color="grey-14"
          size="xs"
          style="width: 70px"
          @click="clearScript"
          icon="fa-solid fa-delete-left"
        ></q-btn>
      </div>
      <div
        class="q-gutter-sm row text-overline justify-center q-mb-xs"
        style="font-size: 10px"
      >
        {{ statusMessage }}
      </div>
    </div>

    <q-popup-edit v-if="showPopUp" fit touch-position model-value="sylisgek">
      <q-card bordered dark>
        <div class="row text-overline justify-center">
          edit {{ selectedScriptItem }} script entry
        </div>
        <div class="row">
          <q-input
            class="col q-ma-sm"
            v-model="selectedNewValue"
            label-color="negative"
            label="new value"
            filled
            square
            hide-hint
            type="number"
            :min="0.0"
            :step="1.0"
            dense
            dark
            stack-label
            style="max-width: 100px; font-size: 12px"
          />
          <q-input
            class="col q-ma-sm"
            label-color="red-10"
            v-model="selectedInTime"
            label="in time(s)"
            filled
            square
            hide-hint
            type="number"
            :min="0.0"
            :step="1.0"
            dense
            dark
            stack-label
            style="max-width: 80px; font-size: 12px"
          />
          <q-input
            class="col q-ma-sm"
            label-color="red-10"
            v-model="selectedAtTime"
            label="at time(s)"
            filled
            square
            hide-hint
            type="number"
            :min="0.0"
            :step="1.0"
            dense
            dark
            stack-label
            style="max-width: 80px; font-size: 12px"
          />
        </div>
        <div
          class="q-gutter-sm row text-overline justify-center q-mt-xs q-mb-sm"
        >
          <q-btn
            color="red-10"
            size="sm"
            style="width: 50px"
            @click="saveScriptLineFromPopUp"
            icon="fa-solid fa-edit"
          ></q-btn>
          <q-btn
            color="indigo-10"
            size="sm"
            style="width: 50px"
            @click="cancelPopUp"
            icon="fa-solid fa-xmark"
          ></q-btn>
        </div>
      </q-card>
    </q-popup-edit>
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
      script_names: [],
      currentScriptName: "",
      selectedScript: "",
      showPopUp: false,
      sylisgek: true,
      statusMessage: "",
      input: "",
      selectedIndex: 0,
      selectedScriptItem: "AA.Vol",
      selectedNewValue: 0.0,
      selectedInTime: 0.0,
      selectedAtTime: 0.0,
    };
  },
  methods: {
    saveScriptLineFromPopUp(n, o) {
      this.script.scriptLines[this.selectedIndex]["v"] = this.selectedNewValue;
      this.script.scriptLines[this.selectedIndex]["it"] = this.selectedInTime;
      this.script.scriptLines[this.selectedIndex]["at"] = this.selectedAtTime;
      this.showPopUp = false;
    },
    cancelPopUp() {
      this.showPopUp = false;
    },
    scriptLineSelected(index) {
      this.showPopUp = true;
      this.selectedIndex = index;
      this.selectedNewValue = this.script.scriptLines[index]["v"];
      this.selectedInTime = this.script.scriptLines[index]["it"];
      this.selectedAtTime = this.script.scriptLines[index]["at"];

      //this.showPopUp = true;
    },
    scriptLineUp(index) {
      console.log("up ", index);
      if (index === 0) {
        return;
      }
      [this.script.scriptLines[index], this.script.scriptLines[index - 1]] = [
        this.script.scriptLines[index - 1],
        this.script.scriptLines[index],
      ];
    },
    scriptLineDown(index) {
      console.log("down ", index);
      if (index === this.script.scriptLines.length - 1) {
        return;
      }

      [this.script.scriptLines[index], this.script.scriptLines[index + 1]] = [
        this.script.scriptLines[index + 1],
        this.script.scriptLines[index],
      ];
    },
    scriptLineDelete(index) {
      this.script.scriptLines.splice(index, 1);
    },
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
