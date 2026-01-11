import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { validateImageFile } from "../../services/imageUpload.service";

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageSelected: (file: File) => void;
  onImageRemoved?: () => void;
  uploading?: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export const ImageUpload = ({
  currentImageUrl,
  onImageSelected,
  onImageRemoved,
  uploading = false,
  disabled = false,
  label = "Imagen",
  className = "",
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | undefined>(currentImageUrl);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validar archivo
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || "Archivo inválido");
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Notificar al padre
    onImageSelected(file);
  };

  const handleRemove = () => {
    setPreview(undefined);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageRemoved?.();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-purple-300">
        {label}
      </label>

      <div className="relative">
        {/* Preview o placeholder */}
        <div
          onClick={!disabled && !uploading ? handleClick : undefined}
          className={`
            relative w-full aspect-video rounded-lg border-2 border-dashed
            overflow-hidden bg-gray-900/50
            ${!preview ? "flex items-center justify-center" : ""}
            ${!disabled && !uploading ? "cursor-pointer hover:border-purple-400" : "cursor-not-allowed"}
            ${error ? "border-red-500" : "border-purple-500/30"}
            transition-colors
          `}
        >
          {uploading ? (
            // Loading state
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
          ) : preview ? (
            // Imagen preview
            <>
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {!disabled && (
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick();
                    }}
                    className="p-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Upload className="w-5 h-5 text-white" />
                  </button>
                  {onImageRemoved && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove();
                      }}
                      className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            // Placeholder
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <ImageIcon className="w-12 h-12 text-purple-400/50 mb-2" />
              <p className="text-sm text-purple-300">
                Haz clic para seleccionar una imagen
              </p>
              <p className="text-xs text-purple-400/70 mt-1">
                Máximo 5MB - JPG, PNG, GIF
              </p>
            </div>
          )}
        </div>

        {/* Input file oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled || uploading}
          className="hidden"
        />
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <X className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};
