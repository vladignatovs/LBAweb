<script setup>
const registerRadio = document.getElementById('REGISTER');
const loginRadio = document.getElementById('LOGIN');

registerRadio.addEventListener('click', function() {
    var registerPanel = document.getElementById('register');
    var loginPanel = document.getElementById('login');

    if (registerPanel.style.visibility === "hidden" || registerPanel.style.visibility === "") {
        registerPanel.style.visibility = "visible";
        registerPanel.style.opacity = "1";  // Optional for animation effect
    } else {
        if (this.checked) this.checked = false;
        registerPanel.style.visibility = "hidden";
        registerPanel.style.opacity = "0";  // Optional for animation effect
    }
    loginPanel.style.visibility = "hidden";
    loginPanel.style.opacity = "0";  // Optional for animation effect
});

loginRadio.addEventListener('click', function() {
    var registerPanel = document.getElementById('register');
    var loginPanel = document.getElementById('login');

    if (loginPanel.style.visibility === "hidden" || loginPanel.style.visibility === "") {
        loginPanel.style.visibility = "visible";
        loginPanel.style.opacity = "1";  // Optional for animation effect
    } else {
        if (this.checked) this.checked = false;
        loginPanel.style.visibility = "hidden";
        loginPanel.style.opacity = "0";  // Optional for animation effect
    }

    registerPanel.style.visibility = "hidden";
    registerPanel.style.opacity = "0";  // Optional for animation effect
});
</script>
<template>
  <main>
        <section class="select-page">
            <h1> You are not logged in an account. </h1>
            <div class="radio-select">
                <input class="radio-button" type="radio" name="radio-group" id="REGISTER"/>
                <label class="radio-label" for="REGISTER">REGISTER</label>
                <input class="radio-button" type="radio" name="radio-group" id="LOGIN"/>
                <label class="radio-label" for="LOGIN">LOGIN</label>
            </div>
        </section>
        <section class="input-page">
            <div id="register">
                <form action="" method="get" class="form-fill">
                    <div class="form-fill">
                        <label for="name">Enter your username: </label>
                        <input type="text" name="name" id="name" required/>
                    </div>
                    <div class="form-fill">
                        <label for="email">Enter your email: </label>
                        <input type="email" name="email" id="email" required/>
                    </div>
                    <div class="form-fill">
                        <label for="password">Enter your password: </label>
                        <input type="password" name="password" id="password" required/>
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
            <div id="login">
                <form action="" method="get" class="form-fill">
                    <div class="form-fill">
                        <label for="name">Enter your username: </label>
                        <input type="text" name="name" id="name" required/>
                    </div>
                    <div class="form-fill">
                        <label for="email">Enter your email: </label>
                        <input type="email" name="email" id="email" required/>
                    </div>
                    <div class="form-fill">
                        <label for="password">Enter your password: </label>
                        <input type="password" name="password" id="password" required/>
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
            Logging into an account is an essential part of your experience on our website, as it allows your account to be browsed by other users, and makes its fair for you
            to browse those in the first place. By having an account you also get an access to creating your own levels, saving your achivements in a dedicated server and 
        </p>
    </aside>
</template>

<style scoped>
button:hover {
    cursor: pointer;
    background: rgba(255, 255, 255, 0.5);
}

.radio-label:hover, .radio-button:checked + .radio-label:hover {
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

footer  {
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

#login, #register {
    background-color: black;
    color: white;

    visibility: hidden;
    opacity: 0;

    transition-duration: 0.5s;

    flex-direction: column;
    align-items: center;
    padding:20px;
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

label, input {
    display: inline-block;
    gap: 5px;
}
  
input {
    padding: 8px;
    font-size: 1rem;
}
  
button[type="submit"] {
    max-width: 150px;
    padding: 10px;
}
</style>
