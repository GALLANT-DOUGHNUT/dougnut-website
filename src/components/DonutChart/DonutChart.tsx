import { useState, useEffect, useRef, useCallback } from "react";
import { scaleRadial } from "d3-scale";
import { select, type Selection } from "d3-selection";
import "../Admin/Admin.css";
import { Tooltip } from "./Tooltip";
import type { DomainData, IndicatorConnection } from "../../types/DonutData";
import {
  AdjustIndicatorArcs,
  createDonutInnerSectors,
  createDonutOuterSectors,
  getArcId,
} from "../../helpers/DonutHelpers";
import { DomainLabels } from "../Indicator/DomainLabels";
import Box from "@mui/material/Box";
import type { SxProps } from "@mui/material/styles";
import { DomainDetails } from "../Indicator/DomainDetails";
import { DonutStrings } from "../../resources/strings";
import theme from "../../theme";

export type DonutGeometry = {
  outerRadius: number;
  innerRadius: number;
  ringRadius: number;
  smallRingRadius: number;
  margin: number;
  innerTextRadius: number;
  outerTextRadius: number;
};

export type UnrolledGeometry = {
  windowWidth: number;
  windowHeight: number;
  centralBarHeight: number;
  barMaxHeight: number;
};

type DonutChartProps = {
  data: DomainData[];
  year: number;
  setHoverText: React.Dispatch<React.SetStateAction<string>>;
  size: number;
  height: number;
  domain: DomainData | null;
  setDomain: React.Dispatch<React.SetStateAction<DomainData | null>>;
  allConnections: IndicatorConnection[];
  showConnections: boolean;
  setShowConnections: React.Dispatch<React.SetStateAction<boolean>>;
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
  setHoverText,
  size = 500,
  height,
  data,
  year,
  domain,
  setDomain,
  allConnections,
  showConnections,
  setShowConnections,
}: DonutChartProps) => {
  const outerRadius = size / 2 - 20;
  const innerRadius = outerRadius / 2;
  const ringRadius = size / 7;
  const smallRingRadius = size / 9.2;

  const margin = 3;
  const innerTextRadius = innerRadius - (ringRadius + smallRingRadius) / 4;
  const outerTextRadius = innerRadius + (ringRadius + smallRingRadius) / 4;

  const [overlayVisible, setOverlayVisible] = useState(false);

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipDomain, setTooltipDomain] = useState<DomainData | null>(null);
  const [tooltipX, setTooltipX] = useState(0);
  const [tooltipY, setTooltipY] = useState(0);

  const [prevYear, setPrevYear] = useState(year);
  const [initialised, setInitialised] = useState(false);
  const [connections, setConnections] = useState<IndicatorConnection[]>([]);
  const ref = useRef<SVGSVGElement | null>(null);

  const CreateBarChart = useCallback(
    (svg: Selection<SVGSVGElement | null, unknown, null, undefined>) => {
      const onDomainOpen = (domain: DomainData) => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;

        setOverlayVisible(true);
        setDomain(domain);

        const connectionName = domain.name
          .replace(" and ", " & ")
          .toLowerCase();

        const connections = allConnections.filter(
          (c) =>
            (c.sourceName === connectionName &&
              c.sourceQuarter === domain.quarter) ||
            (c.targetName === connectionName &&
              c.targetQuarter === domain.quarter),
        );
        setConnections(connections);

        document.body.style.overflow = "hidden";
      };

      const onMouseOver = (_event: MouseEvent, domain: DomainData) => {
        if (domain.quarter === "global_ecological") {
          setHoverText(DonutStrings.hoverText.globalEcological);
        } else if (domain.quarter === "global_social") {
          setHoverText(DonutStrings.hoverText.globalSocial);
        } else if (domain.quarter === "local_ecological") {
          setHoverText(DonutStrings.hoverText.localEcological);
        } else if (domain.quarter === "local_social") {
          setHoverText(DonutStrings.hoverText.localSocial);
        }

        setTooltipVisible(true);
        setTooltipDomain(domain);

        // Highlight the corresponding arc
        const arcId = getArcId(domain);
        const arc = document.getElementById(arcId);
        if (arc) {
          arc.setAttribute(
            "fill",
            domain.code
              ? theme.palette.common.arcHover
              : theme.palette.common.arcEmptyHover,
          );
        }
      };

      const onMouseMove = (event: MouseEvent) => {
        setTooltipX(event.clientX + 10);
        setTooltipY(event.clientY + 10);
      };

      const onMouseLeave = (_event: MouseEvent, domain: DomainData) => {
        setTooltipVisible(false);
        setHoverText("");

        // De-highlight the corresponding arc
        const arcId = getArcId(domain);
        const arc = document.getElementById(arcId);
        if (arc) {
          arc.setAttribute(
            "fill",
            domain.code
              ? theme.palette.common.arc
              : theme.palette.common.arcEmpty,
          );
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
          onDomainOpen,
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
          onDomainOpen,
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
    // [Linter Bypass] - Complains about prevYear being missing from dependency array but including it visually
    // affects the animation transition for the arc changes

    //eslint-disable-next-line
    [
      data,
      year,
      innerRadius,
      outerRadius,
      margin,
      size,
      ringRadius,
      setHoverText,
      innerTextRadius,
      outerTextRadius,
      smallRingRadius,
      allConnections,
      initialised,
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
              id="donut-global-local-boundary-line"
              style={{
                backgroundColor: "black",
                position: "absolute",
                width: "100%",
                height: 5,
                marginTop: 5,
              }}
            ></div>
            <Tooltip
              year={year}
              domain={tooltipDomain}
              x={tooltipX}
              y={tooltipY}
              visible={tooltipVisible}
            />
            {domain ? (
              <DomainDetails
                visible={overlayVisible}
                setVisible={setOverlayVisible}
                domain={domain}
                setDomain={setDomain}
                indicatorConnections={connections}
                allConnections={allConnections}
                unrolled={false}
                showConnections={showConnections}
                setShowConnections={setShowConnections}
              />
            ) : (
              <></>
            )}
            <DomainLabels domain={domain} unrolled={false} />
          </>
        )}
      </>
    </Box>
  );
};
