<template>
  <q-card class="q-pa-xs q-ma-md" bordered>
    <div
      class="row text-overline justify-center"
      @click="collapsed = !collapsed"
    >
      {{ title }}
    </div>
    <div v-if="!collapsed" class="q-ma-sm">
      <q-select
        class="q-ma-sm"
        v-model="selection"
        :options="options"
        hide-bottom-space
        dense
        label="heart rhythm"
        style="width: 90%; font-size: 12px"
      />
    </div>
  </q-card>
</template>

<script>
export default {
  data() {
    return {
      title: "HEART RHYTHM",
      collapsed: false,
      options: ["sinus", "svt", "vt"],
      selection: "sinus",
    };
  },
};
</script>

<style></style>
