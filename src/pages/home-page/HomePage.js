import React from "react";
import BarChart from "components/BarChart/BarChart";
import YoutubeEmbed from "components/YoutubeAddon/YoutubeEmbed";
import { ImageBg, MainBg } from "./PageElements";
import BackgroundImage from "images/background_image.jpg";
import "./index.css";
import data from "./NewData.json";
import { hover } from "@testing-library/user-event/dist/hover";
import useWindowDimensions from "components/LightBox/windowDimensions";

function HomePage() {
  const [sliderGroups, setSliderGroups] = React.useState({
    ecological: { global: {}, local: {} },
    social: { global: {}, local: {} },
  });
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => {
    setSliderGroups(data);
    setLoaded(true);
  }, [loaded]);
  const [hoverText, setHoverText] = React.useState();
  const [topPx, setTopPx] = React.useState();
  const [color, setTextColor] = React.useState("black");
  const [isOpen, setIsOpen] = React.useState(false);
  const { height, width } = useWindowDimensions();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    setIsMobile(
      width <= 768 ||
        (width > 768 && height <= 500) ||
        (height <= 767 && width <= 768)
    );
  }, [width, height]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        textAlign: isMobile,
      }}
    >
      <MainBg>
        <ImageBg src={BackgroundImage} />
      </MainBg>

      <h1
        style={{
          position: "absolute",
          fontSize: "2rem",
          top: "0",
          marginTop: height <= 768 ? 8 : 16,
          marginLeft: isMobile ? 16 : 48,
          wordSpacing: "8px",
          textAlign: "center",
        }}
      >
        THE GLASGOW DOUGHNUT
      </h1>
      {width > 992 && (
        <b
          style={
            topPx == 0
              ? {
                  color,
                  position: "absolute",
                  maxWidth: `${width / 7}px`,
                  fontSize: `${(width + height) / 100}px`,
                  left: width <= 992 ? 16 : 32,
                  bottom: `${height / 3 + 175}px`,
                }
              : {
                  color,
                  position: "absolute",
                  maxWidth: `${width / 7}px`,
                  fontSize: `${(width + height) / 100}px`,
                  left: width <= 992 ? 16 : 32,
                  top: `${height / 3 + topPx + 25}px`,
                }
          }
        >
          {hoverText}
        </b>
      )}
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          zIndex: 999,
          overflow: "hidden",
          width: "100%",
          position: "relative",
        }}
      >
        {!isMobile ? (
          <BarChart
            height={height}
            hoverText={hoverText}
            setIsOpen={setIsOpen}
            setTextColor={setTextColor}
            setHoverText={setHoverText}
            data={sliderGroups}
            setTopPx={setTopPx}
            size={700}
          />
        ) : (
          <h4 style={{ textAlign: "center" }}>
            The Glasgow Doughnut is best viewed on a full computer screen.
            <br />
            <br />
            Please scroll for more information.
          </h4>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <a
          // style={{ position: "absolute", top: 750, left: 64 }}
          className="button"
          href="./Thriving Glasgow Portrait Report (GALLANT).pdf"
          download="Thriving Glasgow Portrait Report (GALLANT).pdf"
          style={{
            textAlign: "center",
            width: isMobile ? "150px" : "10%",
            marginTop: width <= 992 ? 16 : 32,
          }}
        >
          Download Report
        </a>
      </div>
      {/* <div className="flex-container">
        <li>
          <div className="imageDiv">
            <img src="goal.png" className="image" alt="archery target"></img>
          </div>
          <div className="flex-item pStyle headStyle">
            <h1>target</h1>
            <p>
              taken from an officical existing policy or strategy document
              (local or national)
            </p>
          </div>
        </li>

        <li>
          <div className="imageDiv">
            <img
              src="speedometer.png"
              className="image"
              alt="speedometer"
            ></img>
          </div>
          <div className="flex-item pStyle headStyle">
            <h1>indicator</h1>
            <p>
              Quis lectus nulla at volutpat diam ut venenatis tellus. Urna nunc
              id
            </p>
          </div>
        </li>

        <li>
          <div className="imageDiv">
            <img src="happy.png" className="image" alt="smiley face"></img>
          </div>
          <div className="flex-item pStyle headStyle">
            <h1>thriving</h1>
            <p>
              Et malesuada fames ac turpis egestas. Volutpat sed cras ornare
              arcu dui vivamus arcu felis bibendum.
            </p>
          </div>
        </li>

        <li>
          <div className="imageDiv">
            <img
              src="group.png"
              className="image"
              alt="molecule with connections"
            ></img>
          </div>
          <div className="flex-item pStyle headStyle">
            <h1>connections</h1>
            <p>
              Egestas egestas fringilla phasellus faucibus scelerisque eleifend.
            </p>
          </div>
        </li>
      </div> */}

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "15px",
          justifyContent: "center",
          padding: "0px",
          paddingBottom: "1.5%",
          paddingTop: "1.5%",
        }}
      >
        <div
          style={{
            maxWidth: isMobile ? "100%" : "45%",
            marginLeft: isMobile ? "10%" : "10%",
            marginInline: "10%",
          }}
        >
          <h3 className="subtitle">
            Use this page to explore the Thriving Glasgow Doughnut.
          </h3>
          <p>
            Based on Kate Raworth’s{" "}
            <a
              style={{ color: "inherit" }}
              href="https://doughnuteconomics.org/about-doughnut-economics"
            >
              Doughnut Economics
            </a>{" "}
            framework, this Doughnut captures what it would mean for Glasgow to{" "}
            meet the needs of all people, within the means of the living planet.
            A team of researchers have worked closely with a diverse group of
            Glasgow changemakers to define what a ‘thriving’ future for our city
            could look like.
          </p>
        </div>
        <div
          className="SponsorsWrapper"
          style={{
            maxWidth: isMobile ? "100%" : "45%",
            marginLeft: isMobile ? 16 : 0,
            marginBottom: isMobile ? 16 : 0,
            position: "relative",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <img
            src="snip.JPG"
            alt="Glasgow Digital Doughnut Organisations"
            style={{
              maxHeight: "275px",
              minWidth: isMobile ? "50%" : "100%",
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#e3e3e3",
          paddingTop: "1.5%",
        }}
      >
        <div style={{ marginInline: "10%" }}>
          <div>
            The Glasgow Doughnut sets out the vision for a prosperous,
            sustainable future, as part of a flourishing natural world. It
            provides detail on four distinct, but interconnected, perspectives
            on wellbeing, viewed through the four Portrait lenses:
          </div>
          {/* <div style={{ display: "flex", justifyContent: "space-between" }}> */}
          <div>
            <ul>
              <li>
                The Local-Social lens asks: How can all the people of Glasgow
                thrive?
              </li>
              <li>
                The Local-Ecological lens asks: How can Glasgow be as generous
                as the wildland next door?
              </li>
              <li>
                {" "}
                The Global-Ecological lens asks: How can Glasgow respect the
                health of the whole planet?
              </li>
              <li>
                {" "}
                The Global-Social lens asks: How can Glasgow respect the
                wellbeing of all people?
              </li>
            </ul>
            <div>
              Each of these lenses relates to the others, and shows that
              activities in Glasgow have a strong relationship with global
              wellbeing too (in social and ecological terms). The Portrait is
              intended to be viewed as a holistic, whole-system vision of what
              thriving would look like in all four lenses, with each being
              equally important.
            </div>
          </div>
          <YoutubeEmbed width={width} embedId="I77B871YOTQ" />

          {!isMobile && <br />}
          <div>
            To define ‘thriving’ across all these dimensions, the Portrait team
            held a series of workshops and engagement events. Engaging with
            policy officers, elected officials, local citizens, scientists,
            private and third sector organisations, our researchers asked how we
            would define ‘thriving’ in each of the four lenses. Each lens has a
            number of different dimensions, leading to a total of 44 definitions
            for a Thriving Glasgow. Click on the different dimensions within
            this ‘re-rolled’ Doughnut to explore what stakeholders told us about
            each topic area. This vision has now been approved by Glasgow City
            Council and we hope that different businesses, organisations and
            individuals across Glasgow will identify areas where they can
            contribute to this goal. Some impacts will be direct, but some may
            happen as secondary effects, which is why it is helpful to visualise
            the framework as a whole.
          </div>
          <br />
          <div>
            We will continue to add data to this Doughnut as the{" "}
            <a
              href="https://www.gla.ac.uk/research/az/sustainablesolutions/ourprojects/gallant/"
              style={{ color: "inherit" }}
            >
              GALLANT
            </a>{" "}
            programme progresses. Our Systems Transformation workstream are
            exploring indicators and targets, baseline values which we can
            measure future progress against, as well as the interconnections
            within the system.
          </div>
          <br />
          <div>
            For more detail on the research process, policy context, and future
            steps,{" "}
            <a
              style={{ color: "inherit" }}
              href="./Thriving Glasgow Portrait Report (GALLANT).pdf"
              download="Thriving Glasgow Portrait Report (GALLANT).pdf"
            >
              please download the Thriving Glasgow Portrait report.
            </a>
          </div>
        </div>
        <br />
        <small style={{ padding: 8, marginLeft: isMobile ? 16 : 0 }}>
          Thanks to{" "}
          <a
            style={{ color: "inherit" }}
            href="https://linktr.ee/the_donut_team"
          >
            Donut Team
          </a>{" "}
          (students at the University of Glasgow) for building the initial
          version of the application.
        </small>

        <br />
      </div>
    </div>
  );
}

export default HomePage;
