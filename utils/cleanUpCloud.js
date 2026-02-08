import supabaseClient from "../configure/supabase.js";

/**
 * Cleans a single Supabase file URL and returns the internal path
 * Example:
 * https://.../object/public/NearGo/file.png -> file.png
 */
function extractFilePath(url) {
  if (!url) return null;

  try {
    const marker = "/object/public/NearGo/";
    const index = url.indexOf(marker);

    if (index === -1) return null;

    // Extract inside-bucket path (e.g., "file.png")
    let fileName = url.substring(index + marker.length);

    // Decode spaces and special characters
    fileName = decodeURIComponent(fileName);

    return fileName;
  } catch {
    return null;
  }
}

/**
 * Deletes one or multiple files from Supabase storage
 * - Accepts a single URL string OR an array of URLs
 */
async function cleanUpCloud(urls) {
  if (!urls) return;

  // Normalize to array
  const list = Array.isArray(urls) ? urls : [urls];

  // Extract valid file names
  const fileNames = list
    .map(extractFilePath)
    .filter((path) => path !== null && path.length > 0);


  const { error } = await supabaseClient.storage
    .from("NearGo")
    .remove(fileNames);

  if (error) {
    return false;
  }
  return true;
}

export default cleanUpCloud;
