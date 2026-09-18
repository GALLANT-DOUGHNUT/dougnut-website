export type DomainData = {
  name: string
  code: string
  quarter:
    | "global_ecological"
    | "local_ecological"
    | "global_social"
    | "local_social"
  description: string
  target: string
  quotes: string
  symbolId: string
  videoHash: string
  indicators: Indicator[]
  narrative?: string
}

export type Indicator = {
  domainCode: string
  indicatorCode: string
  indicatorName: string
  domainName: string
  indicatorNarrative: string
  domainNarrative: string
  data: IndicatorPoint[]
  primary: boolean
  baseline: number // Baseline/worst case scenario that will be agreed with GCC
  target: number // Target that will be agreed with GCC
}

export type IndicatorPoint = {
  year: number
  value: number
  unit: string
  type: "real" | "imputed"
  localAuthority: string
}

export type IndicatorConnection = {
  sourceName: string // Source - Name of indicator that is causing the effect
  sourceQuarter: string
  targetName: string // Target - Name of indicator that is being affected
  targetQuarter: string
  description: string
}

export type DomainNode = {
  name: string
  quarter: string
  symbol: string
  description?: string
}

export type DomainEdge = {
  id: string
  source: string
  target: string
  type: string
  animated?: boolean
  data: { color: string }
}

export type DonutContext = {
  data: DomainData[]
  allConnections: IndicatorConnection[]
  domain: DomainData
  year: number
  unrolled: boolean
  showConnections: boolean
  showAbout: boolean
  setDomain: React.Dispatch<React.SetStateAction<DomainData | null>>
  setShowConnections: React.Dispatch<React.SetStateAction<boolean>>
  setShowAbout: React.Dispatch<React.SetStateAction<boolean>>
}

export type LozengeType = "overshoot" | "shortfall" | "safe" | "unknown"
