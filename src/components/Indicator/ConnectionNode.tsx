import Box from "@mui/material/Box"
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react"
import { ImageCircle } from "../InterfaceComponents/ImageCircle"
import { findIconSrc } from "../../helpers/DonutHelpers"
import type { IndicatorConnection } from "../../types/DonutData"
import { useScreenSizes } from "../../hooks/useScreenSizes"
import { useMemo } from "react"
import theme from "../../theme"

export type ConnectionNodeProps = Node<{
  label: string
  symbol: string
  quarter: string
  connections: IndicatorConnection[]
  openConnections: IndicatorConnection[]
  setOpenConnections: React.Dispatch<
    React.SetStateAction<IndicatorConnection[]>
  >
  handles: "both" | "source" | "target"
  isCenter: boolean
  setActiveNode: React.Dispatch<React.SetStateAction<string | null>>
}>

export const ConnectionNode = ({
  data,
}: NodeProps<ConnectionNodeProps>) => {
  const {
    label,
    quarter,
    handles,
    connections,
    openConnections,
    setOpenConnections,
    isCenter,
    setActiveNode,
  } = data
  const { isXL, isSm, isLg } = useScreenSizes()
  const nodeText = label.split("_").join(" ")
  const locality = data.quarter.split("_")[0]
  const localityPadding = isLg
    ? "                                   "
    : "                        "

  const color = isCenter
    ? theme.palette.common.panelMain
    : quarter.includes("ecological")
      ? theme.palette.common.ecological
      : theme.palette.common.social

  const fontSize = useMemo(() => {
    return isXL ? "1.1rem" : isSm ? "0.7rem" : "0.88rem"
  }, [isXL, isSm])

  const setConnections = (connectionName: string, quarter: string) => {
    const linkedConnections = connections.filter(
      (item) =>
        (item.sourceName === connectionName &&
          item.sourceQuarter === quarter) ||
        (item.targetName === connectionName &&
          item.targetQuarter === quarter)
    )

    if (linkedConnections.length > 0) {
      setOpenConnections(linkedConnections)
      setActiveNode(label + quarter)
    } else {
      console.log("No child data found for:", connectionName)
    }
  }

  const isHighlighted =
    localStorage.getItem("activeNode") === label + quarter

  return (
    <Box>
      {handles === "both" || handles === "source" ? (
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={true}
          style={{ opacity: 0 }}
        />
      ) : (
        <></>
      )}
      <ImageCircle
        id={`connection-node-${data.label}-${data.quarter}`}
        fontSize={fontSize}
        text={nodeText[0].toUpperCase() + nodeText.substring(1)}
        imageSrc={findIconSrc(data.symbol)}
        absolutePositioning={false}
        onClick={() => {
          if (openConnections.length > 0) {
            setOpenConnections([])
            setActiveNode(null)
          } else {
            setConnections(data.label, data.quarter)
          }
        }}
        sx={{
          width: { sm: "102px", md: "102px", lg: "120px", xl: "150px" },
          height: { sm: "102px", md: "102px", lg: "120px", xl: "150px" },
          "&:hover": { filter: "brightness(1.5)" },
          bgcolor: color,
          zIndex: 15,
          filter: isHighlighted ? "brightness(1.5)" : "none",
        }}
        circularText={{
          text:
            locality[0].toUpperCase() +
            locality.slice(1) +
            localityPadding,
          color: "#efeff383",
          startAngle: 270,
        }}
        isHighlighted={isHighlighted}
      />
      {handles === "both" || handles === "target" ? (
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={true}
          style={{ opacity: 0 }}
        />
      ) : (
        <></>
      )}
    </Box>
  )
}
