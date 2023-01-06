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
          label="grouper"
          style="width: 90%; font-size: 12px"
        />
      </div>
      <div class="q-ma-sm q-gutter-sm row items-center">
        <GrouperUpdaterComponentVue
          v-if="selectedGrouper"
          :grouper="selectedGrouper"
          style="width: 100%"
        ></GrouperUpdaterComponentVue>
      </div>
    </div>
  </q-card>
</template>

<script>
import { explain } from "../boot/explain";
import GrouperUpdaterComponentVue from "./GrouperUpdaterComponent.vue";
import { useUserInterfaceStore } from "src/stores/userInterface";
export default {
  components: {
    GrouperUpdaterComponentVue,
  },
  setup() {
    const uiConfig = useUserInterfaceStore();
    return {
      uiConfig,
    };
  },
  data() {
    return {
      title: "GROUPED MODEL PROPS",
      collapsed: true,
      groupers: [],
      selectedGrouper: "",
    };
  },
  methods: {},
  mounted() {
    // get all the groupers from the store
    this.groupers = [];
    for (let grouper in this.uiConfig.groupers) {
      this.groupers.push(grouper);
    }
  },
};
</script>

<style></style>
