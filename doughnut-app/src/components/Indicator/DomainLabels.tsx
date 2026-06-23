import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { IndicatorDataDict } from "../../types/DonutData";
import { type SxProps } from "@mui/system";

const labelStyles: SxProps = {
  fontSize: "1.6rem",
  fontWeight: 400,
  justifySelf: "end",
  lineHeight: 1.3,
};

export const DomainLabels = ({
  record,
}: {
  record: IndicatorDataDict | null;
}) => (
  <>
    <Box
      sx={{
        position: "absolute",
        top: 20,
        right: 25,
      }}
    >
      <Typography
        sx={{
          ...labelStyles,
          color:
            record && Object.values(record)[0].quarter.includes("global")
              ? "#ffffff"
              : "#000000",
        }}
      >
        GLOBAL
      </Typography>
      <Typography sx={labelStyles}>RESPONSIBILITIES</Typography>
    </Box>
    <Box
      sx={{
        position: "absolute",
        bottom: 20,
        right: 25,
      }}
    >
      <Typography
        sx={{
          ...labelStyles,
          color:
            record && Object.values(record)[0].quarter.includes("local")
              ? "#ffffff"
              : "#000000",
        }}
      >
        LOCAL
      </Typography>
      <Typography sx={labelStyles}>ASPIRATIONS</Typography>
    </Box>
  </>
);
