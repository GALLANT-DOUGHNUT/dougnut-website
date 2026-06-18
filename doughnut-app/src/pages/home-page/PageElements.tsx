// import styled from 'styled-components'
import {styled} from "@mui/material/styles"

// export const ImageBg = () => styled.img`
//   display:'';
//   width:100%;
//   height:100vh;
//   -o-object-fit: cover;
//   object-fit: cover;
//   background:#232a34;
//   opacity:0.5;
//   z-index: -2;
// `

export const ImageBg = styled("img")({
  display: "block",
  width: "100%",
  height: "100vh",
  objectFit: "cover",
  background: "#232a34",
  opacity: 0.5
})

export const MainBg = styled("div")({
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: "100%",
  height: "100vh",
  overflow: "hidden",
  zIndex: -1,
  fontSize: 0,
});
