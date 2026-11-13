import type { SxProps } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import { Fragment, type ReactNode } from "react"

const urlPattern = /https?:\/\/[^\s<>"']+/gi

const renderTextWithHyperlinks = (text: string): ReactNode => {
  const content: ReactNode[] = []
  let lastIndex = 0

  for (const match of text.matchAll(urlPattern)) {
    const matchIndex = match.index
    const url = match[0].replace(/[.,!?;:]+$/, "")
    const trailingPunctuation = match[0].slice(url.length)

    if (matchIndex === undefined || !url) continue

    content.push(text.slice(lastIndex, matchIndex))
    content.push(
      <Fragment key={matchIndex}>
        <a href={url} target="_blank" rel="noreferrer">
          {url}
        </a>
        {trailingPunctuation}
        <br />
      </Fragment>
    )
    lastIndex = matchIndex + match[0].length
  }

  content.push(text.slice(lastIndex))
  return content
}

type DomainContentTextProps = {
  text: string
  title: string
  renderHyperlinks?: boolean
}

export const DomainContentText = ({
  text,
  title,
  renderHyperlinks = false,
}: DomainContentTextProps) => {
  const titleStyles: SxProps = {
    padding: "15px",
    fontWeight: 700,
    fontSize: { xs: "1.2rem", sm: "1.4rem", md: "1.5rem", xl: "1.7rem" },
    textAlign: "center",
  }

  const textStyles: SxProps = {
    paddingTop: "5px",
    paddingBottom: "15px",
    px: "15px",
    fontSize: { sm: "1.1rem", md: "1.2rem", xl: "1.4rem" },
    textAlign: "center",
    wordWrap: "break-word",
  }

  return (
    <>
      <Typography
        sx={titleStyles}
        variant="h2"
        aria-label="domain-section-title"
      >
        {title}
      </Typography>
      <Typography
        sx={textStyles}
        variant="body1"
        aria-label="domain-section-content"
      >
        {renderHyperlinks ? renderTextWithHyperlinks(text) : text}
      </Typography>
    </>
  )
}
