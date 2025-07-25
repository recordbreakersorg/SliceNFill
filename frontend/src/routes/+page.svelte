<script lang="ts">
  import { CurrentEngineStore } from "$lib/editor";
  import Editor from "./editor/Editor.svelte";
  import Home from "./Home.svelte";
  import TabBar from "./TabBar.svelte";
  import { updateEngines } from "$lib/editor";
  import CircularProgress from "$lib/components/CircularProgress.svelte";
</script>

{#await updateEngines()}
  <div class="w3-padding-64 w3-center">
    <CircularProgress indeterminate={true} size={200} />
  </div>
{:then}
  {#if $CurrentEngineStore != null}
    <Editor engine={$CurrentEngineStore} />
  {:else}
    <Home />
  {/if}
{:catch e}
  <h2 class="w3-center w3-text-red w3-padding-64">Error getting engines {e}</h2>
{/await}
