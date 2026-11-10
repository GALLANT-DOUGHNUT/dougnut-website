import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import type { JSX } from "react/jsx-runtime"
import WebIcon from "@mui/icons-material/Web"
import StackedBarChartIcon from "@mui/icons-material/StackedBarChart"
import GroupsIcon from "@mui/icons-material/Groups"
import theme from "../../theme"
import { useScreenSizes } from "../../hooks/useScreenSizes"

type NameLink = {
  name: string
  url?: string
}

const Acknowledgement = (
  name: NameLink,
  role: string | JSX.Element,
  isMobile: boolean
) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        my: theme.spacing(0.5),
        mx: isMobile ? theme.spacing(1.5) : 0,
        justifyContent: isMobile ? "start" : "center",
      }}
    >
      <Typography
        sx={{
          fontSize: isMobile ? "0.8rem" : "1rem",
          fontWeight: 600,
          mr: theme.spacing(1.7),
          maxWidth: isMobile ? "35%" : "25%",
          ...(isMobile && {
            width: "35%",
          }),
        }}
      >
        {name.url ? (
          <a style={{ color: "inherit" }} href={name.url} target="_blank">
            {name.name}
          </a>
        ) : (
          name.name
        )}{" "}
        /
      </Typography>
      <Typography
        sx={{
          fontSize: isMobile ? "0.8rem" : "1rem",
          maxWidth: isMobile ? "60%" : "70%",
          ...(isMobile && {
            width: "70%",
          }),
        }}
      >
        {role}
      </Typography>
    </Box>
  )
}

const Header = (name: string, icon: JSX.Element) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mb: theme.spacing(2.5),
        mt: theme.spacing(2),
      }}
    >
      {icon}
      <Typography sx={{ fontWeight: 600 }}>{name}</Typography>
    </Box>
  )
}

export const Acknowledgements = () => {
  const { isXs, isSm } = useScreenSizes()
  const isMobile = isXs || isSm

  return (
    <Box sx={{ width: isMobile ? "100%" : "58%", mt: theme.spacing(4) }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: 600, justifySelf: "center" }}
      >
        Acknowledgements
      </Typography>
      {Header(
        "Development",
        <WebIcon sx={{ mt: theme.spacing(1), justifySelf: "center" }} />
      )}
      {Acknowledgement(
        { name: "Donut Team", url: "https://linktr.ee/the_donut_team" },
        "For building the initial version of the application.",
        isMobile
      )}
      {Acknowledgement(
        {
          name: "Stephen Brown",
          url: "https://www.gla.ac.uk/schools/socialpolitical/staff/index.html/staffcontact/person/4edcefe78190",
        },
        "Development & styling",
        isMobile
      )}
      {Acknowledgement(
        { name: "Andrew Clarke" },
        "Development & styling",
        isMobile
      )}
      {Acknowledgement(
        { name: "Ermia Hassanpour" },
        "Development & styling",
        isMobile
      )}
      {Acknowledgement(
        { name: "Heather Sinclair" },
        "Data access & licensing",
        isMobile
      )}
      {Acknowledgement(
        {
          name: "Barbara Alvarez Solanilla",
          url: "https://www.gla.ac.uk/stafflist/search/person/4edee7e1849e/",
        },
        "Project management",
        isMobile
      )}
      {Header(
        "Research & Data Collation",
        <StackedBarChartIcon sx={{ mt: theme.spacing(2) }} />
      )}
      {Acknowledgement(
        {
          name: "Michalis Georgiou",
          url: "https://www.gla.ac.uk/schools/socialpolitical/staff/michailgeorgiou/",
        },
        "Data sourcing & analysis",
        isMobile
      )}
      {Acknowledgement(
        {
          name: "Luning Li",
          url: "https://www.gla.ac.uk/schools/socialpolitical/staff/luningli/",
        },
        "Data sourcing & analysis",
        isMobile
      )}
      {Acknowledgement(
        {
          name: "Nick Bailey",
          url: "https://www.gla.ac.uk/schools/socialpolitical/staff/nickbailey/",
        },
        "Data sourcing & analysis",
        isMobile
      )}
      {Acknowledgement(
        {
          name: "Claire Miller",
          url: "https://www.gla.ac.uk/schools/mathematicsstatistics/staff/clairemiller/",
        },
        <>
          Data & data analytics lead for{" "}
          <a
            style={{ color: "inherit" }}
            href="https://www.gla.ac.uk/research/az/sustainablesolutions/ourprojects/gallant/"
            target="_blank"
          >
            GALLANT
          </a>{" "}
        </>,
        isMobile
      )}
      {Header(
        "Engagement & Collaboration",
        <GroupsIcon sx={{ mt: theme.spacing(2) }} />
      )}
      {Acknowledgement(
        {
          name: "Jo Winterbottom",
          url: "https://www.gla.ac.uk/schools/healthwellbeing/staff/jowinterbottom/",
        },
        "Stakeholder Engagement",
        isMobile
      )}
      {Acknowledgement(
        {
          name: "Alice Maclachlan",
          url: "https://www.gla.ac.uk/schools/healthwellbeing/staff/alicemaclachlan/#biography",
        },
        "Stakeholder Engagement",
        isMobile
      )}
      {Acknowledgement(
        {
          name: "Cris Hasan",
          url: "https://www.gla.ac.uk/schools/mathematicsstatistics/staff/raghebhasan/",
        },
        "Stakeholder Engagement",
        isMobile
      )}
      {Acknowledgement(
        {
          name: "Glasgow City Council",
          url: "https://www.glasgow.gov.uk/",
        },
        "Co-development of thriving definitions",
        isMobile
      )}
    </Box>
  )
}
