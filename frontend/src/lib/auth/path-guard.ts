export function isSafeAdminPath(segments: string[]): boolean {
  if (!segments || segments.length === 0) {
    return false;
  }

  const segmentRegex = /^[a-zA-Z0-9_-]+$/;

  for (const seg of segments) {
    if (!seg || typeof seg !== "string") {
      return false;
    }
    // Check for traversal attempts or forbidden characters
    if (
      seg === "." ||
      seg === ".." ||
      seg.includes("%2e") ||
      seg.includes("%2f") ||
      seg.includes("%5c") ||
      seg.includes(":") ||
      seg.includes("//") ||
      seg.includes("\\") ||
      !segmentRegex.test(seg)
    ) {
      return false;
    }
  }

  return true;
}
