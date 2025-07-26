<script lang="ts">
  import type Image from "$lib/img";
  import { onMount } from "svelte";

  export let image: Image;
  export let data: Uint8Array;
  export let width: number | null = null;
  export let height: number | null = null;

  width ??= image.width;
  height ??= image.height;

  let canvas: HTMLCanvasElement;

  onMount(() => {
    const ctx = canvas.getContext("2d");
    const imageData = ctx?.createImageData(image.width, image.height);
    if (!imageData) return;
    imageData.data.set(data);
    ctx?.putImageData(imageData, 0, 0);
    canvas.style.width = width.toFixed(2);
    canvas.style.height = height.toFixed(2);
  });
</script>

<div class="container">
  <canvas class="w3-card" bind:this={canvas} {width} {height}></canvas>
</div>

<style lang="sass">
div.container
  width: 100%
  margin: auto
  padding: auto
  canvas
    max-width: 1000px
    max-height: 650px
    margin: auto
    padding: auto
</style>
