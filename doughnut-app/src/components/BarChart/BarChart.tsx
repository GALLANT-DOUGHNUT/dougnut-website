import { useState, useEffect, useRef } from "react";
import { scaleRadial, scaleBand } from "d3-scale";
import { arc } from "d3-shape";
import { select } from "d3-selection";
import Icons from "../../Icons";
import "../Admin/Admin.css";
import { Tooltip } from "./Tooltip";
import type {
  DonutData,
  IndicatorConnection,
  IndicatorDataDict,
} from "../../types/DonutData";
import { IndicatorDetails } from "../Indicator/IndicatorDetails";

type BarChartProps = {
  data: DonutData;
  hoverText: string;
  setTextColor: React.Dispatch<React.SetStateAction<string>>;
  setHoverText: React.Dispatch<React.SetStateAction<string>>;
  setTopPx: React.Dispatch<React.SetStateAction<number>>;
  size: number;
  height: number;
};

export const BarChart = ({
  setTextColor,
  setHoverText,
  setTopPx,
  size = 500,
  height,
  data,
}: BarChartProps) => {
  const outerRadius = size / 2 - 20;
  const innerRadius = outerRadius / 2;
  const ringRadius = size / 7;
  const smallRingRadius = size / 9.2;
  const margin = 3;

  const [events, eventSetter] = useState({
    target: { href: { baseVal: "Default Value" } },
  });
  const [indicatorRecord, setIndicatorRecord] =
    useState<IndicatorDataDict | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipTitle, setTooltipTitle] = useState("");
  const [tooltipText, setTooltipText] = useState("");
  const [tooltipX, setTooltipX] = useState(0);
  const [tooltipY, setTooltipY] = useState(0);

  const [connections, setConnections] = useState<IndicatorConnection[]>([]);
  const [showConnection, setShowConnection] = useState(false);

  // const [data, setData] = useState(data); Potentially needed for dynamic read-write operations
  const ref = useRef<SVGSVGElement | null>(null);
  const innerTextRadius = innerRadius - (ringRadius + smallRingRadius) / 4;
  const outerTextRadius = innerRadius + (ringRadius + smallRingRadius) / 4;

  const getConnectionNames = (data: string[]): IndicatorConnection[] => {
    if (!Array.isArray(data)) {
      console.error("Expected an array but received:", data);
      return [];
    }

    return data.map((item) => ({
      half: item[0],
      quarter: item[1],
      name: item[2],
      description: item[3],
    }));
  };

  useEffect(() => {
    // Opens the modal for the indicator record
    function LightBoxTrigger(Event: any, ElementProperties: any) {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;

      setOverlayVisible(true);
      eventSetter(Event);
      const newWord = ElementProperties[0]
        .split(" ")
        .map((word: string) => word?.[0]?.toUpperCase() + word?.substring(1))
        .join(" ");

      setIndicatorRecord({ [newWord]: ElementProperties[1] });

      const connections = getConnectionNames(ElementProperties[1]["adjacent"]);
      setConnections(connections);

      document.body.style.overflow = "hidden";
    }

    function CreateBarChart(svg: any) {
      function SetupBarChart() {
        svg.selectAll("g").remove();
        //TODO: This is to remove the element from last render, probably not a good way of doing this

        const group = svg
          .append("g")
          .attr("transform", "translate(" + size / 2 + "," + size / 2 + ")");

        const yOuter = scaleRadial()
          .range([innerRadius + ringRadius / 2 + margin, outerRadius]) // Domain will be define later.
          .domain([0, 140]); // Domain of Y is from 0 to the max seen in the data

        const yInner = scaleRadial()
          .range([innerRadius - ringRadius / 2 - margin, 10]) //This is 10 because the inner part of the graph would become too pointy
          .domain([0, 100]);

        return { group, yOuter, yInner };
      }

      let { group, yOuter, yInner } = SetupBarChart();

      const mouseover = function (event: any, data: any) {
        const CapitalisedProperty = (
          data[0][0].toUpperCase() + data[0].slice(1)
        ).replaceAll(/_/g, " ");

        if (data?.[1]?.quarter === "global_ecological") {
          setTextColor("#297C8E");
          setHoverText("How will Glasgow safeguard the health of the planet?");
          setTopPx(0);
        } else if (data?.[1]?.quarter === "global_social") {
          setTextColor("#477C3C");
          setHoverText(
            "How will Glasgow respect and support the wellbeing of people worldwide?",
          );
          setTopPx(0);
        } else if (data?.[1]?.quarter === "local_ecological") {
          setTextColor("#297C8E");
          setHoverText("How will the city thrive within its natural habitat?");
          setTopPx(150);
        } else if (data?.[1]?.quarter === "local_social") {
          setTextColor("#477C3C");
          setHoverText("How will the people of Glasgow thrive?");
          setTopPx(150);
        }
        setTooltipVisible(true);
        setTooltipTitle(CapitalisedProperty);
        setTooltipText(
          data[1].value === -1 ? "Not Known" : data[1].value + "%",
        );

        if (document.getElementById(data[0] + "_outer")) {
          document
            .getElementById(data[0] + "_outer")!
            .setAttribute("fill", "#B84900");
        } else if (document.getElementById(data[0] + "_inner")) {
          document
            .getElementById(data[0] + "_inner")!
            .setAttribute("fill", "#B84900");
        }
      };

      const mousemove = function (event: any) {
        setTooltipX(event.clientX + 10);
        setTooltipY(event.clientY + 10);
      };

      const mouseleave = function (event: any, data: any) {
        setTooltipVisible(false);
        setHoverText("");
        if (document.getElementById(data[0] + "_outer")) {
          if (data[1].value === -1)
            document
              .getElementById(data[0] + "_outer")!
              .setAttribute("fill", "#cfcfcf");
          else
            document
              .getElementById(data[0] + "_outer")!
              .setAttribute("fill", "#ff7518");
        } else if (document.getElementById(data[0] + "_inner")) {
          if (data[1].value === -1)
            document
              .getElementById(data[0] + "_outer")!
              .setAttribute("fill", "#cfcfcf");
          else
            document
              .getElementById(data[0] + "_inner")!
              .setAttribute("fill", "#ff7518");
        }
      };

      function SetupBarChartInnerSectors(group: any, yInner: any) {
        function CreateGraphColumnInner(
          Properties: any,
          group: any,
          xScale: any,
          yInner: any,
        ) {
          group
            .append("g")
            .selectAll("path")
            .data(Properties)
            .enter()
            .append("path")
            .attr("class", "GraphColumn")
            .attr("fill", (d: any) =>
              d[1].value === -1 ? "#cfcfcf" : "#ff7518",
            )
            .attr("id", (d: any) => d[0] + "_inner")
            .attr(
              "d",
              arc() // imagine your doing a part of a donut plot
                .innerRadius(innerRadius - ringRadius / 2 - margin)
                .outerRadius((d: any) =>
                  yInner(d[1].value === -1 ? 100 : d[1].value),
                )
                .startAngle((d: any) => xScale(d[0]))
                .endAngle((d: any) => xScale(d[0]) + xScale.bandwidth())
                .padAngle(margin / 100)
                .padRadius(innerRadius),
            );
        }

        // dark green
        function CreateRingSegment(Properties: any, group: any, xScale: any) {
          group
            .append("g")
            .selectAll("path")
            .data(Properties)
            .enter()
            .append("path")
            .attr("class", "GraphRingSegment")
            .attr("fill", "#487c3a")
            .attr(
              "d",
              arc()
                .innerRadius(innerRadius - ringRadius / 2)
                .outerRadius(innerRadius + 45 - ringRadius / 2)
                .startAngle((d: any) => xScale(d[0]) - 0.01) //The -.01 is to fix slight gaps
                .endAngle((d: any) => xScale(d[0]) + xScale.bandwidth())
                .padAngle(0)
                .padRadius(innerRadius),
            );

          // dark #B84900
          group
            .append("g")
            .selectAll("path")
            .data(Properties)
            .enter()
            .append("path")
            .attr("class", "GraphRingSegment")
            .attr("fill", "#297c8e")
            .attr(
              "d",
              arc()
                .innerRadius(innerRadius - 20 + ringRadius / 2)
                .outerRadius(innerRadius + ringRadius / 2)
                .startAngle((d: any) => xScale(d[0]) - 0.01) //The -.01 is to fix slight gaps
                .endAngle((d: any) => xScale(d[0]) + xScale.bandwidth())
                .padAngle(0)
                .padRadius(innerRadius),
            );

          // light green
          group
            .append("g")
            .selectAll("path")
            .data(Properties)
            .enter()
            .append("path")
            .attr("class", "GraphRingSegment")
            .attr("fill", "#8fc53b")
            .attr(
              "d",
              arc()
                .innerRadius(innerRadius - smallRingRadius / 2)
                .outerRadius(innerRadius + smallRingRadius / 2)
                .startAngle((d: any) => xScale(d[0]) - 0.01) //The -.01 is to fix slight gaps
                .endAngle((d: any) => xScale(d[0]) + xScale.bandwidth())
                .padAngle(0)
                .padRadius(innerRadius),
            );

          // light #B84900
          group
            .append("g")
            .selectAll("path")
            .data(Properties)
            .enter()
            .append("path")
            .attr("class", "GraphRingSegment")
            .attr("fill", "#39adc6")
            .attr(
              "d",
              arc()
                .innerRadius(innerRadius - 36 + smallRingRadius / 2)
                .outerRadius(innerRadius + smallRingRadius / 2)
                .startAngle((d: any) => xScale(d[0]) - 0.01) //The -.01 is to fix slight gaps
                .endAngle((d: any) => xScale(d[0]) + xScale.bandwidth())
                .padAngle(0)
                .padRadius(innerRadius),
            );
        }

        // inner icons
        function CreateIconRing(Properties: any, group: any, xScale: any) {
          group
            .append("g")
            .selectAll("g")
            .data(Properties)
            .enter()
            .append("g")
            .attr("text-anchor", "middle")
            .attr("transform", function (d: any) {
              const Rotation =
                ((xScale(d[0]) + xScale.bandwidth() / 2) * 180) / Math.PI - 90;
              return `rotate(${Rotation}) translate(${smallRingRadius * 1.92},0) rotate(${-Rotation})`;
            })
            .append("svg:image")
            .attr("x", -smallRingRadius + 14.5)
            .attr("y", -smallRingRadius + 15)
            .attr("width", smallRingRadius / 3.5)
            .attr("height", smallRingRadius / 3.7)
            .attr("xlink:href", function (d: any) {
              const { symbol_id } = d[1];
              const imgRef = symbol_id.substring(
                0,
                symbol_id.length - 4,
              ) as keyof typeof Icons;
              return Icons[imgRef];
            })
            .attr("id", (d: any) => d[0] + "_" + d[1]["quarter"] + "_inner_img")
            .style("cursor", "pointer")
            .attr(
              "transform",
              `translate(${ringRadius / 2}, ${ringRadius / 2})`,
            )
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .on("click", function (Event: any, ElementProperties: any) {
              if (window.location.pathname === "/") {
                //to be changed when giving website away or url changes to proper one
                LightBoxTrigger(Event, ElementProperties);
              }
            });

          // All Text Labeling of Bar Chart --------
          group
            .append("path")
            .attr("id", "arc-top") //Unique id of the path
            .attr(
              "d",
              `M -${innerTextRadius - 0.5},0 A ${innerTextRadius - 0.5} ${
                innerTextRadius - 0.5
              } 0 0 1 ${innerTextRadius - 0.5} 0`,
            ) //SVG path
            .attr("dy", ".1em")
            .style("fill", "none")
            .style("stroke", "0");

          group
            .append("g")
            .append("text")
            .append("textPath")
            .attr("xlink:href", "#arc-top")
            .style("alignment-baseline", "middle")
            .style("dominant-baseline", "middle")
            .style("fill", "white")
            .style("font-size", 12 + "px")
            .style("letter-spacing", "0.001em")
            .style("text-anchor", "middle")
            .style("user-select", "none")
            .style("cursor", "default")
            .attr("startOffset", "50%")
            .text("GLOBAL SOCIAL FOUNDATION");

          group
            .append("path")
            .attr("id", "arc-bottom") //Unique id of the path
            .attr(
              "d",
              `M -${innerTextRadius + 0.5},0 A ${innerTextRadius + 0.5} ${
                innerTextRadius + 0.5
              } 0 0 0 ${innerTextRadius + 0.5} 0`,
            ) //SVG path
            .style("fill", "none")
            .style("stroke", "0");

          group
            .append("g")
            .append("text")
            .append("textPath")
            .attr("xlink:href", "#arc-bottom")
            .style("alignment-baseline", "middle")
            .style("dominant-baseline", "middle")
            .style("fill", "white")
            .style("font-size", 12 + "px")
            .style("letter-spacing", "0.001em")
            .style("text-anchor", "middle")
            .style("user-select", "none")
            .style("cursor", "default")
            .attr("startOffset", "50%")
            .attr("dy", ".1em")
            .text("LOCAL SOCIAL FOUNDATION");

          group
            .append("path")
            .attr("id", "lower-arc-bottom") //Unique id of the path
            .attr(
              "d",
              `M -${outerTextRadius + 0.5},0 A ${outerTextRadius + 0.5} ${
                outerTextRadius + 0.5
              } 0 0 0 ${outerTextRadius + 0.5} 0`,
            ) //SVG path
            .style("fill", "none")
            .style("stroke", "0");

          group
            .append("g")
            .append("text")
            .append("textPath")
            .attr("xlink:href", "#lower-arc-bottom")
            .style("alignment-baseline", "middle")
            .style("dominant-baseline", "middle")
            .style("fill", "white")
            .style("font-size", 12 + "px")
            .style("letter-spacing", "0.001em")
            .style("text-anchor", "middle")
            .style("user-select", "none")
            .style("cursor", "default")
            .attr("startOffset", "50%")
            .attr("dy", ".1em")
            .text("LOCAL ECOLOGICAL CEILING");

          group
            .append("path")
            .attr("id", "upper-arc-top") //Unique id of the path
            .attr(
              "d",
              `M -${outerTextRadius - 0.5},0 A ${outerTextRadius - 0.5} ${
                outerTextRadius - 0.5
              } 0 0 1 ${outerTextRadius - 0.5} 0`,
            ) //SVG path
            .style("fill", "none")
            .style("stroke", "0");

          group
            .append("g")
            .append("text")
            .append("textPath")
            .attr("xlink:href", "#upper-arc-top")
            .style("alignment-baseline", "middle")
            .style("dominant-baseline", "middle")
            .style("fill", "white")
            .style("font-size", 12 + "px")
            .style("letter-spacing", "0.001em")
            .style("text-anchor", "middle")
            .style("user-select", "none")
            .style("cursor", "default")
            .attr("startOffset", "50%")
            .attr("dy", ".1em")
            .text("GLOBAL ECOLOGICAL CEILING");
        }

        for (const [Half, Properties] of Object.entries(data.social)) {
          const xScale = scaleBand()
            // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
            .range(
              Half === "global"
                ? [-Math.PI / 2, Math.PI / 2]
                : [Math.PI / 2, Math.PI * 1.5],
            )
            .align(0) // This does nothing
            .domain(Object.keys(Properties)); // The domain of the X axis is the list of states.
          const PropertiesEntries = Object.entries(Properties);
          CreateGraphColumnInner(PropertiesEntries, group, xScale, yInner);
          CreateRingSegment(PropertiesEntries, group, xScale);
          CreateIconRing(PropertiesEntries, group, xScale);
        }
      }

      function SetupBarChartOuterSectors(group: any, yOuter: any) {
        function CreateGraphColumnOuter(
          Properties: any,
          group: any,
          xScale: any,
          yOuter: any,
        ) {
          group
            .append("g")
            .selectAll("path")
            .data(Properties)
            .enter()

            .append("path")
            .attr("class", "GraphColumn")
            .attr("fill", (d: any) =>
              d[1].value === -1 ? "#cfcfcf" : "#ff7518",
            )
            .attr("id", (d: any) => d[0] + "_outer")
            .attr(
              "d",
              arc() // imagine your doing a part of a donut plot
                .innerRadius(innerRadius + ringRadius / 2 + margin)
                .outerRadius((d: any) =>
                  yOuter(d[1].value === -1 ? 100 : d[1].value),
                )
                .startAngle((d: any) => xScale(d[0]))
                .endAngle((d: any) => xScale(d[0]) + xScale.bandwidth())
                .padAngle(margin / 100)
                .padRadius(innerRadius),
            );
        }
        // outer icons
        function CreateIconRing(Properties: any, group: any, xScale: any) {
          group
            .append("g")
            .selectAll("g")
            .data(Properties)
            .enter()
            .append("g")
            .attr("text-anchor", "middle")
            .attr("transform", function (d: any) {
              const Rotation =
                ((xScale(d[0]) + xScale.bandwidth() / 2) * 180) / Math.PI - 90;
              return `rotate(${Rotation}) translate(${smallRingRadius * 2.44},0) rotate(${-Rotation})`;
            })
            .append("svg:image")
            .attr("x", -smallRingRadius + 13.7)
            .attr("y", -smallRingRadius + 13.2)
            .attr("width", smallRingRadius / 3)
            .attr("height", smallRingRadius / 3)
            .attr("xlink:href", function (d: any) {
              const { symbol_id } = d[1];
              const imgRef = symbol_id.substring(
                0,
                symbol_id.length - 4,
              ) as keyof typeof Icons;
              return Icons[imgRef];
            })
            .attr("id", (d: any) => d[0] + "_outer_img")
            .style("cursor", "pointer")
            .attr(
              "transform",
              `translate(${ringRadius / 2}, ${ringRadius / 2})`,
            )
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .on("click", function (Event: any, ElementProperties: any) {
              if (window.location.pathname === "/") {
                //to be changed when giving website away or url changes to proper one
                LightBoxTrigger(Event, ElementProperties);
              }
            });
        }

        for (const [Half, Properties] of Object.entries(data.ecological)) {
          const xScale = scaleBand()
            .range(
              Half === "global"
                ? [-Math.PI / 2, Math.PI / 2]
                : [Math.PI / 2, Math.PI * 1.5],
            ) // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
            .align(0) // This does nothing
            .domain(Object.keys(Properties)); // The domain of the X axis is the list of states.

          const PropertiesEntries = Object.entries(Properties);
          CreateGraphColumnOuter(PropertiesEntries, group, xScale, yOuter);
          CreateIconRing(PropertiesEntries, group, xScale);
        }
      }

      SetupBarChartInnerSectors(group, yInner);
      SetupBarChartOuterSectors(group, yOuter);
    }

    const svgElement = select(ref.current);
    CreateBarChart(svgElement);
  }, [
    data,
    innerRadius,
    margin,
    outerRadius,
    ringRadius,
    smallRingRadius,
    innerTextRadius,
    outerTextRadius,
    size,
  ]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <div style={{ marginTop: 50 }}>
        <svg
          className="svgClass"
          ref={ref}
          height={size}
          width={size}
          style={{ maxWidth: "100%", zoom: "140%" }}
          viewBox={"100 85 500 550"}
        ></svg>
      </div>
      <>
        {window.location.pathname !== "/" ? null : (
          <>
            <div style={{ marginTop: height <= 768 ? 15 : 0 }}></div>
            <div
              style={{
                backgroundColor: "black",
                position: "absolute",
                width: "100%",
                height: 5,
                marginTop: 5,
              }}
            ></div>
            <Tooltip
              title={tooltipTitle
                .split(" ")
                .map((word) => word?.[0]?.toUpperCase() + word?.substring(1))
                .join(" ")}
              text={tooltipText}
              x={tooltipX}
              y={tooltipY}
              visible={tooltipVisible}
            />
            <IndicatorDetails
              visible={overlayVisible}
              setVisible={setOverlayVisible}
              indicatorDataRecord={indicatorRecord}
              data={data}
              connections={connections}
            />
          </>
        )}
      </>
    </div>
  );
};
