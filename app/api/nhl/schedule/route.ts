import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch("https://api-web.nhle.com/v1/schedule/now");
  const data = await response.json();
  return NextResponse.json(data);
}
