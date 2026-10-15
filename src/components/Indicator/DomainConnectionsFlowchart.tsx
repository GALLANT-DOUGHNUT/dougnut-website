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
  getEdgeColor,
  redistributeMutualNodes,
} from "../../helpers/ConnectionHelpers"
import { domainData } from "../../data/DomainData"

type FlowchartProps = {
  domain: DomainData | null
  connections: IndicatorConnection[]
  openConnections: IndicatorConnection[]
  setOpenConnections: React.Dispatch<
    React.SetStateAction<IndicatorConnection[]>
  >
  setShowConnections: React.Dispatch<React.SetStateAction<boolean>>
  containerSize?: { width: string | number; height: string | number }
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
      const offsetScale = containerSize ? 0.09 : 0.15
      const angleDelta = containerSize ? 1.44 : 1.25

      const width = window.innerWidth
      const height = window.innerHeight
      const xOffset = width * offsetScale

      const isMutual = Boolean(
        mutualNodes.find(
          (mn) => mn.name === n.name && mn.quarter === n.quarter
        )
      )

      const nodeCount =
        position === "left" ? leftNodes.length : rightNodes.length

      const angle = (angleDelta * Math.PI * index) / nodeCount
      const angleOffset = nodeCount < 3 ? 0.38 : -0.4

      const xPos =
        (containerSize
          ? Math.sin(angle + angleOffset) * 110
          : Math.sin(angle + angleOffset) * width * 0.195) *
        (position === "right" ? 1 : -1)

      const yPos =
        (containerSize ? 160 : height * 0.34) *
        Math.cos(angle + angleOffset) *
        -1

      return {
        id: `${n.name}_${n.quarter}`,
        type: "indicator",
        position:
          position === "center"
            ? { x: 20, y: 20 }
            : {
                x: xPos + (position === "right" ? xOffset : -xOffset),
                y: yPos,
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

  const initialEdges = connections.reduce<DomainEdge[]>((edges, c) => {
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

        reactFlowInstance.current?.setViewport({
          x: window.innerWidth / 2 - 80,
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
  }, [containerRef, reactFlowInstance])

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

          if (containerSize) {
            const node = nodes[-1]
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
                x: window.innerWidth / 2 - 80,
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
