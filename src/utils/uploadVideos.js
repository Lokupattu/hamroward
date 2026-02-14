export async function uploadVideo(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "hamroward_unsigned");

  const cloudName = "dhikqtka1"; // replace with your Cloudinary cloud name

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) throw new Error("Failed upload");

  const data = await res.json();
  return data.secure_url; // <- store this in Firestore
}
