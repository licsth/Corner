import type { NextPage } from "next";
import Head from "next/head";
import { Gameboard } from "../components/Gameboard";

import "@fortawesome/fontawesome-free/css/all.min.css";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Hit the corner!</title>
      </Head>
      <Gameboard />
    </div>
  );
};

export default Home;
