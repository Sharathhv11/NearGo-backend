import supabaseClient from "../configure/supabase.js";

async function cleanUpCloud(urls) {
  if (!urls || urls.length === 0) return;

  
  const filePaths = urls
    .map((url) => {
      try {
        const parts = url.split("/NearGo/");
        if (parts.length < 2) return null; // Invalid URL format
        return `NearGo/${parts[1]}`; // Full path inside bucket
      } catch (err) {
        return null;
      }
    })
    .filter((path) => path !== null);

  if (filePaths.length === 0) return;

  // Remove 'NearGo/' prefix since supabase.from("NearGo") expects only file name
  const fileNames = filePaths.map((p) => p.replace("NearGo/", ""));

  // Delete files from Supabase storage
  const { data, error } = await supabaseClient.storage
    .from("NearGo")
    .remove(fileNames);
}

export default cleanUpCloud;
