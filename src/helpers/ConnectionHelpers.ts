import theme from "../theme"
import type { DomainData, DomainNode } from "../types/DonutData"

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

import { Position, type InternalNode } from "@xyflow/react"

const getNodeIntersection = (
  intersectionNode: InternalNode,
  targetNode: InternalNode
) => {
  const { width, height } = intersectionNode.measured

  const intersectionNodePosition =
    intersectionNode.internals.positionAbsolute

  const targetPosition = targetNode.internals.positionAbsolute

  const w = width! / 2
  const h = height! / 2

  const x2 = intersectionNodePosition.x + w
  const y2 = intersectionNodePosition.y + h

  const x1 = targetPosition.x + targetNode.measured.width! / 2
  const y1 = targetPosition.y + targetNode.measured.height! / 2

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h)

  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h)

  const a = 1 / (Math.abs(xx1) + Math.abs(yy1))

  const xx3 = a * xx1
  const yy3 = a * yy1

  return {
    x: w * (xx3 + yy3) + x2,
    y: h * (-xx3 + yy3) + y2,
  }
}

const getEdgePosition = (
  node: InternalNode,
  intersectionPoint: { x: number; y: number }
) => {
  const n = {
    ...node.internals.positionAbsolute,
    ...node,
  }

  const nx = Math.round(n.x)
  const ny = Math.round(n.y)

  const px = Math.round(intersectionPoint.x)
  const py = Math.round(intersectionPoint.y)

  if (px <= nx + 1) {
    return Position.Left
  }

  if (px >= nx + node.measured.width! - 1) {
    return Position.Right
  }

  if (py <= ny + 1) {
    return Position.Top
  }

  if (py >= ny + node.measured.height! - 1) {
    return Position.Bottom
  }

  return Position.Top
}

// export const getEdgeParams = (
//   source: InternalNode,
//   target: InternalNode
// ) => {
//   const sourceIntersection = getNodeIntersection(source, target)
//   const targetIntersection = getNodeIntersection(target, source)

//   return {
//     sourceX: sourceIntersection.x,
//     sourceY: sourceIntersection.y,
//     targetX: targetIntersection.x,
//     targetY: targetIntersection.y,
//     sourcePosition: getEdgePosition(source, sourceIntersection),
//     targetPosition: getEdgePosition(target, targetIntersection),
//   }
// }

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
