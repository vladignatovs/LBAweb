<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import fancyInput from "@/components/fancy-input.vue";
const email = ref("");
const password = ref("");

const router = useRouter();
const toast = useToast();

const handleLogin = async () => {
  try {
    const response = await axios.post("/login", {
      email: email.value,
      password: password.value,
    });

    localStorage.setItem("auth_token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    // push user to the page where they are already logged in (preferably showing user data for development)
    toast.success("Logged in successfully!");
    router.push("/account");
  } catch (e) {
    toast.error(e.response?.data?.message ?? "Failed to log in!");
  }
};

const name = ref("");
const passwordConfirmation = ref("");

const handleRegister = async () => {
  try {
    const response = await axios.post("/register", {
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    });

    localStorage.setItem("auth_token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    toast.success("Registered successfully!");
    // push user to the page where they are already logged in (preferably showing user data for development)
    router.push("/account");
  } catch (e) {
    toast.error(e.response?.data?.message ?? "Failed to register an account!");
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
  <!-- REPLACE THIS, JUST A TEST FOR ANIMATIONS -->
  <img
    src="https://static.vecteezy.com/system/resources/previews/020/933/072/non_2x/abstract-blur-gradient-background-vector.jpg"
    alt=""
    class="absolute top-0 z-[-100] h-full w-full" />
  <div class="flex w-full justify-center">
    <button
      :class="loginButton"
      @click="switchMethod"
      class="absolute top-1/2 right-1/2 z-50 -translate-y-1/2 cursor-pointer rounded-l-2xl bg-black/60 px-6 py-3 backdrop-blur-3xl transition-all duration-200 ease-in-out hover:text-white">
      LOGIN
    </button>
    <button
      :class="registerButton"
      @click="switchMethod"
      class="absolute top-1/2 left-1/2 z-50 -translate-y-1/2 cursor-pointer rounded-r-2xl bg-black/60 px-6 py-3 backdrop-blur-3xl transition-all duration-200 ease-in-out hover:text-white">
      REGISTER
    </button>
  </div>
  <!-- REGISTER -->
  <div
    v-if="register"
    class="absolute top-0 right-0 flex h-screen w-1/2 flex-col items-center justify-center transition-all">
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
  </div>
  <!-- LOGIN -->
  <div
    v-else
    class="absolute top-0 left-0 flex h-screen w-1/2 flex-col items-center justify-center transition-all">
    <div class="absolute z-[-10] size-full bg-black/60 backdrop-blur-3xl"></div>
    <form @submit.prevent="handleLogin" class="flex w-1/2 flex-col gap-3">
      <fancy-input v-model="email" type="email" label="Email" />
      <fancy-input v-model="password" type="password" label="Password" />
      <button
        type="submit"
        class="cursor-pointer rounded-2xl border border-white/10 bg-white/10 px-6 py-3 text-white shadow-md backdrop-blur-xl transition-all hover:bg-white/20 hover:shadow-lg focus:bg-white/20 focus:ring-2 focus:ring-white/50 focus:outline-none active:scale-95">
        Login
      </button>
    </form>
  </div>
</template>
