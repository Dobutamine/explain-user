<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      class="bg-indigo-10 text-white headerCustomStyle"
      height-hint="68"
    >
      <q-toolbar>
        <q-toolbar-title class="text-subtitle2">
          Explanatory models in neonatology
        </q-toolbar-title>
        <div class="text-bold text-subtitle2 q-ml-sm">{{ user.name }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-grey-8 text-white footerCustomStyle">
      <q-toolbar>
        <q-toolbar-title class="text-overline">
          <div>{{ statusMessage }}</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { useLoggedInUser } from "stores/loggedInUser";
import { explain } from "../boot/explain";

export default {
  setup() {
    const user = useLoggedInUser();
    return {
      user,
    };
  },
  data() {
    return {
      statusMessage: "No model definition file loaded.",
    };
  },
  methods: {
    statusUpdate() {
      this.statusMessage = "STATUS: " + explain.statusMessage;
    },
  },
  beforeUnmount() {
    document.removeEventListener("status", this.statusUpdate);
  },
  mounted() {
    document.addEventListener("status", this.statusUpdate);
  },
};
</script>

<style scoped>
.headerCustomStyle {
  height: 30px !important;
  display: flex;
  align-items: center !important;
}
.footerCustomStyle {
  height: 30px !important;
  display: flex;
  align-items: center !important;
}
</style>
