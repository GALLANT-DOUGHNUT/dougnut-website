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
  type: "shortfall" | "overshoot",
  wireframe?: boolean
) => {
  const barId = domain.name.split(" ").join("_").toLowerCase()
  let idString = type === "shortfall" ? "_shortfall" : "_overshoot"

  if (wireframe) {
    idString += "_2024wireframe"
  }

  return group
    .append("g")
    .selectAll("rect")
    .data([domain])
    .enter()
    .append("rect")
    .attr(
      "fill",
      domain.code
        ? wireframe
          ? theme.palette.common.wireframe
          : theme.palette.common.arc
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

type BarType = "shortfall" | "overshoot"
type BarWireframeSelection = Selection<
  SVGRectElement,
  DomainData,
  SVGGElement,
  unknown
>

const getPrimaryIndicatorCode = (domain: DomainData) =>
  domain.indicators.find((indicator) => indicator.primary)
    ?.indicatorCode ?? null

const getBarValue = (
  domain: DomainData,
  indicatorCode: string | null,
  year: number
) =>
  indicatorCode
    ? findArcValue(domain.indicators, indicatorCode, year).value
    : 50

const getBandScaleForDomain = (
  domain: DomainData,
  localDomains: DomainData[],
  globalDomains: DomainData[]
) => {
  const isGlobal = domain.quarter.includes("global")
  return scaleBand<string>()
    .range(isGlobal ? [0, 0.5] : [0.5, 1])
    .domain(
      (isGlobal ? globalDomains : localDomains).map((item) => item.name)
    )
}

const createBar = (
  type: BarType,
  domain: DomainData,
  indicatorCode: string | null,
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: UnrolledGeometry,
  xScale: ScaleBand<string>,
  year: number
) => {
  const { windowWidth, windowHeight, barMaxHeight } = geometry
  const isShortfall = type === "shortfall"
  const selection = initializeBarSegment(group, domain, type)
    .attr("x", (d) => xScale(d.name)! * windowWidth)
    .attr("width", xScale.bandwidth() * windowWidth * 0.8)

  if (isShortfall) {
    selection.attr("y", windowHeight / 2 + 95)
  } else {
    selection
      .attr("y", 0)
      .attr(
        "transform",
        `translate(0,${windowHeight / 2 - 95}) scale(1,-1)`
      )
  }

  selection
    .transition()
    .duration(500)
    .ease(easeLinear)
    .attr(
      "height",
      (getBarValue(domain, indicatorCode, year) / 100) * barMaxHeight
    )
}

const redrawBars = (
  type: BarType,
  data: DomainData[],
  geometry: UnrolledGeometry,
  xScale: ScaleBand<string>,
  year: number
) => {
  const { windowHeight, windowWidth, barMaxHeight } = geometry

  data.forEach((domain: DomainData) => {
    const barId = domain.name.split(" ").join("_").toLowerCase()
    const locality = domain.quarter.includes("local")
      ? "_local"
      : "_global"

    const propertyId = `${barId}_${type}${locality}`
    const escaped = CSS.escape(propertyId)
    const selection = select(`#${escaped}`) as Selection<
      SVGRectElement,
      DomainData,
      HTMLElement,
      unknown
    >

    const indicatorCode = getPrimaryIndicatorCode(domain)

    selection
      .attr("x", (d: DomainData) => xScale(d.name)! * windowWidth)
      .attr("width", xScale.bandwidth() * windowWidth * 0.8)

    if (type === "shortfall") {
      selection.attr("y", windowHeight / 2 + 95)
    } else {
      selection
        .attr("y", 0)
        .attr(
          "transform",
          `translate(0,${windowHeight / 2 - 95}) scale(1,-1)`
        )
    }

    selection
      .transition()
      .duration(500)
      .ease(easeLinear)
      .attr(
        "height",
        (getBarValue(domain, indicatorCode, year) / 100) * barMaxHeight
      )
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
    .attr("x", (d) => xScale(d.name)! * windowWidth + 0.015 * windowWidth)
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
    const distance = domain.quarter === "global_ecological" ? 0.015 : 0.019
    const imgIconId = domain.name + "_outer_img"
    const escapedImg = CSS.escape(imgIconId)
    const imgIcon = select<SVGImageElement, DomainData>(`#${escapedImg}`)
    imgIcon.on("mouseover", onMouseOver)
    imgIcon
      .attr(
        "x",
        (d) => xScale(d.name)! * windowWidth + distance * windowWidth
      )
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
  const wireframes: Selection<
    SVGRectElement,
    DomainData,
    SVGGElement,
    unknown
  >[] = []

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

    createBar(
      "shortfall",
      sd,
      indicatorCode,
      group,
      geometry,
      xScale,
      year
    )

    const wireframe = createBarWireframe(
      "shortfall",
      sd,
      indicatorCode,
      group,
      geometry,
      xScale
    )
    if (wireframe) {
      wireframes.push(wireframe)
    }

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

  return wireframes
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
  const wireframes: Selection<
    SVGRectElement,
    DomainData,
    SVGGElement,
    unknown
  >[] = []

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

    createBar(
      "overshoot",
      ed,
      indicatorCode,
      group,
      geometry,
      xScale,
      year
    )

    const wireframe = createBarWireframe(
      "overshoot",
      ed,
      indicatorCode,
      group,
      geometry,
      xScale
    )
    if (wireframe) {
      wireframes.push(wireframe)
    }

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
  return wireframes
}

export const redrawChart = (
  data: DomainData[],
  year: number,
  geometry: UnrolledGeometry,
  onMouseOver: (event: MouseEvent, data: DomainData) => void,
  wireframes: {
    social: BarWireframeSelection[]
    ecological: BarWireframeSelection[]
  }
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
    redrawBars("shortfall", domainArray, geometry, xScale, year)
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
    redrawBars("overshoot", domainArray, geometry, xScale, year)
  })

  redrawBarWireframes(
    "shortfall",
    wireframes.social,
    localSocial,
    globalSocial,
    geometry
  )
  redrawBarWireframes(
    "overshoot",
    wireframes.ecological,
    localEcological,
    globalEcological,
    geometry
  )
}

const createBarWireframe = (
  type: BarType,
  domain: DomainData,
  indicatorCode: string | null,
  group: Selection<SVGGElement, unknown, null, undefined>,
  geometry: UnrolledGeometry,
  xScale: ScaleBand<string>
) => {
  const { windowWidth, windowHeight, barMaxHeight } = geometry

  if (!indicatorCode) {
    return
  }

  const value = getBarValue(domain, indicatorCode, 2024)
  if (value === 0) {
    return
  }

  const height = (value / 100) * barMaxHeight
  const wireframe = initializeBarSegment(group, domain, type, true)
    .attr("x", (d) => xScale(d.name)! * windowWidth)
    .attr("width", xScale.bandwidth() * windowWidth * 0.8)
    .attr("height", 4)

  if (type === "shortfall") {
    wireframe.attr("y", windowHeight / 2 + 95 + height - 4)
  } else {
    wireframe
      .attr("y", height - 4)
      .attr(
        "transform",
        `translate(0,${windowHeight / 2 - 95}) scale(1,-1)`
      )
  }

  return wireframe
}

const redrawBarWireframes = (
  type: BarType,
  wireframes: BarWireframeSelection[],
  localDomains: DomainData[],
  globalDomains: DomainData[],
  geometry: UnrolledGeometry
) => {
  const { windowWidth, windowHeight, barMaxHeight } = geometry

  wireframes.forEach((wireframe) => {
    const domain = wireframe.datum()
    const indicatorCode = getPrimaryIndicatorCode(domain)
    if (!indicatorCode) {
      return
    }

    const value = getBarValue(domain, indicatorCode, 2024)
    if (value === 0) {
      return
    }

    const xScale = getBandScaleForDomain(
      domain,
      localDomains,
      globalDomains
    )
    const height = (value / 100) * barMaxHeight
    wireframe
      .attr("x", (d) => xScale(d.name)! * windowWidth)
      .attr("width", xScale.bandwidth() * windowWidth * 0.8)

    if (type === "shortfall") {
      wireframe
        .attr("y", windowHeight / 2 + 95 + height - 4)
        .attr("height", 4)
    } else {
      wireframe
        .attr("y", height - 4)
        .attr("height", 4)
        .attr(
          "transform",
          `translate(0,${windowHeight / 2 - 95}) scale(1,-1)`
        )
    }
  })
}
