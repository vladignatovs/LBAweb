<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");

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

const name = ref("");
const passwordConfirmation = ref("");

const handleRegister = async () => {
  try {
    const response = await axios.post("http://127.0.0.1:8000/api/register", {
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    });

    localStorage.setItem("auth_token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    // push user to the page where they are already logged in (preferably showing user data for development)
    router.push("/dashboard");
  } catch (e) {
    alert("womp womp");
    console.error(e.message);
    // if(e.response) {
    //   error.value = e.response.data.message || 'Registration failed. Please try again.';
    // } else {
    //   error.value = 'Nework error. Please check your connection.';
    // }
  }
};

const register = ref(false);
const switchMethod = async () => {
  if (register) {
    register.value = !register.value;
  }
};
</script>
<template>
  <div>
    <button @click="switchMethod">Switch</button>
  </div>
  <!-- REGISTER -->
  <div v-if="register">
    <form @submit.prevent="handleRegister">
      <input v-model="name" type="text" placeholder="Name" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required />
      <input
        v-model="passwordConfirmation"
        type="password"
        placeholder="Confirm Password"
        required />
      <button type="submit">Register</button>
    </form>
    <!-- <p v-if="error" class="text-red-500">{{ error }}</p> -->
  </div>
  <!-- LOGIN -->
  <div v-else>
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
  </div>
</template>
