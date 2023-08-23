"use client";
import { createContext, useContext } from "react";

const FoodContext = createContext<{foodPromise: Promise<string[]>; foodAddPromise: (food: string) => Promise<void>} | null>(null);

export const useFoodPromise = () => {
  const food = useContext(FoodContext);
  if (!food) throw new Error("useFood must be used within a FoodProvider");
  return food;
};

const FoodProvider = ({
  children,
  foodPromise,
  foodAddPromise
}: {
  children: React.ReactNode;
  foodPromise: Promise<string[]>;
  foodAddPromise: (food: string) => Promise<void>
}) => {
  return (
    <FoodContext.Provider value={{foodPromise, foodAddPromise}}>{children}</FoodContext.Provider>
  );
};

export default FoodProvider;
