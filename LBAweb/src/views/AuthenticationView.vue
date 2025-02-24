<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

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
    if (e.response) {
      error.value =
        e.response.data.message || "Registration failed. Please try again.";
    } else {
      error.value = "Nework error. Please check your connection.";
    }
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
  <div
    v-if="register"
    class="relative float-right flex h-[70vh] w-1/2 flex-col">
    <div class="absolute z-[-10] size-full bg-black/60 backdrop-blur-3xl"></div>
    <!-- TODO: finish this input field, reuse and optimize (could use as a component?) -->
    <div class="relative w-full">
      <input
        type="text"
        id="email"
        class="peer w-full rounded-2xl border border-black bg-black/30 px-3 pt-6 pb-2 text-base backdrop-blur-3xl focus:ring-2 focus:ring-gray-500 focus:outline-none"
        placeholder="" />
      <label
        for="email"
        class="absolute top-2 left-3 text-sm text-white transition-all peer-placeholder-shown:top-[16px] peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-white">
        EMAIL OR USERNAME
      </label>
    </div>
    <form @submit.prevent="handleRegister" class="flex w-3/4 flex-col gap-5">
      <input class="" v-model="name" type="text" placeholder="Name" required />
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
