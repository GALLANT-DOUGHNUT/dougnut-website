import type { GraphColors, SxProps } from "@mui/material/styles";
import type { Indicator } from "../../types/DonutData";
import { Box, Typography } from "@mui/material";
import { ScatterChart } from "@mui/x-charts/ScatterChart";
import theme from "../../theme";

type IndicatorProps = {
  index: number;
  indicator: Indicator;
};

export const IndicatorDetails = ({ index, indicator }: IndicatorProps) => {
  const titleStyles: SxProps = {
    pb: 0,
    fontWeight: 600,
    fontSize: { md: "1.1rem", xl: "1.5rem" }, //{ md: "1.5rem", xl: "2rem" },
    textAlign: "start",
    pl: theme.spacing(3),
    pr: theme.spacing(2)
  };

  const textStyles: SxProps = {
    paddingTop: "5px",
    paddingBottom: "15px",
    px: "15px",
    fontSize: { md: "0.9rem", xl: "1.3rem" }, // { md: "1.2rem", xl: "1.7rem" }
    textAlign: "start",
    mx: theme.spacing(1.5),
  };

  const graphStyles: SxProps = {
    backgroundColor: theme.palette.background.paper,
    paddingTop: "7px",
    borderRadius: theme.spacing(1.5),
    border: "3px solid",
    borderColor: "#004c9334",
    mx: theme.spacing(3.5),
    my: theme.spacing(2),
  };

  const series = [
    {
      data: indicator.data
        .filter((d) => d.type === "real")
        .map((d) => {
          return { x: d.year, y: d.value };
        }),
      color: theme.palette.graph[(index % 6) as keyof GraphColors],
      label: "Measured"
    },
    {
      data: indicator.data
        .filter((d) => d.type === "imputed")
        .map((d) => {
          return { x: d.year, y: d.value };
        }),
      color: theme.palette.graph.imputed,
      label: "Imputed"
    },
  ];

  const unit = (indicator.data.length > 0 ? `${indicator.data[0].unit}` : "").replace("Percentage", "%")
  const unitText = ` (${unit})`

  return (
    <>
      <Typography sx={titleStyles}>{indicator.indicatorName}{unitText}</Typography>
      <Box sx={graphStyles}>
        <ScatterChart
          height={220}
          series={series}
          grid={{ horizontal: true, vertical: true }}
          margin={{ bottom: 2, left: 5, right: 25 }}
          xAxis={[
            {
              height: 30,
              tickLabelInterval: (_, index) => index % 2 === 1,
              valueFormatter: (value: number) => {
                return String(value);
              },
            },
          ]}
        //   yAxis={[{label: unit, width: 50}]}
          slotProps={{
            legend: {direction: "horizontal", position: {vertical: "bottom", horizontal: "center"}}
          }}
        //   hideLegend={true}
        />
      </Box>
      <Typography sx={textStyles}>
        {indicator.indicatorNarrative && indicator.indicatorNarrative.length > 0
          ? indicator.indicatorNarrative
          : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."}
      </Typography>
    </>
  );
};
