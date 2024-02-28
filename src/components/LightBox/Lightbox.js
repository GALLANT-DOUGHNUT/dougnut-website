import React, { useEffect, useState } from "react";
import "./Lightbox.css";
import Icons from "../../Icons";
import useWindowDimensions from "./windowDimensions";
import { MultiDirectedGraph } from "graphology";
import { SigmaContainer } from "@react-sigma/core";





export default function LightBox({
  trigger,
  setTrigger,
  setIsOpen,
  DataProperty,
  data,
  setProperty,
}) {
  const [name, SetName] = useState(DataProperty[0]);
  const [additionalCirclesIsShow, SetShowAdditional] = useState(false);
  const [contextCircleIsShow, SetContextCircle] = useState(false);
  const [isTop, SetTop] = useState(false);
  const [showConnection, setShowConnection] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [activeProperty, setActiveProperty] = useState(null); 
  const [numConnections, setNumConnections] = useState(0);


 
  useEffect(() => {
    console.log('showConnection: ', showConnection);
  }, [showConnection]);

  






  const { height, width } = useWindowDimensions();
  const graph = new MultiDirectedGraph();
  graph.addNode("A", { x: height/2, y: width/2, label: "Node A", size: 100 });



  const toggleShowConnection = (value) => {
    setShowConnection(!showConnection);

    let element_connection = document.getElementById("Connections");
    let var_connections = element_connection.innerText
    if (var_connections === "Connections") {
      let element_left_circle = document.getElementById("left_circle");
      let element_right_circle = document.getElementById("right_circle");
      element_left_circle.classList.remove("isShow");
      element_right_circle.classList.remove("isShow");
      document.getElementById("lightboxBottom").style.backgroundColor =
      "rgba(0,0,0,0.8)";
      document.getElementById("lightboxBottom").style.height = "50%";
      document.getElementById("lightboxTop").style.backgroundColor =
        "rgba(0,0,0,0.8)";
        document.getElementById("lightboxTop").style.height = "50%";
        element_connection.innerText = "Details";
        console.log("SetConnections2 called with value: ", value);
        handleTriggerClick(DataProperty);
        console.log('DataProperty: ', DataProperty[1]["adjacent"]);
        const element = document.getElementById("primary_circle");
          if (element){
            const rect = element.getBoundingClientRect();
            
            console.log('rect: ', rect);
          }
    } else {
      const top =
        DataProperty?.[1]?.quarter === "local_ecological" ||
        DataProperty?.[1]?.quarter === "local_social";
      if (top) {
        document.getElementById("lightboxTop").style.backgroundColor =
          "rgba(0,0,0,0.8)";
        if (height <= 768) {
          document.getElementById("lightboxTop").style.height = "50%";
        } else {
          document.getElementById("lightboxTop").style.height = "50%";
        }
        document.getElementById("lightboxBottom").style.backgroundColor =
          "rgba(0,0,0,0.2)";
        document.getElementById("bottom_text").style.color = "white";
        document.getElementById("top_text").style.color = "black";
        if (DataProperty?.[1]?.quarter === "global_ecological") {
          document.getElementById("global_ecological").style.visibility =
            "visible";
        } else {
          document.getElementById("global_social").style.visibility = "visible";
        }
      } else {
        document.getElementById("lightboxBottom").style.backgroundColor =
          "rgba(0,0,0,0.8)";
        if (height <= 768) {
          document.getElementById("lightboxBottom").style.height = "50%";
        } else {
          document.getElementById("lightboxBottom").style.height = "50%";
        }
        document.getElementById("lightboxTop").style.backgroundColor =
          "rgba(0,0,0,0.2)";
        document.getElementById("top_text").style.color = "white";
        document.getElementById("bottom_text").style.color = "black";
        if (DataProperty?.[1]?.quarter === "local_ecological") {
          document.getElementById("local_ecological").style.visibility =
            "visible";
        }
        else {
          document.getElementById("local_social").style.visibility = "visible";
        }
      }
      let element_left_circle = document.getElementById("left_circle");
      let element_right_circle = document.getElementById("right_circle");
      element_left_circle.classList.add("isShow");
      element_right_circle.classList.add("isShow");
        element_connection.innerText = "Connections";
    }

    

  };

  useEffect(() => {
    console.log('trigger: ', trigger);
    
    if (trigger === true) {
      SetName(DataProperty[0].split("_").join(" "));

      setTrigger(true);
      const stringified = JSON.stringify(DataProperty);
      // const top = new Set(
      //   [
      //     ...Object.entries(data.ecological.local),
      //     ...Object.entries(data.social.local),
      //   ].map((x) => JSON.stringify(x))
      // ).has(stringified);

      const top =
        DataProperty?.[1]?.quarter === "local_ecological" ||
        DataProperty?.[1]?.quarter === "local_social";
      if (top) {
        document.getElementById("lightboxTop").style.backgroundColor =
          "rgba(0,0,0,0.8)";
        if (height <= 768) {
          document.getElementById("lightboxTop").style.height = "50%";
        } else {
          document.getElementById("lightboxTop").style.height = "50%";
        }
        document.getElementById("lightboxBottom").style.backgroundColor =
          "rgba(0,0,0,0.2)";
        document.getElementById("bottom_text").style.color = "white";
        document.getElementById("top_text").style.color = "black";
        if (DataProperty?.[1]?.quarter === "global_ecological") {
          document.getElementById("global_ecological").style.visibility =
            "visible";
        } else {
          document.getElementById("global_social").style.visibility = "visible";
        }
      } else {
        document.getElementById("lightboxBottom").style.backgroundColor =
          "rgba(0,0,0,0.8)";
        if (height <= 768) {
          document.getElementById("lightboxBottom").style.height = "50%";
        } else {
          document.getElementById("lightboxBottom").style.height = "50%";
        }
        document.getElementById("lightboxTop").style.backgroundColor =
          "rgba(0,0,0,0.2)";
        document.getElementById("top_text").style.color = "white";
        document.getElementById("bottom_text").style.color = "black";
        if (DataProperty?.[1]?.quarter === "local_ecological") {
          document.getElementById("local_ecological").style.visibility =
            "visible";
        } else {
          document.getElementById("local_social").style.visibility = "visible";
        }
      }




      SetTop(top);

      setIsOpen(false);
      const primaryCircle = document.getElementById("primary_circle");

      const circle = document.getElementById("left_circle");
      const text = document.getElementById("Thriving");

      const { description, target } = DataProperty[1];

      text.innerText = description ?? "Unavailable";
      circle.style.borderRadius = "25px";
      circle.style.padding = "16px";
      circle.style.width = "calc(min(500px, 100vw))";
      switch (true) {
        case description.length < 50:
          circle.style.height = "50px";
          break;
        case description.length >= 50 && description.length < 150:
          circle.style.height = "225px";
          break;
        default:
          circle.style.height = "300px";
      }
      // circle.style.height = description.length > 150 ? "350px" : "250px";
      circle.style.boxSizing = "border-box";

      const targetCircle = document.getElementById("right_circle");
      targetCircle.style.height = "250px";

      targetCircle.style.borderRadius = "25px";
      targetCircle.style.width = "calc(min(520px, 100vw))";
      const diff = 375 - target.length;
      const x = target.length;
      const h = `${
        Math.floor((1600 - width) / 5) + x < 375
          ? x - (diff * diff) / 10 ** 9 + diff * 0.35 + 8
          : x + diff * 0.35 + (diff * diff) / 10 ** 9 + 8
      }px`;
      targetCircle.style.height = h;
      document.getElementById("Target").style.padding = "0 16px 16px 16px";
      targetCircle.style.boxSizing = "border-box";

      primaryCircle.style.backgroundColor = "#D0EBF1";
      circle.style.backgroundColor = "#D0EBF1";
      targetCircle.style.backgroundColor = "#D0EBF1";

      // const extraText = showMore && target.length > 100 ? "..." : "";
      // document.getElementById("Target").innerText =
      //   target.substring(0, showMore ? 100 : target.length) + extraText ??
      //   "Unavailable";
      document.getElementById("Target").innerText = target ?? "Unavailable";
      document.getElementById("Target").style.fontSize = "20px";
    }
  }, [
    showMore,
    trigger,
    DataProperty,
    setTrigger,
    data.social.local,
    data.ecological.local,
  ]);

  function ChangeState() {
    console.log("LightBox ChangeState function called!");
    document.getElementById("global_ecological").style.visibility = "hidden";
    document.getElementById("global_social").style.visibility = "hidden";
    document.getElementById("local_ecological").style.visibility = "hidden";
    document.getElementById("local_social").style.visibility = "hidden";
    if (trigger === true) {
      setShowMore(true);
      SetShowAdditional(false);
      SetContextCircle(false);
      setTrigger(false);
      setShowConnection(false);
      let element_connection = document.getElementById("Connections");
      element_connection.innerText = "Connections";
      document.getElementById("primary_circle").style.filter =
        "brightness(100%)";
      document.getElementById("lightboxTop").style.backgroundColor =
        "rgba(0,0,0,0)";
      document.getElementById("lightboxBottom").style.backgroundColor =
        "rgba(0,0,0,0)";
      document.getElementById("primary_circle").style.cursor = "pointer";
      // document.getElementById("Indicator").innerText = "Indicator";
      // document.getElementById("Indicator").style.margin = "auto";
      document.getElementById("Target").style.margin = 0;
      // document.getElementById("Target").innerText = "Target";
      // document.getElementById("Thriving").innerText = "Thriving";
      document.getElementById("context_circle").style.display = "none";
      document.getElementById("top_circle").style.borderRadius = "90px";
      document.getElementById("top_circle").style.width = "180px";
      document.getElementById("top_text").style.color = "black";
      document.getElementById("bottom_text").style.color = "black";
      document.body.id = "show_scroll";

      for (const element of [
        ...document
          .getElementById("grid-container")
          .querySelectorAll(".small-circle"),
      ])
        element.remove();
      for (const element of [
        ...document.getElementById("line-canvas").querySelectorAll("#lines"),
      ])
        element.remove();
      for (const element of [
        ...document
          .getElementById("right_circle")
          .querySelectorAll("#targetLink"),
      ])
        element.remove();
      for (const element of [
        ...document
          .getElementById("left_circle")
          .querySelectorAll("#indicatorLink"),
      ])
        element.remove();
    }
  }

  // function AdditionalCircles() {
  //   if (additionalCirclesIsShow === false) {
  //     if (document.getElementById("Target").innerText !== "Target") {
  //       RemoveLink("Target", "right_circle");
  //     }

  //     // if (document.getElementById("Indicator").innerText !== "Indicator") {
  //     // RemoveLink("Indicator", "left_circle");
  //     // }

  //     SetContextCircle(false);
  //     SetConnections(false);
  //     document.getElementById("primary_circle").style.cursor = "default";
  //     SetShowAdditional(true);
  //     document.getElementById("primary_circle").style.filter =
  //       "brightness(80%)";

  //     if (isTop) {
  //       document.getElementById("lightboxTop").style.backgroundColor =
  //         "rgba(0,0,0,0.7)";
  //       document.getElementById("lightboxBottom").style.backgroundColor =
  //         "rgba(0,0,0,0.4)";
  //     } else {
  //       document.getElementById("lightboxBottom").style.backgroundColor =
  //         "rgba(0,0,0,0.7)";
  //       document.getElementById("lightboxTop").style.backgroundColor =
  //         "rgba(0,0,0,0.4)";
  //     }
  //   }
  // }

  // function ChangeTarget() {
  //   const circle = document.getElementById("right_circle");
  //   const text = document.getElementById("Target").innerText;
  //   if (text === "Target") {
  //     document.getElementById("Target").innerText =
  //       DataProperty[1]?.target ?? "Unavailable";
  //     // if (DataProperty[1].target_link !== "") {
  //     // CreateLink("Target", "right_circle", DataProperty[1].target_link);
  //     // }
  //     circle.style.borderRadius = "25px";
  //     circle.style.width = "calc(min(500px, 100vw))";
  //     circle.style.boxSizing = "border-box";
  //   } else {
  //     // RemoveLink("Target", "right_circle");
  //     document.getElementById("Target").innerText = "Target";
  //     circle.style.borderRadius = "90px";
  //     circle.style.width = "180px";
  //   }
  // }
  // function ChangeIndicator() {
  // if (document.getElementById("Indicator").innerText === "Indicator") {
  //   document.getElementById("Indicator").innerText =
  //     DataProperty[1]?.indicator ?? "Unavailable";
  //   if (DataProperty[1].indicator_link !== "") {
  //     CreateLink("Indicator", "left_circle", DataProperty[1].indicator_link);
  //   }
  // } else {
  //   RemoveLink("Indicator", "left_circle");
  // }
  // }

  // function CreateLink(destinationText, destinationArea, url) {
  //   document.getElementById(destinationText).style.marginBottom = "12%";
  //   const link = document.createElement("a");
  //   link.setAttribute("href", url);
  //   link.innerText = "Source";
  //   link.id = destinationText.toLowerCase() + "Link";
  //   document.getElementById(destinationArea).appendChild(link);
  // }

  // function RemoveLink(destinationText, destinationArea) {
  //   document.getElementById(destinationText).innerText = destinationText;
  //   document.getElementById(destinationText).style.margin = "auto";
  //   for (const element of [
  //     ...document
  //       .getElementById(destinationArea)
  //       .querySelectorAll("#" + destinationText.toLowerCase() + "Link"),
  //   ])
  //     element.remove();
  // }

  function SetConnections(value) {
    if (value) {
      SetShowAdditional(false);
      document.getElementById("primary_circle").style.filter =
        "brightness(100%)";

      document.getElementById("icon-space").style.width =
        document.getElementById("grid-container").getBoundingClientRect()
          .width + "px";
      document.getElementById("icon-space").style.height =
        document.getElementById("grid-container").getBoundingClientRect()
          .height + "px";

      document
        .getElementById("line-canvas")
        .setAttribute(
          "width",
          document.getElementById("grid-container").getBoundingClientRect()
            .width + "px"
        );
      document
        .getElementById("line-canvas")
        .setAttribute(
          "height",
          document.getElementById("grid-container").getBoundingClientRect()
            .height + "px"
        );

      let adjacencyList = DataProperty[1]?.adjacent ?? "No adjacencies";
      if (adjacencyList !== "No adjacencies") {
        for (let i = 0; i < adjacencyList.length; i++) {
          const adjacencyListItem = adjacencyList[i];
          const offsetDimensions = document
            .getElementById("grid-container")
            .getBoundingClientRect();
          if (adjacencyList[i][0] === "social") {
            const innerDimensions = document
              .getElementById(adjacencyListItem[2] + "_inner_img")
              .getBoundingClientRect();
            CreateIcon(offsetDimensions, innerDimensions, adjacencyListItem);
          } else {
            const outerDimensions = document
              .getElementById(adjacencyListItem[2] + "_outer_img")
              .getBoundingClientRect();
            CreateIcon(offsetDimensions, outerDimensions, adjacencyListItem);
          }
        }
        // Add event listener to window object to recall createIcon function when window size changes
        window.addEventListener("resize", () => {
          for (const element of [
            ...document
              .getElementById("grid-container")
              .querySelectorAll(".small-circle"),
          ])
            element.remove();
          for (const element of [
            ...document
              .getElementById("line-canvas")
              .querySelectorAll("#lines"),
          ])
            element.remove();
            const isShow =
            document.getElementById("lightboxTop").className === "isShow" ||
            document.getElementById("lightboxBottom").className === "isShow";
          if (isShow) {
            for (let i = 0; i < adjacencyList.length; i++) {
              const adjacencyListItem = adjacencyList[i];
              const offsetDimensions = document
                .getElementById("line-canvas")
                .getBoundingClientRect();
              if (adjacencyList[i][0] === "social") {
                const innerDimensions = document
                  .getElementById(adjacencyListItem[2] + "_inner_img")
                  .getBoundingClientRect();
                CreateIcon(
                  offsetDimensions,
                  innerDimensions,
                  adjacencyListItem
                );
              } else {
                const outerDimensions = document
                  .getElementById(adjacencyListItem[2] + "_outer_img")
                  .getBoundingClientRect();
                CreateIcon(
                  offsetDimensions,
                  outerDimensions,
                  adjacencyListItem
                );
              }
            }
          }

        });

      }
    } else {
      // document.getElementById("Connections").innerText = "Connections";
      for (const element of [
        ...document
          .getElementById("grid-container")
          .querySelectorAll(".small-circle"),
      ])
        element.remove();
      for (const element of [
        ...document.getElementById("line-canvas").querySelectorAll("#lines"),
      ])
        element.remove();
    }
  }

  const handleTriggerClick = (DataProperty) => {
    setActiveProperty(DataProperty); 
    const connections = DataProperty[1]?.connection || [];
    setNumConnections(connections.length); // Update numConnections
    connections.forEach((connectionName) => {
      const connectionData = findConnectionDataByName(connectionName);
      if (connectionData) {
        console.log(`Connection Name: ${connectionName}`);
        console.log(`Icon URL: /api/get-icon/${connectionData.symbol_id}`);
      } else {
        console.log(`No data found for connection: ${connectionName}`);
      }
    });
  };

  const findConnectionDataByName = (connectionName) => {
    let connectionData = data.ecological.global[connectionName] || data.ecological.local[connectionName];
    if (!connectionData) {
      connectionData = data.social.global[connectionName] || data.social.local[connectionName];
    }
  
    return connectionData;
  };

  function SetConnections2(value) {
    console.log("SetConnections2 called with value: ", value);
    handleTriggerClick(DataProperty);
    if (value) {
      const connectionCirclesContainer = document.getElementById("icon-space");
      const primaryCircleRect = document.getElementById("primary_circle").getBoundingClientRect();
      const radius = 150; // radius to place circles around the primary circle
  
      // Clear previous connections
      while (connectionCirclesContainer.firstChild) {
        connectionCirclesContainer.removeChild(connectionCirclesContainer.lastChild);
      }
  
      const connections = activeProperty[1]?.connection || [];
      const angleStep = (2 * Math.PI) / connections.length;
  
      connections.forEach((connectionName, index) => {
        const angle = index * angleStep;
        const x = primaryCircleRect.left + primaryCircleRect.width / 2 + radius * Math.cos(angle) - 30; // Adjusted for circle size
        const y = primaryCircleRect.top + primaryCircleRect.height / 2 + radius * Math.sin(angle) - 30; // Adjusted for circle size
  
        // Create connection circle element
        const connectionCircle = document.createElement('div'); // Changed to 'div' to include text
        connectionCircle.className = 'connection-circle';
        connectionCircle.style.position = 'absolute';
        connectionCircle.style.left = `${x}px`;
        connectionCircle.style.top = `${y}px`;
  
        // Set the background image for the circle based on the connection
        const connectionData = findConnectionDataByName(connectionName);
        if (connectionData) {
          const imageUrl = `/api/get-icon/${connectionData.symbol_id}`;
          const icon = document.createElement('img');
          icon.src = imageUrl;
          icon.style.width = '60px'; // Set the size of your icons
          icon.style.height = '60px'; // Set the size of your icons
          connectionCircle.appendChild(icon);
  
          const text = document.createElement('span');
          text.textContent = connectionName;
          text.style.position = 'absolute';
          text.style.width = '100%';
          text.style.textAlign = 'center';
          text.style.top = '70px'; // Adjust as needed
          connectionCircle.appendChild(text);
        }
  
        // Append the circle to the container
        connectionCirclesContainer.appendChild(connectionCircle);
      });
    }
  }


  function CreateIcon(offsetDimensions, initialDimensions, adjacencyListItem) {
    const circle = document.createElement("span");
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    circle.className = "small-circle";
    line.id = "lines";

    const imageUrl =
      "/api/get-icon/" +
      data[adjacencyListItem[0]][adjacencyListItem[1]][adjacencyListItem[2]][
        "symbol_id"
      ];
    circle.style.backgroundImage = `url(${imageUrl})`;

    circle.style.top = initialDimensions.top - offsetDimensions.top - 5 + "px";
    circle.style.left =
      initialDimensions.left - offsetDimensions.left - 5 + "px";

    const lineDimensions = document
      .getElementById("line-canvas")
      .getBoundingClientRect();

    line.setAttributeNS(null, "x1", lineDimensions.width / 2);
    line.setAttributeNS(null, "y1", lineDimensions.height / 2);
    line.setAttributeNS(
      null,
      "x2",
      initialDimensions.left - offsetDimensions.left + 12 + "px"
    );
    line.setAttributeNS(
      null,
      "y2",
      initialDimensions.top - offsetDimensions.top + 10 + "px"
    );
    line.onclick = function () {
      if (
        document.getElementById("Context").innerText === adjacencyListItem[3]
      ) {
        setProperty([
          adjacencyListItem[2],
          data[adjacencyListItem[0]][adjacencyListItem[1]][
            adjacencyListItem[2]
          ],
        ]);
        document.getElementById("primary_circle").style.cursor = "pointer";
        document.getElementById("top_text", "bottom_text").style.color =
          "black";

        for (const element of [
          ...document
            .getElementById("grid-container")
            .querySelectorAll(".small-circle"),
        ])
          element.remove();
        for (const element of [
          ...document.getElementById("line-canvas").querySelectorAll("#lines"),
        ])
          element.remove();
        for (const element of [
          ...document
            .getElementById("right_circle")
            .querySelectorAll("#targetLink"),
        ])
          element.remove();
        for (const element of [
          ...document
            .getElementById("left_circle")
            .querySelectorAll("#indicatorLink"),
        ])
          element.remove();
        document.getElementById("context_circle").className = "circle";
      }
      document.getElementById("context_circle").style.display = "flex";
      SetContextCircle(true);
      document.getElementById("Context").innerText = adjacencyListItem[3];
    };
    circle.onclick = line.onclick;
    document.getElementById("icon-space").appendChild(circle);
    document.getElementById("line-canvas").appendChild(line);
  }

  // function ChangeThriving() {
  //   const circle = document.getElementById("left_circle");
  //   const text = document.getElementById("Thriving");
  //   if (text.innerText === "Thriving") {
  //     text.innerText = DataProperty[1]?.description ?? "Unavailable";
  //     circle.style.borderRadius = "25px";
  //     circle.style.width = "calc(min(500px, 100vw))";
  //     circle.style.boxSizing = "border-box";
  //   } else {
  //     text.innerText = "Thriving";
  //     circle.style.borderRadius = "90px";
  //     circle.style.width = "180px";
  //   }
  // }
  const symbolId = DataProperty[1]?.symbol_id;
  const symbolIdWithoutPng = symbolId?.substring(0, symbolId.length - 4);
  const iconSrc = Icons?.[symbolIdWithoutPng];


  const findIconSrc = (symbolId, Icons) => {
    const symbolIdWithoutPng = symbolId?.substring(0, symbolId.length - 4);
    return Icons?.[symbolIdWithoutPng];
  };


    


  return (
    <>
      <div
        className={`${trigger ? "isShow" : "hidden"}`}
        id="lightboxTop"
        onClick={ChangeState}
      ></div>
      <div
        className={`${trigger ? "isShow" : "hidden"}`}
        id="lightboxBottom"
        onClick={ChangeState}
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
        className={`grid-container  ${trigger ? "isShow" : ""}`}
        id="grid-container"
        style={{ zoom: `${width / 16}%` }}
      >
        <div id="icon-space">
          <svg id="line-canvas"></svg>
        </div>
        {showConnection ? (
              // <SigmaContainer style={{ height: height * 0.8, width: '100%',  zIndex: '13', left: '0', position: 'absolute' }} graph={graph}></SigmaContainer>
              <>
                {activeProperty && (
                  <>
                    {
                      activeProperty[1]?.connection.map((connectionName, index) => {
                        const connectionData = findConnectionDataByName(connectionName);
                        console.log('connectionData: ', connectionData);
                        if (connectionData) {
                          const iconSrcConnection = findIconSrc(connectionData.symbol_id, Icons);
                          return (
                            <>
                                    <span
                                  id="primary_circle"
                                  className={`circle  ${trigger ? "isShow" : ""}`}>
                                          <img
                                            id="lightbox_img"
                                            src={iconSrc}
                                            alt={DataProperty.Name}
                                          />
                                          <h1 className="lightbox_title" /*onClick={AdditionalCircles}*/>
                                          {name}
                                        </h1>
                                      </span>
                            <span 
                              id={`connection_circle`}
                              className={`circle ${trigger ? "isShow" : ""}`} 
                              key={index}
                            >
                              <img
                                id="connection_circle_img"
                                src={iconSrcConnection}
                                alt={connectionName}
                                />
                              <p
                            style={
                              {
                                textAlign: "center",
                                fontSize: "15px",
                              }
                            }
                              >{connectionName.split("_").join(" ")}</p>
                            </span>
                            </>
                          );
                        } else {
                          console.log(`No icon found for connection: ${connectionName}`);
                          return null;
                        }
                      })
                    }
                  </>
                )
              }
          </>

        ) : (
        <span
          id="primary_circle"
          className={`circle  ${trigger ? "isShow" : ""}`}
          // onClick={AdditionalCircles}
        >
          <img
            id="lightbox_img"
            // onClick={AdditionalCircles}
            src={iconSrc}
            alt={DataProperty.Name}
          />
          <h1 className="lightbox_title" /*onClick={AdditionalCircles}*/>
            {name}
          </h1>
        </span>
  ) }
        <span
          id="top_circle"
          // className={`circle ${additionalCirclesIsShow ? "isShow" : ""}`} \\ uncomment when we need indiactor again
          style={{
            borderRadius: "90px",
            width: "180px",
            boxSizing: "borderBox",
          }}
          // onClick={ChangeIndicator}
        >
          <p id="Indicator" className="lightbox_title scrollable">
            {/* {"Indicator"} */}
          </p>
        </span>
        <span
          id="right_circle"
          // className={`circle ${additionalCirclesIsShow ? "isShow" : ""}`}
          className={`circle ${trigger ? "isShow" : ""}`}
          style={{
            width: "180px",
            boxSizing: "borderBox",
            textAlign: "center",
          }}
          // onClick={ChangeTarget}
        >
          <h4>What could this look like?</h4>
          <p
            style={{ overflow: "hidden" }}
            id="Target"
            className="lightbox_title "
          >
            {"Target"}
          </p>
          {/* {DataProperty[1]?.target.length > 100 && (
            <a
              style={{
                margin: 16,
                color: "inherit",
                // textDecoration: "underline",
              }}
              onClick={() => setShowMore(!showMore)}
            >
              <hr />
              {showMore ? "Show More" : "Show Less"}
            </a>
          )} */}
        </span>
        <span
          id="left_circle"
          // className={`circle  ${additionalCirclesIsShow ? "isShow" : ""}`}
          className={`circle  ${trigger ? "isShow" : ""}`}
          // onClick={ChangeThriving}
          style={{ textAlign: "center" }}
        >
          <h4 style={{ marginBottom: 0 }}>Thriving Glasgow Definition</h4>
          <p id="Thriving" className="lightbox_title">
            {"Thriving"}
          </p>
        </span>

{/* {
  activeProperty && (
    <>
      {
        activeProperty[1]?.connection.map((connectionName, index) => {
          const connectionData = findConnectionDataByName(connectionName);
          if (connectionData) {
            const iconSrc = findIconSrc(connectionData.symbol_id, Icons);
            return (
              <span 
                id={`connection_circle`}
                className={`circle ${trigger ? "isShow" : ""}`} 
                key={index}
              >
                <img
                  id="connection_circle_img"
                  src={iconSrc}
                  alt={connectionName}
                />
                <p
              style={
                {
                  textAlign: "center",
                  fontSize: "15px",
                }
                }
                >{connectionName.split("_").join(" ")}</p>
              </span>
            );
          } else {
            console.log(`No icon found for connection: ${connectionName}`);
            return null;
          }
        })
      }
    </>
  )
} */}
        <span
          id="bottom_circle"
          div="center_column"
          // className={`circle ${additionalCirclesIsShow ? "isShow" : ""}`} 
          className={`circle ${trigger ? "isShow" : ""}`}
          onClick={toggleShowConnection}
        >
          <p id="Connections" className="lightbox_title">
            {"Connections"}
          </p>
        </span>
        {/* <span
          id="bottom_circle"
          div="center_column"
          // className={`circle ${additionalCirclesIsShow ? "isShow" : ""}`} 
          className={`circle ${setShowConnection === true ? "isShow" : ""}`}
        >
          <p id="Details" className="lightbox_title">
            {"Details"}
          </p>
        </span> */}
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
}
