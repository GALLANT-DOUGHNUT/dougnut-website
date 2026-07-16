import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { IndicatorDataDict } from "../../types/DonutData";
import { type SxProps } from "@mui/system";

type DomainLabelProps = {
  record: IndicatorDataDict | null;
  unrolled: boolean;
};

const labelStyles: SxProps = {
  fontSize: "1.4rem",
  fontWeight: 550,
  justifySelf: "end",
  lineHeight: 1.3,
};

export const DomainLabels = ({ record, unrolled }: DomainLabelProps) => (
  <>
    <Box
      sx={
        unrolled
          ? { position: "absolute", right: "51.5%", bottom: 15 }
          : {
              position: "absolute",
              top: 15,
              right: 25,
            }
      }
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
      sx={
        unrolled
          ? { position: "absolute", left: "50%", bottom: 15 }
          : {
              position: "absolute",
              bottom: 15,
              right: 25,
            }
      }
    >
      <Typography
        sx={{
          ...labelStyles,
          justifySelf: unrolled ? "start" : "end",
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
