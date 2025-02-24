<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const user = ref(null);
const router = useRouter();

const fetchUserData = async () => {
  const token = localStorage.getItem("auth_token");

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
  }
};

// api logout invalidates the token, after which frontend deletes the token and user data from the localstorage.
// (theoretically user could still use the token after logging out if it wouldnt have been deleted)
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
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      router.push("/");
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
