import Box from "@mui/material/Box";
import type { SxProps } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import type { ResponsiveStyleValue } from "@mui/system";

type ImageCircleProps = {
  id: string;
  onClick: () => void;
  sx: SxProps;
  text: string;
  imageSrc: string;
  absolutePositioning?: boolean;
  fontSize?: ResponsiveStyleValue<number | string> | string;
};

export const ImageCircle = ({
  id,
  onClick,
  sx,
  text,
  imageSrc,
  absolutePositioning = true,
  fontSize = "20px",
}: ImageCircleProps) => {
  const absolutePositionedStyles: SxProps = {
    position: "absolute",
    top: "50%",
    left: "50%",
  };

  return (
    <Box
      id={`${id}-indicator-details-primary-circle`}
      onClick={onClick}
      sx={{
        ...(absolutePositioning ? absolutePositionedStyles : {}),
        aspectRatio: "1/1",
        borderRadius: "50%",
        boxShadow: 6,
        borderColor: "#000000",
        border: "3px solid",
        cursor: "pointer",
        ...sx,
      }}
    >
      <Box
        id={`${id}-image-container`}
        sx={{
          position: "relative",
          top: "18%",
          left: "37%",
          width: "26%",
          height: "26%",
          display: "flex",
          alignSelf: "center",
          justifyContent: "center",
        }}
      >
        <Box
          id={`${id}-image`}
          component="img"
          src={imageSrc}
          alt={"primary circle"}
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
          position: "relative",
          top: "20%",
          left: "12%",
          width: "78%",
        }}
      >
        <Typography
          sx={{
            color: "black",
            textAlign: "center",
            fontWeight: 700,
            fontSize: fontSize,
            lineHeight: 1.25,
          }}
        >
          {text}
        </Typography>
      </Box>
    </Box>
  );
};
