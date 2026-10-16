import Box from "@mui/material/Box"
import type { SxProps } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import type { ResponsiveStyleValue } from "@mui/system"
import { useRef, useState } from "react"
import CircularText from "../Indicator/CircularText"

export type CircularTextProps = {
  text: string
  color: string
  startAngle: number
}

type ImageCircleProps = {
  id: string
  onClick: () => void
  sx: SxProps
  text: string
  imageSrc: string
  absolutePositioning?: boolean
  fontSize?: ResponsiveStyleValue<number | string> | string
  circularText?: CircularTextProps
  isHighlighted?: boolean
}

export const ImageCircle = ({
  id,
  onClick,
  sx,
  text,
  imageSrc,
  absolutePositioning = true,
  fontSize = "20px",
  circularText,
  isHighlighted,
}: ImageCircleProps) => {
  const absolutePositionedStyles: SxProps = {
    position: "absolute",
    top: "50%",
    left: "50%",
  }

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [hover, setHover] = useState(false)

  return (
    <>
      <Box
        id={`${id}-indicator-details-primary-circle`}
        ref={containerRef}
        onClick={onClick}
        onMouseEnter={() => {
          if (!hover) setHover(true)
        }}
        onMouseLeave={() => {
          if (hover) setHover(false)
        }}
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
        {
          <Box
            sx={{
              position: "relative",
              top: "20%",
              left: "12%",
              width: "78%",
            }}
          >
            {
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
            }
          </Box>
        }
        {circularText && (hover || isHighlighted) ? (
          <Box
            sx={{
              position: "absolute",
              left: `-${containerRef.current ? 0.22 * containerRef.current.offsetWidth : 0}px`,
              bottom: `-${containerRef.current ? 0.24 * containerRef.current.offsetWidth : 0}px`,
            }}
          >
            <CircularText
              text={circularText.text}
              onHover="speedUp"
              direction="clockwise"
              spinDuration={17}
              size={
                containerRef.current
                  ? containerRef.current.offsetWidth * 1.41
                  : 100
              }
              fontSize={16}
              draggable
              hoverTilt={16}
              className="custom-class"
              tilt={0}
              fontWeight={900}
              letterSpacing={0}
              startAngle={circularText.startAngle}
              repeat={1}
              ring={false}
              color={circularText.color}
            />
          </Box>
        ) : (
          <></>
        )}
      </Box>
    </>
  )
}
