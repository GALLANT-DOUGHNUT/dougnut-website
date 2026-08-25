import { scaleBand, type ScaleRadial } from "d3-scale";
import type { DonutGeometry } from "../components/DonutChart/DonutChart";
import { select, type Selection } from "d3-selection";
import { CreateInnerIconRing, initializeGraphRingSegment } from "./DonutHelpers";
import theme from "../theme";
import type { DomainData } from "../types/DonutData";
import { arc } from "d3-shape";

export const GenerateSocialPreview = (
  geometry: DonutGeometry,
  group: Selection<SVGGElement, unknown, null, undefined>,
//   yInner: ScaleRadial<number, number, never>,
) => {
  //   const group = svg
  //     .append("g")
  //     .attr("transform", "translate(" + size / 2 + "," + size / 2 + ")");

  //   CreateInnerRingSegment(sd, group, geometry, xScale);
  const samples = [{name: "Education",  quarter: "local_social", symbolId: "Education_black.png"}] as DomainData[]

  [0, 1, 2].forEach((i) => {
    const { innerRadius, smallRingRadius, ringRadius } = geometry;

    const xScale = scaleBand()
      // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .range([Math.PI / 2, Math.PI * 0.9])
      .align(0) // This does nothing
      .domain(["0", "1", "2"]); // The domain of the X axis is the list of states.

    // Social Ring Boundary
    initializeGraphRingSegment(
      group,
      {name: i.toString()} as DomainData,
      theme.palette.common.socialBoundary,
    ).attr(
      "d",
      arc<DomainData>()
        .innerRadius(innerRadius - ringRadius / 2)
        .outerRadius(innerRadius + 45 - ringRadius / 2)
        .startAngle((d: DomainData) => xScale(d.name)! - 0.01) //The -.01 is to fix slight gaps
        .endAngle((d: DomainData) => xScale(d.name)! + xScale.bandwidth())
        .padAngle(0)
        .padRadius(innerRadius),
    );

    // Social Ring Interior
    initializeGraphRingSegment(group, {name: i.toString()} as DomainData, theme.palette.common.social).attr(
      "d",
      arc<DomainData>()
        .innerRadius(innerRadius - smallRingRadius / 2)
        .outerRadius(innerRadius + smallRingRadius / 2)
        .startAngle((d: DomainData) => xScale(d.name)! - 0.01) //The -.01 is to fix slight gaps
        .endAngle((d: DomainData) => xScale(d.name)! + xScale.bandwidth())
        .padAngle(0)
        .padRadius(innerRadius),
    );

        CreateInnerIconRing(
      {...samples[0], name: i.toString()},
      group,
      geometry,
      xScale,
      () => {},
      () => {},
      () => {},
      () => {},
    );
  });


  //   CreateIconRingLabels(group, geometry);
};
