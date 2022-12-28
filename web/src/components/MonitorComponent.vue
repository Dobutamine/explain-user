<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <div
      class="q-mt-es row gutter text-overline justify-center"
      @click="isEnabled = !isEnabled"
    >
      {{ title }}
    </div>
    <div v-if="parameters.length > 0 && isEnabled">
      <div class="q-ma-sm q-gutter-xs row items-center">
        <div v-for="(field, index) in parameters" :key="index">
          <q-input
            v-model="field.value"
            :label="field.label"
            :hint="field.unit"
            filled
            readonly
            dense
            stack-label
            style="max-width: 90px"
            squared
          />
        </div>
      </div>
    </div>
  </q-card>
</template>

<script>
export default {
  props: {
    title: String,
    collapsed: Boolean,
    parameters: Array,
  },
  data() {
    return {
      isEnabled: true,
    };
  },
  mounted() {
    this.isEnabled = !this.collapsed;
  },
};
</script>

<style></style>
