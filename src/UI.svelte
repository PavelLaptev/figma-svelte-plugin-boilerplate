<script lang="ts">
  import './styles.css';
  import Button from './components/Button.svelte';
  import Input from './components/Input.svelte';

  let rectFrame = $state({
    width: 100,
    height: 100,
  });

  let rectangleId = $state();

  function handleUpdate() {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'create-rectangle',
          val: { ...rectFrame },
        },
      },
      '*'
    );
  }

  onmessage = (event) => {
    const message = event.data.pluginMessage;

    if (message.type === 'rectangle-created') {
      console.log('Rectangle created:', message);
      rectangleId = message.id;
    }
  };
</script>

<main class="plugin">
  <h1>Figma/Svelte plugin boilerplate</h1>
  <Input type="number" bind:value={rectFrame.width} placeholder="Width" />
  <Input type="number" bind:value={rectFrame.height} placeholder="Height" />

  <Button onclick={handleUpdate}>Create new rectangle</Button>

  <p>Response from Figma:</p>
  {#if rectangleId}
    <p>Rectangle created with ID: {rectangleId}</p>
  {:else}
    <p>No rectangle created yet.</p>
  {/if}
</main>
