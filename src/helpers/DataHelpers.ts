import Papa from "papaparse";
import type {
  DomainData,
  Indicator,
  IndicatorConnection,
} from "../types/DonutData";
import connectionsCsv from "../data/Glasgow_Interconnections.csv?raw";
import dataCsv from "../data/GALLANT_Indicators_All.csv?raw";
import dictionaryCsv from "../data/Indicators_Dictionary v2.0.csv?raw";
import { domainData } from "../data/DomainData";
import type { DictionaryCsv, IndicatorCsv } from "../types/CsvData";

export const readCSVConnection = (csvRow: string[]) => {
  const sourceDomainParts = csvRow[0].split(" ");
  const targetDomainParts = csvRow[1].split(" ");

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
  };

  return newConnection;
};

export const readIndicatorData = (csvRow: string[]): IndicatorCsv => {
  return {
    domainCode: csvRow[0],
    indicatorCode: csvRow[1],
    year: parseInt(csvRow[2]),
    value: parseFloat(csvRow[3]),
    unit: csvRow[4],
    localAuthority: csvRow[5],
    type: csvRow[6].toLowerCase() === "real" ? "real" : "imputed",
  };
};

export const readDictionaryData = (csvRow: string[]): DictionaryCsv => {
  return {
    domainName: csvRow[0],
    domainCode: csvRow[1],
    indicatorName: csvRow[2],
    indicatorCode: csvRow[3],
    importance: csvRow[4] === "primary" ? "primary" : "secondary",
    baseline: isNaN(parseFloat(csvRow[5])) ? 100 : parseFloat(csvRow[5]),
    target: isNaN(parseFloat(csvRow[6])) ? 0 : parseFloat(csvRow[6]),
    domainNarrative: csvRow[7],
    indicatorNarrative: csvRow[8],
  };
};

export const importCsvData = () => {
  const csvConnections = Papa.parse(connectionsCsv);
  const parsedConnections: IndicatorConnection[] = [];

  const csvIndicators = Papa.parse(dataCsv);
  const indicatorCsvData: IndicatorCsv[] = [];

  const dictionaryCsvData = Papa.parse(dictionaryCsv);
  const dictionaryData: DictionaryCsv[] = [];

  // Read Connections CSV Data
  if (csvConnections && csvConnections.data) {
    csvConnections.data.forEach((connection, index) => {
      if (index > 0) {
        parsedConnections.push(readCSVConnection(connection as string[]));
      }
    });
  }

  const connectionsData = parsedConnections.filter(
    (pc) => pc.description !== "",
  );

  // Read Dictionary CSV Data
  if (dictionaryCsvData && dictionaryCsvData.data) {
    dictionaryCsvData.data.forEach((data, index) => {
      if (index > 0) {
        dictionaryData.push(readDictionaryData(data as string[]));
      }
    });
  }

  // Read Indicator CSV Data
  if (csvIndicators && csvIndicators.data) {
    csvIndicators.data.forEach((id, index) => {
      if (index > 0) {
        indicatorCsvData.push(readIndicatorData(id as string[]));
      }
    });
  }

  // NEW - Form the Indicator Data object
  const indicatorCodes = [
    ...new Set(indicatorCsvData.map((icsv) => icsv.indicatorCode)),
  ];
  const indicatorData: Indicator[] = [];

  // Create a new Indicator for each unique Indicator Code
  indicatorCodes.forEach((ic) => {
    const indicator: Indicator = {
      indicatorCode: ic,
      domainCode: indicatorCsvData.find((i) => i.indicatorCode === ic)!
        .domainCode,
      data: (indicatorCsvData.filter((i) => i.indicatorCode === ic) ?? []).map(
        (icsv: IndicatorCsv) => {
          return {
            year: icsv.year,
            value: icsv.value,
            type: icsv.type,
            unit: icsv.unit,
            localAuthority: icsv.localAuthority,
          };
        },
      ),

      // Populated with Dictionary Data later
      domainName: "",
      domainNarrative: "",
      indicatorName: "",
      indicatorNarrative: "",
      primary: false,
      baseline: 100,
      target: 0,
    };

    indicatorData.push(indicator);
  });

  // Apply the dictionary data to each indicator
  indicatorData.forEach((indicator) => {
    const dictionary = dictionaryData.find(
      (dd) => dd.indicatorCode === indicator.indicatorCode,
    );
    if (dictionary) {
      indicator.domainName = dictionary.domainName;
      indicator.domainNarrative = dictionary.domainNarrative;
      indicator.indicatorName = dictionary.indicatorName;
      indicator.indicatorNarrative = dictionary.indicatorNarrative;
      indicator.baseline = dictionary.baseline;
      indicator.target = dictionary.target;
    }
  });

  // Append the CSV Indicator Data into the Domain Data
  const donutData: DomainData[] = domainData.map((domain) => {
    const indicators = indicatorData.filter(
      (id) => id.domainCode === domain.code,
    );

    return {
      ...domain,
      indicators,

      // TODO: Confirm this, each Indicator Row has a domain narrative, in theory should be same for all within a domain,
      // so for now just pick one from the set of indicators
      narrative:
        indicators.length > 0
          ? indicators.find((i) => i.domainNarrative !== "")?.domainNarrative
          : undefined,
    };
  });

  // TODO - Remove this once we have data on primary / secondary indicators, for now
  // just choose the indicator that has the most data
  donutData.forEach((dd) => {
    if (dd.indicators && dd.indicators.length > 0) {
      let maxCount: number = 0;
      let mostCommonIndicatorCode: string | null = null;

      for (const indicator of dd.indicators.sort((a, b) =>
        a.indicatorCode.localeCompare(b.indicatorCode),
      )) {
        const count = indicator.data.length;

        if (count > maxCount) {
          maxCount = count;
          mostCommonIndicatorCode = indicator.indicatorCode;
        }
      }

      if (mostCommonIndicatorCode) {
        dd.indicators.forEach((i) => {
          if (i.indicatorCode === mostCommonIndicatorCode) {
            i.primary = true;
          }
        });
      }
    }
  });

  return { connectionsData, donutData };
};
