import Test from "components/ExpandButton";
import type { NextPage } from "next";
import Layout from "../components/layout/Layout";




const Home: NextPage = () => {


  return (
    <Layout title={"Login"} useAuth={false}>
      <div>
        Nice
      </div>
      <Test />
    </Layout>
  );
};

export default Home;
