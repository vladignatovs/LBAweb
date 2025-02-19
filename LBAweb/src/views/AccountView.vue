<script setup>
import { ref } from "vue";

// Reactive properties for controlling panel visibility
// false - value, ref() - makes it reactive
const isLoginVisible = ref(false);
const isRegisterVisible = ref(false);

// Method to toggle panels
function togglePanel(panel) {
  if (panel === "login") {
    isLoginVisible.value = !isLoginVisible.value;
    isRegisterVisible.value = false; // Hide the register panel
  } else if (panel === "register") {
    isRegisterVisible.value = !isRegisterVisible.value;
    isLoginVisible.value = false; // Hide the login panel
  }
}
</script>
<template>
  <main class="flex items-stretch justify-between gap-13">
    <section
      class="m-0 mb-13 flex flex-1 flex-col items-center justify-center text-2xl">
      <h1>You are not logged in an account.</h1>
      <div class="flex">
        <input
          class="hidden"
          type="radio"
          name="radio-group"
          id="REGISTER"
          @click="togglePanel('register')" />
        <label
          class="inline-block p-1 duration-500 hover:cursor-pointer hover:bg-black/50"
          for="REGISTER">
          REGISTER
        </label>
        <input
          class="group hidden"
          type="radio"
          name="radio-group"
          id="LOGIN"
          @click="togglePanel('login')" />
        <label
          class="inline-block p-1 duration-500 group-checked:bg-black/50 hover:cursor-pointer hover:bg-black/50"
          for="LOGIN">
          LOGIN
        </label>
      </div>
    </section>
    <section class="flex flex-1 flex-row bg-black text-white">
      <div
        id="register"
        :class="{
          'visible-panel': isRegisterVisible,
          'hidden-panel': !isRegisterVisible,
        }">
        <form action="" method="get" class="form-fill">
          <div class="form-fill">
            <label for="name">Enter your username: </label>
            <input
              class="inline-block"
              type="text"
              name="name"
              id="name"
              required />
          </div>
          <div class="form-fill">
            <label for="email">Enter your email: </label>
            <input type="email" name="email" id="email" required />
          </div>
          <div class="form-fill">
            <label for="password">Enter your password: </label>
            <input type="password" name="password" id="password" required />
          </div>
          <div class="form-fill">
            <label for="rpassword">Repeat your password: </label>
            <input type="password" name="rpassword" id="rpassword" required />
          </div>
          <div class="form-fill" id="submit-form">
            <button
              class="hover:cursor-pointer hover:bg-white/50"
              type="submit">
              REGISTER
            </button>
          </div>
        </form>
      </div>
      <div
        id="login"
        :class="{
          'visible-panel': isLoginVisible,
          'hidden-panel': !isLoginVisible,
        }">
        <form action="" method="get" class="form-fill">
          <div class="form-fill">
            <label for="name">Enter your username: </label>
            <input type="text" name="name" id="name" required />
          </div>
          <div class="form-fill">
            <label for="email">Enter your email: </label>
            <input type="email" name="email" id="email" required />
          </div>
          <div class="form-fill">
            <label for="password">Enter your password: </label>
            <input type="password" name="password" id="password" required />
          </div>
          <div class="form-fill">
            <label for="rpassword">Repeat your password: </label>
            <input type="password" name="rpassword" id="rpassword" required />
          </div>
          <div class="form-fill" id="submit-form">
            <button
              class="hover:cursor-pointer hover:bg-white/50"
              type="submit">
              REGISTER
            </button>
          </div>
        </form>
      </div>
    </section>
  </main>
  <aside class="h-[1000px] bg-black p-13 text-white">
    <!-- class="m-13 mb-0 flex flex-col items-center justify-center gap-3 bg-black p-3 text-2xl text-white"> -->
    <p>
      Logging into an account is an essential part of your experience on our
      website, as it allows your account to be browsed by other users, and makes
      it fair for you to browse those in the first place. By having an account
      you also get an access to creating your own levels, saving your
      achivements in a dedicated server and
    </p>
  </aside>
</template>

<style scoped>
.hidden-panel {
  visibility: hidden;
  opacity: 0;
  transition:
    visibility 0.3s,
    opacity 0.3s;
}
.visible-panel {
  visibility: visible;
  opacity: 1;
  transition:
    visibility 0.3s,
    opacity 0.3s;
}

.radio-label:hover,
.radio-button:checked + .radio-label:hover {
  cursor: pointer;
  background: rgba(0, 0, 0, 0.5);
}

/* section {
    flex: 1; Allow sections to grow and fill available space equally
    justify-content: center;

    background-color: black;
    color: white;
    align-items: center;
    height: inherit;
    width: auto;
} */

#login,
#register {
  background-color: black;
  color: white;

  /* visibility: hidden;
  opacity: 0; */

  transition-duration: 0.5s;

  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 600px;
  width: 80%;
}

/* -----------------------TODO: thisss ----------------------------*/
.form-fill {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}

/* label,
input {
  display: inline-block;
  gap: 5px;
} */

input {
  padding: 8px;
  font-size: 1rem;
}

button[type="submit"] {
  max-width: 150px;
  padding: 10px;
}
</style>
