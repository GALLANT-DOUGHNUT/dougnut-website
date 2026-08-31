import { scaleBand, type ScaleBand, type ScaleRadial } from "d3-scale"
import Icons from "../Icons"
import type { DomainData, Indicator } from "../types/DonutData"
import { select, type Selection } from "d3-selection"
import type { DonutGeometry } from "../components/DonutChart/DonutChart"
import { arc } from "d3-shape"
import "d3-transition"
import { interpolate } from "d3-interpolate"
import { easeLinear } from "d3-ease"
import theme from "../theme"

export const getArcId = (domain: DomainData) => {
  const arcId = domain.name.split(" ").join("_").toLowerCase()
  const arcRadius = domain.quarter.includes("ecological")
    ? "_overshoot"
    : "_shortfall"
  const arcLocality = domain.quarter.includes("local") ? "_local" : "_global"

  return `${arcId}${arcRadius}${arcLocality}`
}

export const findIconSrc = (symbolId: string) => {
  const symbolIdWithoutPng = symbolId?.substring(
    0,
    symbolId.length - 4,
  ) as keyof typeof Icons
  return Icons[symbolIdWithoutPng]
}

export const formatConnectionName = (connectionName: string) => {
  const split = connectionName.split("_")

  const capitalized = split.map((word) => {
    if (word === "the") return word
    return word[0].toUpperCase() + word.substring(1)
  })

  return capitalized.join(" ")
}

const isInRange = (baseline: number, target: number, value: number) => {
  if (baseline < target) {
    return value <= target && value >= baseline
  } else {
    return value >= target && value <= baseline
  }
}

export const findValue = (
  indicatorData: Indicator[],
  code: string | null,
  year: number,
) => {
  if (indicatorData.length === 0 || code === null) {
    return 100
  } else {
    const indicator = indicatorData.find((id) => id.indicatorCode === code)

    if (indicator) {
      const dataPoint = indicator.data.find((d) => d.year === year)
      const { baseline, target } = indicator

      if (dataPoint) {
        const { value } = dataPoint

        if (isInRange(baseline, target, value)) {
          // Handle + sign trends
          if (baseline > target) {
            const range = indicator.baseline - indicator.target
            return ((value - target) / range) * 100
          } else {
            // Handle - sign trends
            const range = indicator.target - indicator.baseline
            return ((target - value) / range) * 100
          }
        } else {
          if (baseline > target) {
            return value > baseline ? 100 : 0
          } else {
            return value < baseline ? 100 : 0
          }
        }
      }
    }
    return 100
  }
}

const initializeArcSegment = (
  group: Selection<SVGGElement, unknown, null, undefined>,
  domain: DomainData,
  type: "inner" | "outer",
) => {
  const arcName = domain.name.split(" ").join("_").toLowerCase()
  const idString = type === "inner" ? "_shortfall" : "_overshoot"

  return group
    .append("g")
    .selectAll("path")
    .data([domain])
    .enter()
    .append("path")
    .attr("class", "GraphColumn")
    .attr(
      "fill",
      domain.code ? theme.palette.common.arc : theme.palette.common.arcEmpty,
    )
    .attr(
      "id",
      (d: DomainData) =>
        `${arcName}${idString}_${d.quarter.includes("local") ? "local" : "global"}`,
    )
}

export const initializeGraphRingSegment = (
  group: Selection<SVGGElement, unknown, null, undefined>,
  domain: DomainData,
  fillColor: string,
) => {
  return group
    .append("g")
    .selectAll("path")
    .data([domain])
    .enter()
    .append("path")
    .attr("class", "GraphRingSegment")
    .attr("fill", fillColor)
}

const CreateShortfallArc = (
  domain: DomainData,
  indicatorCode: string | null,
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: DonutGeometry,
  xScale: ScaleBand<string>,
  yInner: ScaleRadial<number, number, never>,
  year: number,
) => {
  const { innerRadius, ringRadius, margin } = geometry
  let value: number = 100

  if (indicatorCode) {
    value = findValue(domain.indicators, indicatorCode, year)
  }

  initializeArcSegment(group, domain, "inner")
    .transition()
    .duration(500)
    .ease(easeLinear)
    .attrTween("d", function (d: DomainData) {
      const inner = innerRadius - ringRadius / 2 - margin
      const outerRadius = yInner(value)
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
}

const CreateOvershootArc = (
  domain: DomainData,
  indicatorCode: string | null,
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: DonutGeometry,
  xScale: ScaleBand<string>,
  yOuter: ScaleRadial<number, number, never>,
  year: number,
) => {
  const { innerRadius, ringRadius, margin } = geometry

  let value: number = 100

  if (indicatorCode) {
    value = findValue(domain.indicators, indicatorCode, year)
  }

  initializeArcSegment(group, domain, "outer")
    .transition()
    .duration(500)
    .ease(easeLinear)
    .attrTween("d", (d: DomainData) => {
      const inner = innerRadius + ringRadius / 2 + margin
      const finalOuter = yOuter(value)
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
}

const AdjustShortfallArcs = (
  data: DomainData[],
  geometry: DonutGeometry,
  xScale: ScaleBand<string>,
  yInner: ScaleRadial<number, number, never>,
  prevYear: number,
  year: number,
  onMouseOver: (event: MouseEvent, data: DomainData) => void,
) => {
  const { innerRadius, ringRadius, margin } = geometry

  data.forEach((domain: DomainData) => {
    const arcType = "_shortfall"
    const locality = domain.quarter.includes("local") ? "_local" : "_global"
    const arcName = domain.name.split(" ").join("_").toLowerCase()

    const propertyId = `${arcName}${arcType}${locality}`
    const escaped = CSS.escape(propertyId)
    const selection = select(`#${escaped}`) as Selection<
      SVGPathElement,
      DomainData,
      HTMLElement,
      unknown
    >

    // Find which indicator is the primary one for this domain
    let indicatorCode: string | null = null
    if (domain.indicators.length > 0) {
      indicatorCode =
        domain.indicators.find((id) => id.primary)?.indicatorCode ?? null
    }

    const prevOuter = findValue(domain.indicators, indicatorCode, prevYear)
    const newOuter = findValue(domain.indicators, indicatorCode, year)

    selection
      .transition()
      .duration(500)
      .ease(easeLinear)
      .attrTween("d", (d: DomainData) => {
        const inner = innerRadius - ringRadius / 2 - margin
        const interpolateOuterRadius = interpolate(prevOuter, newOuter)

        const arcGen = arc<DomainData>()
          .innerRadius(inner)
          .startAngle(xScale(d.name)!)
          .endAngle(xScale(d.name)! + xScale.bandwidth())
          .padAngle(margin / 100)
          .padRadius(0.4 * innerRadius)

        return (t: number) => {
          const value = interpolateOuterRadius(t)
          const currentOuter = Math.min(yInner(value), inner - 0.0005) // Small delta required here to prevent arcs vanishing instantaneously
          return arcGen.outerRadius(currentOuter)(d)!
        }
      })

    const imgIconId = arcName + "_" + domain.quarter + "_shortfall_img"
    const escapedImg = CSS.escape(imgIconId)
    const imgIcon = select<SVGImageElement, DomainData>(`#${escapedImg}`)
    imgIcon.on("mouseover", onMouseOver)
  })
}

const AdjustOvershootArcs = (
  data: DomainData[],
  geometry: DonutGeometry,
  xScale: ScaleBand<string>,
  yOuter: ScaleRadial<number, number, never>,
  prevYear: number,
  year: number,
  onMouseOver: (event: MouseEvent, data: DomainData) => void,
) => {
  const { innerRadius, ringRadius, margin } = geometry

  data.forEach((domain) => {
    const arcType = "_overshoot"
    const locality = domain.quarter.includes("local") ? "_local" : "_global"
    const arcName = domain.name.split(" ").join("_").toLowerCase()

    const propertyId = `${arcName}${arcType}${locality}`
    const escaped = CSS.escape(propertyId)
    const selection = select(`#${escaped}`) as Selection<
      SVGPathElement,
      DomainData,
      HTMLElement,
      unknown
    >

    // Find which indicator is the primary one for this domain
    let indicatorCode: string | null = null
    if (domain.indicators.length > 0) {
      indicatorCode =
        domain.indicators.find((id) => id.primary)?.indicatorCode ?? null
    }

    const prevOuter = findValue(domain.indicators, indicatorCode, prevYear)
    const newOuter = findValue(domain.indicators, indicatorCode, year)

    selection
      .transition()
      .duration(500)
      .ease(easeLinear)
      .attrTween("d", (d: DomainData) => {
        const inner = innerRadius + ringRadius / 2 + margin
        const interpolateOuterRadius = interpolate(prevOuter, newOuter)

        const arcGen = arc<DomainData>()
          .innerRadius(inner)
          .startAngle(xScale(d.name)!)
          .endAngle(xScale(d.name)! + xScale.bandwidth())
          .padAngle(margin / 100)
          .padRadius(innerRadius)

        return (t: number) => {
          const value = interpolateOuterRadius(t)
          const currentOuter = Math.max(yOuter(value), inner + 0.00005) // Small delta required here to prevent arcs vanishing instantaneously
          return arcGen.outerRadius(currentOuter)(d)!
        }
      })

    const imgIconId = arcName + "_" + domain.quarter + "_overshoot_img"
    const escapedImg = CSS.escape(imgIconId)
    const imgIcon = select<SVGImageElement, DomainData>(`#${escapedImg}`)
    imgIcon.on("mouseover", onMouseOver)
  })
}

function CreateInnerRingSegment(
  domain: DomainData,
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: DonutGeometry,
  xScale: ScaleBand<string>,
) {
  const { innerRadius, smallRingRadius, ringRadius } = geometry

  // Social Ring Boundary
  initializeGraphRingSegment(
    group,
    domain,
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
  )

  // Social Ring Interior
  initializeGraphRingSegment(group, domain, theme.palette.common.social).attr(
    "d",
    arc<DomainData>()
      .innerRadius(innerRadius - smallRingRadius / 2)
      .outerRadius(innerRadius + smallRingRadius / 2)
      .startAngle((d: DomainData) => xScale(d.name)! - 0.01) //The -.01 is to fix slight gaps
      .endAngle((d: DomainData) => xScale(d.name)! + xScale.bandwidth())
      .padAngle(0)
      .padRadius(innerRadius),
  )

  // Ecological Ring Boundary
  initializeGraphRingSegment(
    group,
    domain,
    theme.palette.common.ecologicalBoundary,
  ).attr(
    "d",
    arc<DomainData>()
      .innerRadius(innerRadius - 20 + ringRadius / 2)
      .outerRadius(innerRadius + ringRadius / 2)
      .startAngle((d: DomainData) => xScale(d.name)! - 0.01) //The -.01 is to fix slight gaps
      .endAngle((d: DomainData) => xScale(d.name)! + xScale.bandwidth())
      .padAngle(0)
      .padRadius(innerRadius),
  )

  // Ecological Ring Interior
  initializeGraphRingSegment(
    group,
    domain,
    theme.palette.common.ecological,
  ).attr(
    "d",
    arc<DomainData>()
      .innerRadius(innerRadius - 36 + smallRingRadius / 2)
      .outerRadius(innerRadius + smallRingRadius / 2)
      .startAngle((d: DomainData) => xScale(d.name)! - 0.01) //The -.01 is to fix slight gaps
      .endAngle((d: DomainData) => xScale(d.name)! + xScale.bandwidth())
      .padAngle(0)
      .padRadius(innerRadius),
  )
}

export const ApplyLabelStyles = (
  group: Selection<SVGTextPathElement, unknown, null, undefined>,
  href: string,
  text: string,
) => {
  group
    .attr("xlink:href", href)
    .style("alignment-baseline", "middle")
    .style("dominant-baseline", "middle")
    .style("fill", theme.palette.common.white)
    .style("font-size", 12 + "px")
    .style("letter-spacing", "0.001em")
    .style("text-anchor", "middle")
    .style("user-select", "none")
    .style("cursor", "default")
    .attr("startOffset", "50%")
    .attr("dy", ".1em")
    .text(text)
}

function CreateIconRingLabels(
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: DonutGeometry,
) {
  const { innerTextRadius, outerTextRadius } = geometry

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
    .style("stroke", "0")

  const gsText = group.append("g").append("text").append("textPath")
  ApplyLabelStyles(gsText, "#arc-top", "GLOBAL SOCIAL FOUNDATION")

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
    .style("stroke", "0")

  const lsText = group.append("g").append("text").append("textPath")
  ApplyLabelStyles(lsText, "#arc-bottom", "LOCAL SOCIAL FOUNDATION")

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
    .style("stroke", "0")

  const leText = group.append("g").append("text").append("textPath")
  ApplyLabelStyles(leText, "#lower-arc-bottom", "LOCAL ECOLOGICAL CEILING")

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
    .style("stroke", "0")

  const geText = group.append("g").append("text").append("textPath")
  ApplyLabelStyles(geText, "#upper-arc-top", "GLOBAL ECOLOGICAL CEILING")
}

export const CreateInnerIconRing = (
  domain: DomainData,
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: DonutGeometry,
  xScale: ScaleBand<string>,
  onIndicatorOpen: (domain: DomainData) => void,
  onMouseOver: (event: MouseEvent, data: DomainData) => void,
  onMouseMove: (event: MouseEvent) => void,
  onMouseLeave: (event: MouseEvent, data: DomainData) => void,
) => {
  const { smallRingRadius, ringRadius } = geometry

  group
    .append("g")
    .selectAll("g")
    .data([domain])
    .enter()
    .append("g")
    .attr("text-anchor", "middle")
    .attr("transform", function (d: DomainData) {
      const Rotation =
        ((xScale(d.name)! + xScale.bandwidth() / 2) * 180) / Math.PI - 90
      return `rotate(${Rotation}) translate(${smallRingRadius * 1.92},0) rotate(${-Rotation})`
    })
    .append("svg:image")
    .attr("x", -smallRingRadius + 14.5)
    .attr("y", -smallRingRadius + 15)
    .attr("width", smallRingRadius / 3.5)
    .attr("height", smallRingRadius / 3.7)
    .attr("xlink:href", function (d: DomainData) {
      const imgRef = d.symbolId.substring(
        0,
        d.symbolId.length - 4,
      ) as keyof typeof Icons
      return Icons[imgRef]
    })
    .attr("id", (d: DomainData) => {
      const iconName = d.name.split(" ").join("_").toLowerCase()
      return iconName + "_" + d.quarter + "_shortfall_img"
    })
    .style("cursor", "pointer")
    .attr("transform", `translate(${ringRadius / 2}, ${ringRadius / 2})`)
    .on("mouseover", onMouseOver)
    .on("mousemove", onMouseMove)
    .on("mouseleave", onMouseLeave)
    .on("click", function (_event: PointerEvent, domain: DomainData) {
      if (window.location.pathname === "/") {
        onIndicatorOpen(domain)
      }
    })
}

function CreateOuterIconRing(
  domain: DomainData,
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: DonutGeometry,
  xScale: ScaleBand<string>,
  onIndicatorOpen: (domain: DomainData) => void,
  onMouseOver: (event: MouseEvent, data: DomainData) => void,
  onMouseMove: (event: MouseEvent) => void,
  onMouseLeave: (event: MouseEvent, data: DomainData) => void,
) {
  const { smallRingRadius, ringRadius } = geometry

  group
    .append("g")
    .selectAll("g")
    .data([domain])
    .enter()
    .append("g")
    .attr("text-anchor", "middle")
    .attr("transform", function (d: DomainData) {
      const Rotation =
        ((xScale(d.name)! + xScale.bandwidth() / 2) * 180) / Math.PI - 90
      return `rotate(${Rotation}) translate(${smallRingRadius * 2.44},0) rotate(${-Rotation})`
    })
    .append("svg:image")
    .attr("x", -smallRingRadius + 13.7)
    .attr("y", -smallRingRadius + 13.2)
    .attr("width", smallRingRadius / 3)
    .attr("height", smallRingRadius / 3)
    .attr("xlink:href", function (d: DomainData) {
      const imgRef = d.symbolId.substring(
        0,
        d.symbolId.length - 4,
      ) as keyof typeof Icons
      return Icons[imgRef]
    })
    .attr("id", (d: DomainData) => {
      const iconName = d.name.split(" ").join("_").toLowerCase()
      return iconName + "_" + d.quarter + "_overshoot_img"
    })
    .style("cursor", "pointer")
    .attr("transform", `translate(${ringRadius / 2}, ${ringRadius / 2})`)
    .on("mouseover", onMouseOver)
    .on("mousemove", onMouseMove)
    .on("mouseleave", onMouseLeave)

    .on("click", function (_event: PointerEvent, domain: DomainData) {
      if (window.location.pathname === "/") {
        onIndicatorOpen(domain)
      }
    })
}

export const createDonutInnerSectors = (
  data: DomainData[],
  year: number,
  geometry: DonutGeometry,
  group: Selection<SVGGElement, unknown, null, undefined>,
  yInner: ScaleRadial<number, number, never>,
  onDomainOpen: (domain: DomainData) => void,
  onMouseOver: (event: MouseEvent, data: DomainData) => void,
  onMouseMove: (event: MouseEvent) => void,
  onMouseLeave: (event: MouseEvent, data: DomainData) => void,
) => {
  const socialDomains = data.filter((d) => d.quarter.includes("social"))
  const local = socialDomains.filter((sd) => sd.quarter.includes("local"))
  const global = socialDomains.filter((sd) => sd.quarter.includes("global"))

  socialDomains.forEach((sd) => {
    const xScale = scaleBand()
      // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .range(
        sd.quarter.includes("global")
          ? [-Math.PI / 2, Math.PI / 2]
          : [Math.PI / 2, Math.PI * 1.5],
      )
      .align(0) // This does nothing
      .domain(
        sd.quarter.includes("global")
          ? global.map((g) => g.name)
          : local.map((l) => l.name),
      ) // The domain of the X axis is the list of states.

    // Find which indicator is the primary one for this domain
    let indicatorCode: string | null = null
    if (sd.indicators.length > 0) {
      indicatorCode =
        sd.indicators.find((id) => id.primary)?.indicatorCode ?? null
    }

    CreateShortfallArc(sd, indicatorCode, group, geometry, xScale, yInner, year)
    CreateInnerRingSegment(sd, group, geometry, xScale)
    CreateInnerIconRing(
      sd,
      group,
      geometry,
      xScale,
      onDomainOpen,
      onMouseOver,
      onMouseMove,
      onMouseLeave,
    )
    CreateIconRingLabels(group, geometry)
  })
}

export const createDonutOuterSectors = (
  data: DomainData[],
  year: number,
  geometry: DonutGeometry,
  group: Selection<SVGGElement, unknown, null, undefined>,
  yOuter: ScaleRadial<number, number, never>,
  onDomainOpen: (domain: DomainData) => void,
  onMouseOver: (event: MouseEvent, data: DomainData) => void,
  onMouseMove: (event: MouseEvent) => void,
  onMouseLeave: (event: MouseEvent, data: DomainData) => void,
) => {
  const ecologicalDomains = data.filter((d) => d.quarter.includes("ecological"))

  const local = ecologicalDomains.filter((sd) => sd.quarter.includes("local"))
  const global = ecologicalDomains.filter((sd) => sd.quarter.includes("global"))

  ecologicalDomains.forEach((ed) => {
    const xScale = scaleBand()
      // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .range(
        ed.quarter.includes("global")
          ? [-Math.PI / 2, Math.PI / 2]
          : [Math.PI / 2, Math.PI * 1.5],
      )
      .align(0)
      .domain(
        ed.quarter.includes("global")
          ? global.map((g) => g.name)
          : local.map((l) => l.name),
      ) // The domain of the X axis is the list of states.

    // Find which indicator is the primary one for this domain
    let indicatorCode: string | null = null
    if (ed.indicators.length > 0) {
      indicatorCode =
        ed.indicators.find((id) => id.primary)?.indicatorCode ?? null
    }

    CreateOvershootArc(ed, indicatorCode, group, geometry, xScale, yOuter, year)

    CreateOuterIconRing(
      ed,
      group,
      geometry,
      xScale,
      onDomainOpen,
      onMouseOver,
      onMouseMove,
      onMouseLeave,
    )
  })
}

export const AdjustIndicatorArcs = (
  data: DomainData[],
  prevYear: number,
  year: number,
  geometry: DonutGeometry,
  yOuter: ScaleRadial<number, number, never>,
  yInner: ScaleRadial<number, number, never>,
  onMouseOver: (event: MouseEvent, data: DomainData) => void,
) => {
  const ecologicalDomains = data.filter((d) => d.quarter.includes("ecological"))

  const localEcological = ecologicalDomains.filter((ed) =>
    ed.quarter.includes("local"),
  )
  const globalEcological = ecologicalDomains.filter((ed) =>
    ed.quarter.includes("global"),
  )

  // Adjust Overshoot Arcs
  ;[localEcological, globalEcological].forEach((domainArray) => {
    const xScale = scaleBand()
      .range(
        domainArray[0].quarter.includes("global")
          ? [-Math.PI / 2, Math.PI / 2]
          : [Math.PI / 2, Math.PI * 1.5],
      )
      .align(0)
      .domain(
        domainArray[0].quarter.includes("global")
          ? globalEcological.map((g) => g.name)
          : localEcological.map((l) => l.name),
      )

    AdjustOvershootArcs(
      domainArray,
      geometry,
      xScale,
      yOuter,
      prevYear,
      year,
      onMouseOver,
    )
  })

  const socialDomains = data.filter((d) => d.quarter.includes("social"))
  const localSocial = socialDomains.filter((sd) => sd.quarter.includes("local"))
  const globalSocial = socialDomains.filter((sd) =>
    sd.quarter.includes("global"),
  )

  // Adjust Shortfall Arcs
  ;[localSocial, globalSocial].forEach((domainArray) => {
    const xScale = scaleBand()
      .range(
        domainArray[0].quarter.includes("global")
          ? [-Math.PI / 2, Math.PI / 2]
          : [Math.PI / 2, Math.PI * 1.5],
      )
      .align(0)
      .domain(
        domainArray[0].quarter.includes("global")
          ? globalSocial.map((g) => g.name)
          : localSocial.map((l) => l.name),
      )
    AdjustShortfallArcs(
      domainArray,
      geometry,
      xScale,
      yInner,
      prevYear,
      year,
      onMouseOver,
    )
  })
}
