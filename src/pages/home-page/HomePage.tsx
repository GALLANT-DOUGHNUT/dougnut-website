import BackgroundImage from "../../images/background_image.jpg";
import organisationsImage from "../../images/snip.jpg";
import "./index.css";
import { useMemo, useState } from "react";
import { useWindowDimensions } from "../../components/Indicator/hooks/useWindowDimensions";
import { YoutubeEmbed } from "../../components/YoutubeAddon/YoutubeEmbed";
import { ImageBg, MainBg } from "./PageElements";
import { Box, Tooltip, Typography, type SxProps } from "@mui/material";
import { UnrolledDonutChart } from "../../components/DonutChart/UnrolledDonutChart";
import DonutSmallIcon from "@mui/icons-material/DonutSmall";
import BarChartIcon from "@mui/icons-material/BarChart";
import { DonutChart } from "../../components/DonutChart/DonutChart";
import { getHoverTextStyling } from "../../helpers/HomepageHelpers";
import { YearSlider } from "../../components/DonutChart/YearSlider";
import { importCsvData } from "../../helpers/DataHelpers";

const chartTypeStyles: SxProps = {
  position: "absolute",
  scale: 1.5,
  cursor: "pointer",
  width: "25px",
  zIndex: 100000,
  mt: 3,
  left: 480,
};

const headerProps: SxProps = {
  position: "absolute",
  fontWeight: 800,
  fontSize: "2rem",
  mt: 2,
  ml: 4,
  zIndex: 100000,
  textAlign: "center",
};

export const HomePage = () => {
  const [hoverText, setHoverText] = useState<string>("");
  const [unrolled, setUnrolled] = useState(false);
  const [showConnections, setShowConnections] = useState(false);
  const [year, setYear] = useState(2024);

  const { height, width } = useWindowDimensions();

  const hoverTextStyling = useMemo(() => {
    return getHoverTextStyling(hoverText, unrolled);
  }, [hoverText, unrolled]);

  const { connectionsData, donutData } = importCsvData();

  const isMobile = useMemo(() => {
    return (
      width <= 768 ||
      (width > 768 && height <= 501) ||
      (height <= 767 && width <= 768) ||
      (unrolled && width <= 1000)
    );
  }, [height, width, unrolled]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        textAlign: isMobile ? "center" : "center",
      }}
    >
      <MainBg>
        <ImageBg src={BackgroundImage} />
      </MainBg>
      <Typography variant="h1" sx={headerProps}>
        THE GLASGOW DOUGHNUT
      </Typography>
      <YearSlider
        data={donutData}
        year={year}
        setYear={setYear}
        hideSlider={showConnections}
      />
      <Tooltip
        title={unrolled ? "Roll me up!" : "Unroll me!"}
        placement="right"
      >
        <Box
          id={`chart-type`}
          sx={chartTypeStyles}
          onClick={() => {
            setUnrolled(!unrolled);
          }}
        >
          {unrolled ? (
            <DonutSmallIcon sx={{ color: "#000000" }} />
          ) : (
            <BarChartIcon sx={{ color: "#000000" }} />
          )}
        </Box>
      </Tooltip>
      {width > 992 && (
        <Typography sx={hoverTextStyling}>{hoverText}</Typography>
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
          unrolled ? (
            <UnrolledDonutChart
              data={donutData}
              year={year}
              width={width}
              height={height}
              allConnections={connectionsData}
              showConnections={showConnections}
              setShowConnections={setShowConnections}
              setHoverText={setHoverText}
            />
          ) : (
            <DonutChart
              data={donutData}
              year={year}
              height={height}
              size={700}
              allConnections={connectionsData}
              showConnections={showConnections}
              setShowConnections={setShowConnections}
              setHoverText={setHoverText}
            />
          )
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
        <Box
          sx={{
            maxWidth: isMobile ? "100%" : "45%",
            marginLeft: isMobile ? "10%" : "10%",
            marginInline: "10%",
          }}
        >
          <h1 className="subtitle" style={{ textAlign: "left" }}>
            Explore a shared vision for a greener, fairer, prosperous Glasgow -
            the Thriving Glasgow Doughnut.
          </h1>
        </Box>
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
            src={organisationsImage}
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
          textAlign: "left",
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
          <YoutubeEmbed width={width} />
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
};
