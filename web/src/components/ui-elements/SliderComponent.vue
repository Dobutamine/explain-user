<template>
  <div :style="{ 'font-size': '12px', width: '90%' }">
    <q-separator dark size="1px" color="grey-12"></q-separator>
    <div class="q-mt-sm items-left row">
      <q-badge class="q-mt-sm col" color="dark">
        {{ prefix1 }} {{ grouperItem.caption }}: {{ value1 }}
        {{ grouperItem.unit }}
      </q-badge>
      <div class="col text-right">
        <q-btn
          float-right
          v-if="grouperItem.splittable"
          :color="butColor"
          class="q-pa-xs q-mt-xs"
          dense
          size="xs"
          @click="toggleSplit"
          :icon="butCap"
        ></q-btn>
        <q-btn
          float-right
          v-if="grouperItem.closable"
          :color="butClosedColor1"
          class="q-ml-sm q-mt-xs q-pa-xs"
          dense
          size="xs"
          :icon="butClosedCap1"
          @click="toggleClose1"
        >
        </q-btn>
      </div>
    </div>
    <q-slider
      class="q-mt-xs"
      v-model="value1"
      :min="grouperItem.min"
      :max="grouperItem.max"
      dark
      :readonly="closed1"
      :color="butClosedColor1"
      @update:model-value="update_value1"
    />

    <div v-if="!combined">
      <div class="row items-left">
        <q-badge color="dark col">
          {{ prefix2 }} {{ grouperItem.caption }}: {{ value2 }}
          {{ grouperItem.unit }}
        </q-badge>
        <div class="col text-right">
          <q-btn
            float-right
            v-if="grouperItem.closable"
            :color="butClosedColor2"
            class="q-mt-xs q-pa-xs"
            dense
            size="xs"
            :icon="butClosedCap2"
            @click="toggleClose2"
          ></q-btn>
        </div>
      </div>
      <q-slider
        class="q-mt-xs"
        v-model="value2"
        :min="grouperItem.min"
        :max="grouperItem.max"
        :readonly="closed2"
        dark
        :color="butClosedColor2"
        @update:model-value="update_value2"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    grouperItem: Object,
    grouperItemName: String,
  },
  data() {
    return {
      value1_caption: "",
      value2_caption: "",
      closed1: false,
      butClosedColor1: "secondary",
      butClosedCap1: "fa-solid fa-lock-open",
      closed2: false,
      butClosedColor2: "secondary",
      butClosedCap2: "fa-solid fa-lock-open",
      butColor: "negative",
      butCap: "",
      prefix1_set: "",
      prefix2_set: "",
      prefix1: "",
      prefix2: "",
      value: 100,
      value1: 100,
      prev_value1: 100,
      value2: 100,
      prev_value2: 100,
      combined: false,
    };
  },
  methods: {
    updateParent() {
      this.$emit(
        "grouperItemUpdate",
        this.grouperItemName,
        this.value1,
        this.value2
      );
    },
    toggleClose1() {
      this.closed1 = !this.closed1;
      if (this.closed1) {
        this.prev_value1 = this.value1;
        this.value1 = this.max;
        this.butClosedColor1 = "negative";
        this.butClosedCap1 = "fa-solid fa-lock";
        if (this.combined) {
          this.closed2 = true;
          this.prev_value2 = this.prev_value1;
          this.value2 = this.max;
          this.butClosedColor2 = "negative";
          this.butClosedCap2 = "fa-solid fa-lock";
        }
      } else {
        this.value1 = this.prev_value1;
        this.butClosedColor1 = "secondary";
        this.butClosedCap1 = "fa-solid fa-lock-open";
        if (this.combined) {
          this.closed2 = false;
          this.value2 = this.prev_value2;
          this.butClosedColor2 = "secondary";
          this.butClosedCap2 = "fa-solid fa-lock-open";
        }
      }
    },
    toggleClose2() {
      this.closed2 = !this.closed2;
      if (this.closed2) {
        this.prev_value2 = this.value2;
        this.value2 = this.max;
        this.butClosedColor2 = "negative";
        this.butClosedCap2 = "fa-solid fa-lock";
      } else {
        this.value2 = this.prev_value2;
        this.butClosedColor2 = "secondary";
        this.butClosedCap2 = "fa-solid fa-lock-open";
      }
    },
    toggleSplit() {
      this.combined = !this.combined;
      if (this.combined) {
        this.butCap = "fa-solid fa-square-minus";
        this.butColor = "secondary";
        this.prefix1 = "";
        this.prefix2 = "";
        this.value2 = this.value1;
      } else {
        this.butCap = "fa-solid fa-square-share-nodes";
        this.butColor = "negative";
        this.prefix1 = this.prefix1_set;
        this.prefix2 = this.prefix2_set;
      }
    },

    update_value1(e) {
      if (this.combined) {
        this.value2 = e;
      }
      this.updateParent();
    },
    update_value2(e) {
      if (!this.combined) {
        this.updateParent();
      }
    },
  },
  mounted() {
    this.combined = this.grouperItem.single;
    this.prefix1_set = this.grouperItem.caption1;
    this.prefix2_set = this.grouperItem.caption2;
    if (this.combined) {
      this.butCap = "fa-solid fa-square-minus";
      this.butColor = "secondary";
      this.prefix1 = "";
      this.prefix2 = "";
    } else {
      this.butCap = "fa-solid fa-square-share-nodes";
      this.butColor = "negative";
      this.prefix1 = this.prefix1_set;
      this.prefix2 = this.prefix2_set;
    }
  },
};
</script>

<style></style>
