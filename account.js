const registerRadio = document.getElementById('REGISTER');
const loginRadio = document.getElementById('LOGIN');

registerRadio.addEventListener('click', function() {
    var registerPanel = document.getElementById('register');
    var loginPanel = document.getElementById('login');

    if(registerPanel.style.display === "none" || registerPanel.style.display === "")
        registerPanel.style.display = "flex";
    else {
        if(this.checked) this.checked = false;
        registerPanel.style.display = "none";
    }
    loginPanel.style.display = "none";
});

loginRadio.addEventListener('click', function() {
    var registerPanel = document.getElementById('register');
    var loginPanel = document.getElementById('login');

    if(loginPanel.style.display === "none" || loginPanel.style.display === "")
        loginPanel.style.display = "flex";
    else {
        if(this.checked) this.checked = false;
            loginPanel.style.display = "none";
    }

    registerPanel.style.display = "none";
});