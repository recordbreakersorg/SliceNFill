<script lang="ts">
  import LocaleChooser from "$lib/components/LocaleChooser.svelte";
  import editImage from "$lib/open.js";
  import { OpenFile } from "$lib/wailsjs/go/app/App";
  import { m } from "$lib/paraglide/messages.js";
  function open() {
    OpenFile().then(function (path: string) {
      editImage(path).catch((error: Error) => {
        alert(
          m["error.opening_file"]({ message: error.message, fileName: path }),
        );
      });
    });
  }
</script>

<div class="hero w3-container w3-padding-64">
  <h1 class="w3-jumbo w3-center">
    Slice'<span class="w3-text-teal">n</span>'Fill
  </h1>
  <p class="w3-center w3-opacity">
    Quickly edit, resize, and fill images with a simple interface.
  </p>
</div>

<header class="w3-bar">
  <LocaleChooser style="w3-right" buttonStyle="w3-bar-item" />
</header>
<div class="open-button w3-padding-64">
  <h3 class="w3-xlarge w3-center">Get started</h3>
  <div class="w3-container">
    <button
      aria-label={"Open file"}
      class="w3-button w3-teal w3-large"
      on:click={open}
    >
      {m.open_file()}
    </button>
  </div>
</div>

<style lang="sass">
@use '../theme.sass'
@use 'sass:color'
header
  background: color.adjust(theme.$primary, $alpha: 0.3)
  backdrop-fileter: blur(5px)
div.hero
  background: theme.$primaryContainer
  color: theme.$onPrimary

</style>
