<script setup>
import Navbar from './components/nav-bar.vue'
import Footbar from './components/foot-bar.vue'
</script>

<template>
  <Navbar/>
  <router-view/>
  <Footbar/>
</template>