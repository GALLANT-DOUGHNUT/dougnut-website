import { Typography } from "@mui/material"
import Box from "@mui/material/Box"
import type { SxProps } from "@mui/material/styles"
import type { PropsWithChildren } from "react"

type ContentBoxProps = PropsWithChildren<{
  position: "left" | "right" | "mobile"
  stickyHeader?: string
}>

const contentBoxStyles: SxProps = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  width: "28vw",
  bgcolor: "#D0EBF1",
  borderRadius: 2,
  border: "solid 2px",
  boxShadow: 6,
  transition: "all 0.3s ease-in-out",
}

const scrollBarStyles: SxProps = {
  "&::-webkit-scrollbar": {
    width: "10px",
  },
  "&::-webkit-scrollbar-track": {
    overflow: "auto",
    borderRadius: 8,
    backgroundColor: "#ffffffd3",
    my: 2,
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#5070907b",
    borderRadius: "5px",
  },
}

export const DomainContentBox = ({
  position,
  stickyHeader,
  children,
}: ContentBoxProps) => {
  const boxHeight = position === "mobile" ? "60vh" : "75vh"
  const contentHeight = stickyHeader ? "65vh" : "75vh"
  const mobileContentHeight = stickyHeader ? "50vh" : "60vh"

  const positionedStyles: SxProps =
    position === "mobile"
      ? {
          left: "50%",
          transform: "translate(-50%, -32%)",
          maxHeight: "60vh",
        }
      : position === "left"
        ? { left: "6%" }
        : { right: "6%" }

  const stickyHeaderStyles: SxProps = {
    padding: "15px",
    fontWeight: 700,
    fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.5rem", xl: "1.9rem" },
    textAlign: "center",
  }

  return (
    <>
      <Box
        sx={{
          ...contentBoxStyles,
          ...positionedStyles,
          width: position === "mobile" ? "80vw" : "28vw",
          maxHeight: boxHeight,
        }}
      >
        {stickyHeader ? (
          <Box sx={{ height: "8vh" }}>
            <Typography sx={stickyHeaderStyles} variant="h2">
              {stickyHeader}
            </Typography>
          </Box>
        ) : (
          <></>
        )}
        <Box
          sx={{
            overflowY: "auto",
            maxHeight:
              position === "mobile" ? mobileContentHeight : contentHeight,
            overflow: "auto",
            ...scrollBarStyles,
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  )
}
