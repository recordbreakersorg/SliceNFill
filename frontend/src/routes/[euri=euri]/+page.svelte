<script lang="ts">
  import Color from "$lib/color";
  import CircularProgress from "$lib/components/CircularProgress.svelte";
  import Editor from "./Editor.svelte";
  export let data: { error: string; enginePromise: Promise<number> };
</script>

{#if data.error != null}
  <div class="w3-container w3-red">
    <h2>Error</h2>
    <p>{data.error}</p>
  </div>
{:else}
  {#await data.enginePromise}
    <CircularProgress indeterminate={true} />
  {:then engine}
    <Editor engineID={engine} />
  {:catch error}
    <div class="w3-container w3-red">
      <h2>Error</h2>
      <p>{error}</p>
    </div>
  {/await}
{/if}
