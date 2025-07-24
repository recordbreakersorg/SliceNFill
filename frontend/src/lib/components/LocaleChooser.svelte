<script lang="ts">
  /**
   * @component LocaleChooser
   * @description A dropdown component that allows the user to switch the application's locale.
   * It uses the Paraglide runtime to get the list of available locales (`locales`),
   * get the current locale (`getLocale`), and set the new locale (`setLocale`).
   * It can be triggered by clicking or hovering.
   */
  import { locales, setLocale, getLocale } from "$lib/paraglide/runtime.js";
  import type { Locale } from "$lib/paraglide/runtime.js";

  /**
   * Optional custom styles to apply to the main dropdown container.
   * @type {string}
   * @default ""
   */
  export let style: string = "";

  /**
   * Optional custom styles to apply to the dropdown button.
   * @type {string}
   * @default ""
   */
  export let buttonStyle: string = "";

  /**
   * The interaction mode to open the dropdown.
   * Can be either 'click' or 'hover'.
   * @type {"click" | "hover"}
   * @default "hover"
   */
  export let mode: "click" | "hover" = "hover";

  // A mapping from locale codes to their full display names.
  const LOCALE_NAMES = {
    en: "English",
    fr: "Français",
  };
</script>

<div class="dropdown w3-dropdown-{mode} {style}">
  <div class="w3-button {buttonStyle}">
    {LOCALE_NAMES[getLocale() as Locale]}
  </div>
  <div class="w3-dropdown-content w3-bar-block">
    {#each locales as locale}
      <button class="w3-bar-item w3-button" on:click={() => setLocale(locale)}>
        {LOCALE_NAMES[locale]}
      </button>
    {/each}
  </div>
</div>

<style lang="sass">
@use '../../theme.sass'

div.dropdown > *
  background: theme.$container !important
  color: theme.$on-container !important
div.dropdown > *:hover
  background: theme.$container !important
  color: theme.$on-container !important
</style>