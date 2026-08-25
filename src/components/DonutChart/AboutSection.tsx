import { Stack, Typography, type SxProps, type Theme } from "@mui/material";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import theme from "../../theme";
import type { JSX } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import { useEdges } from "@xyflow/react";
import { select } from "d3-selection";
import { GenerateSocialPreview } from "../../helpers/AboutDonutHelpers";
import type { DonutGeometry } from "./DonutChart";

type AboutProps = {
  showAbout: boolean;
  setShowAbout: React.Dispatch<React.SetStateAction<boolean>>;
};

const backdropStyles: SxProps<Theme> = {
  width: "100vw",
  height: "100vh",
  backdropFilter: "blur(8px)",
  zIndex: 0,
  position: "fixed",
  inset: 0,
  backgroundColor: "#0000003a",
};

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
};

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
};

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
  );
};

export const AboutSection = ({ showAbout, setShowAbout }: AboutProps) => {
  const size = 600;
  const socialRef = useRef(null);
  const ecologicalRef = useRef(null);

  useEffect(() => {
    const svgElement = select(socialRef.current);
    if (svgElement) {
      const outerRadius = size / 2 - 20;
      const innerRadius = outerRadius / 2;
      const ringRadius = size / 7;
      const smallRingRadius = size / 9.2;

      const grup = svgElement
        .append("g")

      GenerateSocialPreview(
        { innerRadius, smallRingRadius, ringRadius } as DonutGeometry,
        grup,
      );
    }
  }, [socialRef]);

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
          <Stack direction={"row"}>
            <Typography sx={{ width: "38%" }}>
              There are basic needs that must be met for all of us to live a
              happy and healthy life. These constitute our{" "}
              <b>social foundation.</b> Falling short of these can cause us harm
              and lead to negative consequences.
              <br />
              <br />
            </Typography>
            <Box sx={{width: "62%"}}>
              <svg
                className="svgClass"
                ref={socialRef}
                height={0.3 * size}
                width={size}
                style={{ maxWidth: "100%", zoom: "120%" }}
                viewBox={"-120 0 300 200"}
              ></svg>
            </Box>
          </Stack>
          However, there are also limits on the planet's ability to provide a
          safe and stable environment for us to call home. These define our{" "}
          <b>Ecological Ceiling</b>
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
          {SectionHeader("Connections")}
        </Box>
      </Fade>
    </Box>
  );
};
