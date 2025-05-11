<script setup>
import { ref, onMounted, watch } from "vue";
import { useUserActions } from "@/composables/useUserActions";
import fancyInput from "@/components/fancy-input.vue";
import fancyFileInput from "@/components/fancy-file-input.vue";
import userCard from "@/components/user-card.vue";
import levelCard from "@/components/level-card.vue";
import requestCard from "@/components/request-card.vue";

const {
  user,
  levels,
  completions,
  friends,
  pending,
  sent,
  blocked,
  fetchUser,
  fetchLevels,
  fetchCompletions,
  fetchFriends,
  fetchPendingRequests,
  fetchSentRequests,
  fetchBlockedUsers,
  sendRequest,
  acceptRequest,
  denyRequest,
  cancelRequest,
  removeFriend,
  blockUser,
  unblockUser,
  logout,
  isCurrentUser,
  isFriend,
  isBlocked,
  hasSent,
} = useUserActions();

const activeSection = ref("profile");
const newEmail = ref("");
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const avatarFile = ref(null);

onMounted(async () => {
  await fetchUser();
  newEmail.value = user.value?.email || "";
});

watch(activeSection, (section) => {
  if (section === "levels") fetchLevels();
  if (section === "completions") fetchCompletions();
  if (section === "friends") fetchFriends();
  if (section === "pendingRequests") fetchPendingRequests();
  if (section === "sentRequests") fetchSentRequests();
  if (section === "blocked") {
    fetchBlockedUsers();
    fetchSentRequests();
  }
});

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
          class="hover:bg-primary/30 w-full rounded px-3 py-2 text-left transition"
          :class="{ 'bg-primary-2 text-black': activeSection === 'profile' }"
          @click="activeSection = 'profile'">
          Profile
        </button>
        <button
          class="hover:bg-primary/30 w-full rounded px-3 py-2 text-left transition"
          :class="{ 'bg-primary-2 text-black': activeSection === 'security' }"
          @click="activeSection = 'security'">
          Security
        </button>
        <button
          class="hover:bg-primary/30 w-full rounded px-3 py-2 text-left transition"
          :class="{ 'bg-primary-2 text-black': activeSection === 'avatar' }"
          @click="activeSection = 'avatar'">
          Avatar
        </button>
        <button
          class="hover:bg-primary/30 w-full rounded px-3 py-2 text-left transition"
          :class="{ 'bg-primary-2 text-black': activeSection === 'levels' }"
          @click="activeSection = 'levels'">
          My Levels
        </button>
        <button
          class="hover:bg-primary/30 w-full rounded px-3 py-2 text-left transition"
          :class="{
            'bg-primary-2 text-black': activeSection === 'completions',
          }"
          @click="activeSection = 'completions'">
          My Completions
        </button>
        <button
          class="hover:bg-primary/30 w-full rounded px-3 py-2 text-left transition"
          @click="activeSection = 'friends'"
          :class="{ 'bg-primary-2 text-black': activeSection === 'friends' }">
          Friends
        </button>
        <button
          class="hover:bg-primary/30 w-full rounded px-3 py-2 text-left transition"
          @click="activeSection = 'pendingRequests'"
          :class="{
            'bg-primary-2 text-black': activeSection === 'pendingRequests',
          }">
          Pending Friend Requests
        </button>
        <button
          class="hover:bg-primary/30 w-full rounded px-3 py-2 text-left transition"
          @click="activeSection = 'sentRequests'"
          :class="{
            'bg-primary-2 text-black': activeSection === 'sentRequests',
          }">
          Sent Friend Requests
        </button>
        <button
          class="hover:bg-primary/30 w-full rounded px-3 py-2 text-left transition"
          @click="activeSection = 'blocked'"
          :class="{ 'bg-primary-2 text-black': activeSection === 'blocked' }">
          Blocked
        </button>
        <button
          class="border-primary/30 mt-6 w-full border-t px-3 py-2 text-left"
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
            class="bg-secondary/50 hover:bg-secondary-2/70 rounded px-4 py-2 text-white">
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
          class="bg-secondary/50 hover:bg-secondary-2/70 rounded px-4 py-2 text-white">
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
          class="bg-secondary/50 hover:bg-secondary-2/70 rounded px-4 py-2 text-white">
          Upload
        </button>
      </section>

      <section v-if="activeSection === 'levels'" class="space-y-4">
        <h2 class="text-2xl font-semibold">My Levels</h2>
        <div v-if="levels.length" class="space-y-4">
          <div
            v-for="lvl in levels"
            :key="lvl.id"
            class="bg-background-2 flex items-center justify-between rounded p-4">
            <level-card :level="lvl" />
          </div>
        </div>
        <div v-else>No levels registered yet.</div>
      </section>

      <section v-if="activeSection === 'completions'" class="space-y-4">
        <h2 class="text-2xl font-semibold">My Completions</h2>
        <div v-if="completions.length" class="space-y-4">
          <div
            v-for="comp in completions"
            :key="comp.id"
            class="bg-background-2 flex items-center justify-between rounded p-4">
            <level-card :level="comp" />
          </div>
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
            <user-card
              :user="f"
              :is-friend="true"
              :is-blocked="isBlocked(f.id)"
              :is-current-user="isCurrentUser(f.id)"
              @block="blockUser"
              @unblock="unblockUser"
              @remove-friend="removeFriend" />
          </div>
        </div>
        <p v-else>No friends yet.</p>
      </section>

      <section v-if="activeSection === 'pendingRequests'">
        <h2 class="mb-4 text-2xl font-semibold">Friend Requests</h2>
        <div v-if="pending.length" class="space-y-4">
          <div
            v-for="r in pending"
            :key="r.id"
            class="bg-background-2 flex items-center justify-between rounded p-4">
            <request-card
              :user="r.sender"
              :received="true"
              @accept="acceptRequest(r.id)"
              @deny="denyRequest(r.id)" />
          </div>
        </div>
        <p v-else>No incoming requests.</p>
      </section>

      <section v-if="activeSection === 'sentRequests'">
        <h2 class="mb-4 text-2xl font-semibold">Sent Friend Requests</h2>
        <div v-if="sent.length" class="space-y-4">
          <div
            v-for="r in sent"
            :key="r.id"
            class="bg-background-2 flex items-center justify-between rounded p-4">
            <request-card
              :user="r.receiver"
              :received="false"
              @cancel="cancelRequest(r.id)" />
          </div>
        </div>
        <p v-else>No outgoing requests.</p>
      </section>

      <section v-if="activeSection === 'blocked'">
        <h2 class="mb-4 text-2xl font-semibold">Blocked Users</h2>
        <div v-if="blocked.length" class="space-y-4">
          <div
            v-for="b in blocked"
            :key="b.id"
            class="bg-background-2 flex items-center justify-between rounded p-4">
            <user-card
              :user="b"
              :is-friend="isFriend(b.id)"
              :is-blocked="true"
              :is-current-user="isCurrentUser(b.id)"
              :is-pending="hasSent(b.id)"
              @unblock="unblockUser"
              @add-friend="sendRequest"
              @remove-friend="removeFriend" />
          </div>
        </div>
        <p v-else>No one blocked.</p>
      </section>
    </main>
  </div>
</template>
