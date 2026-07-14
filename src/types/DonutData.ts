export type IndicatorData = {
  quarter:
    | "global_ecological"
    | "local_ecological"
    | "global_social"
    | "local_social";
  value: Record<string, number>;
  adjacent: string[][];
  indicator: string;
  description: string;
  target: string;
  quotes: string;
  symbol_id: string;
  video_hash: string;
};

export type IndicatorDataDict = Record<string, IndicatorData>;

export type DonutData = {
  ecological: {
    global: IndicatorDataDict;
    local: IndicatorDataDict;
  };
  social: {
    global: IndicatorDataDict;
    local: IndicatorDataDict;
  };
};

export type IndicatorConnection = {
  sourceName: string; // Source - Name of indicator that is causing the effect
  sourceQuarter: string;
  targetName: string; // Target - Name of indicator that is being affected
  targetQuarter: string;
  description: string;
};

export type DomainNode = {
  name: string;
  quarter: string;
  symbol: string;
  description?: string;
};

export type DomainEdge = {
  id: string;
  source: string;
  target: string;
  type: string;
  animated?: boolean;
  data: { color: string };
};
