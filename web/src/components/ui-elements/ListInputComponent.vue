<template>
  <div>
    <div
      v-if="listItems.length > 0"
      :style="{ 'font-size': '10px', width: '100%' }"
    >
      <div class="col q-ml-sm text-left">{{ caption }}</div>
    </div>
    <div v-if="listItems.length > 0" class="row text-left q-ml-sm">
      <div v-for="(lit, index) in listItems" :key="index">
        <q-item
          dense
          clickable
          v-ripple
          text-center
          class="q-mr-sm bg-indigo-10"
          :style="{ 'font-size': '12px' }"
        >
          <q-item-section>{{ lit }}</q-item-section>
        </q-item>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    caption: String,
    modelProp: String,
    value: Array,
  },
  watch: {
    value(nv, ov) {
      this.listItems = nv;
    },
  },
  data() {
    return {
      fontSize: "8px",
      unitClass: "row bg-indigo-10",
      listItems: [],
    };
  },
  methods: {
    updateParent() {
      this.$emit("propupdate", this.modelProp, this.newValue);
    },
  },
};
</script>

<style></style>
