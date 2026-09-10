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
        <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 transition-all hover:shadow-md">
            
            {/* Header */}
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Create New Post
            </h2>

            {/* Input Area */}
            <textarea
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white text-gray-800 placeholder-gray-400 transition-all text-[15px]"
                placeholder="What do you want to share with your network?"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            {/* Image Preview Section */}
            {previewUrl && (
                <div className="relative mt-4 rounded-xl overflow-hidden border border-gray-200 group bg-gray-50 flex justify-center">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full max-h-[400px] object-contain"
                    />
                    <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-3 right-3 bg-gray-900/60 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-900 shadow-lg"
                        title="Remove image"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Actions Footer */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                
                {/* Hidden File Input & Custom Trigger Button */}
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    required
                />
                
                <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className={`flex items-center gap-2 font-semibold px-4 py-2 rounded-xl transition-colors ${
                        file 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100'
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {file ? 'Change Photo' : 'Add Photo'}
                </button>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting || !file}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Posting...
                        </>
                    ) : (
                        <>
                            Publish Post
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}