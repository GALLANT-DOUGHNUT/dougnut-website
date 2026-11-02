import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import type { JSX } from "react/jsx-runtime"
import WebIcon from "@mui/icons-material/Web"
import StackedBarChartIcon from "@mui/icons-material/StackedBarChart"
import GroupsIcon from "@mui/icons-material/Groups"
import theme from "../../theme"

const Acknowledgement = (name: string | JSX.Element, role: string) => {
  return (
    <Box sx={{ width: "100%", display: "flex" }}>
      <Typography
        sx={{
          fontSize: "1rem",
          fontWeight: 600,
          mr: theme.spacing(1.7),
          maxWidth: "25%",
        }}
      >
        {name} /
      </Typography>
      <Typography
        sx={{
          fontSize: "1rem",
          maxWidth: "70%",
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
        mb: theme.spacing(2),
      }}
    >
      {icon}
      <Typography sx={{ fontWeight: 600 }}>{name}</Typography>
    </Box>
  )
}

export const Acknowledgements = () => {
  return (
    <Box sx={{ width: "60%", mt: theme.spacing(4) }}>
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
        <>
          <a
            style={{ color: "inherit" }}
            href="https://linktr.ee/the_donut_team"
            target="_blank"
          >
            Donut Team
          </a>{" "}
        </>,
        "For building the initial version of the application."
      )}
      {Acknowledgement(
        "Stephen Brown",
        "Development & styling of additional features (time-resolution, unrolled variant, Indicator & Connection display)"
      )}
      {Header(
        "Research & Data Collation",
        <StackedBarChartIcon sx={{ mt: theme.spacing(2) }} />
      )}
      {Acknowledgement("Michalis Georgiou", "Placeholder")}
      {Acknowledgement("Luning Li", "Placeholder")}
      {Acknowledgement("Nick Bailey", "Placeholder")}
      {Acknowledgement("Claire Miller", "Placeholder")}
      {Acknowledgement("Jo Winterbottom", "Placeholder")}
      {Acknowledgement("Alice Maclachlan", "Placeholder")}
      {Acknowledgement("Cris Hasan", "Placeholder")}
      {Header(
        "Engagement & Collaboration",
        <GroupsIcon sx={{ mt: theme.spacing(2) }} />
      )}
      {Acknowledgement("Glasgow City Council", "Placeholder")}
    </Box>
  )
}
