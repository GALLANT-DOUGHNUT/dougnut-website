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

export type OutputCsv = {
  YEAR: number
  VALUE: number
  UNIT: string
  TYPE: "real" | "imputed"
  INDICATOR: string
  INDICATOR_CODE: string
  DOMAIN: string
  INDICATOR_NARRATIVE: string
  SOURCE: string
  BASELINE: number
  AMBITION: number
  LOCAL_OR_GLOBAL: "local" | "global"
  SOCIAL_OR_ECOLOGICAL: "social" | "ecological"
}
