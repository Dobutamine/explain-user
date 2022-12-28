<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <div
      class="q-mt-es row gutter text-overline justify-center"
      @click="isEnabled = !isEnabled"
    >
      {{ title }}
    </div>
    <div v-if="isEnabled">
      <div class="q-mt-es row gutter text-overline justify-center">
        <q-select
          class="q-ml-md q-mr-md"
          label-color="red-6"
          v-model="selectedModel"
          :options="models"
          hide-bottom-space
          dense
          label="model"
          style="width: 100%; font-size: 12px"
        />
      </div>
      <div v-if="models.length > 0">
        <div class="q-ma-sm q-gutter-xs row items-center">
          <div v-for="(field, index) in properties" :key="index">
            <q-input
              v-model="field.value"
              :label="field"
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
      <div class="q-gutter-sm row text-overline justify-center q-mb-sm">
        <q-btn color="red-10" size="sm">UPDATE</q-btn>
        <q-btn color="blue-10" size="sm">CANCEL</q-btn>
      </div>
    </div>
  </q-card>
</template>

<script>
export default {
  props: {
    title: String,
    collapsed: Boolean,
    models: Array,
    properties: Array,
  },
  data() {
    return {
      isEnabled: true,
      selectedModel: "",
    };
  },
  mounted() {
    this.isEnabled = !this.collapsed;
  },
};
</script>

<style></style>
