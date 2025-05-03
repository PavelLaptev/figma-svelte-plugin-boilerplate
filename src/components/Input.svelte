<script lang="ts">
  interface Props {
    value: string;
    placeholder?: string;
  }

  let { value = $bindable(), placeholder }: Props = $props();
</script>

<div>
  <input type="text" bind:value {placeholder} class="border-2 border-gray-300 rounded p-2 w-full" />
</div>
