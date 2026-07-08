import type {
  DonutData,
  IndicatorConnection,
  IndicatorDataDict,
} from "../../types/DonutData";
import { Box } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type NodeChange,
  type ReactFlowInstance,
  type EdgeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ConnectionNode } from "./ConnectionNode";
import { AnimatedConnectionEdge } from "./AnimatedConnectionEdge";

type ConnectionsFlowchartProps = {
  data: DonutData;
  indicator: IndicatorDataDict | null;
  connections: IndicatorConnection[];
  openDescription: string | null;
  setOpenDescription: React.Dispatch<React.SetStateAction<string | null>>;
};

type DomainNode = {
  name: string;
  quarter: string;
  symbol: string;
  description?: string;
};

type DomainEdge = {
  id: string;
  source: string;
  target: string;
  type: string;
  animated?: boolean;
  data: { color: string };
};

const createNodes = (dataDict: IndicatorDataDict) => {
  const nodes: DomainNode[] = [];

  for (const [key, value] of Object.entries(dataDict)) {
    nodes.push({
      name: key,
      quarter: value.quarter,
      symbol: value.symbol_id,
    });
  }

  return nodes;
};

const getEdgeColor = (
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

const nodeTypes = { indicator: ConnectionNode };
const edgeTypes = { animated: AnimatedConnectionEdge };

export const IndicatorConnectionsFlowchart = ({
  indicator,
  data,
  connections,
  openDescription,
  setOpenDescription,
}: ConnectionsFlowchartProps) => {
  const indicatorName = Object.keys(indicator!)[0].toLowerCase();
  const indicatorQuarter = Object.values(indicator!)[0].quarter;

  const nodeData = [];
  nodeData.push(...createNodes(data.ecological.global));
  nodeData.push(...createNodes(data.ecological.local));
  nodeData.push(...createNodes(data.social.global));
  nodeData.push(...createNodes(data.social.local));

  const reactFlowInstance = useRef<ReactFlowInstance<Node, DomainEdge> | null>(
    null,
  );

  const visibleNodes = nodeData.filter((n) =>
    connections.some((c) => {
      return (
        (c.sourceName === n.name && c.sourceQuarter === n.quarter) ||
        (c.targetName === n.name && `${c.quarter}_${c.half}` === n.quarter)
      );
    }),
  );

  const forwardNodes = visibleNodes.filter((vn) =>
    connections.find((c) => c.targetName == vn.name),
  );
  const reverseNodes = visibleNodes.filter((vn) =>
    connections.find((c) => c.sourceName == vn.name),
  );

  const generateNodes = (n: DomainNode, isForward: boolean, index: number) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const xOffset = width * 0.15;

    const isCenterNode =
      n.name === indicatorName && n.quarter === indicatorQuarter;

    const angle =
      (1.25 * Math.PI * index) / // Use just over half a semicircle for drawing the arc
      (isForward ? forwardNodes.length : reverseNodes.length);

    const xCalc = Math.sin(angle - 0.4) * width * 0.195 * (isForward ? 1 : -1);
    const yCalc = Math.cos(angle - 0.4) * height * 0.34 * -1;

    return {
      id: `${n.name}_${n.quarter}`,
      position: isCenterNode
        ? { x: 0, y: 0 }
        : {
            x: xCalc + (isForward ? xOffset : -xOffset),
            y: yCalc,
          },
      data: {
        label: n.name,
        symbol: n.symbol,
        quarter: n.quarter,
        handles: isCenterNode ? "both" : isForward ? "target" : "source",
        openDescription,
        setOpenDescription,
        connections,
      },
      type: "indicator",
    };
  };

  const initialNodes: Node[] = [
    ...reverseNodes.map((n: DomainNode, index) => {
      return generateNodes(n, false, index);
    }),
    ...forwardNodes.map((n: DomainNode, index) => {
      return generateNodes(n, true, index);
    }),
  ];

  const initialEdges = connections.map((c: IndicatorConnection) => {
    const source = `${c.sourceName}_${c.sourceQuarter}`;
    const target = `${c.targetName}_${c.quarter}_${c.half}`;
    return {
      id: `${source}-${target}`,
      source: source,
      target: target,
      type: "animated",
      data: { color: getEdgeColor(source, target, indicator!) },
    };
  });

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange<Node>[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<DomainEdge>[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );

  useEffect(() => {
    // Used to recompute the node positions
    const handleResize = () => {
      setNodes([
        ...reverseNodes.map((n: DomainNode, index) => {
          return generateNodes(n, false, index);
        }),
        ...forwardNodes.map((n: DomainNode, index) => {
          return generateNodes(n, true, index);
        }),
      ]);

      // Used to re-centre the flowchart
      setTimeout(() => {
        if (reactFlowInstance.current) {
          reactFlowInstance.current.setCenter(80, 80, {
            zoom: 1,
          });
        }
      }, 0);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Box
      sx={{ width: "100vw", height: "100vh", border: "2px solid red" }}
      id="flowchart-container"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        autoFocus={true}
        onInit={(instance) => {
          instance.setCenter(80, 80, { zoom: 1 });
          reactFlowInstance.current = instance;
        }}
        proOptions={{ hideAttribution: true }}
      />
    </Box>
  );
};
