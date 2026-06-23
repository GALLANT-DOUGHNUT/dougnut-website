import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import type { SxProps } from "@mui/material/styles";

type IndicatorTextProps = {
  text: string;
  title: string;
  position: "left" | "right";
};

const textBoxStyles: SxProps = {
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
  overflowY: "auto",
};

export const IndicatorText = ({
  text,
  title,
  position,
}: IndicatorTextProps) => {
  const positionedStyles: SxProps =
    position === "left" ? { left: "6%" } : { right: "6%" };

  return (
    <Box
      sx={{
        ...textBoxStyles,
        ...positionedStyles,
      }}
    >
      <Typography
        sx={{
          padding: "15px",
          fontWeight: 700,
          fontSize: { md: "1.5rem", xl: "2rem" },
          textAlign: "center",
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          paddingTop: "5px",
          paddingBottom: "15px",
          px: "15px",
          fontSize: { md: "1.2rem", xl: "1.7rem" },
          textAlign: "center",
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};
