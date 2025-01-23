<script setup>
import Navbar from './components/nav-bar.vue'
import Footbar from './components/foot-bar.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <Navbar />
  <RouterView />
  <Footbar />
</template>
