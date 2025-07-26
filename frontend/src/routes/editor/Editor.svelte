<script lang="ts">
  import Editor from "$lib/editor";
  import Engine from "$lib/engine";
  import Menu from "./Menu.svelte";
  import { EditorMode } from "$lib/editor";
  import EmptyView from "./EmptyView.svelte";
  import StatusBar from "./StatusBar.svelte";
  import TabBar from "../TabBar.svelte";
  export let engine: Engine;
  const editor: Editor = new Editor(engine);
  const editorMode = editor.mode;
</script>

<main>
  <header>
    <Menu {editor} />
    <TabBar />
  </header>
  {#if $editorMode == EditorMode.Normal}
    <EmptyView {editor} />
  {:else}
    <div class="w3-panel">
      <h3 class="w3-xxlarge">Invalid mode</h3>
    </div>
  {/if}
  <footer>
    <StatusBar {editor} />
  </footer>
</main>

<style lang="sass">
  header
    position: absolute
    top: 0
    left: 0
    width: 100%
  footer
    position: absolute
    bottom: 0
    left: 0
  main
    padding:
      top: 60px
</style>
