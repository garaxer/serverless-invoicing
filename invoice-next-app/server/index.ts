import { publicProcedure, router } from "./trpc";
import { z } from "zod";

const todos = [{ id: 1, done: 1, content: "2" }];
export type Todos = {
  id: number;
  done: number | null;
  content: string | null;
}[];
export const appRouter = router({
  getTodos: publicProcedure.query(async () => {
    console.log(todos);
    return todos;
  }),
  addTodo: publicProcedure.input(z.string()).mutation(async (opts) => {
    todos.push({
      id: todos.reduce((a, c) => (a > c.id ? a : c.id), 1) + 1,
      done: 0,
      content: opts.input,
    });
    console.log(todos);
    return true;
  }),
  setDone: publicProcedure
    .input(
      z.object({
        id: z.number(),
        done: z.number(),
      })
    )
    .mutation(async (opts) => {
      return true;
    }),
});

export type AppRouter = typeof appRouter;
