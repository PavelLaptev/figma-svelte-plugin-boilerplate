import { getAllChildren, getAllVariableFills } from './utils';

console.clear();

figma.showUI(__html__, { themeColors: true, width: 300, height: 370 });

const selectedElement = figma.currentPage.selection[0];

async function sendSelectedSvgToUI(node: InstanceNode, curveText: boolean) {
  if (!selectedElement) {
    figma.notify('Please select a layer to apply the effect to.');
    figma.closePlugin();
    return;
  }

  const nodeClone = node.clone();
  const selectionChildren = getAllChildren(nodeClone);

  selectionChildren.forEach((child) => {
    child.name = child.id;
  });

  const svgString = await nodeClone.exportAsync({
    format: 'SVG_STRING',
    svgIdAttribute: true,
    svgOutlineText: curveText,
  });

  figma.ui.postMessage({
    type: 'data',
    data: {
      svgString,
      fills: getAllVariableFills(selectionChildren),
    },
  });

  nodeClone.remove();
}

sendSelectedSvgToUI(selectedElement as InstanceNode, false);

figma.ui.onmessage = (msg) => {
  if (msg.type === 'curveText') {
    console.log('msg.value', msg.value);
    sendSelectedSvgToUI(selectedElement as InstanceNode, msg.value);
  }

  if (msg.type === 'showMessage') {
    figma.notify(msg.value);
  }
};

figma.on('selectionchange', () => {
  const selectedElement = figma.currentPage.selection[0];

  if (!selectedElement) {
    figma.notify('Please select a layer to apply the effect to.');

    // send empty data to UI
    figma.ui.postMessage({
      type: 'data',
      data: {
        svgString: '',
        fills: [],
      },
    });
  } else {
    // send selected element to UI
    sendSelectedSvgToUI(selectedElement as InstanceNode, false);
  }
});
