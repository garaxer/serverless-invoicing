import TodoList from "./_components/TodoList";
import Layout from "./_components/layout/Layout";
import { serverClient } from "./_trpc/serverClient";

const Hero = () => {
  return <div>Hello</div>;
};

export default async function Home() {
  const todos = await serverClient.getTodos();

  return (
    <Layout>
      <Hero />
      <TodoList initialTodos={todos} />
    </Layout>
  );
}
