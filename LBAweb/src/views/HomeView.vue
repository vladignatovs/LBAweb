<script setup>
</script>

<template>
    <aside>
        <p> Basically the main point of this page, where useful redirects will be more noticable, could also be a good place to put most important socials
            like a discord server or a redirect to the steam page of the game.
        </p>
        <div class="cards-page">
            <a href="https://discord.com" class="clickable-card"><div class="card">
                <img src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0a6918e57475a843f59f_icon_clyde_black_RGB.svg" alt="">
                <br><p> Join our official discord server, as it is our main 
                    source of recieving feedback from our YOU!</p>
            </div></a>
            <a href="https://store.steampowered.com" class="clickable-card"><div class="card">
                <img src="https://cdn.icon-icons.com/icons2/3261/PNG/512/steam_logo_icon_206670.png" alt="">
                <br><p> Wishlist our game on steam NOW! Don't forget to let us know about your experience! </p>
            </div></a>
            <a href="account.html" class="clickable-card"><div class="card">
                <img src="@/assets/20241009_191656.png" alt="">
                <br><p> Create an account for further usage in both our GAME and WEBSITE!</p>
            </div></a>
        </div>
    </aside>
    <main>
        <section id="about">
            <p> Bunch of info about the game, history of development as well as some other details, socials (?) and useful links</p>
        </section>
    </main>
</template>

<style scoped>
aside {
    margin: 50px 0;

    display: grid;
    gap: 50px;
    font-size: large;

    text-align: center;
}

aside p {
    padding: 0 50px;
}

main {
    height: 5000px;
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


.cards-page {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100%;
}

@media (max-width: 600px) {
    .cards-page {
        flex-direction: column;
        gap: 30px;
    }
    .cards-page a {
        width: 90%;
    }
}

img {
    width: 75px;
    height: 75px;

    filter: invert(1);
    transition-duration: .5s;

}

.card {
    height: inherit;
    border-radius: 15px;
    min-height: 300px;
    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;

    text-align: center;

    background-color: black;
    background-image: linear-gradient(black, black, rgba(21, 0, 255, 0.25));
    color: white;

    transition-duration: .5s;
}


.card p {
    padding: 0 30px;
}

.card:hover {
    transform: scale(1.05);
    z-index: 1;
    background-image: linear-gradient(white, white, rgba(21, 0, 255, 0.25));
    background-color: white;
    color: black;
}

.card:hover img {
    filter: invert(0);
}
.clickable-card {
    height: inherit;
    width: 30%;

    text-decoration: none;
}
</style>