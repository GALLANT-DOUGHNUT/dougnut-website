import type {
  DomainData,
  DomainEdge,
  DomainNode,
  IndicatorConnection,
} from "../../types/DonutData"
import { Box } from "@mui/material"
import React, { useEffect, useRef } from "react"
import { useState, useCallback, useMemo } from "react"
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type NodeChange,
  type ReactFlowInstance,
  type EdgeChange,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { ConnectionNode } from "./ConnectionNode"
import { AnimatedConnectionEdge } from "./AnimatedConnectionEdge"
import {
  generateConnectionEdges,
  getMobileNodePosition,
  getNodePosition,
  redistributeMutualNodes,
} from "../../helpers/ConnectionHelpers"
import { domainData } from "../../data/DomainData"
import { useScreenSizes } from "../../hooks/useScreenSizes"

export type CustomSize = {
  width: string | number
  height: string | number
}

type FlowchartProps = {
  domain: DomainData | null
  connections: IndicatorConnection[]
  openConnections: IndicatorConnection[]
  setOpenConnections: React.Dispatch<
    React.SetStateAction<IndicatorConnection[]>
  >
  setShowConnections: React.Dispatch<React.SetStateAction<boolean>>
  containerSize?: CustomSize
}

const createNodes = () => {
  const nodes: DomainNode[] = []

  domainData.forEach((domain) => {
    nodes.push({
      name: domain.name.replace(" and ", " & ").toLowerCase(),
      quarter: domain.quarter,
      symbol: domain.symbolId,
    })
  })

  return nodes.sort((a, b) =>
    a.quarter.split("_")[1].localeCompare(b.quarter.split("_")[1])
  )
}

const nodeTypes = { indicator: ConnectionNode }
const edgeTypes = { animated: AnimatedConnectionEdge }

export const DomainConnectionsFlowchart = ({
  domain,
  connections,
  openConnections,
  setOpenConnections,
  setShowConnections,
  containerSize,
}: FlowchartProps) => {
  const nodeData = createNodes()
  const { isXs } = useScreenSizes()

  const containerRef = useRef<HTMLDivElement>(null)
  const staticRef = useRef<HTMLDivElement>(null)
  const reactFlowInstance = useRef<ReactFlowInstance<
    Node,
    DomainEdge
  > | null>(null)

  const domainConnectionName = domain?.name
    .replace(" and ", " & ")
    .toLowerCase()

  const [activeNode, setActiveNode] = useState<string | null>(null)

  const visibleNodes = useMemo(
    () =>
      nodeData.filter((n) =>
        connections.some((c) => {
          return (
            (c.sourceName === n.name && c.sourceQuarter === n.quarter) ||
            (c.targetName === n.name && c.targetQuarter === n.quarter)
          )
        })
      ),
    [nodeData, connections]
  )

  const targetNodes = useMemo(
    () =>
      visibleNodes.filter(
        (vn) =>
          Boolean(
            connections.find(
              (c) =>
                c.targetName === vn.name && c.targetQuarter === vn.quarter
            )
          ) &&
          connections.find(
            (c) =>
              c.sourceName === vn.name && c.sourceQuarter === vn.quarter
          ) === undefined
      ),
    [visibleNodes, connections]
  )

  const sourceNodes = useMemo(
    () =>
      visibleNodes.filter(
        (vn) =>
          Boolean(
            connections.find(
              (c) =>
                c.sourceName === vn.name && c.sourceQuarter === vn.quarter
            )
          ) &&
          connections.find(
            (c) =>
              c.targetName === vn.name && c.targetQuarter === vn.quarter
          ) === undefined
      ),
    [visibleNodes, connections]
  )

  const mutualNodes = useMemo(
    () =>
      visibleNodes.filter(
        (vn) =>
          connections.find(
            (c) =>
              c.sourceName === vn.name && c.sourceQuarter === vn.quarter
          ) &&
          connections.find(
            (c) =>
              c.targetName === vn.name && c.targetQuarter === vn.quarter
          ) &&
          !(
            vn.name === domainConnectionName &&
            vn.quarter === domain!.quarter
          )
      ),
    [visibleNodes, connections, domainConnectionName, domain]
  )

  const centralNode = useMemo(
    () =>
      visibleNodes.filter(
        (mn) =>
          mn.name === domainConnectionName &&
          mn.quarter === domain!.quarter
      ),
    [visibleNodes, domain, domainConnectionName]
  )

  const { leftNodes, rightNodes } = useMemo(
    () => redistributeMutualNodes(mutualNodes, sourceNodes, targetNodes),
    [mutualNodes, sourceNodes, targetNodes]
  )

  const generateNodes = useCallback(
    (
      n: DomainNode,
      position: "left" | "right" | "center",
      index: number
    ) => {
      const width = window.innerWidth
      const height = window.innerHeight

      const nodeCount =
        position === "left" ? leftNodes.length : rightNodes.length
      const fraction = index / nodeCount

      const isMutual = Boolean(
        mutualNodes.find(
          (mn) => mn.name === n.name && mn.quarter === n.quarter
        )
      )
      const angleOffset = nodeCount < 3 ? 0.38 : -0.4
      let nodePosition = { x: 0, y: 0 }

      if (isXs) {
        nodePosition = getMobileNodePosition(
          width,
          height,
          fraction,
          position
        )
      } else {
        nodePosition = getNodePosition(
          width,
          height,
          fraction,
          containerSize,
          position,
          angleOffset
        )
      }

      return {
        id: `${n.name}_${n.quarter}`,
        type: "indicator",
        position:
          position === "center"
            ? { x: 20, y: 20 }
            : {
                x: nodePosition.x,
                y: nodePosition.y,
              },
        data: {
          label: n.name,
          symbol: n.symbol,
          quarter: n.quarter,
          openConnections,
          setOpenConnections,
          connections,
          isCenter: position === "center",
          handles:
            isMutual || position === "center"
              ? "both"
              : position === "left"
                ? "source"
                : "target",
          setActiveNode,
        },
      }
    },
    [
      mutualNodes,
      leftNodes,
      rightNodes,
      openConnections,
      setOpenConnections,
      connections,
      containerSize,
      setActiveNode,
      isXs,
    ]
  )

  const initialNodes: Node[] = [
    ...leftNodes.map((n: DomainNode, index) => {
      return generateNodes(n, "left", index)
    }),
    ...rightNodes.map((n: DomainNode, index) => {
      return generateNodes(n, "right", index)
    }),
    ...centralNode.map((n: DomainNode, index) => {
      return generateNodes(n, "center", index)
    }),
  ]
  const initialEdges = generateConnectionEdges(domain, connections)

  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState(initialEdges)

  const onNodesChange = useCallback(
    (changes: NodeChange<Node>[]) =>
      setNodes((nodesSnapshot) =>
        applyNodeChanges(changes, nodesSnapshot)
      ),
    []
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange<DomainEdge>[]) =>
      setEdges((edgesSnapshot) =>
        applyEdgeChanges(changes, edgesSnapshot)
      ),
    []
  )

  useEffect(() => {
    if (!containerRef.current) {
      return
    }
    let timeoutId: ReturnType<typeof setTimeout>

    const observer = new ResizeObserver(() => {
      clearTimeout(timeoutId)

      timeoutId = setTimeout(() => {
        setNodes([
          ...leftNodes.map((n: DomainNode, index) => {
            return generateNodes(n, "left", index)
          }),
          ...rightNodes.map((n: DomainNode, index) => {
            return generateNodes(n, "right", index)
          }),
          ...centralNode.map((n: DomainNode, index) => {
            return generateNodes(n, "center", index)
          }),
        ])

        const xSubtraction = isXs ? 65 : 80
        reactFlowInstance.current?.setViewport({
          x: window.innerWidth / 2 - xSubtraction,
          y: window.innerHeight / 2 - 80,
          zoom: 1,
        })
      }, 150)
    })

    observer.observe(containerRef.current)

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [containerRef, reactFlowInstance, isXs])

  useEffect(() => {
    localStorage.setItem("activeNode", activeNode ?? "")
  }, [activeNode])

  return (
    <Box
      sx={{
        width: containerSize ? containerSize.width : "100vw",
        height: containerSize ? containerSize.height : "100vh",
      }}
      id={`flowchart-container${containerSize ? "-mini" : ""}`}
      ref={containerSize ? staticRef : containerRef}
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
          reactFlowInstance.current = instance
          if (containerSize && nodes.length > 0) {
            const node = nodes[nodes.length - 1]
            reactFlowInstance.current.setCenter(
              node.position.x,
              node.position.y,
              { zoom: 0.7 }
            )
          }
        }}
        defaultViewport={
          containerSize
            ? { x: 220, y: 180, zoom: 0.7 }
            : {
                x: isXs
                  ? window.innerWidth / 2 - 65
                  : window.innerWidth / 2 - 80,
                y: window.innerHeight / 2 - 80,
                zoom: 1,
              }
        }
        proOptions={{ hideAttribution: true }}
        onPaneClick={() => {
          if (!containerSize) {
            if (openConnections.length > 0) {
              setOpenConnections([])
              setActiveNode(null)
            } else {
              setShowConnections(false)
            }
          }
        }}
        onEdgeClick={() => {
          if (!containerSize) {
            if (openConnections.length > 0) {
              setOpenConnections([])
              setActiveNode(null)
            }
          }
        }}
      />
    </Box>
  )
}
