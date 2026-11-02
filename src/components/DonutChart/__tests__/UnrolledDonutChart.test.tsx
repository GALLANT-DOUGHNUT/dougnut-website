// @vitest-environment jsdom

import { act, cleanup, render, screen } from "@testing-library/react"
import { useState } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { DomainData } from "../../../types/DonutData"
import { getArcId } from "../../../helpers/DonutHelpers"
import { DonutStrings } from "../../../resources/strings"
import theme from "../../../theme"
import { UnrolledDonutChart } from "../UnrolledDonutChart"

const mocks = vi.hoisted(() => ({
  socialWireframe: { style: vi.fn() },
  ecologicalWireframe: { style: vi.fn() },
  createSocial: vi.fn(),
  createEcological: vi.fn(),
  redraw: vi.fn(),
}))

vi.mock("../../../helpers/UnrolledDonutHelpers", () => ({
  createGraphSocialSectors: mocks.createSocial,
  createGraphEcologicalSectors: mocks.createEcological,
  redrawChart: mocks.redraw,
}))

vi.mock("@mui/material/Box", () => ({
  default: ({
    children,
    id,
  }: {
    children?: React.ReactNode
    id?: string
  }) => <div id={id}>{children}</div>,
}))

vi.mock("../Tooltip", () => ({
  Tooltip: ({
    domain,
    visible,
    x,
    y,
    year,
  }: {
    domain: DomainData | null
    visible: boolean
    x: number
    y: number
    year: number
  }) => (
    <output
      data-testid="tooltip"
      data-domain={domain?.name ?? ""}
      data-visible={String(visible)}
      data-x={x}
      data-y={y}
      data-year={year}
    />
  ),
}))

vi.mock("../../Indicator/DomainLabels", () => ({
  DomainLabels: ({ domain }: { domain: DomainData | null }) => (
    <div data-testid="domain-labels">{domain?.name ?? ""}</div>
  ),
}))

vi.mock("../../Indicator/DomainDetails", () => ({
  DomainDetails: ({
    domain,
    indicatorConnections,
    unrolled,
    visible,
  }: {
    domain: DomainData
    indicatorConnections: { description: string }[]
    unrolled: boolean
    visible: boolean
  }) => (
    <output
      data-testid="domain-details"
      data-connections={indicatorConnections
        .map((connection) => connection.description)
        .join(",")}
      data-unrolled={String(unrolled)}
      data-visible={String(visible)}
    >
      {domain.name}
    </output>
  ),
}))

vi.mock("../AboutSection", () => ({
  AboutSection: () => <div data-testid="about-section" />,
}))

const makeDomain = (
  quarter: DomainData["quarter"],
  name: string
): DomainData => ({
  name,
  code: name.toUpperCase().replaceAll(" ", "_"),
  quarter,
  description: `${name} domain`,
  target: "Improve outcomes",
  quotes: "",
  symbolId: "health.png",
  videoHash: "",
  indicators: [
    {
      domainCode: name.toUpperCase().replaceAll(" ", "_"),
      indicatorCode: `${name.toUpperCase().replaceAll(" ", "_")}1`,
      indicatorName: `${name} indicator`,
      definition: "Example indicator",
      source: "Test data",
      note: "",
      localOrGlobal: quarter.includes("local") ? "Local" : "Global",
      socialOrEcological: quarter.includes("social")
        ? "Social"
        : "Ecological",
      domainName: name,
      indicatorNarrative: "",
      domainNarrative: "",
      data: [
        {
          year: 2023,
          value: 60,
          unit: "%",
          type: "real",
          localAuthority: "Glasgow",
        },
        {
          year: 2024,
          value: 75,
          unit: "%",
          type: "real",
          localAuthority: "Glasgow",
        },
      ],
      primary: true,
      baseline: 0,
      target: 100,
    },
  ],
})

const domains: DomainData[] = [
  makeDomain("global_social", "Community"),
  makeDomain("local_social", "Health and wellbeing"),
  makeDomain("global_ecological", "Climate"),
  makeDomain("local_ecological", "Nature"),
]

const matchingConnections = [
  {
    sourceName: "health & wellbeing",
    sourceQuarter: "local_social",
    targetName: "community",
    targetQuarter: "global_social",
    description: "outgoing",
  },
  {
    sourceName: "climate",
    sourceQuarter: "global_ecological",
    targetName: "health & wellbeing",
    targetQuarter: "local_social",
    description: "incoming",
  },
  {
    sourceName: "unrelated",
    sourceQuarter: "local_ecological",
    targetName: "nature",
    targetQuarter: "local_ecological",
    description: "unrelated",
  },
]

const baseProps = {
  data: domains,
  year: 2023,
  setHoverText: vi.fn(),
  width: 1200,
  height: 600,
  domain: null,
  setDomain: vi.fn(),
  allConnections: matchingConnections,
  showConnections: false,
  setShowConnections: vi.fn(),
  showAbout: false,
  setShowAbout: vi.fn(),
  showWireframe: false,
}

const statefulChart = (showWireframe = false) => {
  const Wrapper = () => {
    const [domain, setDomain] = useState<DomainData | null>(null)
    return (
      <UnrolledDonutChart
        {...baseProps}
        domain={domain}
        setDomain={setDomain}
        showWireframe={showWireframe}
      />
    )
  }
  return <Wrapper />
}

const createArcNode = (domain: DomainData) => {
  const path = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  )
  path.id = getArcId(domain)
  path.setAttribute("fill", "initial")
  document.body.appendChild(path)
  return path
}

beforeEach(() => {
  window.history.replaceState({}, "", "/")
  document.body.style.overflow = ""
  mocks.createSocial.mockReturnValue([mocks.socialWireframe])
  mocks.createEcological.mockReturnValue([mocks.ecologicalWireframe])
})

afterEach(() => {
  cleanup()
  document.body.innerHTML = ""
  vi.clearAllMocks()
})

describe("UnrolledDonutChart", () => {
  it("renders the responsive SVG and initializes social and ecological sectors", () => {
    const { container } = render(<UnrolledDonutChart {...baseProps} />)

    const svg = container.querySelector("svg")
    expect(svg?.getAttribute("width")).toBe("100vw")
    expect(svg?.getAttribute("height")).toBe("100vh")
    expect(svg?.getAttribute("viewBox")).toBe("0 0 1200 600")

    expect(mocks.createSocial).toHaveBeenCalledTimes(1)
    expect(mocks.createEcological).toHaveBeenCalledTimes(1)
    expect(mocks.createSocial.mock.calls[0][0]).toBe(domains)
    expect(mocks.createSocial.mock.calls[0][1]).toBe(2023)
    expect(mocks.createSocial.mock.calls[0][2]).toEqual({
      windowHeight: 600,
      windowWidth: 1200,
      centralBarHeight: 220,
      barMaxHeight: 78,
    })
  })

  it("redraws the existing chart when year or dimensions change", () => {
    const { rerender } = render(<UnrolledDonutChart {...baseProps} />)
    rerender(
      <UnrolledDonutChart
        {...baseProps}
        year={2024}
        width={1000}
        height={800}
      />
    )

    expect(mocks.redraw).toHaveBeenLastCalledWith(
      domains,
      2024,
      {
        windowHeight: 800,
        windowWidth: 1000,
        centralBarHeight: 220,
        barMaxHeight: 136,
      },
      expect.any(Function),
      expect.objectContaining({
        social: [mocks.socialWireframe],
        ecological: [mocks.ecologicalWireframe],
      })
    )
    expect(mocks.createSocial).toHaveBeenCalledTimes(1)
    expect(mocks.createEcological).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId("tooltip").getAttribute("data-year")).toBe(
      "2024"
    )
  })

  it("shows or hides social and ecological wireframes", () => {
    const { rerender } = render(<UnrolledDonutChart {...baseProps} />)

    expect(mocks.socialWireframe.style).toHaveBeenLastCalledWith(
      "visibility",
      "hidden"
    )
    expect(mocks.ecologicalWireframe.style).toHaveBeenLastCalledWith(
      "visibility",
      "hidden"
    )

    rerender(<UnrolledDonutChart {...baseProps} showWireframe />)
    expect(mocks.socialWireframe.style).toHaveBeenLastCalledWith(
      "visibility",
      "visible"
    )
    expect(mocks.ecologicalWireframe.style).toHaveBeenLastCalledWith(
      "visibility",
      "visible"
    )
  })

  it("updates hover text, tooltip position, and arc highlight through sector callbacks", () => {
    const setHoverText = vi.fn()
    render(
      <UnrolledDonutChart {...baseProps} setHoverText={setHoverText} />
    )

    const hoveredDomain = domains[1]
    const arcNode = createArcNode(hoveredDomain)
    const onMouseOver = mocks.createSocial.mock.calls[0][5]
    const onMouseMove = mocks.createSocial.mock.calls[0][6]
    const onMouseLeave = mocks.createSocial.mock.calls[0][7]

    act(() => {
      onMouseOver(new MouseEvent("mouseover"), hoveredDomain)
      onMouseMove(
        new MouseEvent("mousemove", { clientX: 30, clientY: 45 })
      )
    })

    expect(setHoverText).toHaveBeenLastCalledWith(
      DonutStrings.hoverText.localSocial
    )
    expect(arcNode.getAttribute("fill")).toBe(
      theme.palette.common.arcHover
    )
    expect(screen.getByTestId("tooltip").getAttribute("data-domain")).toBe(
      hoveredDomain.name
    )
    expect(
      screen.getByTestId("tooltip").getAttribute("data-visible")
    ).toBe("true")
    expect(screen.getByTestId("tooltip").getAttribute("data-x")).toBe("40")
    expect(screen.getByTestId("tooltip").getAttribute("data-y")).toBe("55")

    act(() => onMouseLeave(new MouseEvent("mouseleave"), hoveredDomain))
    expect(setHoverText).toHaveBeenLastCalledWith("")
    expect(arcNode.getAttribute("fill")).toBe(theme.palette.common.arc)
    expect(
      screen.getByTestId("tooltip").getAttribute("data-visible")
    ).toBe("false")

    const quarterCases = [
      [domains[0], DonutStrings.hoverText.globalSocial],
      [domains[1], DonutStrings.hoverText.localSocial],
      [domains[2], DonutStrings.hoverText.globalEcological],
      [domains[3], DonutStrings.hoverText.localEcological],
    ] as const
    quarterCases.forEach(([domain, expectedText]) => {
      act(() => onMouseOver(new MouseEvent("mouseover"), domain))
      expect(setHoverText).toHaveBeenLastCalledWith(expectedText)
    })

    const emptyDomain = { ...domains[0], code: "" }
    const emptyArc = createArcNode(emptyDomain)
    act(() => onMouseOver(new MouseEvent("mouseover"), emptyDomain))
    expect(emptyArc.getAttribute("fill")).toBe(
      theme.palette.common.arcEmptyHover
    )
    act(() => onMouseLeave(new MouseEvent("mouseleave"), emptyDomain))
    expect(emptyArc.getAttribute("fill")).toBe(
      theme.palette.common.arcEmpty
    )
  })

  it("opens a domain and provides matching connections to the unrolled details overlay", async () => {
    render(statefulChart())

    const onDomainOpen = mocks.createSocial.mock.calls[0][4]
    act(() => onDomainOpen(domains[1]))

    const details = await screen.findByTestId("domain-details")
    expect(details.textContent).toBe("Health and wellbeing")
    expect(details.getAttribute("data-visible")).toBe("true")
    expect(details.getAttribute("data-unrolled")).toBe("true")
    expect(details.getAttribute("data-connections")).toBe(
      "outgoing,incoming"
    )
    expect(document.body.style.overflow).toBe("hidden")
  })

  it("shows the about section in preference to domain details", () => {
    render(
      <UnrolledDonutChart {...baseProps} domain={domains[0]} showAbout />
    )

    expect(screen.getByTestId("about-section")).not.toBeNull()
    expect(screen.queryByTestId("domain-details")).toBeNull()
  })

  it("omits homepage-only overlays on non-home routes", () => {
    window.history.replaceState({}, "", "/report")
    render(<UnrolledDonutChart {...baseProps} />)

    expect(screen.queryByTestId("tooltip")).toBeNull()
    expect(screen.queryByTestId("domain-labels")).toBeNull()
    expect(document.querySelector("#svg-canvas")).not.toBeNull()
  })
})
