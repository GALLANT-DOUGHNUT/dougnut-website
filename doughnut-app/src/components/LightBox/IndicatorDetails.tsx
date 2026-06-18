import React, { useEffect, useState } from "react";
import "./Lightbox.css";
import { useWindowDimensions } from "./hooks/useWindowDimensions";
import type {
  DonutData,
  IndicatorConnection,
  IndicatorDataDict,
} from "../../types/DonutData";
import { findIconSrc } from "../../helpers/DonutHelpers";
import { IndicatorConnections } from "./IndicatorConnections";

type DetailsProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  indicatorDataRecord: IndicatorDataDict | null;
  data: DonutData;
  connections: IndicatorConnection[];
  showConnection: boolean;
  setShowConnection: React.Dispatch<React.SetStateAction<boolean>>;
};

export const IndicatorDetails = ({
  visible,
  setVisible,
  indicatorDataRecord,
  data,
  connections,
  showConnection,
  setShowConnection,
}: DetailsProps) => {
  if (indicatorDataRecord === null) {
    return <></>;
  }

  const indicatorName = Object.keys(indicatorDataRecord!)[0];
  const indicatorData = Object.values(indicatorDataRecord!)[0];
  const [name, SetName] = useState(indicatorName);

  const [contextCircleIsShow, SetContextCircle] = useState(false);
  // const [showMore, setShowMore] = useState(false);

  const [activeProperty, setActiveProperty] =
    useState<IndicatorDataDict | null>(null);

  const [isConnectionDescOpen, setIsConnectionDescOpen] = useState(false);

  const [showPrimaryCircle, setShowPrimaryCircle] = useState(true);
  const { height, width } = useWindowDimensions();

  const toggleShowConnection = () => {
    setShowConnection(!showConnection);

    let element_connection = document.getElementById("Connections");
    let var_connections = element_connection!.innerText;
    if (var_connections === "Connections") {
      let element_left_circle = document.getElementById("left_circle");
      let element_right_circle = document.getElementById("right_circle");
      element_left_circle!.classList.remove("isShow");
      element_right_circle!.classList.remove("isShow");
      document.getElementById("lightboxBottom")!.style.backgroundColor =
        "rgba(0,0,0,0.8)";
      document.getElementById("lightboxBottom")!.style.height = "50%";
      document.getElementById("lightboxTop")!.style.backgroundColor =
        "rgba(0,0,0,0.8)";
      document.getElementById("lightboxTop")!.style.height = "50%";
      element_connection!.innerText = "Details";
      handleTriggerClick(indicatorDataRecord!);
    } else {
      const top =
        indicatorData.quarter === "local_ecological" ||
        indicatorData.quarter === "local_social";
      if (top) {
        document.getElementById("lightboxTop")!.style.backgroundColor =
          "rgba(0,0,0,0.8)";
        if (height <= 768) {
          document.getElementById("lightboxTop")!.style.height = "50%";
        } else {
          document.getElementById("lightboxTop")!.style.height = "50%";
        }
        document.getElementById("lightboxBottom")!.style.backgroundColor =
          "rgba(0,0,0,0.2)";
        document.getElementById("bottom_text")!.style.color = "white";
        document.getElementById("top_text")!.style.color = "black";
        if (indicatorData.quarter === "global_ecological") {
          document.getElementById("global_ecological")!.style.visibility =
            "visible";
        } else {
          document.getElementById("global_social")!.style.visibility =
            "visible";
        }
      } else {
        document.getElementById("lightboxBottom")!.style.backgroundColor =
          "rgba(0,0,0,0.8)";
        if (height <= 768) {
          document.getElementById("lightboxBottom")!.style.height = "50%";
        } else {
          document.getElementById("lightboxBottom")!.style.height = "50%";
        }
        document.getElementById("lightboxTop")!.style.backgroundColor =
          "rgba(0,0,0,0.2)";
        document.getElementById("top_text")!.style.color = "white";
        document.getElementById("bottom_text")!.style.color = "black";
        if (indicatorData.quarter === "local_ecological") {
          document.getElementById("local_ecological")!.style.visibility =
            "visible";
        } else {
          document.getElementById("local_social")!!.style.visibility =
            "visible";
        }
      }
      let element_left_circle = document.getElementById("left_circle");
      let element_right_circle = document.getElementById("right_circle");
      element_left_circle!.classList.add("isShow");
      element_right_circle!.classList.add("isShow");
      element_connection!.innerText = "Connections";
    }
  };

  useEffect(() => {
    if (visible === true) {
      SetName(indicatorName.split("_").join(" "));
      setVisible(true);

      const top =
        indicatorData.quarter === "local_ecological" ||
        indicatorData.quarter === "local_social";
      if (top) {
        document.getElementById("lightboxTop")!.style.backgroundColor =
          "rgba(0,0,0,0.8)";
        if (height <= 768) {
          document.getElementById("lightboxTop")!.style.height = "50%";
        } else {
          document.getElementById("lightboxTop")!.style.height = "50%";
        }
        document.getElementById("lightboxBottom")!.style.backgroundColor =
          "rgba(0,0,0,0.2)";
        document.getElementById("bottom_text")!.style.color = "white";
        document.getElementById("top_text")!.style.color = "black";
        if (indicatorData.quarter === "global_ecological") {
          document.getElementById("global_ecological")!.style.visibility =
            "visible";
        } else {
          document.getElementById("global_social")!.style.visibility =
            "visible";
        }
      } else {
        document.getElementById("lightboxBottom")!.style.backgroundColor =
          "rgba(0,0,0,0.8)";
        if (height <= 768) {
          document.getElementById("lightboxBottom")!.style.height = "50%";
        } else {
          document.getElementById("lightboxBottom")!.style.height = "50%";
        }
        document.getElementById("lightboxTop")!.style.backgroundColor =
          "rgba(0,0,0,0.2)";
        document.getElementById("top_text")!.style.color = "white";
        document.getElementById("bottom_text")!.style.color = "black";
        if (indicatorData.quarter === "local_ecological") {
          document.getElementById("local_ecological")!.style.visibility =
            "visible";
        } else {
          document.getElementById("local_social")!.style.visibility = "visible";
        }
      }

      const primaryCircle = document.getElementById("primary_circle");
      const circle = document.getElementById("left_circle");
      const text = document.getElementById("Thriving");

      const { description, target } = indicatorData;

      text!.innerText = description ?? "Unavailable";
      circle!.style.borderRadius = "25px";
      circle!.style.padding = "16px";
      circle!.style.width = "calc(min(500px, 100vw))";
      switch (true) {
        case description.length < 50:
          circle!.style.height = "50px";
          break;
        case description.length >= 50 && description.length < 150:
          circle!.style.height = "225px";
          break;
        default:
          circle!.style.height = "300px";
      }

      circle!.style.boxSizing = "border-box";

      const targetCircle = document.getElementById("right_circle");
      targetCircle!.style.height = "250px";

      targetCircle!.style.borderRadius = "25px";
      targetCircle!.style.width = "calc(min(520px, 100vw))";
      const diff = 375 - target.length;
      const x = target.length;
      const h = `${
        Math.floor((1600 - width) / 5) + x < 375
          ? x - (diff * diff) / 10 ** 9 + diff * 0.35 + 8
          : x + diff * 0.35 + (diff * diff) / 10 ** 9 + 8
      }px`;
      targetCircle!.style.height = h;
      document.getElementById("Target")!.style.padding = "0 16px 16px 16px";
      targetCircle!.style.boxSizing = "border-box";

      primaryCircle!.style.backgroundColor = "#D0EBF1";
      circle!.style.backgroundColor = "#D0EBF1";
      targetCircle!.style.backgroundColor = "#D0EBF1";

      document.getElementById("Target")!.innerText = target ?? "Unavailable";
      document.getElementById("Target")!.style.fontSize = "20px";
    }
  }, [
    // showMore,
    visible,
    indicatorData,
    setVisible,
    data.social.local,
    data.ecological.local,
  ]);

  const onHideDetails = () => {
    // document.getElementById("global_ecological")!.style.visibility = "hidden";
    // document.getElementById("global_social")!.style.visibility = "hidden";
    // document.getElementById("local_ecological")!.style.visibility = "hidden";
    // document.getElementById("local_social")!.style.visibility = "hidden";

    if (visible === true) {
      // setShowMore(true);
      SetContextCircle(false);
      setVisible(false);
      setShowPrimaryCircle(true);

      setIsConnectionDescOpen(false);
      setShowConnection(false);

      // let element_connection = document.getElementById("Connections");
      // element_connection!.innerText = "Connections";
      // document.getElementById("primary_circle")!.style.filter =
      //   "brightness(100%)";
      // document.getElementById("lightboxTop")!.style.backgroundColor =
      //   "rgba(0,0,0,0)";
      // document.getElementById("lightboxBottom")!.style.backgroundColor =
      //   "rgba(0,0,0,0)";
      // document.getElementById("primary_circle")!.style.cursor = "pointer";

      // document.getElementById("context_circle")!.style.display = "none";

      // document.getElementById("top_text")!.style.color = "black";
      // document.getElementById("bottom_text")!.style.color = "black";
      // document.body.id = "show_scroll";

      // for (const element of [
      //   ...document
      //     .getElementById("grid-container")!
      //     .querySelectorAll(".small-circle"),
      // ])
      //   element.remove();
      // for (const element of [
      //   ...document.getElementById("line-canvas")!.querySelectorAll("#lines"),
      // ])
      //   element.remove();
      // for (const element of [
      //   ...document
      //     .getElementById("right_circle")!
      //     .querySelectorAll("#targetLink"),
      // ])
      //   element.remove();
      // for (const element of [
      //   ...document
      //     .getElementById("left_circle")!
      //     .querySelectorAll("#indicatorLink"),
      // ])
      //   element.remove();
    }
  };

  const handleTriggerClick = (indicator: IndicatorDataDict) => {
    setActiveProperty(indicator);
  };

  const symbolId = indicatorData.symbol_id;
  const iconSrc = findIconSrc(symbolId);

  return (
    <>
      {visible ? (
        <div
          className={`${visible ? "isShow" : "hidden"}`}
          id="lightboxTop"
          onClick={onHideDetails}
        ></div>
      ) : (
        <></>
      )}
      <div
        className={`${visible ? "isShow" : "hidden"}`}
        id="lightboxBottom"
        onClick={onHideDetails}
      ></div>
      <div style={{ zIndex: -1 }}>
        <div className="outer_indicators" style={{ top: "4vh" }}>
          <p id="top_text">GLOBAL </p>
          <p> RESPONSIBILITIES </p>

          <div style={{ maxWidth: 350 }}>
            <p id="global_ecological" style={{ visibility: "hidden" }}></p>
            <p id="global_social" style={{ visibility: "hidden" }}></p>
          </div>
        </div>
        <div className="outer_indicators" style={{ bottom: "4vh" }}>
          <div style={{ maxWidth: 350 }}>
            <p id="local_social" style={{ visibility: "hidden" }}></p>
            <p id="local_ecological" style={{ visibility: "hidden" }}></p>
          </div>
          <p id="bottom_text">LOCAL </p>
          <p> ASPIRATIONS </p>
        </div>
      </div>

      <div
        className={`grid-container  ${visible ? "isShow" : ""}`}
        id="grid-container"
        style={{ zoom: `${width / 16}%` }}
      >
        <div id="icon-space">
          <svg id="line-canvas"></svg>
        </div>

        {showConnection && (
          <IndicatorConnections
            data={data}
            indicator={activeProperty}
            connections={connections}
            setShowPrimaryCircle={setShowPrimaryCircle}
          />
        )}

        <span
          id="primary_circle"
          className={`circle ${visible && showPrimaryCircle && !isConnectionDescOpen ? "isShow" : "hidden"}`}
        >
          <img id="lightbox_img" src={iconSrc} alt={indicatorName} />
          <h1 className="lightbox_title">{name}</h1>
        </span>

        <span
          id="right_circle"
          className={`circle ${visible ? "isShow" : ""}`}
          style={{
            width: "180px",
            boxSizing: "border-box",
            textAlign: "center",
          }}
        >
          <h4>What could this look like?</h4>
          <p
            style={{ overflow: "hidden" }}
            id="Target"
            className="lightbox_title "
          >
            {"Target"}
          </p>
        </span>
        <span
          id="left_circle"
          className={`circle  ${visible ? "isShow" : ""}`}
          style={{ textAlign: "center" }}
        >
          <h4 style={{ marginBottom: 0 }}>Thriving Glasgow Definition</h4>
          <p id="Thriving" className="lightbox_title">
            {"Thriving"}
          </p>
        </span>
        <span
          id="bottom_circle"
          className={`circle ${visible ? "isShow" : ""}`}
          onClick={toggleShowConnection}
        >
          <p id="Connections" className="lightbox_title">
            {"Connections"}
          </p>
        </span>
        <span
          id="context_circle"
          className={`circle ${contextCircleIsShow ? "isShow" : ""}`}
        >
          <p id="Context" className="lightbox_title">
            {"Context"}
          </p>
        </span>
      </div>
    </>
  );
};
