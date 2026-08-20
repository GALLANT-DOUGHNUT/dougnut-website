import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import type { SxProps } from "@mui/material/styles";
import type { PropsWithChildren } from "react";

type ContentBoxProps = PropsWithChildren<{
  position: "left" | "right";
  stickyHeader?: string;
}>;

const contentBoxStyles: SxProps = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  width: "28vw",
  bgcolor: "#D0EBF1",
  borderRadius: 2,
  border: "solid 2px",
  maxHeight: "75vh",
  boxShadow: 6,
  transition: "all 0.3s ease-in-out",
};

export const DomainContentBox = ({
  position,
  stickyHeader,
  children,
}: ContentBoxProps) => {
  const positionedStyles: SxProps =
    position === "left" ? { left: "6%" } : { right: "6%" };

  const stickyHeaderStyles: SxProps = {
    padding: "15px",
    fontWeight: 700,
    fontSize: { md: "1.5rem", xl: "1.9rem" },
    textAlign: "center",
  };

  return (
    <>
      <Box
        sx={{
          ...contentBoxStyles,
          ...positionedStyles,
        }}
      >
        {stickyHeader ? (
          <Box sx={{ height: "8vh" }}>
            <Typography sx={stickyHeaderStyles}>{stickyHeader}</Typography>
          </Box>
        ) : (
          <></>
        )}
        <Box sx={{ overflowY: "auto", maxHeight: stickyHeader ? "65vh" : "75vh" }}>
          {children}
        </Box>
      </Box>
    </>
  );
};
