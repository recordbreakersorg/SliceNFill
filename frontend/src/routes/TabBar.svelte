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
      CurrentEngineStore.set(null);
      setTimeout(() => CurrentEngineStore.set(engine), 1);
    };
  const engineDestroyer = (engine: Engine) =>
    function () {
      engine.destroy().then(() => {
        EnginesStore.update((val) => val.filter((val) => val.id != engine.id));
        CurrentEngineStore.update((current) =>
          current == null || current.id == engine.id ? null : current,
        );
      });
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
      <button
        class="w3-bar-item tabButton w3-inline w3-button {$CurrentEngineStore ==
        engine
          ? 'selected'
          : ''}"
        on:click={engineSetter(engine)}
      >
        {engine.file.split("/").at(-1)?.split("\\").at(-1)}
        <input
          type="button"
          class="close-button"
          on:click|stopPropagation={engineDestroyer(engine)}
          value="×"
        />
      </button>
    {/each}
    <button
      aria-label="Add Engine"
      class="w3-margin-left w3-bar-item w3-button w3-hover-dark-gray addButton"
      on:click={askOpen}>+</button
    >
  </div>
{/if}

<style lang="sass">
@use '../theme'
@use 'sass:color'

button.tabButton
  padding:
    top: 0 !important
    bottom: 0 !important
    left: 20 !important
    right: 20 !important
  margin:
    right: 0
    left: 0

div.tabBar
  width: 100%
  z-index: 1000
  background-color: color.adjust(theme.$primary, $alpha: 0.4)
  color: color.adjust(theme.$on-container, $alpha: 0.4)
  backdrop-filter: blur(10px)
  overflow-x: scroll
  height: 30px
  button.tabButton
    padding: 0px 10px !important
    display: inline
    padding: 2px 10px
    input.close-button
      padding: 0px 0px !important
      border-radius: 50%
      width: 0px
      transition: width 0.1s ease-in-out
      height: 30px
      background-color: transparent
      border: none
      font-size: 14px  
      input.close-button:hover
      background-color: rgba(255, 0, 0, 0.1)

  button.tabButton.selected
    background-color: theme.$container
  button.tabButton:hover
    background-color: theme.$primary
    input.close-button
      width: 30px

  button.addButton
    font-size: 10px
      

</style>
