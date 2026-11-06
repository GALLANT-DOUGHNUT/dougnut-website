import type {
  DomainData,
  IndicatorConnection,
} from "../../types/DonutData"

type ConnectionsProps = {
  domain: DomainData
  allConnections: IndicatorConnection[]
}

const renderConnectionName = (name: string, quarter: string) => {
  const nameCapitalised = name[0].toUpperCase() + name.substring(1)
  return (
    nameCapitalised +
    ` (${quarter.includes("local") ? "Local" : "Global"})`
  )
}

export const AccessibleConnections = ({
  domain,
  allConnections,
}: ConnectionsProps) => {
  const connectionName = domain.name.replace(" and ", " & ").toLowerCase()

  const incomingConnections = allConnections.filter(
    (c) =>
      c.targetName === connectionName && c.targetQuarter === domain.quarter
  )

  const outgoingConnections = allConnections.filter(
    (c) =>
      c.sourceName === connectionName && c.sourceQuarter === domain.quarter
  )

  const connections = [...incomingConnections, ...outgoingConnections]

  return (
    <ul
      aria-label={`Connections for ${domain.name} (${connections.length})`}
    >
      {connections.map((c, index) => {
        const title =
          renderConnectionName(c.sourceName, c.sourceQuarter) +
          " to " +
          renderConnectionName(c.targetName, c.targetQuarter)

        return (
          <li key={`Connection ${index}`}>
            <h3>{title}</h3>
            {c.description}
          </li>
        )
      })}
    </ul>
  )
}
