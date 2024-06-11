<template>
  <div class="card-wrapper">
    <!-- <div class="card-head space-between">
      <div class="title">{{ title }}</div>
      <slot name="action"></slot>
    </div> -->
    <div class="card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
defineProps({
  title: {
    type: String,
  },
});
</script>

<style lang="scss" scoped>
.card-wrapper {
  box-sizing: border-box;
  border: 2px solid #4c5557;
  .card-head {
    height: 45px;
    color: #1d1a11;
    font-size: 16px;
    font-weight: 600;
    border-bottom: 2px solid #4c5557;
    background-color: #bdbcb4;
    padding: 0 16px;
  }
  .card-content {
    padding: 16px;
    height: calc(100% - 45px);
  }
}
</style>
