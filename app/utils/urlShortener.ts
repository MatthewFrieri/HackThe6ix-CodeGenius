// utils/urlShortener.ts

import { BitlyClient } from "bitly";

const bitly = new BitlyClient("YOUR_BITLY_ACCESS_TOKEN");

export async function shortenUrl(longUrl: string): Promise<string | null> {
  try {
    const result = await bitly.shorten(longUrl);
    return result.link;
  } catch (error) {
    console.error("Error generating shortened URL:", error);
    return null;
  }
}
