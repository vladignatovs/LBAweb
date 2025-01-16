<template>
    <header>
        <ul>
            <li>
                <router-link to="/">HOME</router-link>
            </li>
            <li class="dropdown-li">
                <router-link to="#">LEARN MORE</router-link>
                <ul class="dropdown">
                    <li>
                        <router-link to="#about">ABOUT US</router-link>
                    </li>
                    <li>
                        <router-link to="portfolio.html">PERSONAL PORTFOLIO</router-link>
                    </li>
                    <li>
                        <router-link to="#">CONTACT US</router-link>
                    </li>
                </ul>
            </li>
            <li>
                <router-link to="/account">ACCOUNT</router-link>
            </li>
        </ul>
    </header>
</template>

<style scoped>
html {
    scroll-behavior: smooth;
}

header {
    display: flex;
    align-items: center;
    height: 75px;

    font-size: larger;
    color: white;
    background-color: black;
}

header ul {
    padding: 0;

    height: 100%;

    display: inline-flex;
    justify-content: left;

    list-style: none;
}

header ul li {
    display: inline-block;
    
    position: relative;
}

header ul li a {
    padding: 0 20px;
    
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    color: white;
    transition-duration: 0.5s;

    text-decoration: none;
    font-size: larger;
    text-align: center;
}

header li a:hover {
    background-color: rgba(255, 255, 255, 0.5);
}

header .dropdown-li {
    transition-duration: 0.5s;
}

header .dropdown-li a:hover {
    background-color: rgba(255, 255, 255, 0.3);
}

header .dropdown-li:hover {
    background: rgba(255, 255, 255, 0.2);
}

header .dropdown-li ul.dropdown li {
    height: 75%;

    display: block;

    background-color: black;

    font-size: medium;
}

header .dropdown-li ul.dropdown {
    transition-duration: 0.5s;
    width: 100%;
    position: absolute;
    display: none;
}

header .dropdown-li:hover ul.dropdown {
    display: block;
}
</style>