<script lang="ts">
  // --- PROPS ---
  /**
   * If true, the component will display a spinning animation
   * and ignore the `progress` prop.
   * @type {boolean}
   */
  export let indeterminate: boolean = false;

  /**
   * The progress percentage (0-100).
   * Only used when `indeterminate` is false.
   * @type {number}
   */
  export let progress: number = 0;

  /**
   * The width and height of the component in pixels.
   * @type {number}
   */
  export let size: number = 100;

  /**
   * The thickness of the progress ring.
   * @type {number}
   */
  export let strokeWidth: number = 10;

  /**
   * The color of the progress ring.
   * @type {string}
   */
  export let color: string = '#2196F3'; // A nice default blue

  /**
   * If true, shows the percentage label in the center.
   * Only used when `indeterminate` is false.
   * @type {boolean}
   */
  export let showLabel: boolean = true;


  // --- REACTIVE CALCULATIONS ---
  $: radius = (size / 2) - (strokeWidth / 2);
  $: circumference = 2 * Math.PI * radius;

  // For determinate mode
  $: offset = circumference - (progress / 100) * circumference;

  // For indeterminate mode: a dash that is 25% of the circle's length
  $: indeterminateDash = circumference * 0.25;

</script>

<div class="progress-container" style="width: {size}px; height: {size}px;">
  <svg
    class="progress-svg"
    class:indeterminate={indeterminate}
    width={size}
    height={size}
  >
    <!-- Background circle (the track) -->
    <circle
      class="progress-background"
      stroke="#e6e6e6"
      fill="transparent"
      stroke-width={strokeWidth}
      r={radius}
      cx={size / 2}
      cy={size / 2}
    />

    <!-- Foreground circle (the actual progress) -->
    <circle
      class="progress-foreground"
      stroke={color}
      fill="transparent"
      stroke-linecap="round"
      stroke-width={strokeWidth}
      stroke-dasharray={indeterminate ? `${indeterminateDash} ${circumference - indeterminateDash}` : `${circumference} ${circumference}`}
      stroke-dashoffset={indeterminate ? 0 : offset}
      r={radius}
      cx={size / 2}
      cy={size / 2}
    />

    <!-- Optional percentage label (only shown in determinate mode) -->
    {#if !indeterminate && showLabel}
      <text
        class="progress-label"
        x="50%"
        y="50%"
        text-anchor="middle"
        dominant-baseline="middle"
        font-size={size / 4}
      >
        {Math.round(progress)}%
      </text>
    {/if}
  </svg>
</div>

<style>
  .progress-container {
    position: relative;
    display: inline-block;
  }

  .progress-svg {
    display: block;
    /* Rotate the circle by -90 degrees to start from the top (12 o'clock) */
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
  }

  .progress-foreground {
    /* Add a smooth transition for when the progress value changes in determinate mode */
    transition: stroke-dashoffset 0.35s ease;
  }

  .progress-label {
    /* Undo the parent SVG's rotation to keep the text upright */
    transform: rotate(90deg);
    transform-origin: 50% 50%;
    font-family: sans-serif;
    fill: #333;
  }

  /* --- INDETERMINATE MODE STYLES --- */
  .progress-svg.indeterminate {
    animation: spin 1.4s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(-90deg);
    }
    100% {
      transform: rotate(270deg); /* 360 + (-90) */
    }
  }
</style>
