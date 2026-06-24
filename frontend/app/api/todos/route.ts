import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

export async function GET() {
  const response = await fetch(`${BACKEND_URL}/todos`, {
    cache: "no-store",
  });

  const data = await response.json();

  return NextResponse.json(data, {
    status: response.status,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await fetch(`${BACKEND_URL}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  return NextResponse.json(data, {
    status: response.status,
  });
}

export async function PUT(request: NextRequest) {
  const todoId = request.nextUrl.searchParams.get("id");

  if (!todoId) {
    return NextResponse.json(
      { message: "Todo id가 필요합니다." },
      { status: 400 }
    );
  }

  const body = await request.json();

  const response = await fetch(`${BACKEND_URL}/todos/${todoId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  return NextResponse.json(data, {
    status: response.status,
  });
}

export async function DELETE(request: NextRequest) {
  const todoId = request.nextUrl.searchParams.get("id");

  if (!todoId) {
    return NextResponse.json(
      { message: "Todo id가 필요합니다." },
      { status: 400 }
    );
  }

  const response = await fetch(`${BACKEND_URL}/todos/${todoId}`, {
    method: "DELETE",
  });

  return new NextResponse(null, {
    status: response.status,
  });
}