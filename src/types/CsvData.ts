export type IndicatorCsv = {
  domainCode: string
  indicatorCode: string
  year: number
  value: number
  unit: string
  localAuthority: string
  type: "real" | "imputed"
}

export type DictionaryCsv = {
  domainName: string
  domainCode: string
  domainNarrative: string
  indicatorName: string
  indicatorCode: string
  indicatorNarrative: string
  importance: "primary" | "secondary"
  baseline: number
  target: number
  indicatorDefinition: string
  indicatorSource: string
  indicatorNote: string
  localOrGlobal: "local" | "global"
  socialOrEcological: "social" | "ecological"
}
