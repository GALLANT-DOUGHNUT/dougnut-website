import { Stack, Typography, type SxProps, type Theme } from "@mui/material"
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

type AboutProps = {
  showAbout: boolean
  setShowAbout: React.Dispatch<React.SetStateAction<boolean>>
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

export const AboutSection = ({ showAbout, setShowAbout }: AboutProps) => {
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
        group,
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
        group,
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
        group,
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
            Domains that describe the city's standing in the social and
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
                viewBox={"110 95 300 200"}
              ></svg>
            </Box>
          </Stack>
          <Typography sx={{ mt: -2 }}>
            Domains in the upper half show how Glasgow can support society and
            ecology at the <b>global</b> level, while those in the lower half
            describe the <b>local</b>, city-oriented efforts that can be made.
            You can explore the <i>Thriving Definition</i> for a given Domain by
            clicking its icon on the Doughnut
            <br />
            <br />
          </Typography>

          {/* The <i>Digital Doughnut</i> is designed to allow you to explore
            Glasgow's <i>Thriving Definitions</i> and the connections between
            them.
            <br />
            <br />
            The definitions are grouped as Local/Global (bottom and top halves
            of the doughnut) and Ecological/Social (blue outer and green inner
            rings). Clicking on a definition will bring up its full definition,
            as well as a brief description of how the city might be different if
            the definition were implemented.
            <br />
            <br />
            If any connections were identified between the selected definition
            and other definitions, you can view them here. Selecting{" "}
            <i>'Connections from this domain'</i> will show definitions which
            the selected definition might influence, whereas selecting{" "}
            <i>'Connections to this domain'</i> will show which other
            definitions might influence the currently selected definition. In
            both cases, clicking on the connected definitions will bring up a
            brief explanation of how they affect eachother.
            <br />
            <br />
            If you want more information about how these connections were
            identified, the button <i>
              'How did we derive these connections?'
            </i>{" "}
            is present any time connections are being displayed. For more
            information about the <i>Glasgow Doughnut</i> generally, scroll down
            after closing this prompt. */}
          {SectionHeader("Indicators")}
          <Typography sx={{ mt: 0 }}>
            <b>Indicators</b> are the various metrics and measurements we can
            use to gauge Glasgow's progress within a given Domain. Through
            collaboration and research, we have defined a number of key
            indicator data series across most of the local domains.
            <br />
            <br />
          </Typography>
          <Typography sx={{ mt: 0 }}>
            The size of an overshoot/shortfall arc on the Doughnut is tied to
            the primary indicator value for that Domain. You can use the year
            slider in the top-left corner of the screen to see how this evolves
            over the last decade.
            <br />
            <br />
          </Typography>
          <Typography sx={{ mt: 0 }}>
            To see all of the indicator data series for a particular Domain,
            simply click its icon on the Doughnut. If indicators have been
            identified, these are shown as time-series graphs.
            <br />
            <br />
          </Typography>
          {SectionHeader("Connections")}
        </Box>
      </Fade>
    </Box>
  )
}
