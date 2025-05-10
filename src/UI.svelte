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
  <div class="input-group">
    <p class="caption">Enter rectangle dimensions:</p>
    <Input type="number" bind:value={rectFrame.width} placeholder="Width" />
    <Input type="number" bind:value={rectFrame.height} placeholder="Height" />
    <Button onclick={handleUpdate}>Create new rectangle</Button>
  </div>

  <div class="figma-response">
    <p>Response from Figma:</p>
    {#if rectangleId}
      <p>Rectangle created with ID: {rectangleId}</p>
    {:else}
      <p>No rectangle created yet.</p>
    {/if}
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    padding: 20px;
    font-family: sans-serif;
  }

  h1 {
    font-size: 24px;
    margin: 0;
    margin-bottom: 20px;
  }

  p {
    margin: 0;
    margin-bottom: 10px;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }

  .caption {
    font-size: 14px;
    opacity: 0.7;
    margin-bottom: 5px;
  }

  .figma-response {
    padding: 10px;
    border: 1px solid #ffffff54;

    & p {
      font-size: 14px;
      color: #ffffffc3;
      margin: 0;
      margin-bottom: 5px;
      line-height: 1.5;
    }
  }
</style>
