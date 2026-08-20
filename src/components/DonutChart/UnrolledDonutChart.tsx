import { useState, useEffect, useRef, useCallback } from "react";
import { select, type Selection } from "d3-selection";
import "../Admin/Admin.css";
import { Tooltip } from "./Tooltip";
import type { DomainData, IndicatorConnection } from "../../types/DonutData";
import { DomainLabels } from "../Indicator/DomainLabels";
import Box from "@mui/material/Box";
import type { SxProps } from "@mui/material/styles";
import { DomainDetails } from "../Indicator/DomainDetails";
import {
  createGraphEcologicalSectors,
  createGraphSocialSectors,
  redrawChart,
} from "../../helpers/UnrolledDonutHelpers";

import type { UnrolledGeometry } from "./DonutChart";
import { DonutStrings } from "../../resources/strings";
import { getArcId } from "../../helpers/DonutHelpers";
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

type DonutChartProps = {
  data: DomainData[];
  year: number;
  setHoverText: React.Dispatch<React.SetStateAction<string>>;
  width: number;
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
  width: "100vw",
  height: "100vh",
  position: "relative",
};

export const UnrolledDonutChart = ({
  setHoverText,
  width,
  height,
  data,
  year,
  domain,
  setDomain,
  allConnections,
  showConnections,
  setShowConnections,
}: DonutChartProps) => {
  const [overlayVisible, setOverlayVisible] = useState(false);

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipDomain, setTooltipDomain] = useState<DomainData | null>(null);
  const [tooltipX, setTooltipX] = useState(0);
  const [tooltipY, setTooltipY] = useState(0);

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
          onDomainOpen,
          onMouseOver,
          onMouseMove,
          onMouseLeave,
        );

        createGraphEcologicalSectors(
          data,
          year,
          geometry,
          group,
          onDomainOpen,
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
    [data, year, setHoverText, width, height, allConnections, initialised],
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
                unrolled={true}
                showConnections={showConnections}
                setShowConnections={setShowConnections}
              />
            ) : (
              <></>
            )}
            <DomainLabels domain={domain} unrolled={true} />
          </>
        )}
      </>
    </Box>
  );
};
