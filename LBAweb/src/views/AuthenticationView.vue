<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import fancyInput from "@/components/fancy-input.vue";
const email = ref("");
const password = ref("");

const error = ref("");
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
    router.push("/account");
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
    router.push("/account");
  } catch (e) {
    alert("womp womp");
    console.error(e.message);
    if (e.response) {
      error.value =
        e.response.data.message || "Registration failed. Please try again.";
    } else {
      error.value = "Nework error. Please check your connection.";
    }
  }
};

const register = ref(false);

const registerButton = ref("visible");
const loginButton = ref("hidden");

const switchMethod = async () => {
  register.value = !register.value;
  registerButton.value = register.value ? "hidden" : "visible";
  loginButton.value = register.value ? "visible" : "hidden";
};
</script>
<template>
  <div class="flex w-full justify-center">
    <button
      :class="loginButton"
      @click="switchMethod"
      class="absolute top-1/2 right-1/2 z-50 -translate-y-1/2 cursor-pointer rounded-l-lg bg-black/60 px-6 py-3 backdrop-blur-3xl transition-all duration-200 ease-in-out hover:text-white">
      LOGIN
    </button>
    <button
      :class="registerButton"
      @click="switchMethod"
      class="absolute top-1/2 left-1/2 z-50 -translate-y-1/2 cursor-pointer rounded-r-lg bg-black/60 px-6 py-3 backdrop-blur-3xl transition-all duration-200 ease-in-out hover:text-white">
      REGISTER
    </button>
  </div>
  <!-- REGISTER -->
  <div
    v-if="register"
    class="absolute top-0 right-0 flex h-screen w-1/2 flex-col items-center justify-center">
    <div class="absolute z-[-10] size-full bg-black/60 backdrop-blur-3xl"></div>
    <form @submit.prevent="handleRegister" class="flex w-1/2 flex-col gap-3">
      <fancy-input v-model="name" label="Username" />
      <fancy-input v-model="email" type="email" label="Email" />
      <fancy-input v-model="password" type="password" label="Password" />
      <fancy-input
        v-model="passwordConfirmation"
        type="password"
        label="Confirm Password" />
      <button
        type="submit"
        class="cursor-pointer rounded-2xl border border-white/10 bg-white/10 px-6 py-3 text-white shadow-md backdrop-blur-xl transition-all hover:bg-white/20 hover:shadow-lg focus:bg-white/20 focus:ring-2 focus:ring-white/50 focus:outline-none active:scale-95">
        Register
      </button>
    </form>
    <!-- <p v-if="error" class="text-red-500">{{ error }}</p> -->
  </div>
  <!-- LOGIN -->
  <div
    v-else
    class="absolute top-0 left-0 flex h-screen w-1/2 flex-col items-center justify-center">
    <div class="absolute z-[-10] size-full bg-black/60 backdrop-blur-3xl"></div>
    <form @submit.prevent="handleLogin" class="flex w-1/2 flex-col gap-3">
      <fancy-input v-model="email" type="email" label="Email" />
      <fancy-input v-model="password" type="password" label="Password" />
      <button
        type="submit"
        class="cursor-pointer rounded-2xl border border-white/10 bg-white/10 px-6 py-3 text-white shadow-md backdrop-blur-xl transition-all hover:bg-white/20 hover:shadow-lg focus:bg-white/20 focus:ring-2 focus:ring-white/50 focus:outline-none active:scale-95">
        Submit
      </button>
    </form>
  </div>
</template>
<style>
input:-webkit-autofill {
  background-color: #00e1ff !important;
  color: #000 !important;
  transition: background-color 5000s ease-in-out 0s;
}
input:-webkit-autofill:focus {
  background-color: #00e1ff !important;
  color: #000 !important;
}
</style>
