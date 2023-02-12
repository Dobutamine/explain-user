<template>
  <q-card class="q-mt-xs" bordered dark :style="{ width: '100%' }">
    <div class="row q-pa-xs" :style="{ width: '100%' }">
      <div :style="{ 'font-size': '12px', width: '100%' }">
        <div class="row text-bold">
          <q-toggle
            v-if="visible"
            :label="grouperItem.properties.caption"
            class="q-mt-xs col-9"
            v-model="value"
            dark
            size="xs"
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
    this.value = this.grouperItem.properties.value;
  },
};
</script>

<style></style>
