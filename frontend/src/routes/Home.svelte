<script lang="ts">
  import LocaleChooser from "$lib/components/LocaleChooser.svelte";
  import { m } from "$lib/paraglide/messages.js";
  import { writable } from "svelte/store";
  import type { Writable } from "svelte/store";
  import { open } from "$lib/open";
  import OpeningFile from "./OpeningFile.svelte";
  import TabBar from "./TabBar.svelte";
  let editorLoading: Writable<boolean> = writable(false);
  let editorLoadingError: Writable<null | string> = writable(null);

  let msgIndex = writable(0);
  const messages = [
    "Loading editor...",
    "Please wait...",
    "Getting image data...",
  ];
  setInterval(() => {
    msgIndex.update((n) => (n + 1) % messages.length);
  }, 3000);
  async function openModal() {
    for await (const state of open()) {
      if (typeof state === "boolean") {
        editorLoading.set(state);
      } else if (typeof state === "string") {
        editorLoadingError.set(state);
      }
    }
    editorLoading.set(false);
  }
</script>

<OpeningFile
  shown={$editorLoading}
  error={$editorLoadingError}
  hide={() => editorLoading.set(false)}
/>
<main>
  <header>
    <TabBar />
  </header>

  <div class="hero w3-container w3-padding-64">
    <h1 class="w3-jumbo w3-center">
      Slice'<span class="w3-text-teal">n</span>'Fill
    </h1>
    <p class="w3-center w3-opacity">
      Quickly edit, resize, and fill images with a simple interface.
    </p>

    <div class="w3-padding-32 buttons">
      <button
        aria-label={"Open file"}
        class="w3-button w3-teal w3-large"
        on:click={openModal}
      >
        {m.open_file()}
      </button>
      <LocaleChooser style="w3-right" buttonStyle="w3-bar-item w3-center" />
    </div>
  </div>
</main>

<style lang="sass">
@use '../theme.sass'
@use 'sass:color'
main
  margin:
    top: 30px
header
  position: fixed
  top: 0
  left: 0
div.hero
  background: theme.$primary-container
  color: theme.$on-primary
div.buttons
  max-width: 500px
  margin: auto

</style>
