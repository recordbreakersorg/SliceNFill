<script lang="ts">
  import { CurrentEngineStore, EnginesStore } from "$lib/editor";
  import Engine from "$lib/engine";
  import { writable } from "svelte/store";
  import OpeningFile from "./OpeningFile.svelte";
  import { open } from "$lib/open";

  // Import Google Material Design Icons SVGs
  // Make sure these paths are correct relative to your component
  import CloseIcon from "@material-design-icons/svg/filled/close.svg";
  import AddIcon from "@material-design-icons/svg/filled/add.svg";

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

  const engineSetter = (engine: Engine) => () => {
    CurrentEngineStore.set(null);
    CurrentEngineStore.set(engine);
  };

  const engineDestroyer = (engine: Engine) => (event: Event) => {
    event.stopPropagation(); // Prevent the parent tab-button from being selected
    engine.destroy().then(() => {
      EnginesStore.update((val) => val.filter((val) => val.id !== engine.id));
      CurrentEngineStore.update((current) =>
        current == null || current.id === engine.id ? null : current,
      );
    });
  };
</script>

<OpeningFile
  shown={$editorLoading}
  error={$editorLoadingError}
  hide={() => editorLoading.set(false)}
/>

{#if $EnginesStore.length !== 0}
  <div class="tab-bar">
    {#each $EnginesStore as engine (engine.id)}
      <button
        class="tab-button {$CurrentEngineStore === engine ? 'selected' : ''}"
        on:click={engineSetter(engine)}
        aria-label="Select {engine.file.split('/').at(-1)?.split('\\').at(-1)}"
      >
        <span class="file-name">
          {engine.file.split("/").at(-1)?.split("\\").at(-1)}
        </span>
        <span
          class="close-button"
          on:click={engineDestroyer(engine)}
          aria-label="Close {engine.file.split('/').at(-1)?.split('\\').at(-1)}"
          role="button"
          tabindex="0"
          on:keydown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              engineDestroyer(engine)(e as KeyboardEvent);
            }
          }}
        >
          <img src={CloseIcon} alt="Close Tab" />
        </span>
      </button>
    {/each}
    <button aria-label="Add new tab" class="add-button" on:click={askOpen}>
      <img src={AddIcon} alt="Add Tab" />
    </button>
  </div>
{/if}

<style lang="sass">
@use '../theme'
@use 'sass:color'

.tab-bar
  width: 100%
  z-index: 1000
  background-color: color.adjust(theme.$primary, $alpha: 0.4)
  color: color.adjust(theme.$on-container, $alpha: 0.8) // Increased visibility
  backdrop-filter: blur(10px)
  height: 35px // Slightly increased height for better touch targets
  display: flex
  align-items: center
  padding: 0 15px 0 0px // Increased horizontal padding for the bar itself
  gap: 4px // Increased gap between tabs for better separation
  overflow-x: auto // Enable horizontal scrolling for many tabs
  // Hide scrollbar for cleaner look (optional, depends on browser support)
  &::-webkit-scrollbar
    display: none
  -ms-overflow-style: none  /* IE and Edge */
  scrollbar-width: none  /* Firefox */


  .tab-button
    background-color: transparent
    border: none
    color: inherit
    padding: 0 0px 0 16px // Adjusted padding for text and icon within the tab
    margin: 0 0 0 0 !important
    height: 35px
    display: flex
    align-items: center
    gap: 8px // Increased space between file name and close icon
    font:
      size: 14px // Slightly larger font
      family: 'Roboto', sans-serif
    cursor: pointer
    transition: background-color 0.2s ease, color 0.2s ease // Smooth transitions
    white-space: nowrap // Prevent file names from wrapping
    overflow: hidden
    text-overflow: ellipsis
    max-width: 180px // Limit tab width to prevent overflow
    flex-shrink: 0 // Prevent tabs from shrinking too much
    position: relative // Needed for potential future overlays if a fixed close button is desired

    .file-name
      flex-grow: 1
      overflow: hidden
      text-overflow: ellipsis

    &:hover
      background-color: color.adjust(theme.$primary, $alpha: 0.6)

    &.selected
      background-color: theme.$container
      color: theme.$on-container
      border:
        left: 2px solid theme.$tertiary // Highlight selected tab
        right: 2px solid theme.$tertiary // Highlight selected tab
    &:hover .close-button
      width: auto
      img
        height: 16px // Set a specific size for the SVG
        width: 16px
        // Filter to make black SVG appear white/light on dark background
        filter: invert(1) opacity(0.7) // Slightly less opaque than text for subtlety
        transition: filter 0.2s ease


    .close-button
      // This span now acts like a button visually
      width: 0
      background: none
      border: none
      color: inherit // Inherit color from parent tab-button
      cursor: pointer
      padding: 6px // Increased padding for a larger, more comfortable clickable area
      border-radius: 4px // Slightly rounded corners
      display: flex
      align-items: center
      justify-content: center
      transition: background-color 0.2s ease
      line-height: 0 // Helps with vertical alignment of SVG
      // Accessibility: For keyboard navigation
      outline: none // Remove default outline for aesthetic
      &:focus-visible // Custom focus style for accessibility
        outline: 2px solid theme.$secondary // Example focus ring

      img
        width: 0px

      &:hover, &:focus-visible
        background-color: rgba(255, 0, 0, 0.15) // Reddish tint on hover/focus
        img
          // Make it red on hover/focus
          filter: invert(0) sepia(1) saturate(1000%) hue-rotate(330deg) brightness(1.2) contrast(1.2)

  .add-button
    background-color: transparent
    border: none
    color: inherit
    cursor: pointer
    height: 100%
    padding: 0 14px // Adjusted padding for the add button
    margin-left: 8px // Slightly increased margin from the last tab
    display: flex
    align-items: center
    justify-content: center
    transition: background-color 0.2s ease, color 0.2s ease
    flex-shrink: 0 // Prevent shrinking

    img
      height: 20px // Set a specific size for the SVG
      width: 20px
      filter: invert(1) opacity(0.8) // Adjust color
      transition: filter 0.2s ease

    &:hover
      background-color: color.adjust(theme.$primary, $alpha: 0.6)
      img
        filter: invert(0) opacity(1) // Make it black/default on hover, or a specific color if desired
</style>
