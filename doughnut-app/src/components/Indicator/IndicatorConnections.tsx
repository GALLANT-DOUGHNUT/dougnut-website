import { useMemo } from "react";
import { findIconSrc, formatConnectionName } from "../../helpers/DonutHelpers";
import type {
  DonutData,
  IndicatorConnection,
  IndicatorDataDict,
} from "../../types/DonutData";
import { Box, Fade } from "@mui/material";
import { ImageCircle } from "../InterfaceComponents/ImageCircle";

type IndicatorConnectionProps = {
  data: DonutData;
  indicator: IndicatorDataDict | null;
  connections: IndicatorConnection[];
  openDescription: string | null;
  setOpenDescription: React.Dispatch<React.SetStateAction<string | null>>;
};

const getCircleSize = (numConnections: number) => {
  if (numConnections >= 12 && numConnections <= 14) {
    return {
      circleHeight: "120px",
      circleWidth: "120px",
      imgMaxWidth: "7vh",
      imgMaxHeight: "7vh",
    };
  } else if (numConnections >= 15 && numConnections <= 17) {
    return {
      circleHeight: "100px",
      circleWidth: "100px",
      imgMaxWidth: "6vh",
      imgMaxHeight: "6vh",
    };
  } else if (numConnections >= 18 && numConnections <= 19) {
    return {
      circleHeight: "90px",
      circleWidth: "90px",
      imgMaxWidth: "5vh",
      imgMaxHeight: "5vh",
    };
  } else if (numConnections >= 20) {
    return {
      circleHeight: "80px",
      circleWidth: "80px",
      imgMaxWidth: "4vh",
      imgMaxHeight: "4vh",
    };
  } else {
    return {
      circleHeight: "150px",
      circleWidth: "150px",
      imgMaxWidth: "7vh",
      imgMaxHeight: "5vh",
    };
  }
};

export const IndicatorConnections = ({
  indicator,
  data,
  connections,
  openDescription,
  setOpenDescription,
}: IndicatorConnectionProps) => {
  const findConnectionDataByName = (connectionName: string) => {
    let connectionData =
      data.ecological.global[connectionName] ||
      data.ecological.local[connectionName];

    if (!connectionData) {
      connectionData =
        data.social.global[connectionName] || data.social.local[connectionName];
    }

    return connectionData;
  };

  const findDataByChildName = (childName: string) => {
    const childItem = connections.find((item) => item.name === childName);
    if (childItem) {
      setOpenDescription(childItem.description);
    } else {
      console.log("No child data found for:", childName);
    }
  };

  const adjacencies: string[][] | null = useMemo(() => {
    if (indicator && Object.values(indicator) && Object.values(indicator)[0]) {
      const indicatorData = Object.values(indicator)[0];
      return indicatorData.adjacent;
    }
    return null;
  }, [indicator]);

  return (
    <>
      {adjacencies &&
        adjacencies.length > 0 &&
        adjacencies.map((connectionArray, index) => {
          const connectionName = connectionArray[2];
          const connectionData = findConnectionDataByName(connectionName);

          if (connectionData) {
            const iconSrc = findIconSrc(connectionData.symbol_id);
            const angle = (index / adjacencies.length) * 2 * Math.PI;

            const circleColor = connectionData.quarter.includes("ecological")
              ? "#3AADC6"
              : "#8FC53A";

            const radius = 330;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            const sizings = getCircleSize(adjacencies.length);

            return (
              <Fade
                in={true}
                timeout={{ enter: 380 }}
                style={{
                  transitionDelay: `${index * 50}ms`,
                }}
              >
                <Box>
                  <ImageCircle
                    key={`connection-${connectionName}-${index}`}
                    fontSize={"1rem"}
                    onClick={() => {
                      if (openDescription) {
                        setOpenDescription(null);
                      } else {
                        findDataByChildName(connectionName);
                      }
                    }}
                    text={formatConnectionName(connectionName)}
                    imageSrc={iconSrc}
                    sx={{
                      transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                      width: sizings.circleWidth,
                      height: sizings.circleHeight,
                      bgcolor: circleColor,
                      "&:hover": { filter: "brightness(1.5)" },
                      zIndex: 15,
                    }}
                  />
                </Box>
              </Fade>
            );
          } else {
            return <></>;
          }
        })}
    </>
  );
};
