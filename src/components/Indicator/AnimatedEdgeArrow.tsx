import { useScreenSizes } from "../../hooks/useScreenSizes"

type ArrowProps = {
  path: string
  color: string
  reverse?: boolean
}

export const AnimatedEdgeArrow = ({
  path,
  color,
  reverse = false,
}: ArrowProps) => {
  const { isXs } = useScreenSizes()
  const scale = isXs ? 1 : 1.4
  return (
    <path
      d="M0,-5 L12,0 L0,5 L3,0 Z"
      fill={color}
      transform={`scale(${scale})`}
    >
      <animateMotion
        dur="4s"
        repeatCount="indefinite"
        path={path}
        rotate={reverse ? "auto-reverse" : "auto"}
        keyPoints={reverse ? "1;0" : "0;1"}
        keyTimes="0;1"
        calcMode="linear"
      />
    </path>
  )
}
