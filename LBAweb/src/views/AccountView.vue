<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import fancyInput from "@/components/fancy-input.vue";
import fancyFileInput from "@/components/fancy-file-input.vue";

const router = useRouter();
const user = ref(null);
const activeSection = ref("profile");
// const message = ref("");

const newEmail = ref("");

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const avatarFile = ref(null);

const levels = ref([]);

const fetchUserData = async () => {
  // check if user is already logged in by using authentication token (could use "user" as well)
  const token = localStorage.getItem("auth_token");
  try {
    const resp = await axios.get("http://127.0.0.1:8000/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    user.value = resp.data;
    newEmail.value = resp.data.email;
  } catch (e) {
    console.error(e);
    logoutCleanup();
  }
};

const fetchUserLevels = async () => {
  if (!user.value) return;
  const token = localStorage.getItem("auth_token");
  try {
    const resp = await axios.get(
      `http://127.0.0.1:8000/api/user/${user.value.id}/levels`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    levels.value = resp.data;
  } catch (e) {
    console.error("Could not load levels", e);
  }
};

onMounted(async () => {
  await fetchUserData();
  await fetchUserLevels();
});

const logoutCleanup = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user");
  user.value = null;
};

const logout = async () => {
  // check if user is already logged in by using authentication token (could use "user" as well)
  const token = localStorage.getItem("auth_token");
  try {
    await axios.post(
      "http://127.0.0.1:8000/api/logout",
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );
  } catch (e) {
    console.error(e);
  } finally {
    logoutCleanup();
    router.push("/");
  }
};

// const updateEmail = async () => {
//   const token = localStorage.getItem("auth_token");
//   try {
//     await axios.patch(
//       "http://127.0.0.1:8000/api/user/email",
//       { email: newEmail.value },
//       { headers: { Authorization: `Bearer ${token}` } },
//     );
//     message.value = "Email updated!";
//     user.value.email = newEmail.value;
//   } catch (e) {
//     console.error(e);
//     message.value = "Failed to update email.";
//   }
// };

// const changePassword = async () => {
//   if (newPassword.value !== confirmPassword.value) {
//     message.value = "Passwords do not match.";
//     return;
//   }
//   const token = localStorage.getItem("auth_token");
//   try {
//     await axios.patch(
//       "http://127.0.0.1:8000/api/user/password",
//       {
//         current_password: currentPassword.value,
//         password: newPassword.value,
//         password_confirmation: confirmPassword.value,
//       },
//       { headers: { Authorization: `Bearer ${token}` } },
//     );
//     message.value = "Password changed!";
//     currentPassword.value = "";
//     newPassword.value = "";
//     confirmPassword.value = "";
//   } catch (e) {
//     console.error(e);
//     message.value = "Failed to change password.";
//   }
// };

// const uploadAvatar = async () => {
//   if (!avatarFile.value) {
//     message.value = "Select a file first.";
//     return;
//   }
//   const token = localStorage.getItem("auth_token");
//   const form = new FormData();
//   form.append("avatar", avatarFile.value);
//   try {
//     const resp = await axios.post(
//       "http://127.0.0.1:8000/api/user/avatar",
//       form,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       },
//     );
//     user.value.avatar = resp.data.avatar;
//     message.value = "Avatar updated!";
//   } catch (e) {
//     console.error(e);
//     message.value = "Failed to upload avatar.";
//   }
// };
</script>

<template>
  <div class="bg-background text-selected flex min-h-screen">
    <aside class="bg-background-2 text-selected w-1/4 p-4">
      <h2 class="mb-6 text-2xl font-semibold">Account</h2>
      <nav class="space-y-2">
        <button
          class="hover:bg-primary/30 w-full rounded px-3 py-2 text-left transition hover:cursor-pointer"
          :class="{ 'bg-primary-2 text-black': activeSection === 'profile' }"
          @click="activeSection = 'profile'">
          Profile
        </button>
        <button
          class="hover:bg-primary/30 w-full rounded px-3 py-2 text-left transition hover:cursor-pointer"
          :class="{ 'bg-primary-2 text-black': activeSection === 'security' }"
          @click="activeSection = 'security'">
          Security
        </button>
        <button
          class="hover:bg-primary/30 w-full rounded px-3 py-2 text-left transition hover:cursor-pointer"
          :class="{ 'bg-primary-2 text-black': activeSection === 'avatar' }"
          @click="activeSection = 'avatar'">
          Avatar
        </button>
        <button
          class="hover:bg-primary/30 w-full rounded px-3 py-2 text-left transition hover:cursor-pointer"
          :class="{ 'bg-primary-2 text-black': activeSection === 'levels' }"
          @click="activeSection = 'levels'">
          My Levels
        </button>
        <button
          class="border-primary/30 mt-6 w-full border-t px-3 py-2 text-left hover:cursor-pointer"
          @click="logout">
          Log Out
        </button>
      </nav>
    </aside>

    <main class="flex-1 p-8">
      <h1 class="mb-4 text-3xl font-bold">Dashboard</h1>
      <!-- <p v-if="message" class="mb-4 text-green-600">{{ message }}</p> -->

      <section v-if="activeSection === 'profile'" class="space-y-4">
        <h2 class="text-2xl font-semibold">Profile Info</h2>
        <p><strong>Name:</strong> {{ user?.name }}</p>
        <p><strong>Email:</strong> {{ user?.email }}</p>
        <div class="max-w-sm space-y-2">
          <fancy-input v-model="newEmail" label="New Email" />
          <button
            @click="updateEmail"
            class="bg-secondary/50 hover:bg-secondary-2/70 rounded px-4 py-2 text-white hover:cursor-pointer">
            Save Email
          </button>
        </div>
      </section>

      <section v-if="activeSection === 'security'" class="max-w-md space-y-4">
        <h2 class="text-2xl font-semibold">Change Password</h2>
        <fancy-input
          v-model="currentPassword"
          type="password"
          label="Current Password" />
        <fancy-input
          v-model="newPassword"
          type="password"
          label="New Password" />
        <fancy-input
          v-model="confirmPassword"
          type="password"
          label="Confirm New Password" />
        <button
          @click="changePassword"
          class="bg-secondary/50 hover:bg-secondary-2/70 rounded px-4 py-2 text-white hover:cursor-pointer">
          Update Password
        </button>
      </section>

      <section v-if="activeSection === 'avatar'" class="max-w-sm space-y-4">
        <h2 class="text-2xl font-semibold">Profile Picture</h2>
        <div v-if="user?.avatar" class="mb-4">
          <img
            :src="`http://127.0.0.1:8000/storage/${user.avatar}`"
            alt="Current avatar"
            class="h-32 w-32 rounded-full object-cover" />
        </div>
        <fancy-file-input
          v-model="avatarFile"
          label="Choose new avatar"
          accept="image/*" />
        <button
          @click="uploadAvatar"
          class="bg-secondary/50 hover:bg-secondary-2/70 rounded px-4 py-2 text-white hover:cursor-pointer">
          Upload
        </button>
      </section>

      <section v-if="activeSection === 'levels'" class="space-y-4">
        <h2 class="text-2xl font-semibold">My Levels</h2>
        <div v-if="levels.length" class="overflow-x-auto">
          <table class="min-w-full rounded bg-white shadow">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-left">Level Name</th>
                <th class="px-4 py-2 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="lvl in levels"
                :key="lvl.id"
                class="border-t hover:bg-gray-50">
                <td class="px-4 py-2">{{ lvl.name }}</td>
                <td class="px-4 py-2">
                  {{ new Date(lvl.created_at).toLocaleString() }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>No levels registered yet.</div>
      </section>
    </main>
  </div>
</template>
