import { findIconSrc, formatConnectionName } from "../../helpers/DonutHelpers";
import type {
  DonutData,
  IndicatorConnection,
  IndicatorDataDict,
} from "../../types/DonutData";
import { Box, Fade } from "@mui/material";
import { ImageCircle } from "../InterfaceComponents/ImageCircle";

type DomainConnectionProps = {
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

export const DomainConnections = ({
  indicator,
  data,
  connections,
  openDescription,
  setOpenDescription,
}: DomainConnectionProps) => {
  const indicatorName = indicator ? Object.keys(indicator)[0] : "";

  const findConnectedIndicatorData = (connectionName: string) => {
    let connectionData =
      data.ecological.global[connectionName] ||
      data.ecological.local[connectionName];

    if (!connectionData) {
      connectionData =
        data.social.global[connectionName] || data.social.local[connectionName];
    }
    return connectionData;
  };

  const setConnectionDescription = (connectionName: string) => {
    const childItem = connections.find(
      (item) =>
        item.sourceName === connectionName ||
        item.targetName === connectionName,
    );
    if (childItem) {
      setOpenDescription(childItem.description);
    } else {
      console.log("No child data found for:", connectionName);
    }
  };

  return (
    <>
      {connections &&
        connections.length > 0 &&
        connections.map((connection, index) => {
          const isForward =
            connection.sourceName.toLowerCase() === indicatorName.toLowerCase();

          const connectionName = isForward
            ? connection.targetName
            : connection.sourceName;

          const connectionData = findConnectedIndicatorData(connectionName);

          if (connectionData) {
            const iconSrc = findIconSrc(connectionData.symbol_id);
            const angle = (index / connections.length) * 2 * Math.PI;

            const circleColor = connectionData.quarter.includes("ecological")
              ? "#3AADC6"
              : "#8FC53A";

            const radius = 330;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            const sizings = getCircleSize(connections.length);

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
                    id={`connection-${connectionName}-${index}`}
                    fontSize={"1rem"}
                    onClick={() => {
                      if (openDescription) {
                        setOpenDescription(null);
                      } else {
                        setConnectionDescription(connectionName);
                      }
                    }}
                    text={formatConnectionName(connectionName)}
                    imageSrc={iconSrc}
                    sx={{
                      transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                      width: sizings.circleWidth,
                      height: sizings.circleHeight,
                      bgcolor: isForward ? circleColor : "#9c2ead",
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
