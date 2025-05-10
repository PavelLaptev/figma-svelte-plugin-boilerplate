import { generateRandomRgbColor } from './utils';

figma.showUI(__html__, { themeColors: true, width: 300, height: 380 });

console.clear();
console.log('Figma plugin started');

figma.ui.onmessage = (msg) => {
  if (msg.type === 'create-rectangle') {
    const rectFrame = {
      width: Number(msg.val.width),
      height: Number(msg.val.height),
    }
    const rect = figma.createRectangle();
    // set the rectangle's fill color to a random color
    rect.fills = [
      {
        type: 'SOLID',
        color: generateRandomRgbColor(),
      },
    ];
    rect.resize(rectFrame.width, rectFrame.height);

    // select the rectangle
    figma.currentPage.selection = [rect];
    // center the rectangle in the viewport
    figma.viewport.scrollAndZoomIntoView([rect]);

    // send the rectangle to the UI
    figma.ui.postMessage({
      type: 'rectangle-created',
      id: rect.id,
    });
  }
};
