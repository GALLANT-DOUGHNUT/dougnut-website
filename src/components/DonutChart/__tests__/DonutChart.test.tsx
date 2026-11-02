// @vitest-environment jsdom

import { act, cleanup, render, screen } from "@testing-library/react"
import { useState } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { DomainData } from "../../../types/DonutData"
import { getArcId } from "../../../helpers/DonutHelpers"
import { DonutStrings } from "../../../resources/strings"
import theme from "../../../theme"
import { DonutChart } from "../DonutChart"

const mocks = vi.hoisted(() => ({
  innerWireframe: { style: vi.fn() },
  outerWireframe: { style: vi.fn() },
  createInner: vi.fn(),
  createOuter: vi.fn(),
  adjustArcs: vi.fn(),
}))

vi.mock("../../../helpers/DonutHelpers", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../../helpers/DonutHelpers")>()
  return {
    ...actual,
    createDonutInnerSectors: mocks.createInner,
    createDonutOuterSectors: mocks.createOuter,
    AdjustIndicatorArcs: mocks.adjustArcs,
  }
})

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
  size: 500,
  height: 800,
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
      <DonutChart
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
  mocks.createInner.mockReturnValue([mocks.innerWireframe])
  mocks.createOuter.mockReturnValue([mocks.outerWireframe])
})

afterEach(() => {
  cleanup()
  document.body.innerHTML = ""
  vi.clearAllMocks()
})

describe("DonutChart", () => {
  it("renders the SVG and initializes both donut sectors with the supplied data and year", () => {
    const { container } = render(<DonutChart {...baseProps} />)

    const svg = container.querySelector("svg")
    expect(svg?.getAttribute("width")).toBe("500")
    expect(svg?.getAttribute("height")).toBe("500")
    expect(svg?.getAttribute("viewBox")).toBe("100 85 500 550")

    expect(mocks.createInner).toHaveBeenCalledTimes(1)
    expect(mocks.createOuter).toHaveBeenCalledTimes(1)
    expect(mocks.createInner.mock.calls[0][0]).toBe(domains)
    expect(mocks.createInner.mock.calls[0][1]).toBe(2023)
    expect(mocks.createOuter.mock.calls[0][0]).toBe(domains)
    expect(mocks.createOuter.mock.calls[0][1]).toBe(2023)
  })

  it("updates arc values when the selected year changes", () => {
    const { rerender } = render(<DonutChart {...baseProps} />)
    rerender(<DonutChart {...baseProps} year={2024} />)

    expect(mocks.adjustArcs).toHaveBeenCalledWith(
      domains,
      2023,
      2024,
      expect.objectContaining({ outerRadius: 230, innerRadius: 115 }),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    )
    expect(mocks.createInner).toHaveBeenCalledTimes(1)
    expect(mocks.createOuter).toHaveBeenCalledTimes(1)
  })

  it("shows or hides the returned inner and outer wireframes", () => {
    const { rerender } = render(<DonutChart {...baseProps} />)

    expect(mocks.innerWireframe.style).toHaveBeenLastCalledWith(
      "visibility",
      "hidden"
    )
    expect(mocks.outerWireframe.style).toHaveBeenLastCalledWith(
      "visibility",
      "hidden"
    )

    rerender(<DonutChart {...baseProps} showWireframe />)
    expect(mocks.innerWireframe.style).toHaveBeenLastCalledWith(
      "visibility",
      "visible"
    )
    expect(mocks.outerWireframe.style).toHaveBeenLastCalledWith(
      "visibility",
      "visible"
    )
  })

  it("updates hover text, tooltip position, and arc highlight through sector callbacks", () => {
    const setHoverText = vi.fn()
    render(<DonutChart {...baseProps} setHoverText={setHoverText} />)

    const hoveredDomain = domains[2]
    const arcNode = createArcNode(hoveredDomain)
    const onMouseOver = mocks.createOuter.mock.calls[0][6]
    const onMouseMove = mocks.createOuter.mock.calls[0][7]
    const onMouseLeave = mocks.createOuter.mock.calls[0][8]

    act(() => {
      onMouseOver(new MouseEvent("mouseover"), hoveredDomain)
      onMouseMove(
        new MouseEvent("mousemove", { clientX: 30, clientY: 45 })
      )
    })

    expect(setHoverText).toHaveBeenLastCalledWith(
      DonutStrings.hoverText.globalEcological
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

  it("opens a domain and supplies only its matching connections to the details overlay", async () => {
    render(statefulChart())

    const onDomainOpen = mocks.createInner.mock.calls[0][5]
    act(() => onDomainOpen(domains[1]))

    const details = await screen.findByTestId("domain-details")
    expect(details.textContent).toBe("Health and wellbeing")
    expect(details.getAttribute("data-visible")).toBe("true")
    expect(details.getAttribute("data-unrolled")).toBe("false")
    expect(details.getAttribute("data-connections")).toBe(
      "outgoing,incoming"
    )
    expect(document.body.style.overflow).toBe("hidden")
  })

  it("shows the about section in preference to domain details", () => {
    render(<DonutChart {...baseProps} domain={domains[0]} showAbout />)

    expect(screen.getByTestId("about-section")).not.toBeNull()
    expect(screen.queryByTestId("domain-details")).toBeNull()
  })

  it("omits homepage-only overlays on non-home routes", () => {
    window.history.replaceState({}, "", "/report")
    render(<DonutChart {...baseProps} />)

    expect(screen.queryByTestId("tooltip")).toBeNull()
    expect(screen.queryByTestId("domain-labels")).toBeNull()
    expect(
      document.getElementById("donut-global-local-boundary-line")
    ).toBeNull()
  })
})
