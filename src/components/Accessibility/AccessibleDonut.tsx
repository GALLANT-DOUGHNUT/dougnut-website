import Box from "@mui/material/Box"
import type { SxProps } from "@mui/material/styles"
import type { DomainData } from "../../types/DonutData"
import { AccessibleDomain } from "./AccessibleDomain"

type AccessibleDonutProps = {
  data: DomainData[]
  year: number
}

const navigationStyles: SxProps = {
  position: "fixed",
  top: "1rem",
  left: "1rem",
  zIndex: 10000,
  width: "1px",
  height: "1px",
  p: 0,
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
}

export const AccessibleDonut = ({ data, year }: AccessibleDonutProps) => {
  return (
    <Box
      component="nav"
      sx={navigationStyles}
      aria-label="EXPLORE THE VARIOUS DIGITAL DOUGHNUT DOMAINS"
    >
      <h2>Explore Domains</h2>
      <ul aria-label="Domain List">
        {data.map((domain) => {
          return <AccessibleDomain domain={domain} year={year} />
        })}
      </ul>
    </Box>
  )
}
