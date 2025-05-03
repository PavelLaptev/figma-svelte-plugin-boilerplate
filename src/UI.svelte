<script lang="ts">
  import './styles.css';
  import Input from './components/Input.svelte';

  let svgString = $state('');

  function handleUpdate() {
    console.log('svgString', svgString);

    parent.postMessage(
      {
        pluginMessage: {
          type: 'showMessage',
          value: 'SVG string copied to clipboard',
        },
      },
      '*'
    );
  }

  onmessage = (event) => {
    const message = event.data.pluginMessage;

    if (message.type === 'data') {
      svgString = message.value;
    }
  };
</script>

<main class="plugin">
  <h1>Optimize SVG</h1>
  <button class="update-button" onclick={handleUpdate}> copy SVG to clipboard </button>
</main>
