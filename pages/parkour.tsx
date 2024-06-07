import type { NextPage } from "next";
import Head from "next/head";
import { Parkour } from "../components/Parkour/Parkour";
import { ParkourContextWrapper } from "../components/Parkour/ParkourContext";

const ParkourPage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>"Na klar bin ich gerade produktiv"</title>
      </Head>
      <ParkourContextWrapper>
        <Parkour />
      </ParkourContextWrapper>
    </div>
  );
};

export default ParkourPage;
