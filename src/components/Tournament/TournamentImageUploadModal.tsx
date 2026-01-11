import { useState } from "react";
import { X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "../ui/Button";
import { uploadTournamentImage } from "../../services/imageUpload.service";
import { ImageUpload } from "../ImageUpload";

interface TournamentImageUploadModalProps {
  tournamentId: number;
  currentImageUrl?: string;
  onClose: () => void;
  onSuccess: (imageUrl: string) => void;
}

export const TournamentImageUploadModal = ({
  tournamentId,
  currentImageUrl,
  onClose,
  onSuccess,
}: TournamentImageUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = (file: File) => {
    setSelectedFile(file);
    setError(null);
  };

  const handleImageRemoved = () => {
    setSelectedFile(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    try {
      const imageUrl = await uploadTournamentImage(tournamentId, selectedFile);
      onSuccess(imageUrl);
      onClose();
    } catch (err: any) {
      console.error("Error uploading image:", err);
      setError(err?.response?.data?.message || "Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#2a1f3d] via-[#1f1635] to-[#2a1f3d] border border-purple-500/30 rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={uploading}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-white text-xl font-semibold">
              Imagen del Torneo
            </h2>
            <p className="text-purple-300 text-sm">
              Sube una imagen representativa
            </p>
          </div>
        </div>

        {/* Image Upload Component */}
        <ImageUpload
          currentImageUrl={currentImageUrl}
          onImageSelected={handleImageSelected}
          onImageRemoved={handleImageRemoved}
          uploading={uploading}
          disabled={uploading}
          label="Imagen del Torneo"
        />

        {/* Error message */}
        {error && (
          <div className="mt-4 bg-red-900/20 border border-red-700/50 text-red-300 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button
            onClick={onClose}
            disabled={uploading}
            variant="outline"
            className="flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Subiendo...
              </>
            ) : (
              "Guardar Imagen"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
