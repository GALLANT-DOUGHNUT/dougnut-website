import Box from "@mui/material/Box"
import { ImageCircle } from "../InterfaceComponents/ImageCircle"
import { useScreenSizes } from "../../hooks/useScreenSizes"

type BadgeProps = {
  name: string
  imageSrc: string
}

export const DomainNameBadge = ({ name, imageSrc }: BadgeProps) => {
  const { isXs } = useScreenSizes()
  const position = {
    position: "absolute",
    top: "21vh",
    left: "50%",
  }

  return (
    <Box>
      <ImageCircle
        id="domain-name-badge"
        onClick={() => {}}
        text={name}
        imageSrc={imageSrc}
        sx={{
          ...(isXs ? position : { borderColor: "#000000" }),
          transform: "translate(-50%, -50%)",
          height: {
            md: "calc(min(180px, 30vmin))",
            xl: "22vmin",
            sm: "calc(min(180px, 30vmin))",
            xs: "calc(max(100px, 18vh))",
          },
          bgcolor: "#D0EBF1",
          borderColor: "#000000",
          zIndex: 20,
        }}
        fontSize={{
          xs: "0.85rem",
          sm: "1rem",
          md: "1.25rem",
          xl: "1.35rem",
        }}
        aria-label={`domain-name-${name}`}
        absolutePositioning={isXs ? false : true}
      />
    </Box>
  )
}
