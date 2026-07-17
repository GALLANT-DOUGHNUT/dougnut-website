import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import type {
  DonutData,
  IndicatorData,
  IndicatorDataDict,
} from "../../types/DonutData";

type YearSliderProps = {
  data: DonutData;
  year: number;
  setYear: React.Dispatch<React.SetStateAction<number>>;
  hideSlider: boolean;
};

const populateYears = (
  indicatorDictionary: IndicatorDataDict,
  yearsArray: number[],
) => {
  Object.entries(indicatorDictionary).forEach(
    (value: [string, IndicatorData]) => {
      const values = value[1].value;
      const years = Object.keys(values);
      years.map((year: string) => {
        yearsArray.push(parseInt(year));
      });
    },
  );
  return yearsArray;
};

export const YearSlider = ({
  setYear,
  year,
  data,
  hideSlider,
}: YearSliderProps) => {
  const currentYear = new Date().getFullYear();
  let yearsWithData: number[] = [currentYear];

  [
    data.ecological.global,
    data.ecological.local,
    data.social.global,
    data.social.local,
  ].forEach((indicatorDictionary: IndicatorDataDict) => {
    yearsWithData = populateYears(indicatorDictionary, yearsWithData);
  });

  const uniqueYears = [...new Set(yearsWithData)].sort((a, b) => a - b);
  const labelledYears =
    uniqueYears.length > 10
      ? uniqueYears.toReversed().filter((_, index) => index % 2 === 0)
      : uniqueYears;

  return hideSlider ? (
    <></>
  ) : (
    <Box
      sx={{
        position: "absolute",
        top: 47,
        left: 45,
        width: 400,
      }}
    >
      <Slider
        sx={{
          zIndex: 50000,
          color: "rgb(255, 117, 24)",
          "& .MuiSlider-markLabel": {
            fontSize: 12,
            color: "#666",
            fontWeight: 700,
          },
        }}
        aria-label="year-slider"
        value={year}
        step={null}
        track={false}
        min={uniqueYears[0]}
        max={uniqueYears[uniqueYears.length - 1]}
        onChange={(e, value) => {
          console.log("fudnud");
          if (e.target) {
            setYear(value);
          }
        }}
        marks={uniqueYears.map((year) => {
          return {
            value: year,
            label: labelledYears.includes(year) ? `${year}` : undefined,
          };
        })}
      />
    </Box>
  );
};
