import { useState, useRef } from "react";
import { createPostApi } from "../services/post.service";

export default function CreatePostForm({ onPostCreated }) {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  };

  const clearImage = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image.");

    const formData = new FormData();
    formData.append("postImage", file);
    if (description) formData.append("description", description);

    try {
      setIsSubmitting(true);
      await createPostApi(formData);
      
      // Reset form
      setDescription("");
      clearImage();
      alert("Post created successfully!");
      if (onPostCreated) onPostCreated();
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Failed to create post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <textarea
        className="w-full p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
        placeholder="What's on your mind?"
        rows="3"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      
      {/* Image Preview Section */}
      {previewUrl && (
        <div className="relative mb-4">
          <img 
  src={previewUrl} 
  alt="Preview" 
  className="w-full max-h-96 object-contain bg-gray-50 rounded-md border border-gray-200"
/>
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 bg-gray-900 bg-opacity-60 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-opacity-90 transition"
            title="Remove image"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="text-sm text-gray-600"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting || !file}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}