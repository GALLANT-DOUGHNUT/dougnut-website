import { scaleBand, scaleRadial, type ScaleBand } from "d3-scale"
import type { DonutGeometry } from "../components/DonutChart/DonutChart"
import { type Selection } from "d3-selection"
import { initializeGraphRingSegment } from "./DonutHelpers"
import theme from "../theme"
import type { DomainData } from "../types/DonutData"
import { arc } from "d3-shape"
import Icons from "../Icons"
import { easeLinear } from "d3-ease"
import { interpolate } from "d3-interpolate"

const socialSamples = [
  {
    name: "Education-Sample",
    quarter: "local_social",
    symbolId: "Education_black.png",
  },
  {
    name: "Housing-Sample",
    quarter: "local_social",
    symbolId: "Housing_black.png",
  },
  {
    name: "Food-Sample",
    quarter: "local_social",
    symbolId: "Food_black.png",
  },
] as DomainData[]

const ecologicalSamples = [
  {
    name: "AirPollution-Sample",
    quarter: "local_social",
    symbolId: "AirPollution_black.png",
  },
  {
    name: "CleanseTheAir-Sample",
    quarter: "local_social",
    symbolId: "CleanseTheAir_black.png",
  },
  {
    name: "RegulateTheTemperature-Sample",
    quarter: "local_social",
    symbolId: "RegulateTheTemperature_black.png",
  },
] as DomainData[]

const initialiseIcon = (
  group: Selection<SVGGElement, unknown, null, undefined>,
  domain: DomainData,
) => {
  return group
    .append("g")
    .selectAll("g")
    .data([domain])
    .enter()
    .append("g")
    .attr("text-anchor", "middle")
}

const styleText = (
  text: Selection<SVGTextPathElement, unknown, null, undefined>,
) => {
  return text
    .style("alignment-baseline", "middle")
    .style("dominant-baseline", "middle")
    .style("fill", theme.palette.common.white)
    .style("font-size", 14 + "px")
    .style("font-weight", 600)
    .style("letter-spacing", "0.001em")
    .style("text-anchor", "middle")
    .style("user-select", "none")
    .style("cursor", "default")
    .attr("startOffset", "50%")
    .attr("dy", ".1em")
}

const sizeIcon = (
  group: Selection<SVGGElement, DomainData, SVGGElement, unknown>,
  smallRingRadius: number,
  fullDonut: boolean,
) => {
  const sizing = fullDonut ? 2.2 : 1.95
  return group
    .append("svg:image")
    .attr("x", -smallRingRadius + 5)
    .attr("y", -smallRingRadius + 5)
    .attr("width", smallRingRadius / sizing)
    .attr("height", smallRingRadius / sizing)
    .attr("opacity", fullDonut ? 0.15 : 1)
    .attr("xlink:href", function (d: DomainData) {
      const imgRef = d.symbolId.substring(
        0,
        d.symbolId.length - 4,
      ) as keyof typeof Icons
      return Icons[imgRef]
    })
}

export const CreateShortfallIcon = (
  domain: DomainData,
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: DonutGeometry,
  xScale: ScaleBand<string>,
  fullDonut: boolean,
) => {
  const { smallRingRadius, ringRadius } = geometry
  const rotate = fullDonut ? 2.1 : 2.4

  const icon = initialiseIcon(group, domain).attr(
    "transform",
    function (d: DomainData) {
      const Rotation =
        ((xScale(d.name)! + xScale.bandwidth() / 2) * 180) / Math.PI - 90
      return `rotate(${Rotation}) translate(${smallRingRadius * rotate},0) rotate(${-Rotation})`
    },
  )

  sizeIcon(icon, smallRingRadius, fullDonut)
    .attr("id", (d: DomainData) => {
      const iconName = d.name.split(" ").join("_").toLowerCase()
      return iconName + "_" + d.quarter + "_shortfall_img"
    })
    .style("cursor", "pointer")
    .attr("transform", `translate(${ringRadius / 2}, ${ringRadius / 2})`)
}

export const CreateEcologicalIcon = (
  domain: DomainData,
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: DonutGeometry,
  xScale: ScaleBand<string>,
  fullDonut: boolean,
) => {
  const { smallRingRadius, ringRadius } = geometry
  const rotate = fullDonut ? 2.8 : 2.3

  const icon = initialiseIcon(group, domain).attr(
    "transform",
    function (d: DomainData) {
      const Rotation =
        ((xScale(d.name)! + xScale.bandwidth() / 2) * 180) / Math.PI - 90
      return `rotate(${Rotation}) translate(${smallRingRadius * rotate},0) rotate(${-Rotation})`
    },
  )

  sizeIcon(icon, smallRingRadius, fullDonut)
    .attr("id", (d: DomainData) => {
      const iconName = d.name.split(" ").join("_").toLowerCase()
      return iconName + "_" + d.quarter + "_shortfall_img"
    })
    .style("cursor", "pointer")
    .attr("transform", `translate(${ringRadius / 2}, ${ringRadius / 2})`)
}

const CreateFoundationLabel = (
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: DonutGeometry,
) => {
  const { innerTextRadius } = geometry

  group
    .append("path")
    .attr("id", "foundation-label")
    .attr(
      "d",
      `M -${innerTextRadius - 0.7},0 A ${innerTextRadius - 0.7} ${
        innerTextRadius - 0.7
      } 0 0 1 ${innerTextRadius - 0.5} 0`,
    )
    .attr("transform", `rotate(${2})`)
    .style("fill", "none")
    .style("stroke", "0")

  const foundationText = group.append("g").append("text").append("textPath")
  foundationText.attr("xlink:href", "#foundation-label")
  styleText(foundationText).text("SOCIAL FOUNDATION")
}

const CreateCeilingLabel = (
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: DonutGeometry,
) => {
  const { outerTextRadius } = geometry

  group
    .append("path")
    .attr("id", "ceiling-label")
    .attr(
      "d",
      `M -${outerTextRadius - 0.7},0 A ${outerTextRadius - 0.5} ${
        outerTextRadius - 0.5
      } 0 0 1 ${outerTextRadius - 0.5} 0`,
    )
    .attr("transform", `rotate(${340})`)
    .style("fill", "none")
    .style("stroke", "0")

  const ceilingText = group.append("g").append("text").append("textPath")
  ceilingText.attr("xlink:href", "#ceiling-label")
  styleText(ceilingText).text("ECOLOGICAL CEILING")
}

const CreateSafeZoneLabels = (
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: DonutGeometry,
) => {
  const { outerTextRadius, innerTextRadius } = geometry

  group
    .append("path")
    .attr("id", "safezone-ceiling-label")
    .attr(
      "d",
      `M -${outerTextRadius + 30},0 A ${outerTextRadius + 30} ${
        outerTextRadius + 30
      } 0 0 1 ${outerTextRadius + 30} 0`,
    )
    .attr("transform", `rotate(${1})`)
    .style("fill", "none")
    .style("stroke", "0")

  const ceilingText = group.append("g").append("text").append("textPath")
  ceilingText.attr("xlink:href", "#safezone-ceiling-label")
  styleText(ceilingText).text("ECOLOGICAL CEILING")

  group
    .append("path")
    .attr("id", "safezone-foundation-label") //Unique id of the path
    .attr(
      "d",
      `M -${innerTextRadius - 12},0 A ${innerTextRadius - 12} ${
        innerTextRadius - 12
      } 0 0 1 ${innerTextRadius - 12} 0`,
    ) //SVG path
    .attr("transform", `rotate(${2})`)
    .style("fill", "none")
    .style("stroke", "0")

  const foundationText = group.append("g").append("text").append("textPath")
  foundationText.attr("xlink:href", "#safezone-foundation-label")
  styleText(foundationText).text("SOCIAL FOUNDATION")

  group
    .append("path")
    .attr("id", "safezone-label")
    .attr(
      "d",
      `M -${innerTextRadius + 45},0 A ${innerTextRadius + 45} ${
        innerTextRadius + 45
      } 0 0 1 ${innerTextRadius + 45} 0`,
    )
    .attr("transform", `rotate(${2})`)
    .style("fill", "none")
    .style("stroke", "0")

  const safezoneText = group.append("g").append("text").append("textPath")
  safezoneText.attr("xlink:href", "#safezone-label")
  styleText(safezoneText)
    .style("font-size", 42 + "px")
    .style("font-weight", 600)
    .text("SAFE ZONE")
}

export const GenerateSocialPreview = (
  geometry: DonutGeometry,
  group: Selection<SVGGElement, unknown, null, undefined>,
) => {
  const { margin, innerRadius, ringRadius } = geometry
  const yInner = scaleRadial()
    .range([innerRadius - ringRadius / 2 - 4 * margin, 10]) //This is 10 because the inner part of the graph would become too pointy
    .domain([0, 100])

  const socialValues = [96, 47, 6]
  socialSamples.forEach((i, index) => {
    const { innerRadius, smallRingRadius, ringRadius } = geometry

    const xScale = scaleBand()
      // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .range([1.72 * Math.PI, 2.36 * Math.PI])
      .align(0) // This does nothing
      .domain(socialSamples.map((s) => s.name)) // The domain of the X axis is the list of states.

    // Social Ring Boundary
    initializeGraphRingSegment(
      group,
      i,
      theme.palette.common.socialBoundary,
    ).attr(
      "d",
      arc<DomainData>()
        .innerRadius(innerRadius - ringRadius / 1.7)
        .outerRadius(innerRadius + 45 - ringRadius / 2)
        .startAngle((d: DomainData) => xScale(d.name)! - 0.01) //The -.01 is to fix slight gaps
        .endAngle((d: DomainData) => xScale(d.name)! + xScale.bandwidth())
        .padAngle(0)
        .padRadius(innerRadius),
    )

    // Social Ring Interior
    initializeGraphRingSegment(group, i, theme.palette.common.social).attr(
      "d",
      arc<DomainData>()
        .innerRadius(innerRadius - smallRingRadius / 2.5)
        .outerRadius(innerRadius + smallRingRadius / 2.1)
        .startAngle((d: DomainData) => xScale(d.name)! - 0.01) //The -.01 is to fix slight gaps
        .endAngle((d: DomainData) => xScale(d.name)! + xScale.bandwidth())
        .padAngle(0)
        .padRadius(innerRadius),
    )

    CreateShortfallIcon(i, group, geometry, xScale, false)

    group
      .append("g")
      .selectAll("path")
      .data([i])
      .enter()
      .append("path")
      .attr("class", "GraphColumn")
      .attr("fill", theme.palette.common.arc)
      .attr("id", (d: DomainData) => `${d.name}_sample_arc_social`)
      .transition()
      .duration(500)
      .ease(easeLinear)
      .attrTween("d", function (d: DomainData) {
        const inner = innerRadius - ringRadius / 2 - 4 * margin
        const outerRadius = yInner(socialValues[index])
        const interpolateRadius = interpolate(inner, outerRadius)

        const arcGen = arc<DomainData>()
          .innerRadius(inner)
          .startAngle(xScale(d.name)!)
          .endAngle(xScale(d.name)! + xScale.bandwidth())
          .padAngle(margin / 100)
          .padRadius(0.4 * innerRadius)

        return (t: number) => {
          const currentOuter = interpolateRadius(t)
          arcGen.outerRadius(currentOuter)
          return arcGen(d)!
        }
      })
  })

  // Add the "Social Foundation" label
  CreateFoundationLabel(group, geometry)

  // Draw the "Shortfall" arrow
  const shortfallX = [-110, -23]
  const shortfallY = [-70, 0]

  group
    .append("line")
    .attr("x1", shortfallX[0])
    .attr("y1", shortfallY[0])
    .attr("x2", shortfallX[1])
    .attr("y2", shortfallY[1])
    .attr("stroke-width", 3)
    .attr("stroke", "black")
    .attr("marker-end", "url(#triangle)")

  group
    .append("svg:defs")
    .append("svg:marker")
    .attr("id", "triangle")
    .attr("refX", 4)
    .attr("refY", 4)
    .attr("markerWidth", 16)
    .attr("markerHeight", 16)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M 0 0 7 4 0 7 1.8 4")
    .style("fill", "black")

  const shortfallMidX = (shortfallX[0] + shortfallX[1]) / 2
  const shortfallMidY = (shortfallY[0] + shortfallY[1]) / 2

  const shortfallAngle =
    (Math.atan2(shortfallY[1] - shortfallY[0], shortfallX[1] - shortfallX[0]) *
      180) /
    Math.PI

  group
    .append("text")
    .attr("x", shortfallMidX - 4)
    .attr("y", shortfallMidY + 20)
    .attr(
      "transform",
      `rotate(${shortfallAngle}, ${shortfallMidX}, ${shortfallMidY})`,
    )
    .attr("text-anchor", "middle")
    .style("font-size", 16 + "px")
    .style("font-weight", 600)
    .style("letter-spacing", "0.018em")
    .text("Shortfall")
}

export const GenerateEcologicalPreview = (
  geometry: DonutGeometry,
  group: Selection<SVGGElement, unknown, null, undefined>,
) => {
  const { margin, innerRadius, ringRadius, outerRadius } = geometry
  const yOuter = scaleRadial()
    .range([innerRadius + ringRadius / 2 + margin, 1.05 * outerRadius]) // Domain will be define later.
    .domain([0, 140]) // Domain of Y is from 0 to the max seen in the data

  const ecologicalValues = [13, 61, 94]
  ecologicalSamples.forEach((i, index) => {
    const { innerRadius, smallRingRadius, ringRadius } = geometry

    const xScale = scaleBand()
      // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .range([1.58 * Math.PI, 2.16 * Math.PI])
      .align(0) // This does nothing
      .domain(ecologicalSamples.map((s) => s.name)) // The domain of the X axis is the list of states.

    // Ecological Ring Boundary
    initializeGraphRingSegment(
      group,
      i,
      theme.palette.common.ecologicalBoundary,
    ).attr(
      "d",
      arc<DomainData>()
        .innerRadius(innerRadius - 26 + ringRadius / 2)
        .outerRadius(innerRadius + ringRadius / 2)
        .startAngle((d: DomainData) => xScale(d.name)! - 0.01) //The -.01 is to fix slight gaps
        .endAngle((d: DomainData) => xScale(d.name)! + xScale.bandwidth())
        .padAngle(0)
        .padRadius(innerRadius),
    )

    // Ecological Ring Interior
    initializeGraphRingSegment(group, i, theme.palette.common.ecological).attr(
      "d",
      arc<DomainData>()
        .innerRadius(innerRadius - 67 + smallRingRadius / 2)
        .outerRadius(innerRadius - 15 + smallRingRadius / 2)
        .startAngle((d: DomainData) => xScale(d.name)! - 0.01) //The -.01 is to fix slight gaps
        .endAngle((d: DomainData) => xScale(d.name)! + xScale.bandwidth())
        .padAngle(0)
        .padRadius(innerRadius),
    )

    CreateEcologicalIcon(i, group, geometry, xScale, false)

    group
      .append("g")
      .selectAll("path")
      .data([i])
      .enter()
      .append("path")
      .attr("class", "GraphColumn")
      .attr("fill", theme.palette.common.arc)
      .attr("id", (d: DomainData) => `${d.name}_sample_arc_ecological`)
      .transition()
      .duration(500)
      .ease(easeLinear)
      .attrTween("d", (d: DomainData) => {
        const inner = innerRadius + ringRadius / 2 + margin
        const finalOuter = yOuter(ecologicalValues[index])
        const interpolateRadius = interpolate(inner, finalOuter)

        return (t: number) => {
          const currentOuter = interpolateRadius(t)

          return arc<DomainData>()
            .innerRadius(inner)
            .outerRadius(currentOuter)
            .startAngle(xScale(d.name)!)
            .endAngle(xScale(d.name)! + xScale.bandwidth())
            .padAngle(margin / 100)
            .padRadius(innerRadius)(d)!
        }
      })
  })

  // Add the "Ecological Ceiling" label
  CreateCeilingLabel(group, geometry)

  // Draw the "Overshoot" arrow
  const overshootX = [104, 162]
  const overshootY = [-155, -249]

  group
    .append("line")
    .attr("x1", overshootX[0])
    .attr("y1", overshootY[0])
    .attr("x2", overshootX[1])
    .attr("y2", overshootY[1])
    .attr("stroke-width", 3)
    .attr("stroke", "black")
    .attr("marker-end", "url(#triangle)")

  group
    .append("svg:defs")
    .append("svg:marker")
    .attr("id", "triangle")
    .attr("refX", 4)
    .attr("refY", 4)
    .attr("markerWidth", 16)
    .attr("markerHeight", 16)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M 0 0 7 4 0 7 1.8 4")
    .style("fill", "black")

  const midX = (overshootX[0] + overshootX[1]) / 2
  const midY = (overshootY[0] + overshootY[1]) / 2

  const angle =
    (Math.atan2(overshootY[1] - overshootY[0], overshootX[1] - overshootX[0]) *
      180) /
    Math.PI

  group
    .append("text")
    .attr("x", midX - 4)
    .attr("y", midY + 20)
    .attr("transform", `rotate(${angle}, ${midX}, ${midY})`)
    .attr("text-anchor", "middle")
    .style("font-size", 16 + "px")
    .style("font-weight", 600)
    .style("letter-spacing", "0.018em")
    .text("Overshoot")
}

export const GenerateSafeZone = (
  geometry: DonutGeometry,
  group: Selection<SVGGElement, unknown, null, undefined>,
) => {
  socialSamples.forEach((i) => {
    const { innerRadius, smallRingRadius, ringRadius } = geometry
    const xScale = scaleBand()
      // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .range([1.7 * Math.PI, 2.3 * Math.PI])
      .align(0) // This does nothing
      .domain(socialSamples.map((s) => s.name)) // The domain of the X axis is the list of states.

    // Social Ring Boundary
    initializeGraphRingSegment(
      group,
      i,
      theme.palette.common.socialBoundary,
    ).attr(
      "d",
      arc<DomainData>()
        .innerRadius(innerRadius - ringRadius / 1.4)
        .outerRadius(innerRadius + 45 - ringRadius / 2)
        .startAngle((d: DomainData) => xScale(d.name)! - 0.01) //The -.01 is to fix slight gaps
        .endAngle((d: DomainData) => xScale(d.name)! + xScale.bandwidth())
        .padAngle(0)
        .padRadius(innerRadius),
    )

    // Social Ring Interior
    initializeGraphRingSegment(group, i, theme.palette.common.social).attr(
      "d",
      arc<DomainData>()
        .innerRadius(innerRadius - smallRingRadius / 1.8)
        .outerRadius(innerRadius + smallRingRadius / 5.5)
        .startAngle((d: DomainData) => xScale(d.name)! - 0.01) //The -.01 is to fix slight gaps
        .endAngle((d: DomainData) => xScale(d.name)! + xScale.bandwidth())
        .padAngle(0)
        .padRadius(innerRadius),
    )

    CreateShortfallIcon(i, group, geometry, xScale, true)
  })

  const ecologicalPadded = [
    ...ecologicalSamples,
    {
      name: "HouseBiodiversity-Sample",
      quarter: "local_ecological",
      symbolId: "HouseBiodiversity_black.png",
    },
  ] as DomainData[]

  ecologicalPadded.forEach((i) => {
    const { innerRadius, smallRingRadius, ringRadius } = geometry
    const xScale = scaleBand()
      // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .range([1.7 * Math.PI, 2.3 * Math.PI])
      .align(0) // This does nothing
      .domain(ecologicalPadded.map((s) => s.name)) // The domain of the X axis is the list of states.

    // Ecological Ring Boundary
    initializeGraphRingSegment(
      group,
      i,
      theme.palette.common.ecologicalBoundary,
    ).attr(
      "d",
      arc<DomainData>()
        .innerRadius(innerRadius - 12 + ringRadius / 2)
        .outerRadius(innerRadius + ringRadius / 1.1)
        .startAngle((d: DomainData) => xScale(d.name)! - 0.01) //The -.01 is to fix slight gaps
        .endAngle((d: DomainData) => xScale(d.name)! + xScale.bandwidth())
        .padAngle(0)
        .padRadius(innerRadius),
    )

    // Ecological Ring Interior
    initializeGraphRingSegment(group, i, theme.palette.common.ecological).attr(
      "d",
      arc<DomainData>()
        .innerRadius(innerRadius - 21 + smallRingRadius / 2)
        .outerRadius(innerRadius + smallRingRadius / 1.15)
        .startAngle((d: DomainData) => xScale(d.name)! - 0.01) //The -.01 is to fix slight gaps
        .endAngle((d: DomainData) => xScale(d.name)! + xScale.bandwidth())
        .padAngle(0)
        .padRadius(innerRadius),
    )

    // CreateShortfallIcon(i, group, geometry, xScale, true)
    CreateEcologicalIcon(i, group, geometry, xScale, true)
  })

  // Add the Safezone labels
  CreateSafeZoneLabels(group, geometry)
}
