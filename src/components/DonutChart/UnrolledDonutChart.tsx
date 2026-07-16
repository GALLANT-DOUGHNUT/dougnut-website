import { useState, useEffect, useRef, useCallback } from "react";
import { select, type Selection } from "d3-selection";
import "../Admin/Admin.css";
import { Tooltip } from "./Tooltip";
import type {
  DonutData,
  IndicatorConnection,
  IndicatorData,
  IndicatorDataDict,
} from "../../types/DonutData";
import { DomainLabels } from "../Indicator/DomainLabels";
import Box from "@mui/material/Box";
import type { SxProps } from "@mui/material/styles";
import { YearSlider } from "./YearSlider";
import Papa from "papaparse";
import connectionsCsv from "../../data/Glasgow_Interconnections.csv?raw";
import { readCSVConnection } from "../../helpers/ConnectionHelpers";
import { DomainDetails } from "../Indicator/DomainDetails";
import { yearHasData } from "../../helpers/DonutHelpers";
import {
  createGraphEcologicalSectors,
  createGraphSocialSectors,
  redrawChart,
} from "../../helpers/UnrolledDonutHelpers";

import type { UnrolledGeometry } from "./DonutChart";

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
  setHoverText: React.Dispatch<React.SetStateAction<string>>;
  width: number;
  height: number;
  showConnections: boolean;
  setShowConnections: React.Dispatch<React.SetStateAction<boolean>>;
};

const canvasStyles: SxProps = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100vw",
  height: "100vh",
  position: "relative",
};

export const UnrolledDonutChart = ({
  setHoverText,
  width,
  height,
  data,
  showConnections,
  setShowConnections,
}: DonutChartProps) => {
  const [indicatorRecord, setIndicatorRecord] =
    useState<IndicatorDataDict | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipTitle, setTooltipTitle] = useState("");
  const [tooltipText, setTooltipText] = useState("");
  const [tooltipX, setTooltipX] = useState(0);
  const [tooltipY, setTooltipY] = useState(0);

  const [year, setYear] = useState(2026);
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
          setHoverText("How will Glasgow safeguard the health of the planet?");
        } else if (data?.[1]?.quarter === "global_social") {
          setHoverText(
            "How will Glasgow respect and support the wellbeing of people worldwide?",
          );
        } else if (data?.[1]?.quarter === "local_ecological") {
          setHoverText("How will the city thrive within its natural habitat?");
        } else if (data?.[1]?.quarter === "local_social") {
          setHoverText("How will the people of Glasgow thrive?");
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

      const geometry: UnrolledGeometry = {
        windowHeight: height,
        windowWidth: width,
        centralBarHeight: 220,
        barMaxHeight: (height < 700 ? 0.13 : 0.17) * height,
      };

      if (!initialised) {
        svg.selectAll("g").remove();
        const group = svg.append("g");

        createGraphSocialSectors(
          data,
          year,
          geometry,
          group,
          onIndicatorOpen,
          onMouseOver,
          onMouseMove,
          onMouseLeave,
        );

        createGraphEcologicalSectors(
          data,
          year,
          geometry,
          group,
          onIndicatorOpen,
          onMouseOver,
          onMouseMove,
          onMouseLeave,
        );
        setInitialised(true);
      } else {
        // Redraw the existing chart
        redrawChart(data, year, geometry, onMouseOver);
      }
    },
    [data, year, setHoverText, width, height],
  );

  useEffect(() => {
    const svgElement = select(ref.current);
    CreateBarChart(svgElement);
  }, [CreateBarChart]);

  return (
    <Box sx={canvasStyles} id="svg-canvas">
      <Box id="svg-unrolled">
        <svg
          ref={ref}
          height={"100vh"}
          width={"100vw"}
          viewBox={`0 0 ${width} ${height}`}
        ></svg>
      </Box>
      <>
        {window.location.pathname !== "/" ? null : (
          <>
            <div
              style={{
                backgroundColor: "black",
                position: "absolute",
                height: "100%",
                width: 5,
                left: 0.4925 * width,
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
                unrolled={true}
                showConnections={showConnections}
                setShowConnections={setShowConnections}
              />
            ) : (
              <></>
            )}
            <DomainLabels record={indicatorRecord} unrolled={true} />
            <YearSlider
              data={data}
              setYear={setYear}
              hideSlider={showConnections}
            />
          </>
        )}
      </>
    </Box>
  );
};
