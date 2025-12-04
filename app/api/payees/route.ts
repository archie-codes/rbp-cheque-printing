import { db } from "@/lib/db";

export async function GET() {
  try {
    const rows = await db`SELECT * FROM payees ORDER BY name ASC`;
    return Response.json(rows);
  } catch (err) {
    console.error(err);
    return new Response("Error fetching payees", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name || name.trim() === "") {
      return new Response("Invalid payee name", { status: 400 });
    }

    await db`INSERT INTO payees (name) VALUES (${name})`;

    return new Response("Payee added", { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response("Error creating payee", { status: 500 });
  }
}
