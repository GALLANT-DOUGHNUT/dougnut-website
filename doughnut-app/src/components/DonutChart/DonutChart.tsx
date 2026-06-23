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
import { IndicatorDetails } from "../Indicator/IndicatorDetails";
import {
  createDonutInnerSectors,
  createDonutOuterSectors,
} from "../../helpers/DonutHelpers";
import { DomainLabels } from "../Indicator/DomainLabels";
import Box from "@mui/material/Box";
import type { SxProps } from "@mui/material/styles";
// import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

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

  const donutGeometry: DonutGeometry = {
    outerRadius,
    innerRadius,
    ringRadius,
    smallRingRadius,
    margin,
    innerTextRadius,
    outerTextRadius,
  };

  const [indicatorRecord, setIndicatorRecord] =
    useState<IndicatorDataDict | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipTitle, setTooltipTitle] = useState("");
  const [tooltipText, setTooltipText] = useState("");
  const [tooltipX, setTooltipX] = useState(0);
  const [tooltipY, setTooltipY] = useState(0);

  const [connections, setConnections] = useState<IndicatorConnection[]>([]);
  const ref = useRef<SVGSVGElement | null>(null);

  const getConnectionNames = (data: string[]): IndicatorConnection[] => {
    if (!Array.isArray(data)) {
      console.error("Expected an array but received:", data);
      return [];
    }

    return data.map((item) => ({
      half: item[0],
      quarter: item[1],
      name: item[2],
      description: item[3],
    }));
  };

  const onIndicatorOpen = (properties: any) => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    setOverlayVisible(true);
    const indicatorName = properties[0]
      .split(" ")
      .map((word: string) => word?.[0]?.toUpperCase() + word?.substring(1))
      .join(" ");

    setIndicatorRecord({ [indicatorName]: properties[1] });
    const connections = getConnectionNames(properties[1]["adjacent"]);
    setConnections(connections);
    document.body.style.overflow = "hidden";
  };

  const onMouseOver = (_event: MouseEvent, data: [string, IndicatorData]) => {
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
    setTooltipText(data[1].value === -1 ? "Not Known" : data[1].value + "%");

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

  const onMouseLeave = (_event: MouseEvent, data: [string, IndicatorData]) => {
    setTooltipVisible(false);
    setHoverText("");
    if (document.getElementById(data[0] + "_outer")) {
      if (data[1].value === -1)
        document
          .getElementById(data[0] + "_outer")!
          .setAttribute("fill", "#cfcfcf");
      else
        document
          .getElementById(data[0] + "_outer")!
          .setAttribute("fill", "#ff7518");
    } else if (document.getElementById(data[0] + "_inner")) {
      if (data[1].value === -1)
        document
          .getElementById(data[0] + "_outer")!
          .setAttribute("fill", "#cfcfcf");
      else
        document
          .getElementById(data[0] + "_inner")!
          .setAttribute("fill", "#ff7518");
    }
  };

  const CreateBarChart = useCallback(
    (svg: Selection<SVGSVGElement | null, unknown, null, undefined>) => {
      // TODO: This is to remove the element from last render, probably not a good way of doing this
      svg.selectAll("g").remove();

      const group = svg
        .append("g")
        .attr("transform", "translate(" + size / 2 + "," + size / 2 + ")");

      const yOuter = scaleRadial()
        .range([innerRadius + ringRadius / 2 + margin, outerRadius]) // Domain will be define later.
        .domain([0, 140]); // Domain of Y is from 0 to the max seen in the data

      const yInner = scaleRadial()
        .range([innerRadius - ringRadius / 2 - margin, 10]) //This is 10 because the inner part of the graph would become too pointy
        .domain([0, 100]);

      createDonutInnerSectors(
        data,
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
        donutGeometry,
        group,
        yOuter,
        onIndicatorOpen,
        onMouseOver,
        onMouseMove,
        onMouseLeave,
      );
    },
    [data, donutGeometry],
  );

  useEffect(() => {
    const svgElement = select(ref.current);
    CreateBarChart(svgElement);
  }, [
    data,
    innerRadius,
    margin,
    outerRadius,
    ringRadius,
    smallRingRadius,
    innerTextRadius,
    outerTextRadius,
    size,
  ]);

  return (
    <Box sx={canvasStyles}>
      <Box sx={{ marginTop: "50px" }}>
        {/* Could be useful in future development for pinch and zoom behaviour  */}
        {/* <TransformWrapper>
          <TransformComponent wrapperStyle={{ overflow: "visible" }}> */}
        <svg
          className="svgClass"
          ref={ref}
          height={size}
          width={size}
          style={{ maxWidth: "100%", zoom: "140%" }}
          viewBox={"100 85 500 550"}
        ></svg>
        {/* </TransformComponent>
        </TransformWrapper> */}
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
                marginTop: 5,
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
            <IndicatorDetails
              visible={overlayVisible}
              setVisible={setOverlayVisible}
              indicatorDataRecord={indicatorRecord}
              setIndicatorDataRecord={setIndicatorRecord}
              data={data}
              connections={connections}
            />
            <DomainLabels record={indicatorRecord} />
          </>
        )}
      </>
    </Box>
  );
};
