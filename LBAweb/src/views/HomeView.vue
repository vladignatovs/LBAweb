<template>
  <aside class="grid gap-12 py-12 mx-0 text-xl text-center bg-[var(--background)] text-white">
    <p class="px-12">
      Basically the main point of this page, where useful redirects will be more noticable, could
      also be a good place to put most important socials like a discord server or a redirect to the
      steam page of the game.
    </p>
    <div class="cards-page">
      <a href="https://discord.com" class="clickable-card">
        <div class="card">
          <img
            src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0a6918e57475a843f59f_icon_clyde_black_RGB.svg"
            alt=""
          />
          <br />
          <p>
            Join our official discord server, as it is our main source of recieving feedback from
            our YOU!
          </p>
        </div></a
      >
      <a href="https://store.steampowered.com" class="clickable-card"
        ><div class="card">
          <img src="../assets/steam_logo_icon.webp" alt="" />
          <br />
          <p>Wishlist our game on steam NOW! Don't forget to let us know about your experience!</p>
        </div></a
      >
      <a href="account.html" class="clickable-card"
        ><div class="card">
          <img src="../assets/account_icon.webp" alt="" />
          <br />
          <p>Create an account for further usage in both our GAME and WEBSITE!</p>
        </div></a
      >
    </div>
  </aside>
  <!-- TO BE CHANGED -->
  <main class="h-[5000px] bg-[var(--background)] text-[var(--text)]">
    <section id="about" class="font-bold">
      <p>
        Bunch of info about the game, history of development as well as some other details, socials
        (?) and useful links
      </p>
    </section>
  </main>
</template>

<style scoped>
/* TODO FIX STYLES, FIX ANIMATIONS */
/* ALSO FIX COLOR SCHEME, FIND HOW TO USE IT */
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
  transition-duration: 0.5s ease-in;
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

  background-image: linear-gradient(var(--primary), var(--primary), var(--primary));
  color: var(--text);

  transition-duration: 0.5s;
}

.card p {
  padding: 0 30px;
}

.card:hover {
  transform: scale(1.05);
  z-index: 1;
  transition: ease-out;
  background-image: linear-gradient(var(--secondary), var(--secondary), var(--secondary));
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
