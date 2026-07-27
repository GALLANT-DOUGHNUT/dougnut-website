import theme from "../theme";
import type { DomainData, DomainNode } from "../types/DonutData";

export const getEdgeColor = (
  source: string,
  target: string,
  domain: DomainData,
) => {
  const indicatorName = `${domain.name}_${domain.quarter}`.toLowerCase();
  const colorByTarget = source.toLowerCase() === indicatorName;

  if (colorByTarget) {
    return target.includes("social")
      ? theme.palette.common.social
      : theme.palette.common.ecological;
  }
  return source.includes("social")
    ? theme.palette.common.social
    : theme.palette.common.ecological;
};

export const redistributeMutualNodes = (
  mutualNodes: DomainNode[],
  sourceNodes: DomainNode[],
  targetNodes: DomainNode[],
) => {
  if (mutualNodes.length === 0) {
    return { leftNodes: sourceNodes, rightNodes: targetNodes };
  }

  const sourceTargetImbalance = sourceNodes.length - targetNodes.length;
  const distributeFully = mutualNodes.length < Math.abs(sourceTargetImbalance);

  if (distributeFully) {
    return {
      leftNodes:
        sourceTargetImbalance < 0
          ? [...sourceNodes, ...mutualNodes]
          : sourceNodes,
      rightNodes:
        sourceTargetImbalance > 0
          ? [...targetNodes, ...mutualNodes]
          : targetNodes,
    };
  } else {
    // Amount of nodes left over after equalising the counts
    const remainingAfterEqualisation =
      mutualNodes.length - Math.abs(sourceTargetImbalance);

    let splitIndex;
    if (sourceTargetImbalance < 0) {
      splitIndex =
        Math.abs(sourceTargetImbalance) - 1 + remainingAfterEqualisation / 2;
    } else {
      splitIndex =
        mutualNodes.length -
        1 -
        sourceTargetImbalance -
        remainingAfterEqualisation / 2;
    }

    return {
      leftNodes: [...sourceNodes, ...mutualNodes.slice(0, splitIndex)],
      rightNodes: [...targetNodes, ...mutualNodes.slice(splitIndex)],
    };
  }
};
