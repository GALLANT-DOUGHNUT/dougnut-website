import useEmblaCarousel from "embla-carousel-react";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./CarouselArrowButtons";
import type { EmblaOptionsType } from "embla-carousel";
import type { JSX } from "react/jsx-runtime";
import { Box, type SxProps } from "@mui/material";

type PropType = {
  containerWidth: string;
  slides: JSX.Element[];
  slideSize: string;
  slideSpacing: string;
  sx: SxProps;
  options?: EmblaOptionsType;
};

export const VerticalCarousel = (props: PropType) => {
  const { slides, containerWidth, options, slideSize, slideSpacing, sx } =
    props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const axis = "y";

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <Box
      sx={{
        maxWidth: containerWidth,
        margin: "auto",
        height: "70vh",
        ...sx,
      }}
      id="carousel-canvas"
    >
      <Box
        sx={{ overflow: "hidden", height: "100%" }}
        ref={emblaRef}
        id="carousel-container"
      >
        <Box
          id="carousel-viewport"
          sx={{
            display: "flex",
            touchAction: "pan-y pinch-zoom",
            marginLeft: `calc(${slideSpacing} * -1)`,
            ...(axis === "y"
              ? {
                  flexDirection: "column",
                  height: "100%",
                }
              : {}),
          }}
        >
          {slides.map((element, index) => (
            <Box
              sx={{
                minWidth: 0,
                flex: `0 0 ${slideSize}`,
                paddingLeft: `${slideSpacing}`,
                paddingY: axis === "y" ? slideSpacing : 0,
              }}
              key={index}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {element}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          justifyContent: "space-between",
        }}
        id="carousel-buttons"
      >
        <Box
          sx={{
            alignItems: "center",
          }}
        >
          <PrevButton
            onClick={onPrevButtonClick}
            disabled={prevBtnDisabled}
            vertical={true}
          />
          <NextButton
            onClick={onNextButtonClick}
            disabled={nextBtnDisabled}
            vertical={true}
          />
        </Box>
      </Box>
    </Box>
  );
};
