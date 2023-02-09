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
      <div class="q-mt-xs q-mb-sm row text-overline justify-center">
        <q-btn
          color="primary"
          label="select model"
          style="width: 60%"
          dark
          size="sm"
        >
          <q-menu dark>
            <q-list dense>
              <div
                v-for="(interventionName, index) in interventionNames"
                :key="index"
              >
                <q-item clickable dense>
                  <q-item-section
                    clickable
                    v-close-popup
                    @click="selectIntervention(interventionName)"
                  >
                    {{ interventionName }}
                  </q-item-section>
                </q-item>
              </div>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
      <div class="q-ma-sm row items-center">
        <InterventionsEditorComponent
          :selectedIntervention="selectedIntervention"
        ></InterventionsEditorComponent>
      </div>
    </div>
  </q-card>
</template>

<script>
import InterventionsEditorComponent from "./InterventionsEditorComponent.vue";
import { useInterventionStore } from "src/stores/intervention";
import { useGeneralStore } from "src/stores/general";
import { useUserStore } from "src/stores/user";
import { useDefinitionStore } from "src/stores/definition";
export default {
  components: {
    InterventionsEditorComponent,
  },
  setup() {
    const intervention = useInterventionStore();
    const general = useGeneralStore();
    const user = useUserStore();
    const definition = useDefinitionStore();
    return {
      general,
      user,
      intervention,
      definition,
    };
  },
  data() {
    return {
      title: "THERAPEUTIC INTERVENTIONS",
      test: true,
      collapsed: false,
      selectedInterventionName: "",
      selectedIntervention: {},
      interventionNames: [],
      interventions: [],
    };
  },
  methods: {
    selectIntervention(interventionName) {
      this.selectedIntervention = interventionName;
      this.interventions.forEach((c) => {
        if (c.name === interventionName) {
          this.selectedIntervention = { ...c };
        }
      });
    },
    async getInterventionsFromServer() {
      const url = `${this.general.apiUrl}/api/interventions/get_interventions?token=${this.user.token}`;
      // get the user login data
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          definition: this.definition.name,
        }),
      });

      if (response.status === 200) {
        let loaded_interventions = await response.json();
        this.buildInterventionList(loaded_interventions);
        console.log("Therapeutic interventions loaded.");
        return true;
      } else {
        return false;
      }
    },
    buildInterventionList(loaded_interventions) {
      this.interventionNames = [];
      this.interventions = [];
      loaded_interventions.forEach((_intervention) => {
        this.interventionNames.push(_intervention.name);
        this.interventions.push(_intervention);
      });
    },
  },
  mounted() {
    if (this.user.loggedIn) {
      this.getInterventionsFromServer();
    }
  },
};
</script>

<style></style>
