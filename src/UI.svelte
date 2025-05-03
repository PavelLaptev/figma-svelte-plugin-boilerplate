<script lang="ts">
  import vkbeautify from 'vkbeautify';

  import './styles.css';
  import Input from './components/Input.svelte';
  import Checkbox from './components/Checkbox.svelte';
  import type { MergeedVariableFills } from './types';

  let svgFills = $state([] as MergeedVariableFills[]);
  let svgString = $state('');
  let svgSettings = $state({
    curveText: true,
    removeIds: true,
    removeWidthHeight: true,
    ungroupGroupsWithoutAttributes: true,
    pretify: true,
  });

  function copyToClipboard(value: string) {
    try {
      // @ts-ignore
      if (window.copy) {
        // @ts-ignore
        window.copy(value);
      } else {
        const area = document.createElement('textarea');
        document.body.appendChild(area);
        area.value = value;
        area.focus();
        area.select();
        const result = document.execCommand('copy');
        document.body.removeChild(area);
        if (!result) {
          throw new Error();
        }
      }
    } catch (e) {
      console.error(`Unable to copy the value: ${value}`);
      return false;
    }
    return true;
  }

  function replaceFills(svgString: string, fills: MergeedVariableFills[]) {
    const svgElement = new DOMParser().parseFromString(svgString, 'image/svg+xml').documentElement;

    fills.forEach((fill) => {
      const fillVariable = fill.variableName;
      const fillConsumers = fill.nodes;

      fillConsumers.forEach((node) => {
        const nodeElement = svgElement.querySelector(`[id="${node.nodeId}"]`);

        if (nodeElement) {
          if (node.type === 'FILL' && nodeElement.hasAttribute('fill')) {
            nodeElement.setAttribute('fill', `var(--${fillVariable})`);
          } else if (node.type === 'STROKE' && nodeElement.hasAttribute('stroke')) {
            nodeElement.setAttribute('stroke', `var(--${fillVariable})`);
          }

          /* handle case if an element was broken into two
           * for the fill and stroke. These elements placed inside a group
           * and the group has an id. We need to get elements inside the group
           * and set the fill and stroke to elements. */
          if (nodeElement.tagName === 'g') {
            const groupElements = nodeElement.querySelectorAll('*');

            groupElements.forEach((groupElement) => {
              if (node.type === 'FILL' && groupElement.hasAttribute('fill')) {
                groupElement.setAttribute('fill', `var(--${fillVariable})`);
              } else if (node.type === 'STROKE' && groupElement.hasAttribute('stroke')) {
                groupElement.setAttribute('stroke', `var(--${fillVariable})`);
              }
            });
          }
        }
      });
    });

    return svgElement.outerHTML;
  }

  function replaceIds(svgString: string) {
    const svgElement = new DOMParser().parseFromString(svgString, 'image/svg+xml').documentElement;
    const elements = svgElement.querySelectorAll('*');

    elements.forEach((element) => {
      element.removeAttribute('id');
    });

    return svgElement.outerHTML;
  }

  function removeWidthHeight(svgString: string) {
    const svgElement = new DOMParser().parseFromString(svgString, 'image/svg+xml').documentElement;
    svgElement.removeAttribute('width');
    svgElement.removeAttribute('height');

    return svgElement.outerHTML;
  }

  function ungroupGroupsWithoutAttributes(svgString: string) {
    const svgElement = new DOMParser().parseFromString(svgString, 'image/svg+xml').documentElement;
    const groups = svgElement.querySelectorAll('g');

    groups.forEach((group) => {
      if (group.children.length === 0) {
        group.parentNode?.removeChild(group);
      } else {
        const parent = group.parentNode;
        if (parent) {
          while (group.firstChild) {
            parent.insertBefore(group.firstChild, group);
          }
          parent.removeChild(group);
        }
      }
    });

    return svgElement.outerHTML;
  }

  function uglifySVG(svgString: string) {
    // Remove all whitespace and newlines
    return svgString.replace(/\s+/g, ' ').trim();
  }

  function handleUpdate() {
    let updatedSvgString = svgString;
    updatedSvgString = replaceFills(svgString, svgFills);

    if (svgSettings.removeWidthHeight) {
      updatedSvgString = removeWidthHeight(updatedSvgString);
    }
    if (svgSettings.ungroupGroupsWithoutAttributes) {
      updatedSvgString = ungroupGroupsWithoutAttributes(updatedSvgString);
    }
    if (svgSettings.pretify) {
      updatedSvgString = vkbeautify.xml(updatedSvgString, 2);
    } else {
      updatedSvgString = uglifySVG(updatedSvgString);
    }
    if (svgSettings.removeIds) {
      updatedSvgString = replaceIds(updatedSvgString);
    }

    copyToClipboard(updatedSvgString);
    console.log('SVG string copied to clipboard:', updatedSvgString);

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
      const messageData: {
        svgString: string;
        fills: MergeedVariableFills[];
      } = message.data;

      svgFills = messageData.fills;
      svgString = messageData.svgString;
    }
  };

  $effect(() => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'curveText',
          value: svgSettings.curveText,
        },
      },
      '*'
    );
  });
</script>

<main class="plugin">
  <h1>Optimize SVG</h1>

  {#if svgString !== ''}
    <div class="svg-settings">
      <div class="settings-section">
        {#if svgFills.length > 0}
          <p class="caption">
            Below you can see the variable fills that were found in the SVG. Change the variable
            name to the one you want to use.
          </p>
          {#each svgFills as fill}
            <div class="fill-item">
              <Input bind:value={fill.variableName} />
            </div>
          {/each}
        {:else}
          <p>No variable fills found.</p>
        {/if}
      </div>

      <div class="settings-section">
        <Checkbox id="curve-text" bind:checked={svgSettings.curveText} label="Curve text" />
        <Checkbox id="remove-ids" bind:checked={svgSettings.removeIds} label="Remove IDs" />
        <Checkbox
          id="remove-width-height"
          bind:checked={svgSettings.removeWidthHeight}
          label="Remove width and height"
        />
        <Checkbox
          id="remove-groups-without-attributes"
          bind:checked={svgSettings.ungroupGroupsWithoutAttributes}
          label="Remove groups without attributes"
        />
        <Checkbox id="pretify" bind:checked={svgSettings.pretify} label="Pretify SVG" />
      </div>
    </div>

    <button class="update-button" onclick={handleUpdate}> copy SVG to clipboard </button>
  {:else}
    <p>Nothing to show. Please select something.</p>
  {/if}

  <a href="https://github.com/PavelLaptev/figma-svg-export" target="_blank">Source code</a>
</main>
