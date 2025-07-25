<script lang="ts">
  import { CurrentEngineStore, EnginesStore, updateEngines } from "$lib/editor";
  import Engine from "$lib/engine";
  import { writable } from "svelte/store";
  import OpeningFile from "./OpeningFile.svelte";
  import { open } from "$lib/open";
  let editorLoading = writable(false);
  let editorLoadingError = writable<null | string>(null);
  async function askOpen() {
    for await (const state of open()) {
      if (typeof state === "boolean") {
        editorLoading.set(state);
      } else if (typeof state === "string") {
        editorLoadingError.set(state);
      }
    }
    editorLoading.set(false);
  }
  const engineSetter = (engine: Engine) =>
    function () {
      CurrentEngineStore.update((val) => (val == null ? engine : null));
    };
</script>

<OpeningFile
  shown={$editorLoading}
  error={$editorLoadingError}
  hide={() => editorLoading.set(false)}
/>

{#if $EnginesStore.length != 0}
  <div class="w3-bar tabBar">
    {#each $EnginesStore as engine}
      <span
        aria-label="Engine: {engine.id}"
        class="w3-bar-item w3-button {$CurrentEngineStore == engine
          ? 'selected'
          : ''}"
        on:click={engineSetter(engine)}
      >
        {engine.file.length > 10 ? "..." + engine.file.slice(-10) : engine.file}
        <button class="w3-bar-item w3-button close-button">&times;</button>
      </span>
    {/each}
    <button
      aria-label="Add Engine"
      class="w3-right w3-bar-item w3-button w3-hover-dark-gray addButton"
      on:click={askOpen}>+</button
    >
  </div>
{/if}

<style lang="sass">
@use '../theme'
@use 'sass:color'
div.tabBar
  width: 100%
  z-index: 1000
  background-color: color.adjust(theme.$primary, $alpha: 0.4)
  color: color.adjust(theme.$on-container, $alpha: 0.4)
  backdrop-filter: blur(10px)
  overflow-x: scroll
button.addButton
  padding: 3px 8px !important
button:hover
  background-color: theme.$primary
button.selected
  background-color: theme.$container
button
  padding: 3px !important
  display: inline
button.close-button
  padding: 5px 5px !important
  margin-left: 0px
  border-radius: 5px
  width: 30px
  height: 30px

</style>
