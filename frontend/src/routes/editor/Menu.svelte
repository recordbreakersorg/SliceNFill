<script lang="ts">
  import type Editor from "$lib/editor";

  export let editor: Editor | null;
</script>

<div class="w3-bar">
  <div class="w3-dropdown-hover">
    <button class="w3-button w3-dropdown-item">File</button>
    <div class="w3-dropdown-content w3-bar-block">
      <button class="w3-button w3-bar-item">Open</button>
      <button class="w3-button w3-bar-item">Close</button>
    </div>
  </div>
</div>

<style lang="sass">
  button.w3-button
    padding: 3px 8px
    text-align: center
</style>
