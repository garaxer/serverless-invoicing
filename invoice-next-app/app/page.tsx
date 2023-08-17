import Header from "./components/header/Header";
import Layout from "./components/layout/Layout";

const Hero = () => {
  return <div>Hello</div>;
};

export default function Home() {
  return (
    <Layout>
      <Header>Hello</Header>
      <Hero />
    </Layout>
  );
}
