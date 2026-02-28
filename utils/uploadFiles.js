import supabase from "../configure/supabase.js";

async function uploadToCloud(files) {
  let media = [];

  if (!files || files.length === 0) return media;

  // Upload all files to Supabase
  const supabaseFiles = await Promise.all(
    files.map(async (file) => {
      // Generate a unique filename
      const fileName = `${Date.now()}-${file.originalname}`;

      // Upload to the "media" bucket
      const { data, error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        }); 

      if (error) {
        console.log(error)
        return null; // Skip failed uploads
      }

      // Create public URL for the uploaded file
        const { data: publicData } = supabase.storage
          .from(process.env.SUPABASE_BUCKET)
          .getPublicUrl(fileName);

      return {
        url: publicData.publicUrl,
        type: file.mimetype.startsWith("image") ? "image" : "video",
      };
    })
  );

  // Filter out any failed uploads
  media = supabaseFiles.filter((f) => f !== null);

  return media;
}

export default uploadToCloud;
