import { scaleBand, type ScaleBand, type ScaleRadial } from "d3-scale";
import Icons from "../Icons";
import type { DonutData, IndicatorData } from "../types/DonutData";
import { select, type Selection } from "d3-selection";
import type { DonutGeometry } from "../components/DonutChart/DonutChart";
import { arc } from "d3-shape";
import "d3-transition";
import { interpolate } from "d3-interpolate";
import { easeLinear } from "d3-ease";

type Datum = [string, { value: Record<string, number>; quarter?: string }];

export const findIconSrc = (symbolId: string) => {
  const symbolIdWithoutPng = symbolId?.substring(
    0,
    symbolId.length - 4,
  ) as keyof typeof Icons;
  return Icons[symbolIdWithoutPng];
};

export const formatConnectionName = (connectionName: string) => {
  const split = connectionName.split("_");

  const capitalized = split.map((word) => {
    if (word === "the") return word;
    return word[0].toUpperCase() + word.substring(1);
  });

  return capitalized.join(" ");
};

export const yearHasData = (value: number | null | undefined) => {
  if (value === null || value === undefined || value < 0) {
    return false;
  }
  return true;
};

const initializeArcSegment = (
  group: Selection<SVGGElement, unknown, null, undefined>,
  Properties: [string, IndicatorData][],
  type: "inner" | "outer",
  year: number,
) => {
  const idString = type === "inner" ? "_inner" : "_outer";

  return group
    .append("g")
    .selectAll("path")
    .data(Properties)
    .enter()
    .append("path")
    .attr("class", "GraphColumn")
    .attr("fill", (d: Datum) =>
      d[1].value[`${year}`] === -1 ? "#cfcfcf" : "#ff7518",
    )
    .attr(
      "id",
      (d: Datum) =>
        `${d[0]}${idString}_${d[1].quarter?.includes("local") ? "local" : "global"}`,
    );
};

const initializeGraphRingSegment = (
  group: Selection<SVGGElement, unknown, null, undefined>,
  Properties: [string, IndicatorData][],
  fillColor: string,
) => {
  return group
    .append("g")
    .selectAll("path")
    .data(Properties)
    .enter()
    .append("path")
    .attr("class", "GraphRingSegment")
    .attr("fill", fillColor);
};

function CreateShortfallArc(
  Properties: [string, IndicatorData][],
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: DonutGeometry,
  xScale: ScaleBand<string>,
  yInner: ScaleRadial<number, number, never>,
  year: number,
) {
  const { innerRadius, ringRadius, margin } = geometry;

  initializeArcSegment(group, Properties, "inner", year)
    .transition()
    .duration(500)
    .ease(easeLinear)
    .attrTween("d", function (d: Datum) {
      const inner = innerRadius - ringRadius / 2 - margin;
      const outerRadius = yInner(
        yearHasData(d[1].value[`${year}`]) ? d[1].value[`${year}`] : 100,
      );
      const interpolateRadius = interpolate(inner, outerRadius);

      const arcGen = arc<Datum>()
        .innerRadius(inner)
        .startAngle(xScale(d[0])!)
        .endAngle(xScale(d[0])! + xScale.bandwidth())
        .padAngle(margin / 100)
        .padRadius(0.4 * innerRadius);

      return (t: number) => {
        const currentOuter = interpolateRadius(t);
        arcGen.outerRadius(currentOuter);
        return arcGen(d)!;
      };
    });
}

function CreateOvershootArc(
  Properties: [string, IndicatorData][],
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: DonutGeometry,
  xScale: ScaleBand<string>,
  yOuter: ScaleRadial<number, number, never>,
  year: number,
) {
  const { innerRadius, ringRadius, margin } = geometry;

  initializeArcSegment(group, Properties, "outer", year)
    .transition()
    .duration(500)
    .ease(easeLinear)
    .attrTween("d", (d: Datum) => {
      const inner = innerRadius + ringRadius / 2 + margin;
      const finalOuter = yOuter(
        yearHasData(d[1].value[`${year}`]) ? d[1].value[`${year}`] : 100,
      );
      const interpolateRadius = interpolate(inner, finalOuter);

      return (t: number) => {
        const currentOuter = interpolateRadius(t);

        return arc<Datum>()
          .innerRadius(inner)
          .outerRadius(currentOuter)
          .startAngle(xScale(d[0])!)
          .endAngle(xScale(d[0])! + xScale.bandwidth())
          .padAngle(margin / 100)
          .padRadius(innerRadius)(d)!;
      };
    });
}

const AdjustShortfallArcs = (
  Properties: [string, IndicatorData][],
  geometry: DonutGeometry,
  xScale: ScaleBand<string>,
  yInner: ScaleRadial<number, number, never>,
  prevYear: number,
  year: number,
  onMouseOver: (event: MouseEvent, data: [string, IndicatorData]) => void,
) => {
  const { innerRadius, ringRadius, margin } = geometry;

  Properties.forEach((indicator: [string, IndicatorData]) => {
    const arcType = "_inner";
    const locality = indicator[1].quarter.includes("local")
      ? "_local"
      : "_global";

    const propertyId = `${indicator[0]}${arcType}${locality}`;
    const escaped = CSS.escape(propertyId);
    const selection = select(`#${escaped}`) as Selection<
      SVGPathElement,
      Datum,
      HTMLElement,
      unknown
    >;

    selection
      .transition()
      .duration(500)
      .ease(easeLinear)
      .attrTween("d", (d: Datum) => {
        const inner = innerRadius - ringRadius / 2 - margin;
        const prevOuter = yearHasData(indicator[1].value[`${prevYear}`])
          ? indicator[1].value[`${prevYear}`]
          : 100;

        const newOuter = yearHasData(indicator[1].value[`${year}`])
          ? indicator[1].value[`${year}`]
          : 100;

        const interpolateOuterRadius = interpolate(prevOuter, newOuter);

        const arcGen = arc<Datum>()
          .innerRadius(inner)
          .startAngle(xScale(d[0])!)
          .endAngle(xScale(d[0])! + xScale.bandwidth())
          .padAngle(margin / 100)
          .padRadius(0.4 * innerRadius);

        return (t: number) => {
          const value = interpolateOuterRadius(t);
          const currentOuter = Math.min(yInner(value), inner - 0.0005); // Small delta required here to prevent arcs vanishing instantaneously
          return arcGen.outerRadius(currentOuter)(d)!;
        };
      });

    const imgIconId = indicator[0] + "_" + indicator[1].quarter + "_inner_img";
    const escapedImg = CSS.escape(imgIconId);
    const imgIcon = select<SVGImageElement, [string, IndicatorData]>(
      `#${escapedImg}`,
    );
    imgIcon.on("mouseover", onMouseOver);
  });
};

const AdjustOvershootArcs = (
  Properties: [string, IndicatorData][],
  geometry: DonutGeometry,
  xScale: ScaleBand<string>,
  yOuter: ScaleRadial<number, number, never>,
  prevYear: number,
  year: number,
  onMouseOver: (event: MouseEvent, data: [string, IndicatorData]) => void,
) => {
  const { innerRadius, ringRadius, margin } = geometry;

  Properties.forEach((indicator: [string, IndicatorData]) => {
    const arcType = "_outer";
    const locality = indicator[1].quarter.includes("local")
      ? "_local"
      : "_global";

    const propertyId = `${indicator[0]}${arcType}${locality}`;
    const escaped = CSS.escape(propertyId);
    const selection = select(`#${escaped}`) as Selection<
      SVGPathElement,
      Datum,
      HTMLElement,
      unknown
    >;

    selection
      .transition()
      .duration(500)
      .ease(easeLinear)
      .attrTween("d", (d: Datum) => {
        const inner = innerRadius + ringRadius / 2 + margin;
        const prevOuter = yearHasData(indicator[1].value[`${prevYear}`])
          ? indicator[1].value[`${prevYear}`]
          : 100;

        const newOuter = yearHasData(indicator[1].value[`${year}`])
          ? indicator[1].value[`${year}`]
          : 100;

        const interpolateOuterRadius = interpolate(prevOuter, newOuter);

        const arcGen = arc<Datum>()
          .innerRadius(inner)
          .startAngle(xScale(d[0])!)
          .endAngle(xScale(d[0])! + xScale.bandwidth())
          .padAngle(margin / 100)
          .padRadius(innerRadius);

        return (t: number) => {
          const value = interpolateOuterRadius(t);
          const currentOuter = Math.max(yOuter(value), inner + 0.00005); // Small delta required here to prevent arcs vanishing instantaneously
          return arcGen.outerRadius(currentOuter)(d)!;
        };
      });

    const imgIconId = indicator[0] + "_outer_img";
    const escapedImg = CSS.escape(imgIconId);
    const imgIcon = select<SVGImageElement, [string, IndicatorData]>(
      `#${escapedImg}`,
    );
    imgIcon.on("mouseover", onMouseOver);
  });
};

function CreateInnerRingSegment(
  Properties: [string, IndicatorData][],
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: DonutGeometry,
  xScale: ScaleBand<string>,
) {
  const { innerRadius, smallRingRadius, ringRadius } = geometry;

  // Social Ring Boundary
  initializeGraphRingSegment(group, Properties, "#487c3a").attr(
    "d",
    arc<Datum>()
      .innerRadius(innerRadius - ringRadius / 2)
      .outerRadius(innerRadius + 45 - ringRadius / 2)
      .startAngle((d: Datum) => xScale(d[0])! - 0.01) //The -.01 is to fix slight gaps
      .endAngle((d: Datum) => xScale(d[0])! + xScale.bandwidth())
      .padAngle(0)
      .padRadius(innerRadius),
  );

  // Social Ring Interior
  initializeGraphRingSegment(group, Properties, "#8fc53b").attr(
    "d",
    arc<Datum>()
      .innerRadius(innerRadius - smallRingRadius / 2)
      .outerRadius(innerRadius + smallRingRadius / 2)
      .startAngle((d: Datum) => xScale(d[0])! - 0.01) //The -.01 is to fix slight gaps
      .endAngle((d: Datum) => xScale(d[0])! + xScale.bandwidth())
      .padAngle(0)
      .padRadius(innerRadius),
  );

  // Ecological Ring Boundary
  initializeGraphRingSegment(group, Properties, "#297c8e").attr(
    "d",
    arc<Datum>()
      .innerRadius(innerRadius - 20 + ringRadius / 2)
      .outerRadius(innerRadius + ringRadius / 2)
      .startAngle((d: Datum) => xScale(d[0])! - 0.01) //The -.01 is to fix slight gaps
      .endAngle((d: Datum) => xScale(d[0])! + xScale.bandwidth())
      .padAngle(0)
      .padRadius(innerRadius),
  );

  // Ecological Ring Interior
  initializeGraphRingSegment(group, Properties, "#39adc6").attr(
    "d",
    arc<Datum>()
      .innerRadius(innerRadius - 36 + smallRingRadius / 2)
      .outerRadius(innerRadius + smallRingRadius / 2)
      .startAngle((d: Datum) => xScale(d[0])! - 0.01) //The -.01 is to fix slight gaps
      .endAngle((d: Datum) => xScale(d[0])! + xScale.bandwidth())
      .padAngle(0)
      .padRadius(innerRadius),
  );
}

const ApplyLabelStyles = (
  group: Selection<SVGTextPathElement, unknown, null, undefined>,
  href: string,
  text: string,
) => {
  group
    .attr("xlink:href", href)
    .style("alignment-baseline", "middle")
    .style("dominant-baseline", "middle")
    .style("fill", "white")
    .style("font-size", 12 + "px")
    .style("letter-spacing", "0.001em")
    .style("text-anchor", "middle")
    .style("user-select", "none")
    .style("cursor", "default")
    .attr("startOffset", "50%")
    .attr("dy", ".1em")
    .text(text);
};

function CreateIconRingLabels(
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: DonutGeometry,
) {
  const { innerTextRadius, outerTextRadius } = geometry;

  group
    .append("path")
    .attr("id", "arc-top") //Unique id of the path
    .attr(
      "d",
      `M -${innerTextRadius - 0.5},0 A ${innerTextRadius - 0.5} ${
        innerTextRadius - 0.5
      } 0 0 1 ${innerTextRadius - 0.5} 0`,
    ) //SVG path
    .attr("dy", ".1em")
    .style("fill", "none")
    .style("stroke", "0");

  const gsText = group.append("g").append("text").append("textPath");
  ApplyLabelStyles(gsText, "#arc-top", "GLOBAL SOCIAL FOUNDATION");

  group
    .append("path")
    .attr("id", "arc-bottom") //Unique id of the path
    .attr(
      "d",
      `M -${innerTextRadius + 0.5},0 A ${innerTextRadius + 0.5} ${
        innerTextRadius + 0.5
      } 0 0 0 ${innerTextRadius + 0.5} 0`,
    ) //SVG path
    .style("fill", "none")
    .style("stroke", "0");

  const lsText = group.append("g").append("text").append("textPath");
  ApplyLabelStyles(lsText, "#arc-bottom", "LOCAL SOCIAL FOUNDATION");

  group
    .append("path")
    .attr("id", "lower-arc-bottom") //Unique id of the path
    .attr(
      "d",
      `M -${outerTextRadius + 0.5},0 A ${outerTextRadius + 0.5} ${
        outerTextRadius + 0.5
      } 0 0 0 ${outerTextRadius + 0.5} 0`,
    ) //SVG path
    .style("fill", "none")
    .style("stroke", "0");

  const leText = group.append("g").append("text").append("textPath");
  ApplyLabelStyles(leText, "#lower-arc-bottom", "LOCAL ECOLOGICAL CEILING");

  group
    .append("path")
    .attr("id", "upper-arc-top") //Unique id of the path
    .attr(
      "d",
      `M -${outerTextRadius - 0.5},0 A ${outerTextRadius - 0.5} ${
        outerTextRadius - 0.5
      } 0 0 1 ${outerTextRadius - 0.5} 0`,
    ) //SVG path
    .style("fill", "none")
    .style("stroke", "0");

  const geText = group.append("g").append("text").append("textPath");
  ApplyLabelStyles(geText, "#upper-arc-top", "GLOBAL ECOLOGICAL CEILING");
}

function CreateInnerIconRing(
  Properties: [string, IndicatorData][],
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: DonutGeometry,
  xScale: ScaleBand<string>,
  onIndicatorOpen: (properties: [string, IndicatorData]) => void,
  onMouseOver: (event: MouseEvent, data: [string, IndicatorData]) => void,
  onMouseMove: (event: MouseEvent) => void,
  onMouseLeave: (event: MouseEvent, data: [string, IndicatorData]) => void,
) {
  const { smallRingRadius, ringRadius } = geometry;

  group
    .append("g")
    .selectAll("g")
    .data(Properties)
    .enter()
    .append("g")
    .attr("text-anchor", "middle")
    .attr("transform", function (d: Datum) {
      const Rotation =
        ((xScale(d[0])! + xScale.bandwidth() / 2) * 180) / Math.PI - 90;
      return `rotate(${Rotation}) translate(${smallRingRadius * 1.92},0) rotate(${-Rotation})`;
    })
    .append("svg:image")
    .attr("x", -smallRingRadius + 14.5)
    .attr("y", -smallRingRadius + 15)
    .attr("width", smallRingRadius / 3.5)
    .attr("height", smallRingRadius / 3.7)
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
    .attr("transform", `translate(${ringRadius / 2}, ${ringRadius / 2})`)
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
}

function CreateOuterIconRing(
  Properties: [string, IndicatorData][],
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: DonutGeometry,
  xScale: ScaleBand<string>,
  onIndicatorOpen: (properties: [string, IndicatorData]) => void,
  onMouseOver: (event: MouseEvent, data: [string, IndicatorData]) => void,
  onMouseMove: (event: MouseEvent) => void,
  onMouseLeave: (event: MouseEvent, data: [string, IndicatorData]) => void,
) {
  const { smallRingRadius, ringRadius } = geometry;

  group
    .append("g")
    .selectAll("g")
    .data(Properties)
    .enter()
    .append("g")
    .attr("text-anchor", "middle")
    .attr("transform", function (d: Datum) {
      const Rotation =
        ((xScale(d[0])! + xScale.bandwidth() / 2) * 180) / Math.PI - 90;
      return `rotate(${Rotation}) translate(${smallRingRadius * 2.44},0) rotate(${-Rotation})`;
    })
    .append("svg:image")
    .attr("x", -smallRingRadius + 13.7)
    .attr("y", -smallRingRadius + 13.2)
    .attr("width", smallRingRadius / 3)
    .attr("height", smallRingRadius / 3)
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
    .attr("transform", `translate(${ringRadius / 2}, ${ringRadius / 2})`)
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
}

export const createDonutInnerSectors = (
  data: DonutData,
  year: number,
  geometry: DonutGeometry,
  group: Selection<SVGGElement, unknown, null, undefined>,
  yInner: ScaleRadial<number, number, never>,
  onIndicatorOpen: (properties: [string, IndicatorData]) => void,
  onMouseOver: (event: MouseEvent, data: [string, IndicatorData]) => void,
  onMouseMove: (event: MouseEvent) => void,
  onMouseLeave: (event: MouseEvent, data: [string, IndicatorData]) => void,
) => {
  for (const [Half, Properties] of Object.entries(data.social)) {
    const xScale = scaleBand()
      // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .range(
        Half === "global"
          ? [-Math.PI / 2, Math.PI / 2]
          : [Math.PI / 2, Math.PI * 1.5],
      )
      .align(0) // This does nothing
      .domain(Object.keys(Properties)); // The domain of the X axis is the list of states.

    const PropertiesEntries = Object.entries(Properties);
    CreateShortfallArc(
      PropertiesEntries,
      group,
      geometry,
      xScale,
      yInner,
      year,
    );
    CreateInnerRingSegment(PropertiesEntries, group, geometry, xScale);
    CreateInnerIconRing(
      PropertiesEntries,
      group,
      geometry,
      xScale,
      onIndicatorOpen,
      onMouseOver,
      onMouseMove,
      onMouseLeave,
    );
    CreateIconRingLabels(group, geometry);
  }
};

export const createDonutOuterSectors = (
  data: DonutData,
  year: number,
  geometry: DonutGeometry,
  group: Selection<SVGGElement, unknown, null, undefined>,
  yOuter: ScaleRadial<number, number, never>,
  onIndicatorOpen: (properties: [string, IndicatorData]) => void,
  onMouseOver: (event: MouseEvent, data: [string, IndicatorData]) => void,
  onMouseMove: (event: MouseEvent) => void,
  onMouseLeave: (event: MouseEvent, data: [string, IndicatorData]) => void,
) => {
  for (const [Half, Properties] of Object.entries(data.ecological)) {
    const xScale = scaleBand()
      .range(
        Half === "global"
          ? [-Math.PI / 2, Math.PI / 2]
          : [Math.PI / 2, Math.PI * 1.5],
      ) // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .align(0) // This does nothing
      .domain(Object.keys(Properties)); // The domain of the X axis is the list of states.

    const PropertiesEntries = Object.entries(Properties);
    CreateOvershootArc(
      PropertiesEntries,
      group,
      geometry,
      xScale,
      yOuter,
      year,
    );
    CreateOuterIconRing(
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

export const AdjustIndicatorArcs = (
  data: DonutData,
  prevYear: number,
  year: number,
  geometry: DonutGeometry,
  yOuter: ScaleRadial<number, number, never>,
  yInner: ScaleRadial<number, number, never>,
  onMouseOver: (event: MouseEvent, data: [string, IndicatorData]) => void,
) => {
  // Adjust Overshoot Arcs
  for (const [Half, Properties] of Object.entries(data.ecological)) {
    const xScale = scaleBand()
      .range(
        Half === "global"
          ? [-Math.PI / 2, Math.PI / 2]
          : [Math.PI / 2, Math.PI * 1.5],
      )
      .align(0)
      .domain(Object.keys(Properties));

    const PropertiesEntries = Object.entries(Properties);
    AdjustOvershootArcs(
      PropertiesEntries,
      geometry,
      xScale,
      yOuter,
      prevYear,
      year,
      onMouseOver,
    );
  }

  // Adjust Shortfall Arcs
  for (const [Half, Properties] of Object.entries(data.social)) {
    const xScale = scaleBand()
      // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .range(
        Half === "global"
          ? [-Math.PI / 2, Math.PI / 2]
          : [Math.PI / 2, Math.PI * 1.5],
      )
      .align(0) // This does nothing
      .domain(Object.keys(Properties)); // The domain of the X axis is the list of states.

    const PropertiesEntries = Object.entries(Properties);
    AdjustShortfallArcs(
      PropertiesEntries,
      geometry,
      xScale,
      yInner,
      prevYear,
      year,
      onMouseOver,
    );
  }
};
