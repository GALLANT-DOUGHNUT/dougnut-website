import type { CustomSize } from "../components/Indicator/DomainConnectionsFlowchart"
import theme from "../theme"
import type {
  DomainData,
  DomainEdge,
  DomainNode,
  IndicatorConnection,
} from "../types/DonutData"
import { type InternalNode } from "@xyflow/react"

export const getEdgeColor = (
  source: string,
  target: string,
  domain: DomainData
) => {
  const indicatorName = `${domain.name}_${domain.quarter}`.toLowerCase()
  const colorByTarget =
    source.replace("&", "and").toLowerCase() === indicatorName

  if (colorByTarget) {
    return target.includes("social")
      ? theme.palette.common.social
      : theme.palette.common.ecological
  }
  return source.includes("social")
    ? theme.palette.common.social
    : theme.palette.common.ecological
}

export const redistributeMutualNodes = (
  mutualNodes: DomainNode[],
  sourceNodes: DomainNode[],
  targetNodes: DomainNode[]
) => {
  if (mutualNodes.length === 0) {
    return { leftNodes: sourceNodes, rightNodes: targetNodes }
  }

  const sourceTargetImbalance = sourceNodes.length - targetNodes.length
  const distributeFully =
    mutualNodes.length < Math.abs(sourceTargetImbalance)

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
    }
  } else {
    // Amount of nodes left over after equalising the counts
    const remainingAfterEqualisation =
      mutualNodes.length - Math.abs(sourceTargetImbalance)

    let splitIndex
    if (sourceTargetImbalance < 0) {
      splitIndex =
        Math.abs(sourceTargetImbalance) -
        1 +
        remainingAfterEqualisation / 2
    } else {
      splitIndex =
        mutualNodes.length -
        1 -
        sourceTargetImbalance -
        remainingAfterEqualisation / 2
    }

    return {
      leftNodes: [...sourceNodes, ...mutualNodes.slice(0, splitIndex)],
      rightNodes: [...targetNodes, ...mutualNodes.slice(splitIndex)],
    }
  }
}

export const getEdgeParams = (
  source: InternalNode,
  target: InternalNode
) => {
  const sourceWidth = source.measured.width ?? 0
  const sourceHeight = source.measured.height ?? 0

  const targetWidth = target.measured.width ?? 0
  const targetHeight = target.measured.height ?? 0

  return {
    sourceX: source.internals.positionAbsolute.x + sourceWidth / 2,

    sourceY: source.internals.positionAbsolute.y + sourceHeight / 2,

    targetX: target.internals.positionAbsolute.x + targetWidth / 2,

    targetY: target.internals.positionAbsolute.y + targetHeight / 2,
  }
}

export const generateConnectionEdges = (
  domain: DomainData | null,
  connections: IndicatorConnection[]
) => {
  return connections.reduce<DomainEdge[]>((edges, c) => {
    const source = `${c.sourceName}_${c.sourceQuarter}`
    const target = `${c.targetName}_${c.targetQuarter}`

    // Check if this connection has a reverse connection (and is therefore mutual)
    const reverseConnection = connections.find(
      (other) =>
        other.sourceName === c.targetName &&
        other.sourceQuarter === c.targetQuarter &&
        other.targetName === c.sourceName &&
        other.targetQuarter === c.sourceQuarter
    )
    const isMutual = Boolean(reverseConnection)

    // If we've already added the reverse edge, don't add another one.
    if (
      isMutual &&
      edges.some(
        (edge) => edge.source === target && edge.target === source
      )
    ) {
      return edges
    }

    edges.push({
      id: `${source}-${target}`,
      source,
      target,
      type: "animated",
      data: {
        color: getEdgeColor(source, target, domain!),
        mutual: isMutual,
      },
    })

    return edges
  }, [])
}

export const getNodePosition = (
  width: number,
  height: number,
  fraction: number,
  containerSize: CustomSize | undefined,
  position: "left" | "right" | "center",
  angleOffset: number
) => {
  const offsetScale = containerSize ? 0.09 : 0.15
  const piMultiplier = containerSize ? 1.44 : 1.33
  const xOffset = width * offsetScale * (position === "right" ? 1 : -1)

  const angle = piMultiplier * Math.PI * fraction
  const xDistance = containerSize ? 110 : width * 0.95

  const x =
    Math.sin(angle + angleOffset) *
      xDistance *
      (position === "right" ? 1 : -1) +
    xOffset

  const y =
    (containerSize ? 160 : height * 0.34) *
    Math.cos(angle + angleOffset) *
    -1

  return { x, y }
}

export const getMobileNodePosition = (
  width: number,
  height: number,
  fraction: number,
  position: "left" | "right" | "center"
) => {
  const yDir = position === "right" ? 1 : -1
  const yDist = position === "right" ? 0.38 : 0.26
  const x = -Math.cos(fraction * Math.PI) * 0.37 * width + 0.07 * width
  const y = Math.sin(fraction * Math.PI + 0.17) * yDir * yDist * height
  return { x, y }
}
