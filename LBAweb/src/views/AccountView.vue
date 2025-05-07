<script setup>
import { ref, onMounted, watch } from "vue";
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
const completions = ref([]);
const friends = ref([]);
const incomingRequests = ref([]);
const blockedUsers = ref([]);

const loaded = {
  levels: false,
  completions: false,
  friends: false,
  requests: false,
  blocked: false,
};

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem("auth_token")}` };
}

const fetchUserData = async () => {
  // check if user is already logged in by using authentication token (could use "user" as well)
  try {
    const resp = await axios.get("/user", { headers: authHeaders() });
    user.value = resp.data;
    newEmail.value = resp.data.email;
  } catch (e) {
    console.error(e);
    logoutCleanup();
  }
};

// ON MOUNTED
onMounted(fetchUserData);

const fetchLevels = async () => {
  if (!user.value) return;
  try {
    loaded.levels = true;
    const resp = await axios.get("/levels", { headers: authHeaders() });
    levels.value = resp.data;
  } catch (e) {
    console.error("Could not load levels", e);
  }
};

const fetchCompletions = async () => {
  if (!user.value) return;
  try {
    loaded.completions = true;
    const resp = await axios.get("/completions", { headers: authHeaders() });
    completions.value = resp.data;
  } catch (e) {
    console.error("Could not load completions", e);
  }
};

const fetchFriends = async () => {
  if (loaded.friends) return;
  try {
    loaded.friends = true;
    const { data } = await axios.get("/friendships", {
      headers: authHeaders(),
    });
    friends.value = data;
  } catch (e) {
    console.error("Could not load friends", e);
  }
};

const fetchIncomingRequests = async () => {
  if (loaded.requests) return;
  try {
    loaded.requests = true;
    const { data } = await axios.get("/friend-requests", {
      headers: authHeaders(),
    });
    incomingRequests.value = data;
  } catch (e) {
    console.error("Could not load completions", e);
  }
};

const fetchBlockedUsers = async () => {
  if (loaded.blocked) return;
  try {
    loaded.blocked = true;
    const { data } = await axios.get("/blocks", { headers: authHeaders() });
    blockedUsers.value = data;
  } catch (e) {
    console.error("Could not load completions", e);
  }
};

const removeFriend = async (id) => {
  await axios.delete(`/friendships/${id}`, { headers: authHeaders() });
  friends.value = friends.value.filter((f) => f.id !== id);
};

// const messageFriend = (id) => {
//   router.push({ name: "MessageThread", params: { userId: id } });
// };

const acceptRequest = async (id) => {
  await axios.patch(
    `/friend-requests/${id}`,
    { status: true },
    { headers: authHeaders() },
  );
  incomingRequests.value = incomingRequests.value.filter((r) => r.id !== id);
};

const denyRequest = async (id) => {
  await axios.patch(
    `/friend-requests/${id}`,
    { status: false },
    { headers: authHeaders() },
  );
  incomingRequests.value = incomingRequests.value.filter((r) => r.id !== id);
};

const unblockUser = async (id) => {
  await axios.delete(`/blocks/${id}`, { headers: authHeaders() });
  blockedUsers.value = blockedUsers.value.filter((b) => b.id !== id);
};

// When activeSection changes, lazy-fetch only the needed list
watch(activeSection, (section) => {
  switch (section) {
    case "levels":
      fetchLevels();
      break;
    case "completions":
      fetchCompletions();
      break;
    case "friends":
      fetchFriends();
      break;
    case "requests":
      fetchIncomingRequests();
      break;
    case "blocked":
      fetchBlockedUsers();
      break;
  }
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
      "/logout",
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
          class="hover:bg-primary/30 w-full rounded px-3 py-2 text-left transition hover:cursor-pointer"
          :class="{
            'bg-primary-2 text-black': activeSection === 'completions',
          }"
          @click="activeSection = 'completions'">
          My Completions
        </button>
        <button
          class="hover:bg-primary/30 w-full rounded px-3 py-2 text-left transition hover:cursor-pointer"
          @click="activeSection = 'friends'"
          :class="{ 'bg-primary-2 text-black': activeSection === 'friends' }">
          Friends
        </button>
        <button
          class="hover:bg-primary/30 w-full rounded px-3 py-2 text-left transition hover:cursor-pointer"
          @click="activeSection = 'requests'"
          :class="{ 'bg-primary-2 text-black': activeSection === 'requests' }">
          Friend Requests
        </button>
        <button
          class="hover:bg-primary/30 w-full rounded px-3 py-2 text-left transition hover:cursor-pointer"
          @click="activeSection = 'blocked'"
          :class="{ 'bg-primary-2 text-black': activeSection === 'blocked' }">
          Blocked
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
          <table class="min-w-full rounded shadow">
            <thead class="bg-background-2">
              <tr>
                <th class="px-4 py-2 text-left">Level Name</th>
                <th class="px-4 py-2 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="lvl in levels" :key="lvl.id" class="border-t">
                <td class="px-4 py-2">{{ lvl.name }}</td>
                <td class="px-4 py-2">
                  {{ new Date(lvl.created_at).toLocaleDateString() }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>No levels registered yet.</div>
      </section>

      <section v-if="activeSection === 'completions'" class="space-y-4">
        <h2 class="text-2xl font-semibold">My Completions</h2>
        <div v-if="completions.length" class="overflow-x-auto">
          <table class="min-w-full rounded shadow">
            <thead class="bg-background-2">
              <tr>
                <th class="px-4 py-2 text-left">Completed Level</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="comp in completions" :key="comp.id" class="border-t">
                <td class="px-4 py-2">{{ comp.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>No completions yet.</div>
      </section>

      <section v-if="activeSection === 'friends'">
        <h2 class="mb-4 text-2xl font-semibold">My Friends</h2>
        <div v-if="friends.length" class="space-y-4">
          <div
            v-for="f in friends"
            :key="f.id"
            class="bg-background-2 flex items-center justify-between rounded p-4">
            <div>
              <p class="font-semibold">{{ f.name }}</p>
              <p class="text-sm text-gray-400">{{ f.email }}</p>
            </div>
            <div class="space-x-2">
              <button
                @click="messageFriend(f.id)"
                class="bg-secondary rounded px-3 py-1 text-white">
                Message
              </button>
              <button
                @click="removeFriend(f.id)"
                class="rounded bg-red-600 px-3 py-1 text-white">
                Remove
              </button>
            </div>
          </div>
        </div>
        <p v-else>No friends yet.</p>
      </section>

      <section v-if="activeSection === 'requests'">
        <h2 class="mb-4 text-2xl font-semibold">Friend Requests</h2>
        <div v-if="incomingRequests.length" class="space-y-4">
          <div
            v-for="r in incomingRequests"
            :key="r.id"
            class="bg-background-2 flex items-center justify-between rounded p-4">
            <div>
              <p class="font-semibold">{{ r.sender.name }}</p>
              <p class="text-sm text-gray-400">{{ r.sender.email }}</p>
            </div>
            <div class="space-x-2">
              <button
                @click="acceptRequest(r.id)"
                class="bg-primary rounded px-3 py-1 text-black">
                Accept
              </button>
              <button
                @click="denyRequest(r.id)"
                class="rounded bg-red-600 px-3 py-1 text-white">
                Deny
              </button>
            </div>
          </div>
        </div>
        <p v-else>No incoming requests.</p>
      </section>

      <section v-if="activeSection === 'blocked'">
        <h2 class="mb-4 text-2xl font-semibold">Blocked Users</h2>
        <div v-if="blockedUsers.length" class="space-y-4">
          <div
            v-for="b in blockedUsers"
            :key="b.id"
            class="bg-background-2 flex items-center justify-between rounded p-4">
            <div>
              <p class="font-semibold">{{ b.name }}</p>
              <p class="text-sm text-gray-400">{{ b.email }}</p>
            </div>
            <button
              @click="unblockUser(b.id)"
              class="bg-secondary rounded px-3 py-1 text-white">
              Unblock
            </button>
          </div>
        </div>
        <p v-else>No one blocked.</p>
      </section>
    </main>
  </div>
</template>
