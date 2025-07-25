<script lang="ts">
  import type Editor from "$lib/editor";

  export let editor: Editor;
</script>

<p class="statusBar w3-bar">Hello world</p>

<style lang="sass">
@use 'sass:color'
@use '../../theme'
p.statusBar
  margin: 0 !important
  background-color: rgba(color.mix(theme.$primary, theme.$secondary), 0.4)
  backdrop-filter: blur(10px)
</style>
