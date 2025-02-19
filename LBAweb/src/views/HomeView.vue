<template>
  <aside
    class="mx-0 grid gap-12 bg-[var(--background)] py-12 text-center text-xl text-white"
  >
    <p class="px-12">
      Basically the main point of this page, where useful redirects will be more
      noticable, could also be a good place to put most important socials like a
      discord server or a redirect to the steam page of the game.
    </p>
    <div class="flex h-full items-center justify-around">
      <a href="https://discord.com" class="h-full w-[30%] no-underline">
        <div
          class="group flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl bg-linear-to-t from-blue-100 to-red-100 text-center text-[var(--text)] duration-500 hover:z-10 hover:scale-105 hover:bg-linear-to-r hover:from-red-500 hover:to-blue-500 hover:text-black hover:ease-out"
        >
          <img
            src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0a6918e57475a843f59f_icon_clyde_black_RGB.svg"
            alt=""
            class="h-19 w-19 invert duration-500 ease-in-out group-hover:invert-0"
          />
          <br />
          <p>
            Join our official discord server, as it is our main source of
            recieving feedback from our YOU!
          </p>
        </div>
      </a>
      <a
        href="https://store.steampowered.com"
        class="h-full w-[30%] no-underline"
      >
        <div class="card">
          <img src="../assets/steam_logo_icon.webp" alt="" />
          <br />
          <p>
            Wishlist our game on steam NOW! Don't forget to let us know about
            your experience!
          </p>
        </div>
      </a>
      <a href="account.html" class="h-full w-[30%] no-underline">
        <div class="card">
          <img src="../assets/account_icon.webp" alt="" />
          <br />
          <p>
            Create an account for further usage in both our GAME and WEBSITE!
          </p>
        </div>
      </a>
    </div>
  </aside>
  <!-- TO BE CHANGED -->
  <main class="h-[5000px] bg-[var(--background)] text-[var(--text)]">
    <section id="about" class="font-bold">
      <p>
        Bunch of info about the game, history of development as well as some
        other details, socials (?) and useful links
      </p>
    </section>
  </main>
</template>

<style scoped>
/* TODO FIX STYLES, FIX ANIMATIONS */
/* ALSO FIX COLOR SCHEME, FIND HOW TO USE IT */

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

  background-image: linear-gradient(
    var(--primary),
    var(--primary),
    var(--primary)
  );
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
  background-image: linear-gradient(
    var(--secondary),
    var(--secondary),
    var(--secondary)
  );
  color: black;
}

/* 
.card:hover img {
  filter: invert(0);
} */
</style>
