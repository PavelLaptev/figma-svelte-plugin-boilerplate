figma.showUI(__html__, { themeColors: true, width: 300, height: 370 });



figma.ui.onmessage = (msg) => {
  if (msg.type === 'getSelected') {
    const selected = figma.currentPage.selection;
    const selectedIds = selected.map(node => node.id);
    figma.ui.postMessage({ type: 'selected', selectedIds });
  }
};
