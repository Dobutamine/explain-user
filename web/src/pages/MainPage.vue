.
<template>
  <q-page> MAIN PAGE </q-page>
</template>

<script>
import { useLoggedInUser } from "stores/loggedInUser";

export default {
  setup() {
    const user = useLoggedInUser();
    return {
      user,
    };
  },
  mounted() {
    if (!this.user.loggedIn) {
      this.$router.push("/login");
    }
  },
};
</script>

<style></style>
