<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const user = ref(null);
const router = useRouter();

const fetchUserData = async () => {
  const token = localStorage.getItem("auth_token");

  // if (!token) {
  //   router.push("/login");
  //   return;
  // }

  try {
    const response = await axios.get("http://127.0.0.1:8000/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    user.value = response.data;
  } catch (e) {
    console.error(e);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    // router.push("/login");
  }
};

const logout = async () => {
  const token = localStorage.getItem("auth_token");
  await axios
    .post(
      "http://127.0.0.1:8000/api/logout",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    .then((response) => {
      console.log(response.data.message);
      router.push("/");
      // localStorage.removeItem("auth_token");
    })
    .catch((e) => {
      console.error(e);
      alert("womp womp!");
    });
};

onMounted(() => {
  fetchUserData();
});
</script>
<template>
  <div>
    <h1 class="text-3xl text-white">Dashboard</h1>
    <div v-if="user">
      <p>Name: {{ user.name }}</p>
      <p>Email: {{ user.email }}</p>
      <p>Password: {{ user.password }}</p>
      <button @click="logout" class="cursor-pointer">Log out</button>
    </div>
    <div v-else>
      <p>You are not logged in!</p>
    </div>
  </div>
</template>
