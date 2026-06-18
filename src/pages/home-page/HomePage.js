import React from "react";
import BarChart from "../../components/BarChart/BarChart";
import YoutubeEmbed from "../../components/YoutubeAddon/YoutubeEmbed";
import { ImageBg, MainBg } from "./PageElements";
import BackgroundImage from "../../images/background_image.jpg";
import "./index.css";
import data from "./NewData.json";
import { hover } from "@testing-library/user-event/dist/hover";
import useWindowDimensions from "../../components/LightBox/windowDimensions";

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
  const [hoverText, setHoverText] = React.useState("");
  const [topPx, setTopPx] = React.useState(0);
  const [color, setTextColor] = React.useState("black");
  const [isOpen, setIsOpen] = React.useState(false);
  const { height, width } = useWindowDimensions();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    setIsMobile(
      width <= 768 ||
        (width > 768 && height <= 501) ||
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
          <h1 className="subtitle">
            Explore a shared vision for a greener, fairer, prosperous Glasgow -
            the Thriving Glasgow Doughnut.
          </h1>
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
            The Thriving Glasgow Doughnut presents a vision for the future of a
            greener, fairer, prosperous Glasgow. It is a future where the
            people, wildlife, and ecology of Glasgow are all able to thrive, and
            to thrive in ways that help us mitigate and adapt to the global
            climate crisis. The Glasgow Doughnut downscales to the city-level
            the global principles of{" "}
            <a
              style={{ color: "inherit" }}
              href="https://doughnuteconomics.org/about-doughnut-economics"
            >
              Doughnut Economics
            </a>{" "}
            – a conceptual framework which aims to answer the question,{" "}
            <b>
              ‘how can we meet the needs of all people within the means of the
              living planet?’
            </b>
          </div>
          <br />
          <div>
            The Glasgow Doughnut provides detail on four distinct, but
            interconnected, perspectives on wellbeing, viewed through four
            lenses:
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
                The Global-Ecological lens asks: How can Glasgow respect the
                health of the whole planet?
              </li>
              <li>
                The Global-Social lens asks: How can Glasgow respect the
                wellbeing of all people?
              </li>
            </ul>
            <div>
              Each of these lenses relates to the others, and shows that
              activities in Glasgow have a strong relationship with global
              wellbeing, both in social and ecological terms. The Glasgow
              Doughnut is intended to be viewed as a holistic, whole-system
              vision of what thriving would look like in all four lenses, with
              each being equally important.
            </div>
          </div>
          <YoutubeEmbed width={width} embedId="I77B871YOTQ" />

          {!isMobile && <br />}
          <div>
            To create a shared vision of a thriving future, we engaged in a
            year-long, wide-ranging engagement process with policy officers,
            elected officials, local citizens, scientists, private and third
            sector organisations. We co-developed 44 Thriving Glasgow
            definitions across these four lenses. Click on the different domains
            of the Doughnut to explore the definitions and what stakeholders
            said this might look like in Glasgow. This is just a start of the
            process and we encourage everyone to make use of the Glasgow
            Doughnut to work up their own ideas of what progress would look like
            and think about what is needed to help us get there.
          </div>
          <br />
          <div>
            What is clear is that for rapid progress, we need change in enough
            parts of the system to set in motion positive mutually reinforcing
            processes, whereby progress in one domain makes it easier to make
            advances in another – this means{" "}
            <b>action by everyone, everywhere, all at once! </b>In August 2023,
            the Thriving Definitions were adopted by Glasgow City Council to
            guide their future work. We hope that similarly, many Glasgow
            organisations, businesses and individuals will use this framework to
            articulate their individual and collective contributions to a
            greener, thriving Glasgow, identify action pathways, and use it to
            forge new alliances to accelerate action across the whole system.
          </div>
          <br />
          <div>
            For more detail on the research, policy context, and future steps,{" "}
            <a
              style={{ color: "inherit" }}
              href="./Thriving Glasgow Portrait Report (GALLANT).pdf"
              download="Thriving Glasgow Portrait Report (GALLANT).pdf"
            >
              please download the Thriving Glasgow Portrait report{" "}
            </a>
            and check out the solutions GALLANT is working on by visiting our{" "}
            <a
              href="https://www.gla.ac.uk/research/az/sustainablesolutions/ourprojects/gallant/"
              style={{ color: "inherit" }}
            >
              project website.
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
