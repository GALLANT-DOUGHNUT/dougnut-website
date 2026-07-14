import type {
  DomainNode,
  IndicatorConnection,
  IndicatorDataDict,
} from "../types/DonutData";

export const readCSVConnection = (csvRow: string[]) => {
  const sourceDomainParts = csvRow[0].split(" ");
  const targetDomainParts = csvRow[1].split(" ");

  const newConnection: IndicatorConnection = {
    sourceName: sourceDomainParts
      .slice(1)
      .join("_")
      .replaceAll("_and_", "_&_")
      .toLowerCase(),
    sourceQuarter: `${sourceDomainParts[0][0] === "L" ? "local" : "global"}_${sourceDomainParts[0][1] === "E" ? "ecological" : "social"}`,
    targetName: targetDomainParts
      .slice(1)
      .join("_")
      .replaceAll("_and_", "_&_")
      .toLowerCase(),
    targetQuarter: `${targetDomainParts[0][0] === "L" ? "local" : "global"}_${targetDomainParts[0][1] === "E" ? "ecological" : "social"}`,
    description: csvRow[3], // Proposed Website Text column
  };

  return newConnection;
};

export const getEdgeColor = (
  source: string,
  target: string,
  indicator: IndicatorDataDict,
) => {
  const name = Object.keys(indicator)[0];
  const data = Object.values(indicator)[0];

  const indicatorName = `${name}_${data.quarter}`.toLowerCase();
  const colorByTarget = source.toLowerCase() === indicatorName;

  if (colorByTarget) {
    return target.includes("social") ? "#8FC53A" : "#3AADC6";
  }
  return source.includes("social") ? "#8FC53A" : "#3AADC6";
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
