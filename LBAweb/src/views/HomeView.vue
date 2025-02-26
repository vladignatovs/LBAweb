<template>
  <main>
    <!-- TITLE -->
    <section
      class="mx-0 grid gap-12 bg-[var(--accent)] py-12 text-center text-xl">
      <p class="px-12">
        Basically the main point of this page, where useful redirects will be
        more noticable, could also be a good place to put most important socials
        like a discord server or a redirect to the steam page of the game.
      </p>
    </section>
    <!-- NEWS -->
    <section
      class="mx-0 grid gap-12 bg-[var(--accent)] py-12 text-center text-xl text-[var(--secondary)]">
      <P>NEWS</P>
    </section>
    <!-- CARDS -->
    <section
      class="mx-0 flex h-full items-center justify-around gap-12 bg-[var(--accent)] px-12 text-center text-xl text-white">
      <!-- DISCORD CARD -->
      <a href="https://discord.com" class="group h-full w-[30%] no-underline">
        <div
          class="flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl bg-linear-to-t from-[var(--primary)] via-[var(--primary)] to-[var(--primary)] text-center text-[var(--text)] duration-500 hover:z-10 hover:scale-105 hover:bg-linear-to-t hover:from-[var(--secondary)] hover:via-[var(--secondary)] hover:to-[var(--secondary)] hover:text-black hover:ease-out">
          <img
            src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0a6918e57475a843f59f_icon_clyde_black_RGB.svg"
            alt=""
            class="size-19 invert duration-500 ease-out group-hover:invert-0" />
          <br />
          <p class="px-8">
            Join our official discord server, as it is our main source of
            recieving feedback from our YOU!
          </p>
        </div>
      </a>
      <!-- STEAM CARD -->
      <a
        href="https://store.steampowered.com"
        class="group h-full w-[30%] no-underline">
        <div
          class="flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl bg-linear-to-t from-[var(--primary)] via-[var(--primary)] to-[var(--primary)] text-center text-[var(--text)] duration-500 hover:z-10 hover:scale-105 hover:bg-linear-to-t hover:from-[var(--secondary)] hover:via-[var(--secondary)] hover:to-[var(--secondary)] hover:text-black hover:ease-out">
          <img
            src="../assets/steam_logo_icon.webp"
            alt=""
            class="size-19 invert duration-500 ease-in-out group-hover:invert-0" />
          <br />
          <p class="px-8">
            Wishlist our game on steam NOW! Don't forget to let us know about
            your experience!
          </p>
        </div>
      </a>
      <!-- ACCOUNT CARD (MIGHT CHANGE) -->
      <a href="/account" class="group h-full w-[30%] no-underline">
        <div
          class="flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl bg-linear-to-t from-[var(--primary)] via-[var(--primary)] to-[var(--primary)] text-center text-[var(--text)] duration-500 hover:z-10 hover:scale-105 hover:bg-linear-to-t hover:from-[var(--secondary)] hover:via-[var(--secondary)] hover:to-[var(--secondary)] hover:text-black hover:ease-out">
          <img
            src="../assets/account_icon.webp"
            alt=""
            class="size-19 invert duration-500 ease-in-out group-hover:invert-0" />
          <br />
          <p class="px-8">
            Create an account for further usage in both our GAME and WEBSITE!
          </p>
        </div>
      </a>
    </section>
    <!-- DEVELOPMENT -->
    <section
      class="h-[5000px] bg-linear-to-b from-[var(--accent)] from-0% to-[var(--secondary)] p-12 font-bold">
      <p>
        Bunch of info about the game, history of development as well as some
        other details, socials (?) and useful links, on scroll moving section
      </p>
    </section>
  </main>
</template>

<style scoped>
@media (max-width: 600px) {
  .cards-page {
    flex-direction: column;
    gap: 30px;
  }

  .cards-page a {
    width: 90%;
  }
}
</style>
