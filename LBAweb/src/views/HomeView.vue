<template>
  <main>
    <!-- TITLE -->
    <section
      class="mx-0 grid gap-12 bg-[var(--background-primary)] py-12 text-center text-xl">
      <p class="px-12">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras quis urna
        ante. Nullam tempus, nisl eget elementum tempus, quam orci volutpat
        lorem, sed hendrerit turpis tellus id lorem. Aenean dapibus, ligula
        imperdiet ultrices hendrerit, mauris neque fermentum dolor, non iaculis
        leo nisl non arcu. Donec elit tellus, finibus a ante non, gravida
        porttitor mi. Sed ipsum arcu, efficitur eu dignissim id, cursus sit amet
        felis. Curabitur convallis enim lacus, a egestas mi ultrices vel.
        Curabitur vitae euismod est. Nullam convallis feugiat mi, at venenatis
        dolor interdum sit amet. Ut vitae mauris quis nibh ornare condimentum.
        Sed fermentum lorem sed erat malesuada scelerisque. Sed nec laoreet
        lacus.
      </p>
    </section>
    <!-- NEWS -->
    <section
      class="mx-0 grid gap-12 bg-[var(--background-secondary)] py-12 text-center text-2xl font-bold text-[var(--background-primary)]">
      <P>NEWS</P>
    </section>
    <!-- CARDS -->
    <section
      class="mx-0 flex h-full items-center justify-around gap-12 bg-[var(--background)] p-12 text-center text-xl text-white">
      <!-- DISCORD CARD -->
      <a href="https://discord.com" class="group h-full w-[30%] no-underline">
        <div
          class="flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl bg-linear-to-t from-[var(--primary)] via-[var(--primary)] to-[var(--primary)] text-center text-[var(--text)] duration-500 hover:z-10 hover:scale-105 hover:bg-linear-to-t hover:from-[var(--background-secondary)] hover:via-[var(--background-secondary)] hover:to-[var(--background-secondary)] hover:text-black hover:ease-out">
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
          class="flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl bg-linear-to-t from-[var(--primary)] via-[var(--primary)] to-[var(--primary)] text-center text-[var(--text)] duration-500 hover:z-10 hover:scale-105 hover:bg-linear-to-t hover:from-[var(--background-secondary)] hover:via-[var(--background-secondary)] hover:to-[var(--background-secondary)] hover:text-black hover:ease-out">
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
      <router-link to="/account" class="group h-full w-[30%] no-underline">
        <div
          class="flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl bg-linear-to-t from-[var(--primary)] via-[var(--primary)] to-[var(--primary)] text-center text-[var(--text)] duration-500 hover:z-10 hover:scale-105 hover:bg-linear-to-t hover:from-[var(--background-secondary)] hover:via-[var(--background-secondary)] hover:to-[var(--background-secondary)] hover:text-black hover:ease-out">
          <img
            src="../assets/account_icon.webp"
            alt=""
            class="size-19 invert duration-500 ease-in-out group-hover:invert-0" />
          <br />
          <p class="px-8">
            Create an account for further usage in both our GAME and WEBSITE!
          </p>
        </div>
      </router-link>
    </section>
    <!-- DEVELOPMENT -->
    <section
      id="development"
      class="h-[5000px] bg-linear-to-b from-[var(--background-primary)] from-0% to-[var(--background-secondary)] p-12 font-bold">
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
