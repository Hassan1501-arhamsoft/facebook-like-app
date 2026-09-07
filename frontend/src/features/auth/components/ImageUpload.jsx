import { useRef } from "react";

function ImageUpload({
  image,
  preview,
  onChange,
  label = "Upload Profile Picture",
}) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col gap-2.5 border-2 border-dashed border-gray-300 justify-center items-center p-2.5">
      <label className="text-[14px] font-semibold text-gray-700">
        {label}
      </label>

      <div 
        className="w-[120px] h-[120px] border-2 border-dashed border-gray-300 rounded-full cursor-pointer overflow-hidden flex justify-center items-center bg-gray-50 transition-colors duration-200 hover:border-blue-600"
        onClick={handleClick}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-500 text-[34px] text-center">
            📤
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onChange}
      />

      {image && (
        <p className="text-[13px] text-gray-600">
          {image.name}
        </p>
      )}
    </div>
  );
}

export default ImageUpload;