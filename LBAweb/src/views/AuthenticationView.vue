<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import fancyInput from "@/components/fancy-input.vue";
import { useAuthStore } from "@/stores/useAuthStore";

const router = useRouter();
const toast = useToast();
const auth = useAuthStore();

const name = ref("");
const email = ref("");
const password = ref("");
const passwordConfirmation = ref("");

const register = ref(false);

function switchMethod() {
  register.value = !register.value;
}

async function handleLogin() {
  try {
    await auth.login(email.value, password.value);
    toast.success("Logged in successfully!");
    router.push({ name: "Account" });
  } catch (e) {
    toast.error(e.response?.data?.message || "Login failed");
  }
}

async function handleRegister() {
  try {
    await auth.register(
      name.value,
      email.value,
      password.value,
      passwordConfirmation.value,
    );
    toast.success("Registered successfully!");
    router.push({ name: "Account" });
  } catch (e) {
    toast.error(e.response?.data?.message || "Registration failed");
  }
}
</script>
<template>
  <div
    class="from-primary-2/10 to-background absolute inset-0 overflow-hidden bg-linear-120 text-white">
    <div
      :class="register ? '-translate-x-1/2' : 'translate-x-0'"
      class="flex h-full w-[200%] gap-[50%] transition-transform duration-500">
      <div class="relative flex w-1/2 items-center justify-center">
        <div class="absolute inset-0 bg-black/60"></div>

        <button
          @click="switchMethod"
          class="absolute top-1/2 right-[-100%] z-20 -translate-y-1/2 rounded-l-2xl bg-black/60 px-6 py-3 text-white transition hover:opacity-80">
          REGISTER
        </button>

        <form
          @submit.prevent="handleLogin"
          class="z-10 flex w-1/2 flex-col gap-4">
          <fancy-input
            v-loading
            v-model="email"
            type="email"
            label="Email"
            id="loginEmail"
            autocomplete="email" />
          <fancy-input
            v-loading
            v-model="password"
            type="password"
            label="Password"
            id="loginPassword"
            autocomplete="current-password" />
          <button
            v-loading
            type="submit"
            class="self-end rounded-2xl border border-white/10 bg-white/10 px-6 py-3 text-white shadow-md backdrop-blur-xl transition-all hover:bg-white/20 focus:ring-2 focus:ring-white/50 active:scale-95">
            Login
          </button>
        </form>
      </div>

      <div class="relative flex w-1/2 items-center justify-center">
        <div class="absolute inset-0 bg-black/60"></div>

        <button
          @click="switchMethod"
          class="absolute top-1/2 left-[-100%] z-20 -translate-y-1/2 rounded-r-2xl bg-black/60 px-6 py-3 text-white transition hover:opacity-80">
          LOGIN
        </button>

        <form
          autocomplete="off"
          @submit.prevent="handleRegister"
          class="z-10 flex w-1/2 flex-col gap-4">
          <fancy-input
            v-loading
            v-model="name"
            label="Username"
            autocomplete="off" />
          <fancy-input
            v-loading
            v-model="email"
            type="email"
            label="Email"
            autocomplete="off" />
          <fancy-input
            v-loading
            v-model="password"
            type="password"
            label="Password"
            autocomplete="off" />
          <fancy-input
            v-loading
            v-model="passwordConfirmation"
            type="password"
            label="Confirm Password"
            autocomplete="off" />
          <button
            v-loading
            type="submit"
            class="self-end rounded-2xl border border-white/10 bg-white/10 px-6 py-3 text-white shadow-md backdrop-blur-xl transition-all hover:bg-white/20 focus:ring-2 focus:ring-white/50 active:scale-95">
            Register
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
