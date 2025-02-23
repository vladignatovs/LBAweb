<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("test@test.com");
const password = ref("test123");
const router = useRouter();

const handleLogin = async () => {
  try {
    const response = await axios.post("http://127.0.0.1:8000/api/login", {
      email: email.value,
      password: password.value,
    });

    localStorage.setItem("auth_token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    // push user to the page where they are already logged in (preferably showing user data for development)
    router.push("/dashboard");
  } catch (e) {
    alert("womp womp");
    console.error(e);
  }
};
</script>
<template>
  <form @submit.prevent="handleLogin">
    <input
      class="bg-white/60"
      v-model="email"
      type="email"
      placeholder="Email" />
    <input
      class="bg-white/60"
      v-model="password"
      type="password"
      placeholder="Password" />
    <button type="submit" class="cursor-pointer bg-white px-5 py-2">
      Submit
    </button>
  </form>
</template>
