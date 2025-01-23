<script setup>
import { ref } from 'vue'

// Reactive properties for controlling panel visibility
const isLoginVisible = ref(false)
const isRegisterVisible = ref(false)

// Method to toggle panels
function togglePanel(panel) {
  if (panel === 'login') {
    isLoginVisible.value = !isLoginVisible.value
    isRegisterVisible.value = false // Hide the register panel
  } else if (panel === 'register') {
    isRegisterVisible.value = !isRegisterVisible.value
    isLoginVisible.value = false // Hide the login panel
  }
}
</script>
<template>
  <main>
    <section class="select-page">
      <h1>You are not logged in an account.</h1>
      <div class="radio-select">
        <input
          class="radio-button"
          type="radio"
          name="radio-group"
          id="REGISTER"
          @click="togglePanel('register')"
        />
        <label class="radio-label" for="REGISTER">REGISTER</label>
        <input
          class="radio-button"
          type="radio"
          name="radio-group"
          id="LOGIN"
          @click="togglePanel('login')"
        />
        <label class="radio-label" for="LOGIN">LOGIN</label>
      </div>
    </section>
    <section class="input-page">
      <div
        id="register"
        :class="{
          'visible-panel': isRegisterVisible,
          'hidden-panel': !isRegisterVisible,
        }"
      >
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
            <button type="submit">REGISTER</button>
          </div>
        </form>
      </div>
      <div
        id="login"
        :class="{
          'visible-panel': isLoginVisible,
          'hidden-panel': !isLoginVisible,
        }"
      >
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
            <button type="submit">REGISTER</button>
          </div>
        </form>
      </div>
    </section>
  </main>
  <aside>
    <p>
      Logging into an account is an essential part of your experience on our website, as it allows
      your account to be browsed by other users, and makes its fair for you to browse those in the
      first place. By having an account you also get an access to creating your own levels, saving
      your achivements in a dedicated server and
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

button:hover {
  cursor: pointer;
  background: rgba(255, 255, 255, 0.5);
}

.radio-label:hover,
.radio-button:checked + .radio-label:hover {
  cursor: pointer;
  background: rgba(0, 0, 0, 0.5);
}

/* aside {
    background-color: black;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: xx-large;
    gap: 10px;
    padding: 10px;
    margin: 50px;
    margin-bottom: 0;
} */

main {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  height: 500px;
  gap: 50px;
}

.select-page {
  flex: 1;
  margin: 0 0 0 50px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: xx-large;
}

.input-page {
  flex: 1;

  display: flex;
  flex-direction: row;
  background-color: black;
  color: white;
}

aside {
  padding: 50px;
  background-color: black;
  color: white;

  height: 1000px;
}

footer {
  background-color: black;
  color: gray;

  display: flex;
  justify-content: center;
  align-items: center;
  height: 75px;
  font-size: x-large;
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

.radio-button {
  display: none;
}

.radio-select {
  display: flex;
}

.radio-label {
  display: inline-block;
  transition-duration: 0.5s;
  padding: 5px;
}

.radio-button:checked + .radio-label {
  background: rgba(0, 0, 0, 0.25);
}

/* -----------------------TODO: thisss ----------------------------*/
.form-fill {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}

label,
input {
  display: inline-block;
  gap: 5px;
}

input {
  padding: 8px;
  font-size: 1rem;
}

button[type='submit'] {
  max-width: 150px;
  padding: 10px;
}
</style>
