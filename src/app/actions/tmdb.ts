"use server";

import { searchMovies, searchPeople } from "@/lib/tmdb";

export async function searchTmdbMovies(query: string) {
  if (!query || query.length < 2) return { results: [] };
  try {
    const data = await searchMovies(query);
    return { results: data.results || [] };
  } catch (error) {
    console.error("TMDB Movie Search Error:", error);
    return { results: [] };
  }
}

export async function searchTmdbPeople(query: string) {
  if (!query || query.length < 2) return { results: [] };
  try {
    const data = await searchPeople(query);
    return { results: data.results || [] };
  } catch (error) {
    console.error("TMDB Person Search Error:", error);
    return { results: [] };
  }
}
