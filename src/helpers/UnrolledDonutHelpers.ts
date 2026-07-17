import { scaleBand, type ScaleBand } from "d3-scale";
import Icons from "../Icons";
import type { DonutData, IndicatorData } from "../types/DonutData";
import { select, type Selection } from "d3-selection";
import type { UnrolledGeometry } from "../components/DonutChart/DonutChart";
import "d3-transition";
import { easeLinear } from "d3-ease";
import { yearHasData } from "./DonutHelpers";

type Datum = [string, { value: Record<string, number>; quarter?: string }];

const initializeBarSegment = (
  group: Selection<SVGGElement, unknown, null, undefined>,
  Properties: [string, IndicatorData][],
  type: "shortfall" | "overshoot",
  year: number,
) => {
  const idString = type === "shortfall" ? "_shortfall" : "_overshoot";

  return group
    .append("g")
    .selectAll("rect")
    .data(Properties)
    .enter()
    .append("rect")
    .attr("fill", (d: Datum) =>
      d[1].value[`${year}`] === -1 ? "#cfcfcf" : "#ff7518",
    )
    .attr(
      "id",
      (d: Datum) =>
        `${d[0]}${idString}_${d[1].quarter?.includes("local") ? "local" : "global"}`,
    );
};

const initializeGraphRectSegment = (
  group: Selection<SVGGElement, unknown, null, undefined>,
  fillColor: string,
) => {
  return group.append("g").append("rect").attr("fill", fillColor);
};

const createShortfallBar = (
  Properties: [string, IndicatorData][],
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: UnrolledGeometry,
  xScale: ScaleBand<string>,
  year: number,
) => {
  const { windowWidth, windowHeight, barMaxHeight } = geometry;
  const bottomY = windowHeight / 2 + 95;

  initializeBarSegment(group, Properties, "shortfall", year)
    .attr("x", (d) => xScale(d[0])! * windowWidth)
    .attr("y", bottomY)
    .attr("width", xScale.bandwidth() * windowWidth * 0.8)
    .transition()
    .duration(500)
    .ease(easeLinear)
    .attr("height", (d) => {
      const value = yearHasData(d[1].value[`${year}`])
        ? d[1].value[`${year}`]
        : 100;
      return (value / 100) * barMaxHeight;
    });
};

const redrawShortfallBars = (
  Properties: [string, IndicatorData][],
  geometry: UnrolledGeometry,
  xScale: ScaleBand<string>,
  year: number,
) => {
  const { windowHeight, windowWidth, barMaxHeight } = geometry;
  const bottomY = windowHeight / 2 + 95;

  Properties.forEach((indicator: [string, IndicatorData]) => {
    const barType = "_shortfall";
    const locality = indicator[1].quarter.includes("local")
      ? "_local"
      : "_global";

    const propertyId = `${indicator[0]}${barType}${locality}`;
    const escaped = CSS.escape(propertyId);
    const selection = select(`#${escaped}`) as Selection<
      SVGRectElement,
      Datum,
      HTMLElement,
      unknown
    >;

    selection
      .attr("x", (d: Datum) => xScale(d[0])! * windowWidth)
      .attr("y", bottomY)
      .attr("width", xScale.bandwidth() * windowWidth * 0.8)
      .transition()
      .duration(500)
      .ease(easeLinear)
      .attr("height", (d: Datum) => {
        const value = yearHasData(d[1].value[`${year}`])
          ? d[1].value[`${year}`]
          : 100;
        return (value / 100) * barMaxHeight;
      });
  });
};

const createOvershootBar = (
  Properties: [string, IndicatorData][],
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: UnrolledGeometry,
  xScale: ScaleBand<string>,
  year: number,
) => {
  const { windowWidth, windowHeight, barMaxHeight } = geometry;

  initializeBarSegment(group, Properties, "overshoot", year)
    .attr("x", (d) => xScale(d[0])! * windowWidth)
    .attr("y", 0) // Use translate for y position instead as scale is flipped
    .attr("width", xScale.bandwidth() * windowWidth * 0.8)
    .attr("transform", `translate(0,${windowHeight / 2 - 95}) scale(1,-1)`)
    .transition()
    .duration(500)
    .ease(easeLinear)
    .attr("height", (d) => {
      const value = yearHasData(d[1].value[`${year}`])
        ? d[1].value[`${year}`]
        : 100;
      return (value / 100) * barMaxHeight;
    });
};

const redrawOvershootBars = (
  Properties: [string, IndicatorData][],
  geometry: UnrolledGeometry,
  xScale: ScaleBand<string>,
  year: number,
) => {
  const { windowHeight, windowWidth, barMaxHeight } = geometry;

  Properties.forEach((indicator: [string, IndicatorData]) => {
    const barType = "_overshoot";
    const locality = indicator[1].quarter.includes("local")
      ? "_local"
      : "_global";

    const propertyId = `${indicator[0]}${barType}${locality}`;
    const escaped = CSS.escape(propertyId);
    const selection = select(`#${escaped}`) as Selection<
      SVGRectElement,
      Datum,
      HTMLElement,
      unknown
    >;

    selection
      .attr("x", (d: Datum) => xScale(d[0])! * windowWidth)
      .attr("width", xScale.bandwidth() * windowWidth * 0.8)
      .attr("transform", `translate(0,${windowHeight / 2 - 95}) scale(1,-1)`)
      .transition()
      .duration(500)
      .ease(easeLinear)
      .attr("height", (d: Datum) => {
        const value = yearHasData(d[1].value[`${year}`])
          ? d[1].value[`${year}`]
          : 100;
        return (value / 100) * barMaxHeight;
      });
  });
};

const createSocialGraphSegments = (
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: UnrolledGeometry,
) => {
  const { windowHeight, windowWidth } = geometry;

  // Social Foundation Boundary
  initializeGraphRectSegment(group, "#487c3a")
    .attr("id", `social-foundation-boundary`)
    .attr("x", 0)
    .attr("y", windowHeight / 2 + 55)
    .attr("width", windowWidth)
    .attr("height", 35);

  // Social Foundation Center
  initializeGraphRectSegment(group, "#8fc53b")
    .attr("id", `social-foundation-center`)
    .attr("x", 0)
    .attr("y", windowHeight / 2)
    .attr("width", windowWidth)
    .attr("height", 55);
};

const redrawSocialGraphSegments = (geometry: UnrolledGeometry) => {
  const { windowHeight, windowWidth } = geometry;

  let selection = select(`#social-foundation-boundary`);
  selection
    .attr("x", 0)
    .attr("y", windowHeight / 2 + 55)
    .attr("width", windowWidth)
    .attr("height", 35);

  selection = select(`#social-foundation-center`);
  selection
    .attr("x", 0)
    .attr("y", windowHeight / 2)
    .attr("width", windowWidth)
    .attr("height", 55);
};

const createEcologicalGraphSegments = (
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: UnrolledGeometry,
) => {
  const { windowHeight, windowWidth } = geometry;

  // Ecological Ceiling Boundary
  initializeGraphRectSegment(group, "#297c8e")
    .attr("id", "ecological-ceiling-boundary")
    .attr("x", 0)
    .attr("y", windowHeight / 2 - 55 - 35)
    .attr("width", windowWidth)
    .attr("height", 35);

  // Ecological Ring Interior
  initializeGraphRectSegment(group, "#39adc6")
    .attr("id", "ecological-ceiling-center")
    .attr("x", 0)
    .attr("y", windowHeight / 2 - 55)
    .attr("width", windowWidth)
    .attr("height", 55);
};

const redrawEcologicalGraphSegments = (geometry: UnrolledGeometry) => {
  const { windowHeight, windowWidth } = geometry;

  let selection = select(`#ecological-ceiling-boundary`);
  selection
    .attr("x", 0)
    .attr("y", windowHeight / 2 - 55 - 35)
    .attr("width", windowWidth)
    .attr("height", 35);

  selection = select(`#ecological-ceiling-center`);
  selection
    .attr("x", 0)
    .attr("y", windowHeight / 2 - 55)
    .attr("width", windowWidth)
    .attr("height", 55);
};

const createGraphLabels = (
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: UnrolledGeometry,
) => {
  const { windowWidth, windowHeight } = geometry;

  group
    .append("text")
    .attr("id", "global-social-foundation-label")
    .attr("x", 0.25 * windowWidth)
    .attr("y", windowHeight / 2 + 72)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("fill", "white")
    .text("GLOBAL SOCIAL FOUNDATION");

  group
    .append("text")
    .attr("id", "local-social-foundation-label")
    .attr("x", 0.75 * windowWidth)
    .attr("y", windowHeight / 2 + 72)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("fill", "white")
    .text("LOCAL SOCIAL FOUNDATION");

  group
    .append("text")
    .attr("id", "local-ecological-ceiling-label")
    .attr("x", 0.75 * windowWidth)
    .attr("y", windowHeight / 2 - 72)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("fill", "white")
    .text("LOCAL ECOLOGICAL CEILING");

  group
    .append("text")
    .attr("id", "global-ecological-ceiling-label")
    .attr("x", 0.25 * windowWidth)
    .attr("y", windowHeight / 2 - 72)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("fill", "white")
    .text("GLOBAL ECOLOGICAL CEILING");
};

const redrawGraphLabels = (geometry: UnrolledGeometry) => {
  const { windowHeight, windowWidth } = geometry;

  let selection = select(`#global-social-foundation-label`);
  selection.attr("x", 0.25 * windowWidth).attr("y", windowHeight / 2 + 72);

  selection = select(`#local-social-foundation-label`);
  selection.attr("x", 0.75 * windowWidth).attr("y", windowHeight / 2 + 72);

  selection = select(`#local-ecological-ceiling-label`);
  selection.attr("x", 0.75 * windowWidth).attr("y", windowHeight / 2 - 72);

  selection = select(`#global-ecological-ceiling-label`);
  selection.attr("x", 0.25 * windowWidth).attr("y", windowHeight / 2 - 72);
};

const createSocialIcons = (
  Properties: [string, IndicatorData][],
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: UnrolledGeometry,
  xScale: ScaleBand<string>,
  onIndicatorOpen: (properties: [string, IndicatorData]) => void,
  onMouseOver: (event: MouseEvent, data: [string, IndicatorData]) => void,
  onMouseMove: (event: MouseEvent) => void,
  onMouseLeave: (event: MouseEvent, data: [string, IndicatorData]) => void,
) => {
  const { windowWidth, windowHeight } = geometry;

  group
    .append("g")
    .selectAll("g")
    .data(Properties)
    .enter()
    .append("g")
    .attr("text-anchor", "middle")
    .append("svg:image")
    .attr("x", (d) => xScale(d[0])! * windowWidth + 0.006 * windowWidth)
    .attr("y", windowHeight / 2 + 15)
    .attr("width", 27)
    .attr("height", 27)
    .attr("xlink:href", function (d: [string, { symbol_id: string }]) {
      const { symbol_id } = d[1];
      const imgRef = symbol_id.substring(
        0,
        symbol_id.length - 4,
      ) as keyof typeof Icons;
      return Icons[imgRef];
    })
    .attr("id", (d: Datum) => d[0] + "_" + d[1].quarter + "_inner_img")
    .style("cursor", "pointer")
    .on("mouseover", onMouseOver)
    .on("mousemove", onMouseMove)
    .on("mouseleave", onMouseLeave)
    .on(
      "click",
      function (
        _event: PointerEvent,
        elementProperties: [string, IndicatorData],
      ) {
        if (window.location.pathname === "/") {
          onIndicatorOpen(elementProperties);
        }
      },
    );
};

const redrawSocialIcons = (
  Properties: [string, IndicatorData][],
  geometry: UnrolledGeometry,
  xScale: ScaleBand<string>,
  onMouseOver: (event: MouseEvent, data: [string, IndicatorData]) => void,
) => {
  const { windowWidth, windowHeight } = geometry;

  Properties.forEach((indicator: [string, IndicatorData]) => {
    const imgIconId = indicator[0] + "_" + indicator[1].quarter + "_inner_img";
    const escapedImg = CSS.escape(imgIconId);
    const imgIcon = select<SVGImageElement, [string, IndicatorData]>(
      `#${escapedImg}`,
    );
    imgIcon.on("mouseover", onMouseOver);
    imgIcon
      .attr("x", (d) => xScale(d[0])! * windowWidth + 0.006 * windowWidth)
      .attr("y", windowHeight / 2 + 15);
  });
};

const CreateEcologicalIcons = (
  Properties: [string, IndicatorData][],
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: UnrolledGeometry,
  xScale: ScaleBand<string>,
  onIndicatorOpen: (properties: [string, IndicatorData]) => void,
  onMouseOver: (event: MouseEvent, data: [string, IndicatorData]) => void,
  onMouseMove: (event: MouseEvent) => void,
  onMouseLeave: (event: MouseEvent, data: [string, IndicatorData]) => void,
) => {
  const { windowWidth, windowHeight } = geometry;

  group
    .append("g")
    .selectAll("g")
    .data(Properties)
    .enter()
    .append("g")
    .attr("text-anchor", "middle")
    .append("svg:image")
    .attr("x", (d) => xScale(d[0])! * windowWidth + 0.01 * windowWidth)
    .attr("y", windowHeight / 2 - 45)
    .attr("width", 27)
    .attr("height", 27)
    .attr("xlink:href", function (d: [string, { symbol_id: string }]) {
      const { symbol_id } = d[1];
      const imgRef = symbol_id.substring(
        0,
        symbol_id.length - 4,
      ) as keyof typeof Icons;
      return Icons[imgRef];
    })
    .attr("id", (d: Datum) => d[0] + "_outer_img")
    .style("cursor", "pointer")
    .on("mouseover", onMouseOver)
    .on("mousemove", onMouseMove)
    .on("mouseleave", onMouseLeave)

    .on(
      "click",
      function (
        _event: PointerEvent,
        elementProperties: [string, IndicatorData],
      ) {
        if (window.location.pathname === "/") {
          onIndicatorOpen(elementProperties);
        }
      },
    );
};

const redrawEcologicalIcons = (
  Properties: [string, IndicatorData][],
  geometry: UnrolledGeometry,
  xScale: ScaleBand<string>,
  onMouseOver: (event: MouseEvent, data: [string, IndicatorData]) => void,
) => {
  const { windowWidth, windowHeight } = geometry;

  Properties.forEach((indicator: [string, IndicatorData]) => {
    const imgIconId = indicator[0] + "_outer_img";
    const escapedImg = CSS.escape(imgIconId);
    const imgIcon = select<SVGImageElement, [string, IndicatorData]>(
      `#${escapedImg}`,
    );
    imgIcon.on("mouseover", onMouseOver);
    imgIcon
      .attr("x", (d) => xScale(d[0])! * windowWidth + 0.01 * windowWidth)
      .attr("y", windowHeight / 2 - 45);
  });
};

export const createGraphSocialSectors = (
  data: DonutData,
  year: number,
  geometry: UnrolledGeometry,
  group: Selection<SVGGElement, unknown, null, undefined>,
  onIndicatorOpen: (properties: [string, IndicatorData]) => void,
  onMouseOver: (event: MouseEvent, data: [string, IndicatorData]) => void,
  onMouseMove: (event: MouseEvent) => void,
  onMouseLeave: (event: MouseEvent, data: [string, IndicatorData]) => void,
) => {
  createSocialGraphSegments(group, geometry);

  for (const [Half, properties] of Object.entries(data.social)) {
    const xScale = scaleBand()
      // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .range(Half === "global" ? [0, 0.5] : [0.5, 1])
      .domain(Object.keys(properties)); // The domain of the X axis is the list of states.

    const PropertiesEntries = Object.entries(properties);
    createShortfallBar(PropertiesEntries, group, geometry, xScale, year);
    createSocialIcons(
      PropertiesEntries,
      group,
      geometry,
      xScale,
      onIndicatorOpen,
      onMouseOver,
      onMouseMove,
      onMouseLeave,
    );
  }
};

export const createGraphEcologicalSectors = (
  data: DonutData,
  year: number,
  geometry: UnrolledGeometry,
  group: Selection<SVGGElement, unknown, null, undefined>,
  onIndicatorOpen: (properties: [string, IndicatorData]) => void,
  onMouseOver: (event: MouseEvent, data: [string, IndicatorData]) => void,
  onMouseMove: (event: MouseEvent) => void,
  onMouseLeave: (event: MouseEvent, data: [string, IndicatorData]) => void,
) => {
  createEcologicalGraphSegments(group, geometry);
  for (const [Half, Properties] of Object.entries(data.ecological)) {
    const xScale = scaleBand()
      .range(Half === "global" ? [0, 0.5] : [0.5, 1])
      .domain(Object.keys(Properties));

    const PropertiesEntries = Object.entries(Properties);
    createOvershootBar(PropertiesEntries, group, geometry, xScale, year);
    CreateEcologicalIcons(
      PropertiesEntries,
      group,
      geometry,
      xScale,
      onIndicatorOpen,
      onMouseOver,
      onMouseMove,
      onMouseLeave,
    );
  }
  createGraphLabels(group, geometry);
};

export const redrawChart = (
  data: DonutData,
  year: number,
  geometry: UnrolledGeometry,
  onMouseOver: (event: MouseEvent, data: [string, IndicatorData]) => void,
) => {
  // Redraw Central Region
  redrawSocialGraphSegments(geometry);
  redrawEcologicalGraphSegments(geometry);
  redrawGraphLabels(geometry);

  // Redraw the Social Bars
  for (const [Half, properties] of Object.entries(data.social)) {
    const xScale = scaleBand()
      .range(Half === "global" ? [0, 0.5] : [0.5, 1])
      .domain(Object.keys(properties));

    const PropertiesEntries = Object.entries(properties);
    redrawSocialIcons(PropertiesEntries, geometry, xScale, onMouseOver);
    redrawShortfallBars(PropertiesEntries, geometry, xScale, year);
  }

  // Redraw the Ecological Bars
  for (const [Half, Properties] of Object.entries(data.ecological)) {
    const xScale = scaleBand()
      .range(Half === "global" ? [0, 0.5] : [0.5, 1])
      .domain(Object.keys(Properties));

    const PropertiesEntries = Object.entries(Properties);
    redrawEcologicalIcons(PropertiesEntries, geometry, xScale, onMouseOver);
    redrawOvershootBars(PropertiesEntries, geometry, xScale, year);
  }
};
