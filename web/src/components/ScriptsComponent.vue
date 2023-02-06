<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <div
      class="row text-overline justify-center"
      @click="collapsed = !collapsed"
    >
      SCRIPT
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
      <div class="q-mt-es row justify-center">
        <q-input
          class="q-ml-md q-mr-md q-mt-sm"
          v-model="script.name"
          label-color="red"
          label="script name"
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
        v-if="script.script.length > 0"
        class="q-pb-xs q-pt-xs q-ma-md q-mt-xs"
      >
        <q-list bordered separator dark style="font-size: 12px">
          <div v-for="(script_line, index) in script.script" :key="index">
            <div class="row">
              <q-item class="col-7" clickable v-ripple>
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
                icon="fa-solid fa-edit"
                @click="scriptelected(index)"
              ></q-btn>
              <q-btn
                size="xs"
                icon="fa-solid fa-trash"
                @click="scriptLineDelete(index)"
              ></q-btn>
              <q-btn
                size="xs"
                icon="fa-solid fa-angle-up"
                @click="scriptLineUp(index)"
              ></q-btn>
              <q-btn
                size="xs"
                icon="fa-solid fa-angle-down"
                @click="scriptLineDown(index)"
              ></q-btn>
            </div>
          </div>
        </q-list>
      </q-card>

      <div class="q-gutter-sm row text-overline justify-center q-mb-sm q-mt-xs">
        <q-checkbox
          v-if="user.isAdmin"
          label="protected"
          dense
          v-model="this.script.protected"
        ></q-checkbox>
        <q-checkbox
          label="shared"
          dense
          v-model="this.script.shared"
        ></q-checkbox>
      </div>

      <div class="q-gutter-sm row text-overline justify-center q-mb-sm q-mt-sm">
        <q-btn
          v-if="script.script.length > 0"
          color="secondary"
          dense
          size="sm"
          style="width: 50px"
          icon="fa-solid fa-play"
          @click="startScript"
        ></q-btn>
        <q-btn
          v-if="script.script.length > 0"
          color="red-10"
          dense
          size="sm"
          style="width: 50px"
          icon="fa-solid fa-upload"
          @click="saveScriptToServer"
        ></q-btn>
        <q-btn
          color="blue-10"
          dense
          size="sm"
          style="width: 50px"
          icon="fa-solid fa-download"
          @click="openServerCommunication"
        ></q-btn>
        <q-btn
          v-if="script.script.length > 0"
          color="grey-14"
          size="xs"
          dense
          style="width: 50px"
          @click="clearScript"
          icon="fa-solid fa-trash-can"
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
            v-if="typeof selectedNewValue == 'number'"
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
            v-if="typeof selectedNewValue == 'string'"
            class="col q-ma-sm"
            v-model="selectedNewValue"
            label-color="negative"
            label="new value"
            filled
            square
            hide-hint
            dense
            dark
            stack-label
            style="max-width: 100px; font-size: 12px"
          />
          <div
            v-if="typeof selectedNewValue == 'boolean'"
            class="col q-ma-sm bg-grey-10"
          >
            <div :style="{ 'font-size': '10px', width: '70px' }">
              <div class="col text-center text-negative">new value</div>
            </div>
            <div class="col row justify-center">
              <q-toggle
                size="xs"
                dark
                v-model="selectedNewValue"
                style="font-size: 10px"
              />
            </div>
          </div>

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

    <q-popup-edit
      v-if="showPopUpServer"
      fit
      touch-position
      model-value="sylisgek"
    >
      <q-card bordered dark style="width: 300px">
        <div class="row text-overline justify-center">
          available scripts on server
        </div>
        <div class="row">
          <q-select
            class="q-ml-md q-mr-md"
            label-color="red-6"
            v-model="selectedScriptOnServer"
            :options="availableScriptsOnServer"
            hide-bottom-space
            dense
            label="available scripts"
            style="width: 90%; font-size: 12px"
          />
        </div>
        <div
          class="q-gutter-sm row text-overline justify-center q-mt-xs q-mb-sm"
        >
          <q-btn
            color="primary"
            size="sm"
            style="width: 50px"
            @click="getScriptFromServer"
            icon="fa-solid fa-download"
          ></q-btn>
          <q-btn
            color="red-10"
            size="sm"
            style="width: 50px"
            @click="deleteScriptFromServer"
            icon="fa-solid fa-delete-left"
          ></q-btn>
          <q-btn
            color="indigo-10"
            size="sm"
            style="width: 50px"
            @click="closeServerCommunication"
            icon="fa-solid fa-xmark"
          ></q-btn>
        </div>
        <div
          class="q-gutter-sm row text-overline justify-center q-mb-xs"
          style="font-size: 10px"
        >
          {{ statusMessage }}
        </div>
      </q-card>
    </q-popup-edit>
  </q-card>
</template>

<script>
import { explain } from "src/boot/explain";
import { useScriptStore } from "stores/script";
import { useUserStore } from "stores/user";
import { useConfigStore } from "stores/config";

export default {
  setup() {
    const script = useScriptStore();
    const user = useUserStore();
    const config = useConfigStore();
    return {
      script,
      user,
      config,
    };
  },
  components: {},
  data() {
    return {
      apiUrl: "http://localhost:8081",
      collapsed: false,
      relative: true,
      script_names: [],
      currentScriptName: "",
      selectedScript: "",
      showPopUp: false,
      showPopUpServer: false,
      sylisgek: true,
      statusMessage: "",
      input: "",
      selectedIndex: 0,
      selectedScriptItem: "AA.Vol",
      selectedNewValue: 0.0,
      selectedInTime: 0.0,
      selectedAtTime: 0.0,
      availableScriptsOnServer: ["PDA"],
      selectedScriptOnServer: "",
    };
  },
  methods: {
    async saveScriptToServer() {
      // check if script is not protected
      if (this.script.protected) {
        alert("Script is protected!");
        return;
      }

      if (this.script.name === "") {
        alert("Script has no valid name!");
        return;
      }

      const url = `${this.apiUrl}/api/scripts/update_script?token=${this.user.token}`;
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: this.script.name,
          user: this.user.name,
          script: this.script.script,
          protected: this.script.protected,
          shared: this.script.shared,
        }),
      });
      if (response.status === 200) {
        let data = await response.json();
        switch (data.message) {
          case "new":
            this.statusMessage = "new script created on server.";
            break;
          case "update":
            this.statusMessage = "script is updated on server.";
            break;
        }
        setTimeout(() => (this.statusMessage = ""), 1500);
      }
      this.showPopUpServer = false;
    },
    async deleteScriptFromServer() {
      // do a server request
      const url = `${this.apiUrl}/api/scripts/delete_script?token=${this.user.token}`;
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: this.selectedScriptOnServer,
          user: this.user.name,
        }),
      });
      if (response.status === 200) {
        let data = await response.json();
        switch (data.message) {
          case "error":
            this.statusMessage = "script could not be deleted!";
            break;
          case "success":
            this.statusMessage = "script is deleted.";
            break;
        }
        setTimeout(() => (this.statusMessage = ""), 1500);
      }
      this.getAllScriptsFromUser();
    },
    async getScriptFromServer() {
      // do a server request
      const url = `${this.apiUrl}/api/scripts/get_script?token=${this.user.token}`;
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: this.selectedScriptOnServer,
          user: this.user.name,
        }),
      });
      if (response.status === 200) {
        let data = await response.json();
        // process the result
        this.script.user = data.user;
        this.script.name = data.name;
        this.script.script = data.script;
        this.script.protected = data.protected;
        this.script.shared = data.shared;
        this.script.dateUpdated = data.dateUpdated;
        this.script.dateCreated = data.dateCreated;
      }
      this.showPopUpServer = false;
    },
    async getAllScriptsFromUser() {
      // do a server request
      const url = `${this.apiUrl}/api/scripts/get_scripts?token=${this.user.token}`;
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: this.user.name }),
      });
      if (response.status === 200) {
        let data = await response.json();
        // returns an array with all scripts of this user
        if (data.length > 0) {
          this.availableScriptsOnServer = data.map((script) => script.name);
          this.selectedScriptOnServer = "";
        } else {
          this.availableScriptsOnServer = [];
        }
      }
    },
    openServerCommunication() {
      this.showPopUpServer = true;
      this.getAllScriptsFromUser();
    },
    closeServerCommunication() {
      this.showPopUpServer = false;
    },

    saveScriptLineFromPopUp(n, o) {
      this.script.script[this.selectedIndex]["v"] = this.selectedNewValue;
      this.script.script[this.selectedIndex]["it"] = this.selectedInTime;
      this.script.script[this.selectedIndex]["at"] = this.selectedAtTime;
      this.showPopUp = false;
    },
    cancelPopUp() {
      this.showPopUp = false;
    },
    scriptelected(index) {
      this.showPopUp = true;
      this.selectedIndex = index;
      this.selectedNewValue = this.script.script[index]["v"];
      this.selectedInTime = this.script.script[index]["it"];
      this.selectedAtTime = this.script.script[index]["at"];

      //this.showPopUp = true;
    },
    scriptLineUp(index) {
      console.log("up ", index);
      if (index === 0) {
        return;
      }
      [this.script.script[index], this.script.script[index - 1]] = [
        this.script.script[index - 1],
        this.script.script[index],
      ];
    },
    scriptLineDown(index) {
      console.log("down ", index);
      if (index === this.script.script.length - 1) {
        return;
      }

      [this.script.script[index], this.script.script[index + 1]] = [
        this.script.script[index + 1],
        this.script.script[index],
      ];
    },
    scriptLineDelete(index) {
      this.script.script.splice(index, 1);
    },
    clearScript() {
      this.selectedScript = "";
      this.script.script = [];
    },
    translateGrouperEntries() {
      // script t tag has the groupers
      this.script.script.forEach((scriptline) => {
        if (scriptline.t === "grouper") {
          // find the grouper props in the config
          let grouperProps = this.config.groupers[scriptline.m][scriptline.p];
          if (grouperProps.unit === "%") {
            grouperProps.properties.forEach((prop) => {
              let model = prop.model;
              let modelProp = prop.modelProp;
              // get the current value from explain

              // calculate the new value as this is a relative value
              console.log(prop);
            });
          }
        }
      });
    },
    startScript() {
      let processed_script = [];
      this.translateGrouperEntries();
      // this.script.script.forEach((scriptline) => {
      //   // only transfer the pending script states
      //   if (scriptline.state === "pending") {
      //     processed_script.push(scriptline);
      //     scriptline.state = "transferred";
      //   }
      // });
      // // transfer to model
      // explain.addScriptToTaskScheduler(processed_script);
    },
  },
  mounted() {},
};
</script>

<style></style>
