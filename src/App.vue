<template>
  <n-message-provider>
    <div class="base-container">
      <div class="app-container">
        <BaseHead></BaseHead>
        <div class="content-wrapper">
          <router-view />
        </div>
      </div>
    </div>
  </n-message-provider>
</template>

<script setup>
import BaseHead from "@/components/BaseHead.vue";
import { NMessageProvider } from "naive-ui";
</script>

<style lang="scss">
.base-container {
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  position: relative;
  .app-container {
    overflow: hidden;
    height: 100%;
    width: 100%;
    border-radius: 8px;
    background-color: #f7efe5;
  }
  .content-wrapper {
    width: 100%;
    height: calc(100vh - 48px);
  }
}
</style>
