import { NextResponse } from "next/server";

export async function GET() {
  const today = new Date().toLocaleDateString('en-CA');
  const response = await fetch(`https://api-web.nhle.com/v1/schedule/${today}`);
  const data = await response.json();
  return NextResponse.json(data);
}
