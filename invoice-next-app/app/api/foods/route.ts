import { NextResponse } from "next/server";

const FOODS = ["Pizza", "Burger", "Sandwich", "Pasta"];

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return NextResponse.json(FOODS);
}
export async function POST(req: Request) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const food = await req.json();
  console.log({postData: food})
  FOODS.push(food);
  return NextResponse.json(FOODS);
}
