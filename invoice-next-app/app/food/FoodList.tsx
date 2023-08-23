"use client";
import { useFoodPromise } from "../_context/food/FoodContext";
import { use } from "react";

export default function FoodList() {
  const { foodPromise } = useFoodPromise();
  console.log(foodPromise);
  const foods = use(foodPromise);
  return <div>Foods: {foods.join(", ")}</div>;
}
