<script lang="ts">
  import Editor from "$lib/editor";
  import Engine from "$lib/engine";
  import Menu from "./Menu.svelte";
  import { EditorMode } from "$lib/editor";
  import EmptyView from "./EmptyView.svelte";
  import CircularProgress from "$lib/components/CircularProgress.svelte";
  export let engine: Engine;
  const editor: Editor = new Editor(engine);
  const editorMode = editor.mode;
</script>

<Menu {editor} />
<h1>{editor.engine.id}:{editor.engine.image.id}</h1>
{#if $editorMode == EditorMode.Normal}
  {#await editor.engine.image.getData()}
    <div class="w3-panel w3-center">
      <CircularProgress indeterminate={true} />
      <h4>Loading image data...</h4>
    </div>
  {:then data}
    {engine.image.width}&times;{engine.image.height}
    <EmptyView {data} image={engine.image} />
  {:catch error}
    <div class="w3-panel w3-text-red w3-center">
      <h3>{error}</h3>
    </div>
  {/await}
{:else}
  <div class="w3-panel">
    <h3 class="w3-xxlarge">Invalid mode</h3>
  </div>
{/if}
