<script lang="ts">
  interface Props {
    id: string;
    label: string;
    checked: boolean;
  }

  let { id, label, checked = $bindable() }: Props = $props();
</script>

<label for={id}>
  <input {id} type="checkbox" bind:checked class="border-2 border-gray-300 rounded p-2 w-full" />
  <span class="checkmark">{label}</span>
</label>
