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
    fontSize: { sm: "1.4rem", md: "1.5rem", xl: "1.7rem" },
    textAlign: "center",
  };

  const textStyles: SxProps = {
    paddingTop: "5px",
    paddingBottom: "15px",
    px: "15px",
    fontSize: { sm: "1.1rem", md: "1.2rem", xl: "1.4rem" },
    textAlign: "center",
    wordWrap: "break-word"
  };

  return (
    <>
      <Typography sx={titleStyles} variant="h2" aria-label="domain-section-title">{title}</Typography>
      <Typography sx={textStyles} variant="body1" aria-label="domain-section-content">{text}</Typography>
    </>
  );
};
