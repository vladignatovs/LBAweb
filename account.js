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