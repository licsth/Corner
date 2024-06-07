import type { NextPage } from "next";
import Head from "next/head";
import { Parkour } from "../components/Parkour/Parkour";

const ParkourPage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>"Na klar bin ich gerade produktiv"</title>
      </Head>
      <Parkour />
    </div>
  );
};

export default ParkourPage;
