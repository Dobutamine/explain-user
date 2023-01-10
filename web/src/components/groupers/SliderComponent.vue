<template>
  <q-card class="q-mt-xs" bordered dark :style="{ width: '100%' }">
    <div class="row q-pa-xs" :style="{ width: '100%' }">
      <div :style="{ 'font-size': '12px', width: '100%' }">
        <div class="items-left row">
          <q-badge
            class="q-mt-sm col text-bold"
            color="dark"
            @click="toggleVisibility"
          >
            {{ grouperItem.properties.caption }}: {{ value }}
            {{ grouperItem.properties.unit }}
          </q-badge>
          <div v-if="visible" class="col text-right">
            <q-btn
              float-right
              v-if="grouperItem.properties.closable"
              :color="butClosedColor"
              class="q-ml-sm q-mt-xs q-pa-xs"
              dense
              size="xs"
              :icon="butClosedCap"
              @click="toggleClose"
            >
            </q-btn>
          </div>
        </div>
        <div class="row">
          <q-slider
            v-if="visible"
            class="q-mt-xs col-9"
            v-model="value"
            :min="grouperItem.properties.min"
            :max="grouperItem.properties.max"
            :step="grouperItem.properties.step"
            dark
            :readonly="closed"
            :color="butClosedColor"
            @update:model-value="update_value"
          />
          <q-btn
            class="q-ma-sm col"
            color="grey-9"
            outline
            size="xs"
            dense
            icon="fa-solid fa-delete-left"
            @click="deleteMe"
          ></q-btn>
        </div>
      </div>
    </div>
  </q-card>
</template>

<script>
export default {
  props: {
    grouperItem: Object,
  },
  data() {
    return {
      visible: true,
      value_caption: "",
      closed: false,
      butClosedColor: "secondary",
      butClosedCap: "fa-solid fa-lock-open",
      butColor: "negative",
      butCap: "",
      value: 100,
      prev_value: 100,
    };
  },
  methods: {
    deleteMe() {
      this.$emit(
        "removegrouperitem",
        this.grouperItem.group,
        this.grouperItem.grouperItem
      );
    },
    updateParent() {
      this.$emit(
        "grouperItemUpdate",
        this.grouperItem.group,
        this.grouperItem.grouperItem,
        this.value
      );
    },
    toggleVisibility() {
      this.visible = !this.visible;
    },
    toggleClose() {
      this.closed = !this.closed;
      if (this.closed) {
        this.prev_value = this.value;
        this.value = this.max;
        this.butClosedColor = "negative";
        this.butClosedCap = "fa-solid fa-lock";
      } else {
        this.value = this.prev_value;
        this.butClosedColor = "secondary";
        this.butClosedCap = "fa-solid fa-lock-open";
      }
    },
    update_value(e) {
      this.updateParent();
    },
  },
  mounted() {
    // this.value = this.grouperItem.value;
    this.butCap = "fa-solid fa-square-share-nodes";
    this.butColor = "negative";
  },
};
</script>

<style></style>
