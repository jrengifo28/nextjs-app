import { NextRequest, NextResponse } from "next/server";
import schema from "./schema";
import { prisma } from "@/prisma/client";

// Function GET
export async function GET(request: NextRequest) {
  const products = await prisma.product.findMany();
  return NextResponse.json(products);
}

// Function POST
export async function POST(request: NextRequest) {
  const body = await request.json();
  const validatio = schema.safeParse(body);
  if (!validatio.success)
    return NextResponse.json(validatio.error.errors, { status: 400 });

  const newProduct = await prisma.product.create({
    data: {
      name: body.name,
      price: body.price,
    },
  });
  return NextResponse.json(newProduct, { status: 201 });
}

//Function Update
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const validation = schema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  const product = await prisma.product.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!product)
    return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const updatedProduct = await prisma.product.update({
    where: { id: product.id },
    data: {
      name: body.name,
      price: body.price,
    },
  });

  return NextResponse.json(updatedProduct);
}

// Function DELETE
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!product)
    return NextResponse.json({ error: "Product not found" }, { status: 404 });

  await prisma.product.delete({
    where: { id: product.id },
  });
  return NextResponse.json({});
}
