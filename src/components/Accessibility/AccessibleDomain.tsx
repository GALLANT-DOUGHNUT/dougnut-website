import { useState } from "react"
import type {
  DomainData,
  Indicator,
  IndicatorPoint,
  LozengeType,
} from "../../types/DonutData"
import Box from "@mui/material/Box"
import { Typography } from "@mui/material"
import { findArcValue } from "../../helpers/DonutHelpers"

type AccessibleDomainProps = {
  domain: DomainData
  year: number
}

export const AccessibleDomain = ({
  domain,
  year,
}: AccessibleDomainProps) => {
  const [expanded, setExpanded] = useState(false)
  const viewState = expanded ? "Hide" : "View"

  // Get main Indicator Measurement for the current year
  let valueText: string = ""
  let subText: string | null = null
  let lozengeText: LozengeType = "unknown"

  if (domain && domain.indicators.length > 0) {
    let indicatorCode: string | null = null
    if (domain.indicators.length > 0) {
      indicatorCode =
        domain.indicators.find((id) => id.primary)?.indicatorCode ?? null
    }

    const indicator = domain.indicators.find(
      (id) => id.indicatorCode === indicatorCode
    )
    const dataPoint: IndicatorPoint | undefined = indicator?.data.find(
      (d) => d.year === year
    )
    const arcValue = findArcValue(domain.indicators, indicatorCode, year)
    const isUnbounded =
      indicator &&
      (indicator.baseline === null || indicator.target === null)

    if (dataPoint) {
      const value = Math.round(arcValue.value)
      valueText = value === 0 || isUnbounded ? "" : `${value}%`
    }

    lozengeText = isUnbounded
      ? "unbounded"
      : arcValue.type === "unsafe"
        ? domain.quarter.includes("ecological")
          ? "overshoot"
          : "shortfall"
        : arcValue.type

    if (indicator) {
      subText = indicator.indicatorName
    }
  }

  const realm = domain.quarter.includes("social") ? "Social" : "Ecological"
  const locality = domain.quarter.includes("local") ? "Local" : "Global"

  const key = `${domain.name}-${locality}-${realm}`
  let label = `${domain.name} (${locality}/${realm})`

  const statusText =
    lozengeText === "unbounded"
      ? "Baseline / Ambition Not Known"
      : lozengeText === "overshoot"
        ? "Overshoot"
        : lozengeText === "shortfall"
          ? "Shortfall"
          : lozengeText === "safe"
            ? "In Safe Space"
            : "Not Known"

  if (valueText && statusText) {
    label += ` - ${valueText} ${statusText}`
  }

  const ThrivingDefinitionBox = (
    <Box>
      <Typography variant="h2">Thriving Glasgow Definition</Typography>
      <Typography variant="body2">{domain.description}</Typography>
      <Typography variant="h2">What could this look like?</Typography>
      <Typography variant="body2">{domain.target}</Typography>
      <Typography variant="h2">Further Information</Typography>
      <Typography variant="body2">{domain.narrative}</Typography>
    </Box>
  )

  const IndicatorDataTable = (data: IndicatorPoint[], name: string) => {
    return (
      <table aria-label="Indicator Yearly Data">
        <caption>Yearly data for {name}</caption>
        <thead>
          <tr>
            <th scope="col">Year</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((point) => (
            <tr key={point.year}>
              <th scope="row">{point.year}</th>
              <td>
                {point.value}
                {point.unit === "Percentage" ? "%" : ` ${point.unit}`}
                {point.type === "imputed" ? " (imputed)" : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  const Indicator = (indicator: Indicator) => {
    return (
      <Box aria-label={indicator.indicatorName}>
        <Typography variant="h3" aria-label={"Indicator Name"}>
          {indicator.indicatorName}
        </Typography>
        <Typography variant="body2" aria-label="Indicator Information">
          {indicator.definition} {indicator.note}{" "}
          {indicator.source ? `Source: ${indicator.source}` : ""}
        </Typography>
        <Typography variant="h3" aria-label="Indicator Data">
          Indicator Data
        </Typography>
        {indicator.data.length > 0 ? (
          IndicatorDataTable(indicator.data, indicator.indicatorName)
        ) : (
          <>No Data</>
        )}
      </Box>
    )
  }

  const IndicatorContent = (indicators: Indicator[]) => {
    return (
      <Box>
        <Typography variant="h2">Indicators</Typography>
        {indicators.length > 0 ? (
          indicators.map((i) => Indicator(i))
        ) : (
          <Typography variant="body2" aria-label="No Indicators Defined">
            No Indicators Defined
          </Typography>
        )}
      </Box>
    )
  }

  return (
    <li key={key} aria-label={label} title={label}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-label={`${viewState} ${domain.name} (${locality}/${realm})`}
      ></button>
      {expanded ? ThrivingDefinitionBox : <></>}
      {expanded ? IndicatorContent(domain.indicators) : <></>}
    </li>
  )
}
