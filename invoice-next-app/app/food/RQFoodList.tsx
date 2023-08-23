"use client";
import { use } from "react";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useFoodPromise } from "../_context/food/FoodContext";
import AddButtonTransistion from "./AddButtonTransistion";

export default function FoodList() {
  const { foodPromise, foodAddPromise } = useFoodPromise();
  const {
    data: foods,
    isFetching,
    refetch,
  } = useQuery(["foods"], () => foodPromise, {
    initialData: use(foodPromise),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const queryClient = new QueryClient();

  const { mutate } = useMutation({
    mutationFn: foodAddPromise,
    onSuccess: (data) => {
      console.log("data", data);
      refetch();
      queryClient.invalidateQueries({ queryKey: ["foods"] });
    },
  });

  if (isFetching) return <div>RQ Loading...</div>;

  return (
    <div>
      RQ Foods: {foods?.join(", ")}
      <AddButtonTransistion addTodo={async (data: string) => mutate(data)} />
    </div>
  );
}
