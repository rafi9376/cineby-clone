import { getTVDetails } from '../../../../lib/tmdb';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;
  const data = await getTVDetails(id);
  return NextResponse.json(data);
}