import Box from "@mui/material/Box";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { ImageCircle } from "../InterfaceComponents/ImageCircle";
import { findIconSrc } from "../../helpers/DonutHelpers";
import type { IndicatorConnection } from "../../types/DonutData";
import { useScreenSizes } from "../../hooks/useScreenSizes";
import { useMemo } from "react";

export type ConnectionNodeProps = Node<{
  label: string;
  symbol: string;
  quarter: string;
  connections: IndicatorConnection[];
  openConnections: IndicatorConnection[];
  setOpenConnections: React.Dispatch<
    React.SetStateAction<IndicatorConnection[]>
  >;
  handles: "both" | "source" | "target";
  isCenter: boolean;
}>;

export const ConnectionNode = ({ data }: NodeProps<ConnectionNodeProps>) => {
  const {
    label,
    quarter,
    handles,
    connections,
    openConnections,
    setOpenConnections,
    isCenter,
  } = data;
  const { isXL } = useScreenSizes();
  const nodeText = label.split("_").join(" ");

  const color = isCenter
    ? "#D0EBF1"
    : quarter.includes("ecological")
      ? "#3AADC6"
      : "#8FC53A";

  const fontSize = useMemo(() => {
    return isXL ? "1.1rem" : "0.88rem";
  }, [isXL]);

  const setConnections = (connectionName: string, quarter: string) => {
    const linkedConnections = connections.filter(
      (item) =>
        (item.sourceName === connectionName &&
          item.sourceQuarter === quarter) ||
        (item.targetName === connectionName && item.targetQuarter === quarter),
    );

    if (linkedConnections.length > 0) {
      setOpenConnections(linkedConnections);
    } else {
      console.log("No child data found for:", connectionName);
    }
  };

  return (
    <Box>
      {handles === "both" || handles === "source" ? (
        <Handle type="source" position={Position.Right} isConnectable={true} />
      ) : (
        <></>
      )}
      <ImageCircle
        id={`flowchart-node-${data.label}-${data.quarter}`}
        fontSize={fontSize}
        text={nodeText[0].toUpperCase() + nodeText.substring(1)}
        imageSrc={findIconSrc(data.symbol)}
        absolutePositioning={false}
        onClick={() => {
          if (openConnections.length > 0) {
            setOpenConnections([]);
          } else {
            setConnections(data.label, data.quarter);
          }
        }}
        sx={{
          width: { sm: "80px", md: "95px", lg: "120px", xl: "150px" },
          height: { sm: "80px", md: "95px", lg: "120px", xl: "150px" },
          "&:hover": { filter: "brightness(1.5)" },
          bgcolor: color,
          zIndex: 15,
        }}
      />
      {handles === "both" || handles === "target" ? (
        <Handle type="target" position={Position.Left} isConnectable={true} />
      ) : (
        <></>
      )}
    </Box>
  );
};
