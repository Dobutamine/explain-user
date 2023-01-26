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
          dark
          label="select grouper"
          style="width: 80%"
          size="sm"
        >
          <q-menu dark>
            <q-list dense>
              <div v-for="(grouper, index) in groupersTree" :key="index">
                <q-item clickable dense>
                  <q-item-section>
                    {{ grouper.group }}
                  </q-item-section>
                  <q-item-section side>
                    <q-icon name="keyboard_arrow_right" />
                  </q-item-section>

                  <q-menu dark anchor="top end" self="top start">
                    <q-list dense>
                      <div v-for="(grouperItem, i) in grouper.items" :key="i">
                        <q-item clickable dense>
                          <q-item-section
                            clickable
                            v-close-popup
                            @click="addGrouperItem(grouper.group, grouperItem)"
                          >
                            {{ grouperItem }}
                          </q-item-section>
                        </q-item>
                      </div>
                    </q-list>
                  </q-menu>
                </q-item>
              </div>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
      <div class="q-ma-sm row items-center">
        <GrouperUpdaterComponentVue
          :grouperItems="selectedGrouperItems"
          style="width: 100%"
          @removeallgroupers="removeAllGroupers"
          @removegrouperitem="removeGrouperItem"
        ></GrouperUpdaterComponentVue>
      </div>
    </div>
  </q-card>
</template>

<script>
import GrouperEditorComponentVue from "./GrouperEditorComponent.vue";
import { useConfigStore } from "src/stores/config";
export default {
  components: {
    GrouperUpdaterComponentVue: GrouperEditorComponentVue,
  },
  setup() {
    const uiConfig = useConfigStore();
    return {
      uiConfig,
    };
  },
  data() {
    return {
      title: "EDIT GROUPERS",
      test: true,
      collapsed: true,
      groupersTree: {},
      selectedGrouperItems: [],
    };
  },
  methods: {
    removeAllGroupers() {
      this.selectedGrouperItems = [];
    },
    removeGrouperItem(group, grouperItem) {
      // make sure the object does exits
      let index = -1;
      for (let gi in this.selectedGrouperItems) {
        if (
          this.selectedGrouperItems[gi].group == group &&
          this.selectedGrouperItems[gi].grouperItem == grouperItem
        ) {
          index = gi;
        }
      }
      // if the grouperItem is found then remove it from the list
      if (index > -1) {
        this.selectedGrouperItems.splice(index, 1);
      }
    },
    addGrouperItem(group, grouperItem) {
      // make sure the object doesn't exist in the current list
      let index = -1;
      for (let gi in this.selectedGrouperItems) {
        if (
          this.selectedGrouperItems[gi].group == group &&
          this.selectedGrouperItems[gi].grouperItem == grouperItem
        ) {
          index = gi;
        }
      }
      // if the grouperItem is not found add it the list
      if (index < 0) {
        this.selectedGrouperItems.push({
          group: group,
          grouperItem: grouperItem,
          properties: this.uiConfig.groupers[group][grouperItem],
        });
      }
    },
    buildGrouperItemTree() {
      // build the grouperItem tree from the ui store
      this.groupersTree = {};
      for (let grouper in this.uiConfig.groupers) {
        let groupersItems = [];
        for (let grouperItem in this.uiConfig.groupers[grouper]) {
          groupersItems.push(grouperItem);
        }
        this.groupersTree[grouper] = { group: grouper, items: groupersItems };
      }
    },
  },
  mounted() {
    this.buildGrouperItemTree();
  },
};
</script>

<style></style>
