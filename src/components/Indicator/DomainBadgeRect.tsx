import Box from "@mui/material/Box"
import { Stack, Typography } from "@mui/material"
import theme from "../../theme"

type BadgeProps = {
  name: string
  imageSrc: string
}

export const DomainBadgeRect = ({ name, imageSrc }: BadgeProps) => {
  return (
    <Box
      sx={{
        position: "absolute",
        borderRadius: "10px",
        boxShadow: 6,
        borderColor: "#000000",
        bgcolor: "#D0EBF1",
        border: "2px solid",
        cursor: "pointer",
        transform: "translate(-50%, -50%)",
        left: "50%",
        top: "19%",
        width: "60vw",
        height: "11vh",
      }}
    >
      <Stack direction="row" sx={{ width: "100%", height: "100%" }}>
        <Box
          id={`${name}-image-container`}
          sx={{
            position: "relative",
            height: "45%",
            left: "6%",
            top: "25%",
          }}
        >
          <Box
            id={`${name}-image`}
            component="img"
            src={imageSrc}
            alt={"domain name image"}
            sx={{
              objectFit: "contain",
              alignSelf: "center",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          />
        </Box>

        <Box
          sx={{
            width: "90%",
            justifyContent: "center",
            alignContent: "center",
            ml: theme.spacing(1.5),
          }}
        >
          <Stack direction={"column"}>
            <Typography
              sx={{
                textAlign: "center",
                fontWeight: 600,
                fontSize: "0.9rem",
                lineHeight: 1.12,
              }}
            >
              {name}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
