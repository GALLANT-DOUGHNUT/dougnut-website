import { scaleBand, type ScaleBand } from "d3-scale"
import Icons from "../Icons"
import type { DomainData } from "../types/DonutData"
import { select, type Selection } from "d3-selection"
import type { UnrolledGeometry } from "../components/DonutChart/DonutChart"
import "d3-transition"
import { easeLinear } from "d3-ease"
import { findArcValue } from "./DonutHelpers"
import theme from "../theme"

const initializeBarSegment = (
  group: Selection<SVGGElement, unknown, null, undefined>,
  domain: DomainData,
  type: "shortfall" | "overshoot"
) => {
  const barId = domain.name.split(" ").join("_").toLowerCase()
  const idString = type === "shortfall" ? "_shortfall" : "_overshoot"

  return group
    .append("g")
    .selectAll("rect")
    .data([domain])
    .enter()
    .append("rect")
    .attr(
      "fill",
      domain.code
        ? theme.palette.common.arc
        : theme.palette.common.arcEmpty
    )
    .attr(
      "id",
      (d: DomainData) =>
        `${barId}${idString}_${d.quarter?.includes("local") ? "local" : "global"}`
    )
}

const initializeGraphRectSegment = (
  group: Selection<SVGGElement, unknown, null, undefined>,
  fillColor: string
) => {
  return group.append("g").append("rect").attr("fill", fillColor)
}

const createShortfallBar = (
  domain: DomainData,
  indicatorCode: string | null,
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: UnrolledGeometry,
  xScale: ScaleBand<string>,
  year: number
) => {
  const { windowWidth, windowHeight, barMaxHeight } = geometry
  const bottomY = windowHeight / 2 + 95

  let value: number = 100

  if (indicatorCode) {
    const arcValue = findArcValue(domain.indicators, indicatorCode, year)
    value = arcValue.value
  }

  initializeBarSegment(group, domain, "shortfall")
    .attr("x", (d) => xScale(d.name)! * windowWidth)
    .attr("y", bottomY)
    .attr("width", xScale.bandwidth() * windowWidth * 0.8)
    .transition()
    .duration(500)
    .ease(easeLinear)
    .attr("height", (value / 100) * barMaxHeight)
}

const redrawShortfallBars = (
  data: DomainData[],
  geometry: UnrolledGeometry,
  xScale: ScaleBand<string>,
  year: number
) => {
  const { windowHeight, windowWidth, barMaxHeight } = geometry
  const bottomY = windowHeight / 2 + 95

  data.forEach((domain: DomainData) => {
    const barId = domain.name.split(" ").join("_").toLowerCase()
    const barType = "_shortfall"
    const locality = domain.quarter.includes("local")
      ? "_local"
      : "_global"

    const propertyId = `${barId}${barType}${locality}`
    const escaped = CSS.escape(propertyId)
    const selection = select(`#${escaped}`) as Selection<
      SVGRectElement,
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

    let value: number = 100
    if (indicatorCode) {
      const arcValue = findArcValue(domain.indicators, indicatorCode, year)
      value = arcValue.value
    }

    selection
      .attr("x", (d: DomainData) => xScale(d.name)! * windowWidth)
      .attr("y", bottomY)
      .attr("width", xScale.bandwidth() * windowWidth * 0.8)
      .transition()
      .duration(500)
      .ease(easeLinear)
      .attr("height", (value / 100) * barMaxHeight)
  })
}

const createOvershootBar = (
  domain: DomainData,
  indicatorCode: string | null,
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: UnrolledGeometry,
  xScale: ScaleBand<string>,
  year: number
) => {
  const { windowWidth, windowHeight, barMaxHeight } = geometry

  let value: number = 100

  if (indicatorCode) {
    const arcValue = findArcValue(domain.indicators, indicatorCode, year)
    value = arcValue.value
  }

  initializeBarSegment(group, domain, "overshoot")
    .attr("x", (d) => xScale(d.name)! * windowWidth)
    .attr("y", 0) // Use translate for y position instead as scale is flipped
    .attr("width", xScale.bandwidth() * windowWidth * 0.8)
    .attr("transform", `translate(0,${windowHeight / 2 - 95}) scale(1,-1)`)
    .transition()
    .duration(500)
    .ease(easeLinear)
    .attr("height", (value / 100) * barMaxHeight)
}

const redrawOvershootBars = (
  data: DomainData[],
  geometry: UnrolledGeometry,
  xScale: ScaleBand<string>,
  year: number
) => {
  const { windowHeight, windowWidth, barMaxHeight } = geometry

  data.forEach((domain: DomainData) => {
    const barId = domain.name.split(" ").join("_").toLowerCase()
    const barType = "_overshoot"
    const locality = domain.quarter.includes("local")
      ? "_local"
      : "_global"

    const propertyId = `${barId}${barType}${locality}`
    const escaped = CSS.escape(propertyId)
    const selection = select(`#${escaped}`) as Selection<
      SVGRectElement,
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

    let value: number = 100
    if (indicatorCode) {
      const arcValue = findArcValue(domain.indicators, indicatorCode, year)
      value = arcValue.value
    }

    selection
      .attr("x", (d: DomainData) => xScale(d.name)! * windowWidth)
      .attr("width", xScale.bandwidth() * windowWidth * 0.8)
      .attr(
        "transform",
        `translate(0,${windowHeight / 2 - 95}) scale(1,-1)`
      )
      .transition()
      .duration(500)
      .ease(easeLinear)
      .attr("height", (value / 100) * barMaxHeight)
  })
}

const createSocialGraphSegments = (
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: UnrolledGeometry
) => {
  const { windowHeight, windowWidth } = geometry

  // Social Foundation Boundary
  initializeGraphRectSegment(group, theme.palette.common.socialBoundary)
    .attr("id", `social-foundation-boundary`)
    .attr("x", 0)
    .attr("y", windowHeight / 2 + 55)
    .attr("width", windowWidth)
    .attr("height", 35)

  // Social Foundation Center
  initializeGraphRectSegment(group, theme.palette.common.social)
    .attr("id", `social-foundation-center`)
    .attr("x", 0)
    .attr("y", windowHeight / 2)
    .attr("width", windowWidth)
    .attr("height", 55)
}

const redrawSocialGraphSegments = (geometry: UnrolledGeometry) => {
  const { windowHeight, windowWidth } = geometry

  let selection = select(`#social-foundation-boundary`)
  selection
    .attr("x", 0)
    .attr("y", windowHeight / 2 + 55)
    .attr("width", windowWidth)
    .attr("height", 35)

  selection = select(`#social-foundation-center`)
  selection
    .attr("x", 0)
    .attr("y", windowHeight / 2)
    .attr("width", windowWidth)
    .attr("height", 55)
}

const createEcologicalGraphSegments = (
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: UnrolledGeometry
) => {
  const { windowHeight, windowWidth } = geometry

  // Ecological Ceiling Boundary
  initializeGraphRectSegment(
    group,
    theme.palette.common.ecologicalBoundary
  )
    .attr("id", "ecological-ceiling-boundary")
    .attr("x", 0)
    .attr("y", windowHeight / 2 - 55 - 35)
    .attr("width", windowWidth)
    .attr("height", 35)

  // Ecological Ring Interior
  initializeGraphRectSegment(group, theme.palette.common.ecological)
    .attr("id", "ecological-ceiling-center")
    .attr("x", 0)
    .attr("y", windowHeight / 2 - 55)
    .attr("width", windowWidth)
    .attr("height", 55)
}

const redrawEcologicalGraphSegments = (geometry: UnrolledGeometry) => {
  const { windowHeight, windowWidth } = geometry

  let selection = select(`#ecological-ceiling-boundary`)
  selection
    .attr("x", 0)
    .attr("y", windowHeight / 2 - 55 - 35)
    .attr("width", windowWidth)
    .attr("height", 35)

  selection = select(`#ecological-ceiling-center`)
  selection
    .attr("x", 0)
    .attr("y", windowHeight / 2 - 55)
    .attr("width", windowWidth)
    .attr("height", 55)
}

const createGraphLabels = (
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: UnrolledGeometry
) => {
  const { windowWidth, windowHeight } = geometry

  group
    .append("text")
    .attr("id", "global-social-foundation-label")
    .attr("x", 0.25 * windowWidth)
    .attr("y", windowHeight / 2 + 72)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("fill", theme.palette.common.white)
    .text("GLOBAL SOCIAL FOUNDATION")

  group
    .append("text")
    .attr("id", "local-social-foundation-label")
    .attr("x", 0.75 * windowWidth)
    .attr("y", windowHeight / 2 + 72)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("fill", theme.palette.common.white)
    .text("LOCAL SOCIAL FOUNDATION")

  group
    .append("text")
    .attr("id", "local-ecological-ceiling-label")
    .attr("x", 0.75 * windowWidth)
    .attr("y", windowHeight / 2 - 72)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("fill", theme.palette.common.white)
    .text("LOCAL ECOLOGICAL CEILING")

  group
    .append("text")
    .attr("id", "global-ecological-ceiling-label")
    .attr("x", 0.25 * windowWidth)
    .attr("y", windowHeight / 2 - 72)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("fill", theme.palette.common.white)
    .text("GLOBAL ECOLOGICAL CEILING")
}

const redrawGraphLabels = (geometry: UnrolledGeometry) => {
  const { windowHeight, windowWidth } = geometry

  let selection = select(`#global-social-foundation-label`)
  selection.attr("x", 0.25 * windowWidth).attr("y", windowHeight / 2 + 72)

  selection = select(`#local-social-foundation-label`)
  selection.attr("x", 0.75 * windowWidth).attr("y", windowHeight / 2 + 72)

  selection = select(`#local-ecological-ceiling-label`)
  selection.attr("x", 0.75 * windowWidth).attr("y", windowHeight / 2 - 72)

  selection = select(`#global-ecological-ceiling-label`)
  selection.attr("x", 0.25 * windowWidth).attr("y", windowHeight / 2 - 72)
}

const createSocialIcons = (
  data: DomainData,
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: UnrolledGeometry,
  xScale: ScaleBand<string>,
  onIndicatorOpen: (domain: DomainData) => void,
  onMouseOver: (event: MouseEvent, data: DomainData) => void,
  onMouseMove: (event: MouseEvent) => void,
  onMouseLeave: (event: MouseEvent, data: DomainData) => void
) => {
  const { windowWidth, windowHeight } = geometry

  group
    .append("g")
    .selectAll("g")
    .data([data])
    .enter()
    .append("g")
    .attr("text-anchor", "middle")
    .append("svg:image")
    .attr("x", (d) => xScale(d.name)! * windowWidth + 0.006 * windowWidth)
    .attr("y", windowHeight / 2 + 15)
    .attr("width", 27)
    .attr("height", 27)
    .attr("xlink:href", function (d: DomainData) {
      const imgRef = d.symbolId.substring(
        0,
        d.symbolId.length - 4
      ) as keyof typeof Icons
      return Icons[imgRef]
    })
    .attr("id", (d: DomainData) => d.name + "_" + d.quarter + "_inner_img")
    .style("cursor", "pointer")
    .on("mouseover", onMouseOver)
    .on("mousemove", onMouseMove)
    .on("mouseleave", onMouseLeave)
    .on("click", function (_event: PointerEvent, domain: DomainData) {
      if (window.location.pathname === "/") {
        onIndicatorOpen(domain)
      }
    })
}

const redrawSocialIcons = (
  data: DomainData[],
  geometry: UnrolledGeometry,
  xScale: ScaleBand<string>,
  onMouseOver: (event: MouseEvent, data: DomainData) => void
) => {
  const { windowWidth, windowHeight } = geometry

  data.forEach((domain) => {
    const imgIconId = domain.name + "_" + domain.quarter + "_inner_img"
    const escapedImg = CSS.escape(imgIconId)
    const imgIcon = select<SVGImageElement, DomainData>(`#${escapedImg}`)
    imgIcon.on("mouseover", onMouseOver)
    imgIcon
      .attr(
        "x",
        (d) => xScale(d.name)! * windowWidth + 0.006 * windowWidth
      )
      .attr("y", windowHeight / 2 + 15)
  })
}

const CreateEcologicalIcons = (
  data: DomainData,
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: UnrolledGeometry,
  xScale: ScaleBand<string>,
  onIndicatorOpen: (domain: DomainData) => void,
  onMouseOver: (event: MouseEvent, data: DomainData) => void,
  onMouseMove: (event: MouseEvent) => void,
  onMouseLeave: (event: MouseEvent, data: DomainData) => void
) => {
  const { windowWidth, windowHeight } = geometry

  group
    .append("g")
    .selectAll("g")
    .data([data])
    .enter()
    .append("g")
    .attr("text-anchor", "middle")
    .append("svg:image")
    .attr("x", (d) => xScale(d.name)! * windowWidth + 0.01 * windowWidth)
    .attr("y", windowHeight / 2 - 45)
    .attr("width", 27)
    .attr("height", 27)
    .attr("xlink:href", function (d: DomainData) {
      const imgRef = d.symbolId.substring(
        0,
        d.symbolId.length - 4
      ) as keyof typeof Icons
      return Icons[imgRef]
    })
    .attr("id", (d: DomainData) => d.name + "_outer_img")
    .style("cursor", "pointer")
    .on("mouseover", onMouseOver)
    .on("mousemove", onMouseMove)
    .on("mouseleave", onMouseLeave)

    .on("click", function (_event: PointerEvent, domain: DomainData) {
      if (window.location.pathname === "/") {
        onIndicatorOpen(domain)
      }
    })
}

const redrawEcologicalIcons = (
  data: DomainData[],
  geometry: UnrolledGeometry,
  xScale: ScaleBand<string>,
  onMouseOver: (event: MouseEvent, data: DomainData) => void
) => {
  const { windowWidth, windowHeight } = geometry

  data.forEach((domain: DomainData) => {
    const imgIconId = domain.name + "_outer_img"
    const escapedImg = CSS.escape(imgIconId)
    const imgIcon = select<SVGImageElement, DomainData>(`#${escapedImg}`)
    imgIcon.on("mouseover", onMouseOver)
    imgIcon
      .attr("x", (d) => xScale(d.name)! * windowWidth + 0.01 * windowWidth)
      .attr("y", windowHeight / 2 - 45)
  })
}

export const createGraphSocialSectors = (
  data: DomainData[],
  year: number,
  geometry: UnrolledGeometry,
  group: Selection<SVGGElement, unknown, null, undefined>,
  onIndicatorOpen: (properties: DomainData) => void,
  onMouseOver: (event: MouseEvent, data: DomainData) => void,
  onMouseMove: (event: MouseEvent) => void,
  onMouseLeave: (event: MouseEvent, data: DomainData) => void
) => {
  createSocialGraphSegments(group, geometry)
  const socialDomains = data.filter((d) => d.quarter.includes("social"))
  const local = socialDomains.filter((sd) => sd.quarter.includes("local"))
  const global = socialDomains.filter((sd) =>
    sd.quarter.includes("global")
  )

  socialDomains.forEach((sd) => {
    const xScale = scaleBand()
      .range(sd.quarter.includes("global") ? [0, 0.5] : [0.5, 1])
      .domain(
        sd.quarter.includes("global")
          ? global.map((g) => g.name)
          : local.map((l) => l.name)
      )

    // Find which indicator is the primary one for this domain
    let indicatorCode: string | null = null
    if (sd.indicators.length > 0) {
      indicatorCode =
        sd.indicators.find((id) => id.primary)?.indicatorCode ?? null
    }

    createShortfallBar(sd, indicatorCode, group, geometry, xScale, year)
    createSocialIcons(
      sd,
      group,
      geometry,
      xScale,
      onIndicatorOpen,
      onMouseOver,
      onMouseMove,
      onMouseLeave
    )
  })
}

export const createGraphEcologicalSectors = (
  data: DomainData[],
  year: number,
  geometry: UnrolledGeometry,
  group: Selection<SVGGElement, unknown, null, undefined>,
  onIndicatorOpen: (domain: DomainData) => void,
  onMouseOver: (event: MouseEvent, data: DomainData) => void,
  onMouseMove: (event: MouseEvent) => void,
  onMouseLeave: (event: MouseEvent, data: DomainData) => void
) => {
  createEcologicalGraphSegments(group, geometry)
  const ecologicalDomains = data.filter((d) =>
    d.quarter.includes("ecological")
  )
  const local = ecologicalDomains.filter((ed) =>
    ed.quarter.includes("local")
  )
  const global = ecologicalDomains.filter((ed) =>
    ed.quarter.includes("global")
  )

  ecologicalDomains.forEach((ed) => {
    const xScale = scaleBand()
      .range(ed.quarter.includes("global") ? [0, 0.5] : [0.5, 1])
      .domain(
        ed.quarter.includes("global")
          ? global.map((g) => g.name)
          : local.map((l) => l.name)
      )

    // Find which indicator is the primary one for this domain
    let indicatorCode: string | null = null
    if (ed.indicators.length > 0) {
      indicatorCode =
        ed.indicators.find((id) => id.primary)?.indicatorCode ?? null
    }

    createOvershootBar(ed, indicatorCode, group, geometry, xScale, year)
    CreateEcologicalIcons(
      ed,
      group,
      geometry,
      xScale,
      onIndicatorOpen,
      onMouseOver,
      onMouseMove,
      onMouseLeave
    )
  })

  createGraphLabels(group, geometry)
}

export const redrawChart = (
  data: DomainData[],
  year: number,
  geometry: UnrolledGeometry,
  onMouseOver: (event: MouseEvent, data: DomainData) => void
) => {
  // Redraw Central Region
  redrawSocialGraphSegments(geometry)
  redrawEcologicalGraphSegments(geometry)
  redrawGraphLabels(geometry)

  // Redraw the Social Bars
  const socialDomains = data.filter((d) => d.quarter.includes("social"))
  const localSocial = socialDomains.filter((sd) =>
    sd.quarter.includes("local")
  )
  const globalSocial = socialDomains.filter((sd) =>
    sd.quarter.includes("global")
  )

  ;[localSocial, globalSocial].forEach((domainArray) => {
    const xScale = scaleBand()
      .range(
        domainArray[0].quarter.includes("global") ? [0, 0.5] : [0.5, 1]
      )
      .domain(
        domainArray[0].quarter.includes("global")
          ? globalSocial.map((g) => g.name)
          : localSocial.map((l) => l.name)
      )

    redrawSocialIcons(domainArray, geometry, xScale, onMouseOver)
    redrawShortfallBars(domainArray, geometry, xScale, year)
  })

  // Redraw the Ecological Bars
  const ecologicalDomains = data.filter((d) =>
    d.quarter.includes("ecological")
  )

  const localEcological = ecologicalDomains.filter((ed) =>
    ed.quarter.includes("local")
  )
  const globalEcological = ecologicalDomains.filter((ed) =>
    ed.quarter.includes("global")
  )

  ;[localEcological, globalEcological].forEach((domainArray) => {
    const xScale = scaleBand()
      .range(
        domainArray[0].quarter.includes("global") ? [0, 0.5] : [0.5, 1]
      )
      .domain(
        domainArray[0].quarter.includes("global")
          ? globalEcological.map((g) => g.name)
          : localEcological.map((l) => l.name)
      )

    redrawEcologicalIcons(domainArray, geometry, xScale, onMouseOver)
    redrawOvershootBars(domainArray, geometry, xScale, year)
  })
}
