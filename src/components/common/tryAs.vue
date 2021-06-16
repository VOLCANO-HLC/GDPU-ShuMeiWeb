<template>
  <div>
    <div v-for="(item, index) in list" :key="index">{{ item }}</div>
  </div>
</template>

<script>
export default {
  name: "try",
  props: {
    list: Object,
  },
};
</script>

<style>
</style>