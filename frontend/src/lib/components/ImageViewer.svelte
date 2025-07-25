<script lang="ts">
  import Zoom from "svelte-zoom";
  import type Image from "$lib/img";
  import { onMount } from "svelte";

  export let image: Image;
  export let data: Uint8Array;

  let canvas: HTMLCanvasElement;

  onMount(() => {
    const ctx = canvas.getContext("2d");
    const imageData = ctx?.createImageData(image.width, image.height);
    if (!imageData) return;
    imageData.data.set(data);
    ctx?.putImageData(imageData, 0, 0);
  });
</script>

<Zoom />
<!-- <div use:zoom> -->
<!--   <canvas -->
<!--     width={image.width} -->
<!--     height={image.height} -->
<!--     bind:this={canvas} -->
<!--     class="view-canvas">HTML Canvas not supported</canvas -->
<!--   > -->
<!-- </div> -->
