<script lang="ts">
  import type Editor from "$lib/editor";
  import type Image from "$lib/img";
  import { onMount } from "svelte";

  export let data: Uint8Array;
  export let image: Image;

  let canvas: HTMLCanvasElement;

  onMount(() => {
    const ctx = canvas.getContext("2d");
    let newData = ctx?.createImageData(image.width, image.height);
    console.log("Created empty data", newData);
    if (!newData) return;
    console.log("Applying data");
    for (let i = 0; i < newData.data.length; i++) newData.data[i] = data[i];
    ctx?.putImageData(newData, 0, 0);
  });
</script>

<canvas
  width={image.width}
  height={image.height}
  bind:this={canvas}
  class="view-canvas">HTML Canvas not supported</canvas
>

<p>View</p>
