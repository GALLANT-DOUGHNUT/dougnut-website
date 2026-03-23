import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import "./Lightbox.css";
import Icons from "../../Icons";
import useWindowDimensions from "./windowDimensions";
import Tooltip from "components/BarChart/Tooltip";






export default function LightBox({
  trigger,
  setTrigger,
  setIsOpen,
  DataProperty,
  data,
  setProperty,
  childData,
  showConnection,
  setShowConnection,
  reverseConnections,
}) {
  const [name, SetName] = useState(DataProperty[0]);
  const [additionalCirclesIsShow, SetShowAdditional] = useState(false);
  const [contextCircleIsShow, SetContextCircle] = useState(false);
  const [isTop, SetTop] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [activeProperty, setActiveProperty] = useState(null); 
  const [numConnections, setNumConnections] = useState(0);
  const [numRevConnections, setNumRevConnections] = useState(0);
  const [currentAdjacencyArray, setAdjArray] = useState([]);
  const [currentArrayReady, setCurrentArrayReady] = useState(false);
  const [connectionDes , setConnectionDes] = useState(null);
  const [longDesText , setLongDesText] = useState(false);
  const [connectionTitle , setConnectionTitle] = useState(null);
  const [hoveredConnection, setHoveredConnection] = useState(null);
  const [connectionsInverted, setConnectionsInverted] = useState(false);
  const [isElementSelected, setIsElementSelected] = useState(false);
  const [detailState, setDetailState] = useState("details");
  const [isInfoBoxOpen, setIsInfoBoxOpen] = useState(false);
  const connectionRefs = useRef([]);
  const [showPrimaryCircle, setShowPrimaryCircle] = useState(true);
  const [tooltipX, setTooltipX] = useState(0);
  const [tooltipY, setTooltipY] = useState(0);

  const { height, width } = useWindowDimensions();
  
  function blackOutBack() {
      document.getElementById("left_circle").classList.remove("isShow");
      document.getElementById("right_circle").classList.remove("isShow");
      let element_light_bottom = document.getElementById("lightboxBottom");
      let element_light_top = document.getElementById("lightboxTop");
	  
	  element_light_bottom.style.backgroundColor = "rgba(0,0,0,0.8)";
      element_light_bottom.style.height = "50%";
      element_light_bottom.classList.remove("hidden");
      element_light_top.style.backgroundColor = "rgba(0,0,0,0.8)";
      element_light_top.style.height = "50%";
	  element_light_top.classList.remove("hidden");
  }

  const toggleShowConnection = (value) => {
    //setShowConnection(!showConnection);
	
	let instigator = value.target;
	
	if (instigator.classList.contains("disabledButton")){
		return;
	}
	
	if (instigator.id === "bottom_circle"){
		instigator = instigator.firstChild;
	}
	let state = "details";
	if (instigator.id === "Connections"){
		state = "connections";
		setConnectionsInverted(false);
		setDetailState("connections");
	}
	else if (instigator.id === "Details"){
		state = "details";
		setDetailState("details");
	}
	else {
		state = "reverseConnections";
		setConnectionsInverted(true);
		setDetailState("reverseConnections");
	};
	handleStateChange(state);
  };
  
  function handleStateChange(state="current"){
	  if (state === "current"){
		  state = detailState;
	  }
	  if (state !== "details") {
		setShowConnection(true);
		blackOutBack()
		handleTriggerClick(DataProperty);

	  } else {
		  setShowConnection(false);
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
		  //element_connection.innerText = "Connections";
		}
  }

  useEffect(() => {
    
    if (trigger === true) {
      //SetName(DataProperty[0].split("_").join(" "));
	  SetName(DataProperty[1].display_name || DataProperty[0].split("_").join(" "));
	  handleTriggerClick(DataProperty);
	  //if ((detailState === "connections" && numConnections === 0) || (detailState === "reverseConnections" && numRevConnections === 0)){
		//setDetailState("details");
	  //}
	  setDetailState("details");
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
	  setCurrentArrayReady(false);
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

  function ChangeState(force=false) {
    document.getElementById("global_ecological").style.visibility = "hidden";
    document.getElementById("global_social").style.visibility = "hidden";
    document.getElementById("local_ecological").style.visibility = "hidden";
    document.getElementById("local_social").style.visibility = "hidden";


    if (trigger === true || force === true) {
      setShowMore(true);
      SetShowAdditional(false);
      SetContextCircle(false);
      setTrigger(false);
      setShowPrimaryCircle(true);
      setIsInfoBoxOpen(false);
      setShowConnection(false);
      let element_connection = document.getElementById("Connections");
      //element_connection.innerText = "Connections";
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
      // document.getElementById("top_circle").style.borderRadius = "90px";
      // document.getElementById("top_circle").style.width = "180px";
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
        setIsInfoBoxOpen(false);
    }
  }
  
  function displayFlatText(title,body){
	  blackOutBack();
	  setLongDesText(body.length > 384);
	  setConnectionDes(body);
	  setConnectionTitle(title);
	  setShowConnection(false);
	  SetShowAdditional(false);
	  setIsInfoBoxOpen(true);
	  let element_left_circle = document.getElementById("left_circle");
      let element_right_circle = document.getElementById("right_circle");
	  element_left_circle.classList.remove("isShow");
      element_right_circle.classList.remove("isShow");
  }
  
  const renderConnectionDes = () => {
	  let split = connectionDes.split("!B");
	  return (
		split.map((line,i) => (<p>{line}</p>))
	  );
  }
  
  function displayConnectionMethodology(){
	  let body = "During the process of co-developing the <i>Thriving Glasgow Portrait</i> and creating the <i>Thriving Glasgow Definitions</i>, many interconnections between the Doughnut Domains were identified. These interconnections show how changes occurring in one domain might influence the outcomes we see in other domains.<br><br>Here we have captured the interconnections that were highlighted during our engagement activities with policy officers, elected officials, local citizens, sciences, private and third sector organisations in and around Glasgow. This is not an exhaustive list of all possible interconnections between the different domains, and is not based on a comprehensive review of all published information. Instead, it provides a snapshot of the interconnections that are most salient to those working and living in Glasgow, and that may provide opportunities to create solutions with benefits across multiple domains in the future.";
	  let title = "Interconnections between Doughnut Domains";
	  displayFlatText(title,body);
  }
  
  function displayUserInfo(){
	  let body = "The <i>Digital Doughnut</i> is designed to allow you to explore Glasgow's <i>Thriving Definitions</i> and the connections between them.<br><br>The definitions are grouped as Local/Global (bottom and top halves of the doughnut) and Ecological/Social (blue outer and green inner rings). Clicking on a definition will bring up its full definition, as well as a brief description of how the city might be different if the definition were implemented.<br><br>If any connections were identified between the selected definition and other definitions, you can view them here. Selecting <i>'Connections from this domain'</i> will show definitions which the selected definition might influence, whereas selecting <i>'Connections to this domain'</i> will show which other definitions might influence the currently selected definition. In both cases, clicking on the connected definitions will bring up a brief explanation of how they affect eachother.<br><br>If you want more information about how these connections were identified, the button <i>'How did we derive these connections?'</i> is present any time connections are being displayed. For more information about the <i>Glasgow Doughnut</i> generally, scroll down after closing this prompt.";
	  let title = "Using the Glasgow Doughnut";
	  displayFlatText(title,body);
  }
  
  function displayConnectionMethodologyball(){
	  setDetailState();
	  blackOutBack();
	  setConnectionDes("During the process of co-developing the Thriving Glasgow Portrait and creating the Thriving Glasgow definitions many interconnections between the Doughnut Domains were identified. These interconnections show how changes occurring in one domain might influence the outcomes we see in other domains. Here we have captured the interconnections that were highlighted during our engagement activities with policy officers, elected officials, local citizens, sciences, private and third sector organisations in and around Glasgow. This is not an exhaustive list of all possible interconnections between the different domains, and is not based on a comprehensive review of all published information. Instead, it provides a snapshot of the interconnections that are most salient to those working and living in Glasgow, and that may provide opportunities to create solutions with benefits across multiple domains in the future.");
	  setConnectionTitle("Interconnections between Doughnut Domains");
	  setShowConnection(false);
	  SetShowAdditional(false);
	  setIsInfoBoxOpen(true);
	  let element_left_circle = document.getElementById("left_circle");
      let element_right_circle = document.getElementById("right_circle");
	  element_left_circle.classList.remove("isShow");
      element_right_circle.classList.remove("isShow");
  }
  
  function BuildReverseAdjacencies(){
	  let accumulator = {"ecological": {"local": {}, "global": {}},"social": {"local": {}, "global": {}}};
	  for (const scope of ["ecological","social"]){
		  for (const [scale, indSet] of Object.entries(data[scope])) {
			for (const [indEnt, indData] of Object.entries(indSet)) {
				for (var i = 0; i < indData["adjacent"].length; i++) { 
					var adEnt = indData["adjacent"][i];
					if (!(adEnt[2] in accumulator[adEnt[0]][adEnt[1]])){
						accumulator[adEnt[0]][adEnt[1]][adEnt[2]] = []
					}
					var revAccInfo = [scope,scale,indEnt,adEnt[3]]
					accumulator[adEnt[0]][adEnt[1]][adEnt[2]].push(revAccInfo)
				}
			}
		 }
	  for (const scope of ["ecological","social"]){
		  for (const [scale, indSet] of Object.entries(data[scope])) { 
			  for (const [indEnt, indData] of Object.entries(indSet)) {
				  if (!(indEnt in accumulator[scope][scale])){
					  data[scope][scale][indEnt]["reverseAdjacencies"] = [];
				  }
				  else{
					data[scope][scale][indEnt]["reverseAdjacencies"] = accumulator[scope][scale][indEnt];
				  }
			  }
		  }
	  }
}
  }
  
  function CirclePopulateFunction(){
	  
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

  // function SetConnections(value) {
  //   if (value) {
  //     SetShowAdditional(false);
  //     document.getElementById("primary_circle").style.filter =
  //       "brightness(100%)";

  //     document.getElementById("icon-space").style.width =
  //       document.getElementById("grid-container").getBoundingClientRect()
  //         .width + "px";
  //     document.getElementById("icon-space").style.height =
  //       document.getElementById("grid-container").getBoundingClientRect()
  //         .height + "px";

  //     document
  //       .getElementById("line-canvas")
  //       .setAttribute(
  //         "width",
  //         document.getElementById("grid-container").getBoundingClientRect()
  //           .width + "px"
  //       );
  //     document
  //       .getElementById("line-canvas")
  //       .setAttribute(
  //         "height",
  //         document.getElementById("grid-container").getBoundingClientRect()
  //           .height + "px"
  //       );

  //     let adjacencyList = DataProperty[1]?.adjacent ?? "No adjacencies";
  //     if (adjacencyList !== "No adjacencies") {
  //       for (let i = 0; i < adjacencyList.length; i++) {
  //         const adjacencyListItem = adjacencyList[i];
  //         const offsetDimensions = document
  //           .getElementById("grid-container")
  //           .getBoundingClientRect();
  //         if (adjacencyList[i][0] === "social") {
  //           const innerDimensions = document
  //             .getElementById(adjacencyListItem[2] + "_inner_img")
  //             .getBoundingClientRect();
  //           CreateIcon(offsetDimensions, innerDimensions, adjacencyListItem);
  //         } else {
  //           const outerDimensions = document
  //             .getElementById(adjacencyListItem[2] + "_outer_img")
  //             .getBoundingClientRect();
  //           CreateIcon(offsetDimensions, outerDimensions, adjacencyListItem);
  //         }
  //       }
  //       // Add event listener to window object to recall createIcon function when window size changes
  //       window.addEventListener("resize", () => {
  //         for (const element of [
  //           ...document
  //             .getElementById("grid-container")
  //             .querySelectorAll(".small-circle"),
  //         ])
  //           element.remove();
  //         for (const element of [
  //           ...document
  //             .getElementById("line-canvas")
  //             .querySelectorAll("#lines"),
  //         ])
  //           element.remove();
  //           const isShow =
  //           document.getElementById("lightboxTop").className === "isShow" ||
  //           document.getElementById("lightboxBottom").className === "isShow";
  //         if (isShow) {
  //           for (let i = 0; i < adjacencyList.length; i++) {
  //             const adjacencyListItem = adjacencyList[i];
  //             const offsetDimensions = document
  //               .getElementById("line-canvas")
  //               .getBoundingClientRect();
  //             if (adjacencyList[i][0] === "social") {
  //               const innerDimensions = document
  //                 .getElementById(adjacencyListItem[2] + "_inner_img")
  //                 .getBoundingClientRect();
  //               CreateIcon(
  //                 offsetDimensions,
  //                 innerDimensions,
  //                 adjacencyListItem
  //               );
  //             } else {
  //               const outerDimensions = document
  //                 .getElementById(adjacencyListItem[2] + "_outer_img")
  //                 .getBoundingClientRect();
  //               CreateIcon(
  //                 offsetDimensions,
  //                 outerDimensions,
  //                 adjacencyListItem
  //               );
  //             }
  //           }
  //         }

  //       });

  //     }
  //   } else {
  //     // document.getElementById("Connections").innerText = "Connections";
  //     for (const element of [
  //       ...document
  //         .getElementById("grid-container")
  //         .querySelectorAll(".small-circle"),
  //     ])
  //       element.remove();
  //     for (const element of [
  //       ...document.getElementById("line-canvas").querySelectorAll("#lines"),
  //     ])
  //       element.remove();
  //   }
  // }

  const handleTriggerClick = (DataProperty) => {
	setIsElementSelected(true);
    setActiveProperty(DataProperty);
	if (!("reverseAdjacencies" in DataProperty[1])){
		BuildReverseAdjacencies();
	}
    //const connections = DataProperty[1]['adjacent'] || []; 
	var connections = null;
	setNumConnections((DataProperty[1]['adjacent'] || []).length); 
	setNumRevConnections((DataProperty[1]["reverseAdjacencies"] || []).length); 
	if (!connectionsInverted){
		connections = DataProperty[1]['adjacent'] || []; 
	}
	else{
	    connections = DataProperty[1]["reverseAdjacencies"] || []; 
	}
    setAdjArray(connections);
  };
  
  useLayoutEffect(() => {
	if (DataProperty.Name != "Default Name"){
		handleTriggerClick(DataProperty);
	};
  }, [connectionsInverted]);
  
  useEffect(() => {
	setCurrentArrayReady(true);
  }, [currentAdjacencyArray]);

  const findConnectionDataByName = (connectionName) => {
    let connectionData = data.ecological.global[connectionName] || data.ecological.local[connectionName];
    if (!connectionData) {
      connectionData = data.social.global[connectionName] || data.social.local[connectionName];
    }
    return connectionData;
  };

  const symbolId = DataProperty[1]?.symbol_id;
  const symbolIdWithoutPng = symbolId?.substring(0, symbolId.length - 4);
  const iconSrc = Icons?.[symbolIdWithoutPng];


  const findIconSrc = (symbolId, Icons) => {
    const symbolIdWithoutPng = symbolId?.substring(0, symbolId.length - 4);
    return Icons?.[symbolIdWithoutPng];
  };


  const findDataByChildName = (childName) => {
	var childItem = undefined;
	for (const entry of currentAdjacencyArray) {
			if (entry[2] === childName){
				childItem = entry[3];
				break;
			}
	}
    if (childItem) {
	  setLongDesText(childItem > 384);
      setConnectionDes(childItem);
	  setConnectionTitle("");
      setIsInfoBoxOpen(true);
      setShowPrimaryCircle(false); 
    } else {
      console.log("No child data found for: ", childName);
    }
  };


  //useEffect(() => {
    //const connections = currentAdjacencyArray || [];
    //setNumConnections(connections.length);
  //}, [activeProperty]);

  const getCircleSize = (numConnections) => {
    if (numConnections >= 12 && numConnections <= 14) {
      return { circleHeight: "120px", circleWidth: "120px", imgMaxWidth: "7vh", imgMaxHeight: "7vh" };
    } else if (numConnections >= 15 && numConnections <= 17) {
      return { circleHeight: "100px", circleWidth: "100px", imgMaxWidth: "6vh", imgMaxHeight: "6vh" };
    } else if (numConnections >= 18 && numConnections <= 19) {
      return { circleHeight: "90px", circleWidth: "90px", imgMaxWidth: "5vh", imgMaxHeight: "5vh" };
    } else if (numConnections >= 20) {
      return { circleHeight: "80px", circleWidth: "80px", imgMaxWidth: "4vh", imgMaxHeight: "4vh" };
    } else {
      return { circleHeight: "140px", circleWidth: "140px", imgMaxWidth: "7vh", imgMaxHeight: "5vh" };
    }
  };


  return (
    <>
	  {isInfoBoxOpen && (
          <div className="connection-des-box">
		    <h3>{connectionTitle}</h3>
            <div className={`${longDesText ? "longDesText" : "smallDesText"}`} dangerouslySetInnerHTML={{__html: connectionDes}}></div>
            <button onClick={() => {
				if (!isElementSelected){
					ChangeState(true);
					let element_light_bottom = document.getElementById("lightboxBottom");
					let element_light_top = document.getElementById("lightboxTop");		
					element_light_bottom.classList.remove("isShow");
					element_light_bottom.classList.add("hidden");
					element_light_top.classList.remove("isShow");
					element_light_top.classList.add("hidden");
				}
				else{
					setShowPrimaryCircle(true);
					setIsInfoBoxOpen(false);
					handleStateChange();
				}
            }}>
            Close
          </button>
          </div>
        )}
      <div
        className={`${trigger ? "isShow" : "hidden"}`}
        id="lightboxTop"
        onClick={() => {
			setIsElementSelected(false);
			setDetailState("details");
			setCurrentArrayReady(false);
			setAdjArray([]);
			setActiveProperty(null);
            ChangeState();
            }}>
		</div>
      <div
        className={`${trigger ? "isShow" : "hidden"}`}
        id="lightboxBottom"
        onClick={() => {
			setIsElementSelected(false);
			setDetailState("details");
			setCurrentArrayReady(false);
			setAdjArray([]);
			setActiveProperty(null);
            ChangeState();
            }}>
		</div>
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

        {showConnection && (
          <div id="connection_circle_container" className={currentAdjacencyArray.length > 12 ? "small" : ""}>
            {activeProperty && currentArrayReady && currentAdjacencyArray.map((connectionArray, index) => {
              const connectionName = connectionArray[2];
              const connectionData = findConnectionDataByName(connectionName);
              if (connectionData) {
                const iconSrc = findIconSrc(connectionData.symbol_id, Icons);
				const dispName = connectionData.display_name;
                const angle = ((index / currentAdjacencyArray.length) * 360)+270;
                let distance = 350;
                const circleColor = connectionData.quarter.includes('ecological') ? '#3AADC6' : '#8FC53A';
                const isSmall = currentAdjacencyArray.length > 12;
				const numRelConnections = currentAdjacencyArray.length;
                if (isSmall) {
                distance = 450;
                }
                return (
                <>
            <div
              id={`connection_circle`}
              className={`circle ${trigger && detailState !== "details" ? "isShow" : ""} connection-circle`}
              key={index}
              style={{
                "--circle-height": getCircleSize(numRelConnections).circleHeight,
                "--circle-width": getCircleSize(numRelConnections).circleWidth,
                "--img-max-width": getCircleSize(numRelConnections).imgMaxWidth,
                "--img-max-height": getCircleSize(numRelConnections).imgMaxHeight,
                transform: `rotate(${angle}deg) translate(${distance}px) rotate(-${angle}deg)`,
                zIndex: 15,
                backgroundColor: circleColor,
              }}
              onClick={() => {
                if (isInfoBoxOpen) {
                  setIsInfoBoxOpen(false);
                  setShowPrimaryCircle(true); 
                } else {
                  findDataByChildName(connectionName, index);
                  setShowPrimaryCircle(false); 
                  setIsInfoBoxOpen(true);
                }
              }}                  
              onMouseEnter={() => {
                setHoveredConnection({ name: connectionName, index });
              }}
              onMouseLeave={() => {
                setHoveredConnection(null);
              }}
              onMouseMove={(event) => {
				const bounds = event.currentTarget.getBoundingClientRect();
				let perX = (event.clientX-window.innerWidth/2);
				let perY = (event.clientY-window.innerHeight/2);
                setTooltipX(perX);
                setTooltipY(perY);
              }}
              ref={(el) => (connectionRefs.current[index] = el)}
              >
                  <img
                    id="connection_circle_img"
                    src={iconSrc}
                    alt={connectionName}
                  />
                  {!isSmall && (
                    <p>
                      {dispName || connectionName.split("_").join(" ")}
                    </p>
                  )}
                </div>
                { isSmall && hoveredConnection?.name === connectionName && (
                      //<div style={{ position: 'fixed' }}>
                        <Tooltip
                        visible={hoveredConnection?.name === connectionName}
                        title={dispName || connectionName.split("_").join(" ")}
                        x={tooltipX}
                        y={tooltipY}
                        />
                  //</div> 
                )}
                
              </>
            );
  } else {
    return null;
  }
})}
      </div>
    )}  
        <span
          id="primary_circle"
          className={`circle ${trigger && showPrimaryCircle && !isInfoBoxOpen ? "isShow" : "hidden"}`}
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
		
		<span id="bottom_container">
			<span
				id="bottom_circle"
				className={`circle ${(trigger) ? ((detailState !== "details") ? "isShow" : "disabledButton") : "hiddenButton"}`}
				onClick={toggleShowConnection}
			>
				<p id="Details" className="lightbox_title">
					{"Thriving Definition"}
				</p>
			</span>
		
			<span
				id="bottom_circle"
				className={`circle ${(trigger && numConnections > 0) ? ((detailState !== "connections") ? "isShow" : "disabledButton") : "hiddenButton"}`}
				//className={`circle ${(trigger && numConnections > 0 && detailState !== "connections") ? "isShow" : "disabledButton"}`}
				onClick={toggleShowConnection}
			>
				<p id="Connections" className="lightbox_title">
					{"Connections from this domain"}
				</p>
			</span>
		
			<span
				id="bottom_circle"
				className={`circle ${(trigger && numRevConnections > 0) ? ((detailState !== "reverseConnections") ? "isShow" : "disabledButton") : "hiddenButton"}`}
				onClick={toggleShowConnection}
			>
				<p id="RevConnections" className="lightbox_title">
					{"Connections to this domain"}
				</p>
			</span>
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
	  <span
			id="bottom_left_container"
		>
			
				<button 
					id="generalInfoButton" 
					type="button" 
					className = "infoButton"
					onClick={displayUserInfo}
				>About the interactive doughnut</button>
			
				<button 
					id="connectionMethodologyInfoButton" 
					type="button" 
					onClick={displayConnectionMethodology}
					className={`infoButton ${(trigger && detailState !== "details") ? "isShow" : "hiddenButton"}`}
				>How did we derive these connections?</button>
			
		</span>
    </>
  );
}
