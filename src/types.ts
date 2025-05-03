export type MergeedVariableFills = {
  variableName: string;
  nodes: {
    type: 'FILL' | 'STROKE';
    nodeId: string;
  }[];
};

export type VariableFills = {
  type: 'FILL' | 'STROKE';
  nodeId: string;
  variableName: string;
};
