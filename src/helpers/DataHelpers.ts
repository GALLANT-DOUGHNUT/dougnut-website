import Papa from "papaparse"
import type {
  DomainData,
  Indicator,
  IndicatorConnection,
} from "../types/DonutData"
import connectionsCsv from "../data/Glasgow_Interconnections.csv?raw"
import dataCsv from "../data/GALLANT_Indicators_All.csv?raw"
import dictionaryCsv from "../data/Indicators_Dictionary v3.0.csv?raw"
import { domainData } from "../data/DomainData"
import type {
  DictionaryCsv,
  IndicatorCsv,
  OutputCsv,
} from "../types/CsvData"

export const readCSVConnection = (csvRow: string[]) => {
  const sourceDomainParts = csvRow[0].split(" ")
  const targetDomainParts = csvRow[1].split(" ")

  const newConnection: IndicatorConnection = {
    sourceName: sourceDomainParts
      .slice(1)
      .join(" ")
      .replaceAll(" and ", " & ")
      .replaceAll("\r\n", "")
      .toLowerCase(),
    sourceQuarter: `${sourceDomainParts[0][0] === "L" ? "local" : "global"}_${sourceDomainParts[0][1] === "E" ? "ecological" : "social"}`,

    targetName: targetDomainParts
      .slice(1)
      .join(" ")
      .replaceAll(" and ", " & ")
      .replaceAll("\r\n", "")
      .toLowerCase(),
    targetQuarter: `${targetDomainParts[0][0] === "L" ? "local" : "global"}_${targetDomainParts[0][1] === "E" ? "ecological" : "social"}`,
    description: csvRow[3], // Proposed Website Text column
  }

  return newConnection
}

export const readIndicatorData = (csvRow: string[]): IndicatorCsv => {
  return {
    domainCode: csvRow[0],
    indicatorCode: csvRow[1],
    year: parseInt(csvRow[2]),
    value: parseFloat(csvRow[3]),
    unit: csvRow[4],
    localAuthority: csvRow[5],
    type: csvRow[6].toLowerCase() === "real" ? "real" : "imputed",
  }
}

export const readDictionaryData = (csvRow: string[]): DictionaryCsv => {
  return {
    domainName: csvRow[0],
    domainCode: csvRow[1],
    indicatorName: csvRow[2],
    indicatorCode: csvRow[3],
    importance:
      csvRow[5].toLowerCase() === "primary" ? "primary" : "secondary",
    baseline: isNaN(parseFloat(csvRow[6])) ? 100 : parseFloat(csvRow[6]),
    target: isNaN(parseFloat(csvRow[7])) ? 0 : parseFloat(csvRow[7]),
    indicatorDefinition: csvRow[8],
    indicatorSource: csvRow[9],
    indicatorNote: csvRow[10],
    localOrGlobal:
      csvRow[11].toLowerCase() === "local" ? "local" : "global",
    socialOrEcological:
      csvRow[12].toLowerCase() === "social" ? "social" : "ecological",
    domainNarrative: csvRow[13],
    indicatorNarrative: csvRow[14],
  }
}

export const importCsvData = () => {
  const csvConnections = Papa.parse(connectionsCsv)
  const parsedConnections: IndicatorConnection[] = []

  const csvIndicators = Papa.parse(dataCsv)
  const indicatorCsvData: IndicatorCsv[] = []

  const dictionaryCsvData = Papa.parse(dictionaryCsv)
  const dictionaryData: DictionaryCsv[] = []

  // Read Connections CSV Data
  if (csvConnections && csvConnections.data) {
    csvConnections.data.forEach((connection, index) => {
      if (index > 0) {
        parsedConnections.push(readCSVConnection(connection as string[]))
      }
    })
  }

  const connectionsData = parsedConnections.filter(
    (pc) => pc.description !== ""
  )

  // Read Dictionary CSV Data
  if (dictionaryCsvData && dictionaryCsvData.data) {
    dictionaryCsvData.data.forEach((data, index) => {
      if (index > 0) {
        dictionaryData.push(readDictionaryData(data as string[]))
      }
    })
  }

  // Read Indicator CSV Data
  if (csvIndicators && csvIndicators.data) {
    csvIndicators.data.forEach((id, index) => {
      if (index > 0) {
        indicatorCsvData.push(readIndicatorData(id as string[]))
      }
    })
  }

  // NEW - Form the Indicator Data object
  const indicatorCodes = [
    ...new Set(indicatorCsvData.map((icsv) => icsv.indicatorCode)),
  ]
  const indicatorData: Indicator[] = []

  // Create a new Indicator for each unique Indicator Code
  indicatorCodes.forEach((ic) => {
    const indicator: Indicator = {
      indicatorCode: ic,
      domainCode: indicatorCsvData.find((i) => i.indicatorCode === ic)!
        .domainCode,
      data: (
        indicatorCsvData.filter((i) => i.indicatorCode === ic) ?? []
      ).map((icsv: IndicatorCsv) => {
        return {
          year: icsv.year,
          value: icsv.value,
          type: icsv.type,
          unit: icsv.unit,
          localAuthority: icsv.localAuthority,
        }
      }),

      // Populated with Dictionary Data later
      domainName: "",
      domainNarrative: "",
      indicatorName: "",
      indicatorNarrative: "",
      definition: "",
      source: "",
      note: "",
      localOrGlobal: "global",
      socialOrEcological: "ecological",
      primary: false,
      baseline: 100,
      target: 0,
    }

    indicatorData.push(indicator)
  })

  // Apply the dictionary data to each indicator
  indicatorData.forEach((indicator) => {
    const dictionary = dictionaryData.find(
      (dd) => dd.indicatorCode === indicator.indicatorCode
    )
    if (dictionary) {
      indicator.domainName = dictionary.domainName
      indicator.domainNarrative = dictionary.domainNarrative
      indicator.indicatorName = dictionary.indicatorName
      indicator.indicatorNarrative = dictionary.indicatorNarrative
      indicator.baseline = dictionary.baseline
      indicator.target = dictionary.target
      indicator.definition = dictionary.indicatorDefinition
      indicator.source = dictionary.indicatorSource
      indicator.note = dictionary.indicatorNote
      indicator.localOrGlobal = dictionary.localOrGlobal
      indicator.socialOrEcological = dictionary.socialOrEcological
      indicator.primary =
        dictionary.importance === "primary" ? true : false
    }
  })

  // Append the CSV Indicator Data into the Domain Data
  const donutData: DomainData[] = domainData.map((domain) => {
    const indicators = indicatorData.filter(
      (id) =>
        id.domainName.toLowerCase() === domain.name.toLowerCase() &&
        domain.quarter === `${id.localOrGlobal}_${id.socialOrEcological}`
    )

    return {
      ...domain,
      indicators,
      code: indicators.length > 0 ? indicators[0].domainCode : "",
      narrative:
        indicators.length > 0
          ? indicators.find((i) => i.domainNarrative !== "")
              ?.domainNarrative
          : undefined,
    }
  })

  return { connectionsData, donutData }
}

export const createOutputCsvURL = (donutData: DomainData[]) => {
  const outputCsv: OutputCsv[] = []

  donutData.forEach((data) => {
    data.indicators.forEach((ind) => {
      const flattenedItems: OutputCsv[] = ind.data.map((yr) => {
        return {
          LOCAL_OR_GLOBAL:
            ind.localOrGlobal === "local" ? "local" : "global",
          SOCIAL_OR_ECOLOGICAL:
            ind.socialOrEcological === "social" ? "social" : "ecological",
          DOMAIN: ind.domainName,
          INDICATOR_CODE: ind.indicatorCode,
          INDICATOR: ind.indicatorName,
          YEAR: yr.year,
          VALUE: yr.value,
          UNIT: yr.unit,
          TYPE: yr.type,
          BASELINE: ind.baseline,
          AMBITION: ind.target,
          INDICATOR_NARRATIVE: ind.indicatorNarrative,
          SOURCE: ind.source,
        }
      })

      outputCsv.push(...flattenedItems)
    })
  })

  const csv = Papa.unparse(
    outputCsv.sort((a, b) => {
      const socialEcologicalComparison =
        a.SOCIAL_OR_ECOLOGICAL.localeCompare(b.SOCIAL_OR_ECOLOGICAL)
      if (socialEcologicalComparison !== 0) {
        return socialEcologicalComparison
      }

      return a.DOMAIN.localeCompare(b.DOMAIN)
    }),
    { header: true }
  )
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  return url
}
