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
  half: string;
  quarter: string;
  description: string;
};
