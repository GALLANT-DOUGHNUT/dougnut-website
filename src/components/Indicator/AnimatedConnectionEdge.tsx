import { BaseEdge, getBezierPath, type EdgeProps } from "@xyflow/react";

export const AnimatedConnectionEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ strokeWidth: 3, strokeDasharray: "9 4", stroke: "#666677" }}
      />
      {/* <circle r="7" fill="#ff0073"> */}
      <path
        d="M0,-5 L12,0 L0,5 L3,0 Z"
        fill={data!["color"] as string}
        transform="scale(1.4)"
      >
        <animateMotion
          dur="4s"
          repeatCount="indefinite"
          path={edgePath}
          rotate={"auto"}
        />
      </path>
      {/* </circle> */}
    </>
  );
};
