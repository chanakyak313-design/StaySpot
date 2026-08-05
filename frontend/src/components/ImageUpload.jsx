import { useState } from "react";
import toast from "react-hot-toast";
import { UploadCloud } from "lucide-react";
import api from "../services/api";

function ImageUpload({ hostelId }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFiles([...e.target.files]);
  };

  const uploadImages = async () => {
    if (!hostelId) {
      toast.error("Create the hostel first.");
      return;
    }
    if (files.length === 0) {
      toast.error("Choose at least one photo.");
      return;
    }

    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        await api.post(`/hostel-images/${hostelId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success("Photos uploaded!");
      setFiles([]);
    } catch (err) {
      console.error(err);
      toast.error("Photo upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="poster-border rounded-2xl p-6 bg-skytape mt-6">
      <h3 className="font-display text-base text-ink mb-1">ADD PHOTOS</h3>
      <p className="text-sm text-pencil mb-4">Real photos help students trust your listing.</p>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
        className="w-full text-sm text-ink file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-2 file:border-ink file:bg-paper file:font-semibold file:cursor-pointer"
      />

      <button
        onClick={uploadImages}
        disabled={uploading}
        className="btn-poster mt-4 bg-marigold text-ink px-5 py-2.5 hard-shadow-sm text-sm flex items-center gap-2 disabled:opacity-60"
      >
        <UploadCloud size={16} />
        {uploading ? "Uploading..." : "Upload Photos"}
      </button>
    </div>
  );
}

export default ImageUpload;
