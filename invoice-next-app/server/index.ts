import { publicProcedure, router } from "./trpc";
import { z } from "zod";

export type Todos = {
  id: number;
  done: number | null;
  content: string | null;
}[];
export const appRouter = router({
  getTodos: publicProcedure.query(async () => {
    return [{ id: 1, done: 1, content: 2 }];
  }),
  addTodo: publicProcedure.input(z.string()).mutation(async (opts) => {
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
