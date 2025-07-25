<script lang="ts">
  import CircularProgress from "$lib/components/CircularProgress.svelte";
  import ImageViewer from "$lib/components/ImageViewer.svelte";
  import Editor from "$lib/editor";
  export let editor: Editor;
  const image = editor.engine.image;
</script>

{#await image.getData()}
  <div class="w3-padding-64 w3-panel w3-center">
    <CircularProgress indeterminate={true} />
    <h4>Loading image data...</h4>
  </div>
{:then data}
  <ImageViewer {data} {image} />
{:catch error}
  <div class="w3-panel w3-text-red w3-center">
    <h3>{error}</h3>
  </div>
{/await}
