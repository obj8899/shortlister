import pdfParse from "pdf-parse/lib/pdf-parse.js";

export async function extractResumeText(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") || "";
    const isPdf = contentType.includes("pdf") || url.toLowerCase().endsWith(".pdf");
    if (!isPdf) return null;

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdfParse(buffer);

    return data.text.slice(0, 5000);
  } catch (err) {
    console.error("Resume extraction failed:", err);
    return null;
  }
}