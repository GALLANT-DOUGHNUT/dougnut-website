import {
  Stack,
  Typography,
  type SxProps,
  type Theme,
} from "@mui/material"
import Box from "@mui/material/Box"
import Fade from "@mui/material/Fade"
import theme from "../../theme"
import type { JSX } from "react/jsx-runtime"
import { useEffect, useRef } from "react"
import { select } from "d3-selection"
import {
  GenerateEcologicalPreview,
  GenerateSafeZone,
  GenerateSocialPreview,
} from "../../helpers/AboutDonutHelpers"
import type { DonutGeometry } from "./DonutChart"
import type {
  DomainData,
  IndicatorConnection,
  IndicatorPoint,
} from "../../types/DonutData"
import { DomainConnectionsFlowchart } from "../Indicator/DomainConnectionsFlowchart"
import { IndicatorThesholdChart } from "../Indicator/IndicatorThresholdChart"

type AboutProps = {
  showAbout: boolean
  setShowAbout: React.Dispatch<React.SetStateAction<boolean>>
  data: DomainData[]
  connections: IndicatorConnection[]
}

const backdropStyles: SxProps<Theme> = {
  width: "100vw",
  height: "100vh",
  backdropFilter: "blur(8px)",
  zIndex: 0,
  position: "fixed",
  inset: 0,
  backgroundColor: "#0000003a",
}

const contentStyles: SxProps<Theme> = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "52vw",
  minWidth: "820px",
  bgcolor: "#D0EBF1",
  borderRadius: 2,
  border: "solid 2px",
  maxHeight: "60vh",
  boxShadow: 6,
  transition: "all 0.3s ease-in-out",
  padding: theme.spacing(2),
}

const scrollableStyles: SxProps<Theme> = {
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "10px",
  },
  "&::-webkit-scrollbar-track": {
    overflow: "auto",
    borderRadius: 8,
    backgroundColor: "#ffffffd3",
    my: 3,
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#5070907b",
    borderRadius: "5px",
  },
}

const indicatorGraphStyles: SxProps = {
  backgroundColor: theme.palette.background.paper,
  paddingTop: "7px",
  marginBottom: 2,
  borderRadius: theme.spacing(1.5),
  border: "3px solid",
  borderColor: "#004c9334",
  mx: theme.spacing(3.5),
  width: "55%",
}

const SectionHeader = (content: string | JSX.Element) => {
  return (
    <Typography
      sx={{
        fontSize: "1.3rem",
        fontWeight: 600,
        pt: theme.spacing(0.5),
        pb: theme.spacing(0.75),
      }}
    >
      {content}
    </Typography>
  )
}

export const AboutSection = ({
  showAbout,
  setShowAbout,
  data,
  connections,
}: AboutProps) => {
  const size = 600
  const outerRadius = size / 2 - 15
  const innerRadius = outerRadius / 2 + 9
  const ringRadius = size / 7
  const smallRingRadius = size / 9.2
  const innerTextRadius = innerRadius - (ringRadius + smallRingRadius) / 4
  const outerTextRadius = innerRadius + (ringRadius + smallRingRadius) / 4

  const socialRef = useRef(null)
  const ecologicalRef = useRef(null)
  const safeZoneRef = useRef(null)

  const connectionDomain = data.find((d) => d.code === "HOUS")
  const connectionName = connectionDomain!.name
    .replace(" and ", " & ")
    .toLowerCase()

  const basePoint = { localAuthority: "Glasgow", unit: "Percentage" }
  const indicatorData: IndicatorPoint[] = [
    { ...basePoint, year: 2015, value: 67, type: "real" },
    { ...basePoint, year: 2016, value: 64, type: "real" },
    { ...basePoint, year: 2017, value: 74, type: "real" },
    { ...basePoint, year: 2018, value: 78, type: "real" },
    { ...basePoint, year: 2019, value: 73, type: "imputed" },
    { ...basePoint, year: 2020, value: 88, type: "real" },
    { ...basePoint, year: 2021, value: 61, type: "imputed" },
    { ...basePoint, year: 2022, value: 34, type: "real" },
    { ...basePoint, year: 2023, value: 38, type: "real" },
    { ...basePoint, year: 2024, value: 43, type: "real" },
  ]

  useEffect(() => {
    const socialElement = select(socialRef.current)
    if (socialElement) {
      const group = socialElement
        .append("g")
        .attr("transform", "translate(" + size / 2 + "," + size / 2 + ")")

      GenerateSocialPreview(
        {
          innerRadius,
          smallRingRadius,
          ringRadius,
          outerRadius,
          innerTextRadius,
          outerTextRadius,
          margin: 3,
        } as DonutGeometry,
        group
      )
    }
  }, [socialRef])

  useEffect(() => {
    const ecologicalElement = select(ecologicalRef.current)
    if (ecologicalElement) {
      const group = ecologicalElement
        .append("g")
        .attr("transform", "translate(" + size / 2 + "," + size / 2 + ")")

      GenerateEcologicalPreview(
        {
          innerRadius,
          smallRingRadius,
          ringRadius,
          outerRadius,
          innerTextRadius,
          outerTextRadius,
          margin: 3,
        } as DonutGeometry,
        group
      )
    }
  }, [ecologicalRef])

  useEffect(() => {
    const safeZoneElement = select(safeZoneRef.current)
    if (safeZoneElement) {
      const group = safeZoneElement
        .append("g")
        .attr("transform", "translate(" + size / 2 + "," + size / 2 + ")")

      GenerateSafeZone(
        {
          innerRadius,
          smallRingRadius,
          ringRadius,
          outerRadius,
          innerTextRadius,
          outerTextRadius,
          margin: 3,
        } as DonutGeometry,
        group
      )
    }
  }, [safeZoneRef])

  return (
    <Box
      onClick={() => setShowAbout(!showAbout)}
      id="about-section-backdrop"
      sx={backdropStyles}
    >
      <Fade
        in={true}
        timeout={{ enter: 450, exit: 450 }}
        mountOnEnter
        unmountOnExit
      >
        <Box
          id="about-section-content"
          sx={{
            ...contentStyles,
            ...scrollableStyles,
          }}
        >
          {SectionHeader("The Digital Doughnut")}
          <Typography>
            The <i>Digital Doughnut</i> allows you to visualise a portrait of
            Glasgow throughout the past decade. The Doughnut can be used to
            explore Glasgow's <i>Thriving Definitions</i> and understand key
            domains that describe the city's standing in the social and
            ecological realms.
            <br />
            <br />
          </Typography>
          {/* Shortfall Section */}
          <Stack direction={"row"}>
            <Typography sx={{ width: "45%" }}>
              There are basic needs that must be met for all of us to live a
              happy and healthy life. These constitute our{" "}
              <b>social foundation.</b> Falling short of these can cause us harm
              and lead to negative consequences. Shortfalls are depicted by
              inward-extending arcs
              <br />
              <br />
            </Typography>
            <Box sx={{ width: "55%" }}>
              <svg
                className="svgClass"
                ref={socialRef}
                height={0.3 * size}
                width={size}
                style={{ maxWidth: "100%", zoom: "100%" }}
                viewBox={"130 125 300 200"}
              ></svg>
            </Box>
          </Stack>
          {/* Overshoot Section */}
          <Stack direction={"row"} sx={{ mt: theme.spacing(3) }}>
            <Box sx={{ width: "55%" }}>
              <svg
                className="svgClass"
                ref={ecologicalRef}
                height={0.3 * size}
                width={size}
                style={{ maxWidth: "100%", zoom: "100%" }}
                viewBox={"140 45 300 200"}
              ></svg>
            </Box>
            <Typography sx={{ width: "45%" }}>
              However, there are limits on the planet's ability to provide a
              safe and stable environment for us to call home. These define our{" "}
              <b>Ecological Ceiling</b>. Overshooting these limits leads to
              ecological disaster, and these are represented by
              outward-extending arcs
              <br />
              <br />
            </Typography>
          </Stack>
          {/* Safe Space section */}
          <Stack direction={"row"} sx={{ mt: theme.spacing(6) }}>
            <Typography sx={{ width: "45%" }}>
              The central region of the Doughnut represents the safe zone, a
              space where the fundamental needs of a society are met while not
              placing an unsustainable burden on the planet.
            </Typography>
            <Box sx={{ width: "55%" }}>
              <svg
                className="svgClass"
                ref={safeZoneRef}
                height={0.3 * size}
                width={size}
                style={{ maxWidth: "100%", zoom: "100%" }}
                viewBox={"110 105 300 200"}
              ></svg>
            </Box>
          </Stack>
          <Typography sx={{ mt: -3 }}>
            Domains in the upper half show how Glasgow can support society and
            ecology at the <b>global</b> level, while those in the lower half
            describe the <b>local</b>, city-oriented efforts that can be made.
            You can explore the <i>Thriving Definition</i> for a given domain by
            clicking its icon on the Doughnut
            <br />
            <br />
          </Typography>
          {/* Indicator Section */}
          {SectionHeader("Indicators")}
          <Typography sx={{ mt: 0 }}>
            <b>Indicators</b> are the various metrics and measurements we can
            use to gauge Glasgow's standing within a given domain. Through
            collaboration and research, we have defined a number of key
            indicators across most of the local domains.
            <br />
            <br />
          </Typography>
          <Typography sx={{ mt: 0 }}>
            The size of an overshoot/shortfall arc on the Doughnut is tied to
            the primary indicator for that domain. You can use the
            year slider in the top-left corner of the screen to see how this
            varies over time. Hovering over the domain icon shows a percentage
            measure of how much its indicator is in overshoot or shortfall.
            (<b>100%</b> indicating <i>worse</i> than the baseline level, <b>0%</b> meaning <i>better</i>{" "}
            than the ambition level)
            <br />
            <br />
          </Typography>
          <Stack direction={"row"} sx={{ mt: theme.spacing(0) }}>
            <Box sx={{ width: "45%" }}>
              <Typography sx={{ mt: theme.spacing(2) }}>
                To see all of the indicator data series for a particular domain,
                simply click its icon on the Doughnut. If indicators have been
                defined for that domain, they are shown as time-series graphs.
                For years where no data are available, <i>imputed</i>{" "}
                measurements are shown
                <br />
                <br />
                <b>Baseline</b> and <b>Ambition</b> levels are also shown on the graph. Areas shaded in red indicate periods of time where the actual values fall short of the ambition level
              </Typography>
            </Box>
            <Box sx={indicatorGraphStyles}>
              <Typography sx={{ fontWeight: 600, textAlign: "center" }}>
                Sample Indicator Data
              </Typography>
              <IndicatorThesholdChart
                width={0.26 * window.innerWidth}
                height={220}
                margin={{ top: 20, bottom: 23, left: 55, right: 22 }}
                data={indicatorData}
                baseline={25}
                target={95}
                color={theme.palette.graph[1]}
              />
            </Box>
          </Stack>
          {/* Connections Section */}
          {SectionHeader("Connections")}
          <Typography sx={{ mt: 0 }}>
            You can view the connections between domains by clicking the{" "}
            <b>Connections</b> button while viewing a domain's thriving
            definition.
            <br />
          </Typography>
          <Stack direction="row">
            <Box sx={{ width: "65%", borderRadius: "30px" }}>
              <DomainConnectionsFlowchart
                domain={connectionDomain!}
                connections={connections
                  .filter(
                    (c) =>
                      (c.sourceName === connectionName &&
                        c.sourceQuarter === connectionDomain!.quarter) ||
                      (c.targetName === connectionName &&
                        c.targetQuarter === connectionDomain!.quarter)
                  )
                  .slice(0, 5)}
                openConnections={[]}
                setOpenConnections={() => { }}
                setShowConnections={() => { }}
                containerSize={{ width: "92%", height: "400px" }}
              />
            </Box>
            <Typography sx={{ mt: 2, width: "35%" }}>
              The flowchart shows how different domains relate to one another,
              and maps out the directionality of these connections. The
              directionality of the connection indicates whether the domain{" "}
              <i>influences</i> or is <i>affected by</i> another.
              <br />
              <br />
              Some connections may be bi-directional, indicating that both
              domains affect each other in some way. Clicking on either of the
              connected domains will bring up a brief explanation of how they
              affect each other.
            </Typography>
          </Stack>
        </Box>
      </Fade>
    </Box>
  )
}
