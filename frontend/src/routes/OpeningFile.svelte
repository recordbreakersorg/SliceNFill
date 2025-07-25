<script lang="ts">
  import CircularProgress from "$lib/components/CircularProgress.svelte";
  import { m } from "$lib/paraglide/messages";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  export let shown = false;
  export let error: string | null = null;
  export let hide: Function | null = null;
  export let messages: string[] = [
    "Loading editor...",
    "Please wait...",
    "Getting image data...",
  ];
  let msgIndex = writable(0);

  onMount(() => {
    setInterval(() => {
      msgIndex.update((n) => (n + 1) % messages.length);
    }, 3000);
  });
</script>

<div class="w3-modal {shown ? 'shown' : ''}">
  <div class="w3-modal-content w3-margin-large w3-padding-64">
    <button
      on:click={() => (hide ? hide() : null)}
      class="w3-button w3-display-topright"
    >
      &times;
    </button>
    {#if error}
      <div class="w3-container w3-padding-64 hero w3-center">
        <h1 class="w3-jumbo w3-text-red">Error</h1>
        <p class="w3-large">{error}</p>
        <button aria-label={"Retry"} class="w3-button w3-teal w3-large">
          {m.retry()}
        </button>
      </div>
    {:else}
      <div class="w3-container w3-padding-64 hero w3-center">
        <CircularProgress indeterminate={true} size={200} />
        <p class="we-center w3-text-teal w3-large">
          {messages[$msgIndex]}
        </p>
      </div>
    {/if}
  </div>
</div>

<style lang="sass">
@use 'sass:color'
@use '../theme.sass'
div.w3-modal.shown 
  display: block
div.w3-modal-content
  background-color: color.adjust(theme.$container, $alpha: 0.4)
  color: theme.$on-container
    backdrop-filter: blur(10px)
</style>
