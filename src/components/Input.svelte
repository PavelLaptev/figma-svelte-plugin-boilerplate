<script lang="ts">
  import { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';

  interface Props {
    type?: HTMLInputTypeAttribute;
    value: string | number;
    placeholder?: string;
  }

  let { value = $bindable(), type, placeholder }: Props = $props();
</script>

<input {type} bind:value {placeholder} />
