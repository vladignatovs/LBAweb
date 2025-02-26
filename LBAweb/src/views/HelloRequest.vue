<script setup>
// ref import is used to create reactive and dynamic variables
import { ref, onMounted } from "vue";

// const message is empty, yet by using ref it is dynamic and can be changed
const message = ref("");

onMounted(async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/message");
    const data = await response.json();
    message.value = data.message;
  } catch (e) {
    console.error(e);
  }
});
</script>
<template>
  <h1>
    {{ message }}
  </h1>
</template>
