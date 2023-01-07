<template>
  <div :style="{ 'font-size': '12px', width: '100%' }">
    <div class="q-mt-sm items-left row">
      <q-badge class="q-mt-sm col" color="dark" @click="toggleVisibility">
        {{ grouperItem.caption }}: {{ value }}
        {{ grouperItem.unit }}
      </q-badge>
      <div v-if="visible" class="col text-right">
        <q-btn
          float-right
          v-if="grouperItem.closable"
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
    <q-slider
      v-if="visible"
      class="q-mt-xs"
      v-model="value"
      :min="grouperItem.min"
      :max="grouperItem.max"
      :step="grouperItem.step"
      dark
      :readonly="closed"
      :color="butClosedColor"
      @update:model-value="update_value"
    />

    <q-separator
      class="q-mt-sm"
      dark
      size="0.1px"
      color="grey-12"
    ></q-separator>
  </div>
</template>

<script>
export default {
  props: {
    grouper: String,
    grouperItem: Object,
    grouperItemName: String,
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
    updateParent() {
      this.$emit(
        "grouperItemUpdate",
        this.grouper,
        this.grouperItemName,
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
    this.value = this.grouperItem.value;
    this.butCap = "fa-solid fa-square-share-nodes";
    this.butColor = "negative";
  },
};
</script>

<style></style>
