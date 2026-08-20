import type { SxProps } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

type DomainContentTextProps = {
  text: string;
  title: string;
};

export const DomainContentText = ({ text, title }: DomainContentTextProps) => {
  const titleStyles: SxProps = {
    padding: "15px",
    fontWeight: 700,
    fontSize: { md: "1.5rem", xl: "1.9rem" },

    textAlign: "center",
  };

  const textStyles: SxProps = {
    paddingTop: "5px",
    paddingBottom: "15px",
    px: "15px",
    fontSize: { md: "1.2rem", xl: "1.6rem" },
    textAlign: "center",
  };

  return (
    <>
      <Typography sx={titleStyles}>{title}</Typography>
      <Typography sx={textStyles}>{text}</Typography>
    </>
  );
};
