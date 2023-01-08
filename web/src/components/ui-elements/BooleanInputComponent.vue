<template>
  <div class="row q-mt-sm" :style="{ width: '100%' }">
    <div
      class="bg-indigo-10 row"
      :style="{ 'font-size': '12px', width: '100%' }"
    >
      <div class="col q-mr-xs text-left">
        {{ title }}
      </div>
    </div>
    <q-btn-toggle
      class="q-ma-sm col-9"
      v-model="newValue"
      size="sm"
      dark
      spread
      dense
      no-caps
      toggle-color="blue-grey-6"
      color="grey-9"
      text-color="black"
      :options="[
        { label: 'Enabled', value: true },
        { label: 'Disabled', value: false },
      ]"
      @update:model-value="updateParent"
    />
    <q-btn
      class="q-ma-sm q-mb-xs col"
      color="grey-9"
      outline
      size="xs"
      dense
      icon="fa-solid fa-delete-left"
      @click="deleteMe"
    ></q-btn>
  </div>
</template>

<script>
export default {
  props: {
    caption: String,
    modelName: String,
    modelProp: String,
    value: Boolean,
  },
  watch: {
    value(nv, ov) {
      console.log(nv);
      if (typeof nv === "boolean") {
        this.newValue = nv;
      } else {
        this.newValue = false;
      }
    },
  },
  data() {
    return {
      title: "",
      newValue: false,
      fontSize: "8px",
      unitClass: "row bg-indigo-10",
    };
  },
  methods: {
    deleteMe() {
      this.$emit("propdelete", this.modelName, this.modelProp);
    },
    updateParent() {
      this.$emit("propupdate", this.modelProp, this.newValue);
    },
  },
  mounted() {
    this.newValue = this.value;
    this.title = this.modelName + " " + this.caption;
  },
};
</script>

<style></style>
