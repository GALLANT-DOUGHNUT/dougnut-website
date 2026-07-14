import { useState, useEffect, useRef, useCallback } from "react";
import { scaleRadial } from "d3-scale";
import { select, type Selection } from "d3-selection";
import "../Admin/Admin.css";
import { Tooltip } from "./Tooltip";
import type {
  DonutData,
  IndicatorConnection,
  IndicatorData,
  IndicatorDataDict,
} from "../../types/DonutData";
import {
  AdjustIndicatorArcs,
  createDonutInnerSectors,
  createDonutOuterSectors,
  yearHasData,
} from "../../helpers/DonutHelpers";
import { DomainLabels } from "../Indicator/DomainLabels";
import Box from "@mui/material/Box";
import type { SxProps } from "@mui/material/styles";
import { YearSlider } from "./YearSlider";
import Papa from "papaparse";
import connectionsCsv from "../../data/Glasgow_Interconnections.csv?raw";
import { readCSVConnection } from "../../helpers/ConnectionHelpers";
import { DomainDetails } from "../Indicator/DomainDetails";

export type DonutGeometry = {
  outerRadius: number;
  innerRadius: number;
  ringRadius: number;
  smallRingRadius: number;
  margin: number;
  innerTextRadius: number;
  outerTextRadius: number;
};

type DonutChartProps = {
  data: DonutData;
  hoverText: string;
  setTextColor: React.Dispatch<React.SetStateAction<string>>;
  setHoverText: React.Dispatch<React.SetStateAction<string>>;
  setTopPx: React.Dispatch<React.SetStateAction<number>>;
  size: number;
  height: number;
};

const canvasStyles: SxProps = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  position: "relative",
};

export const DonutChart = ({
  setTextColor,
  setHoverText,
  setTopPx,
  size = 500,
  height,
  data,
}: DonutChartProps) => {
  const outerRadius = size / 2 - 20;
  const innerRadius = outerRadius / 2;
  const ringRadius = size / 7;
  const smallRingRadius = size / 9.2;

  const margin = 3;
  const innerTextRadius = innerRadius - (ringRadius + smallRingRadius) / 4;
  const outerTextRadius = innerRadius + (ringRadius + smallRingRadius) / 4;

  const [indicatorRecord, setIndicatorRecord] =
    useState<IndicatorDataDict | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipTitle, setTooltipTitle] = useState("");
  const [tooltipText, setTooltipText] = useState("");
  const [tooltipX, setTooltipX] = useState(0);
  const [tooltipY, setTooltipY] = useState(0);

  const [year, setYear] = useState(2026);
  const [prevYear, setPrevYear] = useState(2026);
  const [initialised, setInitialised] = useState(false);
  const [connections, setConnections] = useState<IndicatorConnection[]>([]);
  const ref = useRef<SVGSVGElement | null>(null);

  const csvConnections = Papa.parse(connectionsCsv);
  const parsedConnections: IndicatorConnection[] = [];

  if (csvConnections && csvConnections.data) {
    csvConnections.data.forEach((connection, index) => {
      if (index > 0) {
        parsedConnections.push(readCSVConnection(connection as string[]));
      }
    });
  }

  const allConnections = parsedConnections.filter(
    (pc) => pc.description !== "",
  );

  const CreateBarChart = useCallback(
    (svg: Selection<SVGSVGElement | null, unknown, null, undefined>) => {
      const onIndicatorOpen = (properties: [string, IndicatorData]) => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;

        setOverlayVisible(true);
        const indicatorName = properties[0]
          .split(" ")
          .map((word: string) => word?.[0]?.toUpperCase() + word?.substring(1))
          .join(" ");

        setIndicatorRecord({ [indicatorName]: properties[1] });

        const connections = allConnections.filter(
          (c) =>
            (c.sourceName === properties[0] &&
              c.sourceQuarter === properties[1].quarter) ||
            (c.targetName === properties[0] &&
              c.targetQuarter === properties[1].quarter),
        );
        setConnections(connections);
        document.body.style.overflow = "hidden";
      };

      const onMouseOver = (
        _event: MouseEvent,
        data: [string, IndicatorData],
      ) => {
        const CapitalisedProperty = (
          data[0][0].toUpperCase() + data[0].slice(1)
        ).replaceAll(/_/g, " ");

        if (data?.[1]?.quarter === "global_ecological") {
          setTextColor("#297C8E");
          setHoverText("How will Glasgow safeguard the health of the planet?");
          setTopPx(0);
        } else if (data?.[1]?.quarter === "global_social") {
          setTextColor("#477C3C");
          setHoverText(
            "How will Glasgow respect and support the wellbeing of people worldwide?",
          );
          setTopPx(0);
        } else if (data?.[1]?.quarter === "local_ecological") {
          setTextColor("#297C8E");
          setHoverText("How will the city thrive within its natural habitat?");
          setTopPx(150);
        } else if (data?.[1]?.quarter === "local_social") {
          setTextColor("#477C3C");
          setHoverText("How will the people of Glasgow thrive?");
          setTopPx(150);
        }
        setTooltipVisible(true);
        setTooltipTitle(CapitalisedProperty);
        setTooltipText(
          !yearHasData(data[1].value[`${year}`])
            ? "Not Known"
            : data[1].value[`${year}`] + "%",
        );

        if (document.getElementById(data[0] + "_outer")) {
          document
            .getElementById(data[0] + "_outer")!
            .setAttribute("fill", "#B84900");
        } else if (document.getElementById(data[0] + "_inner")) {
          document
            .getElementById(data[0] + "_inner")!
            .setAttribute("fill", "#B84900");
        }
      };

      const onMouseMove = (event: MouseEvent) => {
        setTooltipX(event.clientX + 10);
        setTooltipY(event.clientY + 10);
      };

      const onMouseLeave = (
        _event: MouseEvent,
        data: [string, IndicatorData],
      ) => {
        setTooltipVisible(false);
        setHoverText("");
        if (document.getElementById(data[0] + "_outer")) {
          if (data[1].value[`${year}`] === -1)
            document
              .getElementById(data[0] + "_outer")!
              .setAttribute("fill", "#cfcfcf");
          else
            document
              .getElementById(data[0] + "_outer")!
              .setAttribute("fill", "#ff7518");
        } else if (document.getElementById(data[0] + "_inner")) {
          if (data[1].value[`${year}`] === -1)
            document
              .getElementById(data[0] + "_outer")!
              .setAttribute("fill", "#cfcfcf");
          else
            document
              .getElementById(data[0] + "_inner")!
              .setAttribute("fill", "#ff7518");
        }
      };

      const donutGeometry: DonutGeometry = {
        outerRadius,
        innerRadius,
        ringRadius,
        smallRingRadius,
        margin,
        innerTextRadius,
        outerTextRadius,
      };

      const yOuter = scaleRadial()
        .range([innerRadius + ringRadius / 2 + margin, outerRadius]) // Domain will be define later.
        .domain([0, 140]); // Domain of Y is from 0 to the max seen in the data

      const yInner = scaleRadial()
        .range([innerRadius - ringRadius / 2 - margin, 10]) //This is 10 because the inner part of the graph would become too pointy
        .domain([0, 100]);

      if (!initialised) {
        // TODO: This is to remove the element from last render, probably not a good way of doing this
        svg.selectAll("g").remove();

        const group = svg
          .append("g")
          .attr("transform", "translate(" + size / 2 + "," + size / 2 + ")");

        createDonutInnerSectors(
          data,
          year,
          donutGeometry,
          group,
          yInner,
          onIndicatorOpen,
          onMouseOver,
          onMouseMove,
          onMouseLeave,
        );
        createDonutOuterSectors(
          data,
          year,
          donutGeometry,
          group,
          yOuter,
          onIndicatorOpen,
          onMouseOver,
          onMouseMove,
          onMouseLeave,
        );
        setInitialised(true);
        setPrevYear(year);
      } else {
        AdjustIndicatorArcs(
          data,
          prevYear,
          year,
          donutGeometry,
          yOuter,
          yInner,
          onMouseOver,
        );
        setPrevYear(year);
      }
    },
    [
      data,
      year,
      innerRadius,
      outerRadius,
      margin,
      size,
      ringRadius,
      setHoverText,
      setTextColor,
      setTopPx,
      innerTextRadius,
      outerTextRadius,
      smallRingRadius,
    ],
  );

  useEffect(() => {
    const svgElement = select(ref.current);
    CreateBarChart(svgElement);
  }, [CreateBarChart]);

  return (
    <Box sx={canvasStyles}>
      <Box sx={{ marginTop: "50px" }}>
        <svg
          className="svgClass"
          ref={ref}
          height={size}
          width={size}
          style={{ maxWidth: "100%", zoom: "140%" }}
          viewBox={"100 85 500 550"}
        ></svg>
      </Box>
      <>
        {window.location.pathname !== "/" ? null : (
          <>
            <div style={{ marginTop: height <= 768 ? 15 : 0 }}></div>
            <div
              style={{
                backgroundColor: "black",
                position: "absolute",
                width: "100%",
                height: 5,
                marginTop: 10,
              }}
            ></div>
            <Tooltip
              title={tooltipTitle
                .split(" ")
                .map((word) => word?.[0]?.toUpperCase() + word?.substring(1))
                .join(" ")}
              text={tooltipText}
              x={tooltipX}
              y={tooltipY}
              visible={tooltipVisible}
            />
            {indicatorRecord ? (
              <DomainDetails
                visible={overlayVisible}
                setVisible={setOverlayVisible}
                indicatorDataRecord={indicatorRecord}
                setIndicatorDataRecord={setIndicatorRecord}
                data={data}
                indicatorConnections={connections}
                allConnections={allConnections}
              />
            ) : (
              <></>
            )}
            <DomainLabels record={indicatorRecord} />
            <YearSlider data={data} setYear={setYear} />
          </>
        )}
      </>
    </Box>
  );
};
