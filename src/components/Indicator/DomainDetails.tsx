import { useMemo, useState } from "react"
import type {
  DomainData,
  IndicatorConnection,
} from "../../types/DonutData"
import Box from "@mui/material/Box"
import { Fade } from "@mui/material"
import { findIconSrc } from "../../helpers/DonutHelpers"
import { DomainContentBox } from "./DomainContentBox"
import { ConnectionsDetailsModal } from "./ConnectionDetailsModal"
import { DomainConnectionsFlowchart } from "./DomainConnectionsFlowchart"
import { DomainContentText } from "./DomainContentText"
import { IndicatorDetails } from "./IndicatorDetails"
import { DomainOverlay } from "./DomainOverlay"
import { DomainNameBadge } from "./DomainNameBadge"
import { useScreenSizes } from "../../hooks/useScreenSizes"
import { DomainDisplaySwitchButton } from "./DomainDisplaySwitchButton"

type DetailsProps = {
  visible: boolean
  domain: DomainData
  indicatorConnections: IndicatorConnection[]
  allConnections: IndicatorConnection[]
  unrolled: boolean
  showConnections: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  setDomain: React.Dispatch<React.SetStateAction<DomainData | null>>
  setShowConnections: React.Dispatch<React.SetStateAction<boolean>>
}

export const DomainDetails = ({
  visible,
  setVisible,
  domain,
  setDomain,
  indicatorConnections,
  unrolled,
  showConnections,
  setShowConnections,
}: DetailsProps) => {
  const indicatorName = domain.name
  const symbolId = domain.symbolId
  const iconSrc = findIconSrc(symbolId)
  const { indicators } = domain

  const displayName = useMemo(() => {
    return indicatorName.split("_").join(" ")
  }, [indicatorName])

  const [openConnections, setOpenConnections] = useState<
    IndicatorConnection[]
  >([])

  const isGlobalIndicator =
    domain.quarter === "global_ecological" ||
    domain.quarter === "global_social"

  const onClose = () => {
    setVisible(false)

    // Cleanup other conditional elements after transition ends
    setTimeout(() => {
      setShowConnections(false)
      setOpenConnections([])
      setDomain(null)
      document.body.style.overflow = "auto"
    }, 450)
  }

  const { isXs } = useScreenSizes()

  return (
    <>
      {visible ? (
        <Box
          id="glass-blur"
          sx={{
            width: "100vw",
            height: "100vh",
            backdropFilter: "blur(8px)",
            zIndex: 0,
            position: "fixed",
            inset: 0,
          }}
        ></Box>
      ) : (
        <></>
      )}
      <Fade
        in={visible}
        timeout={{ enter: 450, exit: 450 }}
        mountOnEnter
        unmountOnExit
      >
        <Box
          id="indicator-details-canvas"
          sx={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box>
            <DomainOverlay
              type="global"
              unrolled={unrolled}
              showConnections={showConnections}
              isGlobalDomain={isGlobalIndicator}
              onClose={onClose}
            />
            <DomainOverlay
              type="local"
              unrolled={unrolled}
              showConnections={showConnections}
              isGlobalDomain={isGlobalIndicator}
              onClose={onClose}
            />
            <ConnectionsDetailsModal
              showConnections={showConnections}
              openConnections={openConnections}
              setOpenConnections={setOpenConnections}
            />
            <Fade
              in={!showConnections}
              timeout={{ enter: 450, exit: 450 }}
            >
              <Box>
                <DomainNameBadge name={displayName} imageSrc={iconSrc} />
              </Box>
            </Fade>
            {showConnections ? (
              <DomainConnectionsFlowchart
                domain={domain}
                connections={indicatorConnections}
                openConnections={openConnections}
                setOpenConnections={setOpenConnections}
                setShowConnections={setShowConnections}
              />
            ) : isXs ? (
              <>
                <DomainContentBox position="mobile">
                  {indicators.length > 0 ? (
                    <>
                      <DomainContentText text={""} title="Indicators" />
                      {[
                        ...indicators.filter((i) => i.primary === true),
                        ...indicators.filter((i) => i.primary === false),
                      ].map((i, index) => (
                        <IndicatorDetails indicator={i} index={index} />
                      ))}
                    </>
                  ) : (
                    <></>
                  )}
                  <DomainContentText
                    text={domain.description}
                    title="Thriving Glasgow Definition"
                  />
                  <DomainContentText
                    text={domain.target}
                    title="What could this look like?"
                  />
                  {domain.narrative ? (
                    <DomainContentText
                      text={domain.narrative}
                      title={"Further Information"}
                      renderHyperlinks={true}
                    />
                  ) : (
                    <></>
                  )}
                </DomainContentBox>
              </>
            ) : (
              <>
                <DomainContentBox position="left">
                  <DomainContentText
                    text={domain.description}
                    title="Thriving Glasgow Definition"
                  />
                  {indicators.length > 0 ? (
                    <DomainContentText
                      text={domain.target}
                      title="What could this look like?"
                    />
                  ) : (
                    <></>
                  )}
                  {domain.narrative ? (
                    <DomainContentText
                      text={domain.narrative}
                      title={"Further Information"}
                      renderHyperlinks={true}
                    />
                  ) : (
                    <></>
                  )}
                </DomainContentBox>

                {indicators.length > 0 ? (
                  <DomainContentBox
                    position="right"
                    stickyHeader="Indicators"
                  >
                    {[
                      ...indicators.filter((i) => i.primary === true),
                      ...indicators.filter((i) => i.primary === false),
                    ].map((i, index) => (
                      <IndicatorDetails indicator={i} index={index} />
                    ))}
                  </DomainContentBox>
                ) : (
                  <DomainContentBox position="right">
                    <DomainContentText
                      text={domain.target}
                      title="What could this look like?"
                    />
                  </DomainContentBox>
                )}
              </>
            )}
            <DomainDisplaySwitchButton
              showConnections={showConnections}
              openConnections={openConnections}
              setShowConnections={setShowConnections}
              setOpenConnections={setOpenConnections}
            />
          </Box>
        </Box>
      </Fade>
    </>
  )
}
