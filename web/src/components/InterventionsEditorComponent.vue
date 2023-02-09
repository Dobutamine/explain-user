<template>
  <q-card class="q-ma-sm justify-center"> </q-card>
</template>

<script>
import { explain } from "../boot/explain";
import { useScriptStore } from "stores/script";
import { useConfigStore } from "src/stores/config";
import { useDefinitionStore } from "src/stores/definition";

export default {
  setup() {
    const script = useScriptStore();
    const uiConfig = useConfigStore();
    const definition = useDefinitionStore();
    return {
      script,
      uiConfig,
      definition,
    };
  },
  components: {},
  props: {
    selectedIntervention: Object,
  },
  data() {
    return {
      collapsed: false,
      statusMessage: "",
    };
  },
  methods: {},
  mounted() {},
};
</script>

<style></style>
