export type IndicatorData = {
    quarter: "global_ecological" | "local_ecological" | "global_social" | "local_social";
    value: number;
    adjacent: string[][];
    indicator: string;
    description: string;
    target: string;
    quotes: string;
    symbol_id: string;
    video_hash: string;
}

export type IndicatorDataDict = Record<string, IndicatorData>//{name: string, data: IndicatorData};

export type DonutData = {
    ecological: {
        global: IndicatorDataDict
        local: IndicatorDataDict
    }
    social: {
        global: IndicatorDataDict
        local: IndicatorDataDict
    }
}

export type IndicatorConnection = {
    name: string;
    half: string;
    quarter: string;
    description: string;
}