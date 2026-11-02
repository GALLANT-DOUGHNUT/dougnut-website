import {
  BaseEdge,
  getBezierPath,
  useInternalNode,
  type EdgeProps,
} from "@xyflow/react"
import { getEdgeParams } from "../../helpers/ConnectionHelpers"
import { AnimatedEdgeArrow } from "./AnimatedEdgeArrow"

export const AnimatedConnectionEdge = ({
  id,
  source,
  target,
  data,
}: EdgeProps) => {
  const sourceNode = useInternalNode(source)
  const targetNode = useInternalNode(target)

  if (!sourceNode || !targetNode) {
    return null
  }

  const { sourceX, sourceY, targetX, targetY } = getEdgeParams(
    sourceNode,
    targetNode
  )

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  })

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          strokeWidth: 2.6,
          strokeDasharray: "9 4",
          stroke: "#666677bf",
        }}
      />
      <AnimatedEdgeArrow
        path={edgePath}
        color={data!["color"] as string}
      />
      {data!.mutual && (
        // Draw reverse (mutual) connection
        <AnimatedEdgeArrow
          path={edgePath}
          color={data!["color"] as string}
          reverse={true}
        />
      )}
    </>
  )
}
