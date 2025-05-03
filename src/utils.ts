import { MergeedVariableFills, VariableFills } from './types';

function isEmptyObject(obj: object) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

function filterChildren(node: SceneNode[]) {
  return node.filter((child) => {
    if ('visible' in child && !child.visible) {
      return false;
    }
    if ('type' in child && child.type === 'GROUP') {
      return false;
    }
    return true;
  });
}

const groupByVariableName = (fills: VariableFills[]) => {
  const groupedFills: MergeedVariableFills[] = [];
  fills.forEach((fill) => {
    const existingGroup = groupedFills.find((group) => group.variableName === fill.variableName);
    if (existingGroup) {
      existingGroup.nodes.push({
        type: fill.type,
        nodeId: fill.nodeId,
      });
    } else {
      groupedFills.push({
        variableName: fill.variableName,
        nodes: [
          {
            type: fill.type,
            nodeId: fill.nodeId,
          },
        ],
      });
    }
  });
  return groupedFills;
};

export function getAllChildren(node: SceneNode) {
  const children: SceneNode[] = [node];

  if ('children' in node) {
    for (const child of node.children) {
      children.push(child);
      children.push(...getAllChildren(child));
    }
  }
  // if child visible is false filter it out
  return filterChildren(children);
}

export function getAllVariableFills(children: SceneNode[]) {
  const fills: {
    type: 'FILL' | 'STROKE';
    nodeId: string;
    variableName: string;
  }[] = [];

  // loop through all children and get the fills
  children.forEach((child) => {
    if ('fills' in child && Array.isArray(child.fills)) {
      child.fills.forEach((fill) => {
        if (isEmptyObject(fill.boundVariables)) return;

        const variable = figma.variables.getVariableById(fill.boundVariables.color.id);
        if (variable) {
          fills.push({
            type: 'FILL',
            nodeId: child.id,
            variableName: variable.name,
          });
        }
      });
    }
    if ('strokes' in child && Array.isArray(child.strokes)) {
      child.strokes.forEach((stroke) => {
        if (isEmptyObject(stroke.boundVariables)) return;
        const variable = figma.variables.getVariableById(stroke.boundVariables.color.id);
        if (variable) {
          fills.push({
            type: 'STROKE',
            nodeId: child.id,
            variableName: variable.name,
          });
        }
      });
    }
  });
  return groupByVariableName(fills);
}
