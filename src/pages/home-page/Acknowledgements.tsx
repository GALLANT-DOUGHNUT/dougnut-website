import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import type { JSX } from "react/jsx-runtime"
import WebIcon from "@mui/icons-material/Web"
import StackedBarChartIcon from "@mui/icons-material/StackedBarChart"
// import NaturePeopleIcon from "@mui/icons-material/NaturePeople"
import GroupsIcon from "@mui/icons-material/Groups"
import theme from "../../theme"
import Tooltip from "@mui/material/Tooltip"

const Acknowledgement = (name: string | JSX.Element, role: string) => {
  return (
    <Box sx={{ width: "100%", display: "flex" }}>
      <Typography
        noWrap
        sx={{
          fontSize: "1rem",
          fontWeight: 600,
          mr: theme.spacing(1.7),
        }}
      >
        {name} /
      </Typography>
      <Typography
        sx={{
          fontSize: "1rem",
          maxWidth: "60%",
        }}
      >
        {role}
      </Typography>
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
      <Typography
        sx={{
          fontWeight: 600,
          justifySelf: "center",
          fontSize: "1.3rem",
        }}
      >
        <Tooltip title="Development">
          <WebIcon sx={{ my: theme.spacing(1) }} />
        </Tooltip>
      </Typography>
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
        "Styling & development of additional features (time-resolution, unrolled variant, Indicator display)"
      )}
      <Typography
        sx={{
          fontWeight: 600,
          justifySelf: "center",
          fontSize: "1.3rem",
        }}
      >
        <Tooltip title="Research & Data Collation">
          <StackedBarChartIcon sx={{ my: theme.spacing(1) }} />
        </Tooltip>
      </Typography>
      {Acknowledgement("Michalis Georgiou", "Placeholder")}
      {Acknowledgement("Luning Li", "Placeholder")}
      {Acknowledgement("Nick Bailey", "Placeholder")}
      {Acknowledgement("Claire Miller", "Placeholder")}
      {Acknowledgement("Jo Winterbottom", "Placeholder")}
      {Acknowledgement("Alice Maclachlan", "Placeholder")}
      {Acknowledgement("Cris Hasan", "Placeholder")}
      <Typography
        sx={{
          fontWeight: 600,
          justifySelf: "center",
          fontSize: "1.3rem",
        }}
      >
        <Tooltip title="Engagement & Collaboration">
          <GroupsIcon sx={{ my: theme.spacing(1) }} />
        </Tooltip>
      </Typography>
      {Acknowledgement("Glasgow City Council", "Placeholder")}
    </Box>
  )
}
