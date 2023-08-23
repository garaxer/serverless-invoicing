import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import RQProvider from "@/app/_context/RQProvider";
import FoodProvider from "@/app/_context/food/FoodContext";
import FoodList from "@/app/food/FoodList";
import RQFoodList from "@/app/food/RQFoodList";
import { revalidatePath } from "next/cache";
import AddButton from "./AddButton";

export default async function Home() {
  const foodReq = fetch("http://localhost:3000/api/foods", {
    cache: "no-cache",
  }).then((res) => res.json());

  async function addFood(data: FormData) {
    "use server";

    const food = data.get("food") as string;
    fetch("http://localhost:3000/api/foods", {
      method: "POST",
      cache: "no-cache",
      body: JSON.stringify(food),
    }).then((res) => res.json());
    revalidatePath("/food");
  }

  async function addFoodPost(food: string) {
    "use server";

    const newFoods = await fetch("http://localhost:3000/api/foods", {
      method: "POST",
      cache: "no-cache",
      body: JSON.stringify(food),
    }).then((res) => res.json());
    revalidatePath("/food");
    return newFoods;
  }

  return (
    <RQProvider>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <FoodProvider foodPromise={foodReq} foodAddPromise={addFoodPost}>
          <main className="max-w-6xl mx-auto mt-5 text-3xl">
            <Suspense fallback={<div>Loading...</div>}>
              <FoodList />
            </Suspense>
            <form action={addFood}>
              <input
                type="text"
                name="food"
                className="border border-gray-300 rounded-lg py-4 px-4 text-base font-normal text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              <AddButton />
            </form>
          </main>
          <br />
          <RQFoodList />
        </FoodProvider>
      </ErrorBoundary>
    </RQProvider>
  );
}
