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
          color="grey-9"
          label="select case study"
          style="width: 60%"
          dark
          size="sm"
        >
          <q-menu dark>
            <q-list dense>
              <div v-for="(caseName, index) in caseNames" :key="index">
                <q-item clickable dense>
                  <q-item-section
                    clickable
                    v-close-popup
                    @click="selectCase(caseName)"
                  >
                    {{ caseName }}
                  </q-item-section>
                </q-item>
              </div>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
      <div class="q-ma-sm row items-center">
        <CaseStudiesEditorComponent
          :selectedCase="selectedCase"
        ></CaseStudiesEditorComponent>
      </div>
    </div>
  </q-card>
</template>

<script>
import CaseStudiesEditorComponent from "./CaseStudiesEditorComponent.vue";
import { useCaseStore } from "src/stores/case";
import { useGeneralStore } from "src/stores/general";
import { useUserStore } from "src/stores/user";
export default {
  components: {
    CaseStudiesEditorComponent,
  },
  setup() {
    const caseStudy = useCaseStore();
    const general = useGeneralStore();
    const user = useUserStore();
    return {
      general,
      user,
      caseStudy,
    };
  },
  data() {
    return {
      title: "CASE STUDIES",
      test: true,
      collapsed: true,
      selectedCaseName: "",
      selectedCase: {},
      caseNames: [],
      cases: [],
    };
  },
  methods: {
    selectCase(caseName) {
      this.selectedCaseName = caseName;
      this.cases.forEach((c) => {
        if (c.name === caseName) {
          this.selectedCase = { ...c };
        }
      });
    },
    async getCasesFromServer() {
      const url = `${this.general.apiUrl}/api/cases/get_cases?token=${this.user.token}`;
      // get the user login data
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (response.status === 200) {
        let loaded_cases = await response.json();
        this.buildCaseList(loaded_cases);
        console.log("Case studies loaded.");
        return true;
      } else {
        return false;
      }
    },
    buildCaseList(loaded_cases) {
      this.caseNames = [];
      this.cases = [];
      loaded_cases.forEach((_case) => {
        this.caseNames.push(_case.name);
        this.cases.push(_case);
      });
    },
  },
  mounted() {
    if (this.user.loggedIn) {
      this.getCasesFromServer();
    }
  },
};
</script>

<style></style>
