.
<template>
  <q-page>
    <div class="q-pa-md row">
      <ModelTreeComponent class="col"></ModelTreeComponent></div
  ></q-page>
</template>

<script>
import ModelTreeComponent from "../components/ModelTreeComponent.vue";

export default {
  components: {
    ModelTreeComponent,
  },
  mounted() {
    this.$q.dark.set(true);
  },
};
</script>

<style></style>
