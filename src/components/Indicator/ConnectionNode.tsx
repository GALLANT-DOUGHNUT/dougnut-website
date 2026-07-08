import Box from "@mui/material/Box";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { ImageCircle } from "../InterfaceComponents/ImageCircle";
import { findIconSrc } from "../../helpers/DonutHelpers";
import type { IndicatorConnection } from "../../types/DonutData";

export type ConnectionNodeProps = Node<{
  label: string;
  symbol: string;
  quarter: string;
  connections: IndicatorConnection[];
  openDescription: string;
  setOpenDescription: React.Dispatch<React.SetStateAction<string | null>>;
  handles: "both" | "source" | "target";
}>;

export const ConnectionNode = ({ data }: NodeProps<ConnectionNodeProps>) => {
  const nodeText = data.label.split("_").join(" ");
  const color = data.quarter.includes("ecological") ? "#3AADC6" : "#8FC53A";
  const { handles, connections, openDescription, setOpenDescription } = data;

  const setConnectionDescription = (connectionName: string) => {
    const childItem = connections.find(
      (item) =>
        item.sourceName === connectionName ||
        item.targetName === connectionName,
    );
    if (childItem) {
      setOpenDescription(childItem.description);
    } else {
      console.log("No child data found for:", connectionName);
    }
  };

  return (
    <Box>
      {handles === "both" || handles === "source" ? (
        <Handle
          type="source"
          position={Position.Right}
          onConnect={(params) => console.log("handle onConnect", params)}
          isConnectable={true}
        />
      ) : (
        <></>
      )}
      <ImageCircle
        id={`flowchart-node-${data.label}`}
        fontSize={"1rem"}
        onClick={() => {
          if (openDescription) {
            setOpenDescription(null);
          } else {
            setConnectionDescription(data.label);
          }
        }}
        text={nodeText[0].toUpperCase() + nodeText.substring(1)}
        imageSrc={findIconSrc(data.symbol)}
        sx={{
          width: { sm: "100px", md: "130px", lg: "140px", xl: "150px" },
          height: { sm: "100px", md: "130px", lg: "140px", xl: "150px" },
          bgcolor: color,
          "&:hover": { filter: "brightness(1.5)" },
          zIndex: 15,
        }}
        absolutePositioning={false}
      />
      {handles === "both" || handles === "target" ? (
        <Handle
          type="target"
          position={Position.Left}
          onConnect={(params) => console.log("handle onConnect", params)}
          isConnectable={true}
        />
      ) : (
        <></>
      )}
    </Box>
  );
};
