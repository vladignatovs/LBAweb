<script setup>
import { ref, onMounted, watch } from "vue";
import { useUserActions } from "@/composables/useUserActions";
import fancyInput from "@/components/fancy-input.vue";
import userCard from "@/components/user-card.vue";
import levelCard from "@/components/level-card.vue";
import requestCard from "@/components/request-card.vue";
import { useAdminActions } from "@/admin/composables/useAdminActions";

const {
  user,
  levels,
  completions,
  friends,
  pending,
  sent,
  blocked,
  fetchCreatedLevels,
  fetchCompletions,
  updateName,
  updateEmail,
  changePassword,
  deleteAccount,
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

const {
  users,
  changeLogs,
  fetchUsers,
  fetchChangeLogs,
  updateUser,
  deleteUser,
  terminateAllSessions,
  isAdmin,
} = useAdminActions();

const activeSection = ref("profile");
const newEmail = ref("");
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const newName = ref("");

onMounted(async () => {
  newEmail.value = user.value?.email || "";
});

watch(activeSection, (section) => {
  if (section === "levels") fetchCreatedLevels();
  if (section === "completions") fetchCompletions();
  if (section === "adminUsers") fetchUsers();
  if (section === "adminLogs") fetchChangeLogs();
});
</script>

<template>
  <div class="bg-background text-selected flex min-h-screen pb-18">
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
        <template v-if="isAdmin">
          <hr class="border-primary/30 my-4" />
          <h3 class="mb-2 text-lg font-medium">Admin Panel</h3>
          <button
            class="hover:bg-primary/30 w-full rounded px-3 py-2 text-left transition"
            :class="{
              'bg-primary-2 text-black': activeSection === 'adminUsers',
            }"
            @click="activeSection = 'adminUsers'">
            Manage Users
          </button>
          <button
            class="hover:bg-primary/30 w-full rounded px-3 py-2 text-left transition"
            :class="{
              'bg-primary-2 text-black': activeSection === 'adminLogs',
            }"
            @click="activeSection = 'adminLogs'">
            Change Logs
          </button>
        </template>
        <button
          class="border-primary/30 mt-6 w-full border-t px-3 py-2 text-left"
          @click="logout">
          Log Out
        </button>
      </nav>
    </aside>

    <main class="flex-1 p-8">
      <h1 class="mb-4 text-3xl font-bold">Dashboard</h1>

      <section v-if="activeSection === 'profile'" class="max-w-lg space-y-6">
        <h2 class="text-2xl font-semibold">Profile & Security</h2>

        <!-- Name & current email display -->
        <p><strong>Name:</strong> {{ user?.name }}</p>
        <p><strong>Email:</strong> {{ user?.email }}</p>

        <!-- Update Name -->
        <div class="space-y-2">
          <fancy-input v-model="newName" label="Display Name" />
          <button
            @click="updateName(newName)"
            class="bg-secondary/50 hover:bg-secondary-2/70 rounded px-4 py-2 text-white">
            Update Name
          </button>
        </div>

        <!-- Update Email -->
        <div class="space-y-2">
          <fancy-input v-model="newEmail" type="email" label="New Email" />
          <fancy-input
            v-model="currentPassword"
            type="password"
            label="Current Password" />
          <button
            @click="updateEmail(newEmail, currentPassword)"
            class="bg-secondary/50 hover:bg-secondary-2/70 rounded px-4 py-2 text-white">
            Update Email
          </button>
        </div>

        <!-- Change Password -->
        <div class="space-y-2">
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
            @click="
              changePassword(currentPassword, newPassword, confirmPassword)
            "
            class="bg-secondary/50 hover:bg-secondary-2/70 rounded px-4 py-2 text-white">
            Change Password
          </button>
        </div>

        <!-- Delete Account -->
        <div>
          <button
            @click="deleteAccount"
            class="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700">
            Delete Account
          </button>
        </div>
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

      <section
        v-if="activeSection === 'adminUsers' && isAdmin"
        class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-semibold">Manage Users</h2>
          <button
            class="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            @click="terminateAllSessions">
            Terminate All Sessions
          </button>
        </div>

        <div v-for="(group, rights) in users" :key="rights" class="mb-8">
          <h3 class="mb-2 text-xl font-medium capitalize">{{ rights }}</h3>
          <table class="w-full table-auto border-collapse">
            <thead>
              <tr class="bg-background-2">
                <th class="p-2 text-left">ID</th>
                <th class="p-2 text-left">Name</th>
                <th class="p-2 text-left">Email</th>
                <th class="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in group" :key="u.id" class="even:bg-background-2">
                <td class="p-2">{{ u.id }}</td>
                <td class="p-2">
                  <fancy-input
                    v-model="u.name"
                    class="w-full"
                    @blur="updateUser(u.id, { name: u.name })" />
                </td>
                <td class="p-2">
                  <fancy-input
                    v-model="u.email"
                    type="email"
                    class="w-full"
                    @blur="updateUser(u.id, { email: u.email })" />
                </td>
                <td class="space-x-2 p-2">
                  <button
                    class="bg-secondary/50 hover:bg-secondary-2/70 rounded px-3 py-1 text-white"
                    @click="deleteUser(u.id)">
                    Delete
                  </button>
                  <button
                    class="bg-secondary/50 hover:bg-secondary-2/70 rounded px-3 py-1 text-white"
                    @click="
                      updateUser(u.id, { password: prompt('New password:') })
                    ">
                    Reset Password
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section
        v-if="activeSection === 'adminLogs' && isAdmin"
        class="space-y-4">
        <h2 class="text-2xl font-semibold">News Change Logs</h2>

        <div v-if="changeLogs.length">
          <ul class="space-y-2">
            <li
              v-for="log in changeLogs"
              :key="log.id"
              class="bg-background-2 rounded p-4">
              <p>
                <strong>{{ log.admin.name }}</strong>
                {{ log.action }}D the news item
                <em>"{{ log.news.title }}"</em>
              </p>
              <p class="text-sm text-gray-500">
                {{ new Date(log.action_date).toLocaleString() }}
              </p>
            </li>
          </ul>
        </div>
        <p v-else>No change logs yet.</p>
      </section>
    </main>
  </div>
</template>
