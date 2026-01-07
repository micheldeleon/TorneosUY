import { useState } from "react";
import { Star, Send} from "lucide-react";
import { Button } from "../ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/Dialog";
import { Label } from "../ui/Label";

interface RateOrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (score: number, comment?: string) => Promise<void>;
  organizerName: string;
  tournamentName: string;
}

export function RateOrganizerModal({
  isOpen,
  onClose,
  onSubmit,
  organizerName,
  tournamentName,
}: RateOrganizerModalProps) {
  const [score, setScore] = useState<number>(0);
  const [hoveredScore, setHoveredScore] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (score === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(score, comment.trim() || undefined);
      setScore(0);
      setComment("");
      onClose();
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setScore(0);
      setComment("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1a1a1a] border-gray-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            Calificar a {organizerName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Tournament Info */}
          <div className="bg-[#2a2a2a] border border-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Torneo:</p>
            <p className="text-white font-medium">{tournamentName}</p>
          </div>

          {/* Star Rating */}
          <div>
            <Label className="text-white mb-3 block">
              ¿Cómo calificarías al organizador? <span className="text-rose-400">*</span>
            </Label>
            <div className="flex items-center justify-center gap-2 py-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setScore(star)}
                  onMouseEnter={() => setHoveredScore(star)}
                  onMouseLeave={() => setHoveredScore(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                  disabled={isSubmitting}
                >
                  <Star
                    className={`w-12 h-12 transition-colors ${
                      star <= (hoveredScore || score)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-600 hover:text-gray-500"
                    }`}
                  />
                </button>
              ))}
            </div>
            {score > 0 && (
              <p className="text-center text-gray-400 text-sm">
                {score === 1 && "Muy malo"}
                {score === 2 && "Malo"}
                {score === 3 && "Regular"}
                {score === 4 && "Bueno"}
                {score === 5 && "Excelente"}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment" className="text-white mb-2 block">
              Comentario (opcional)
            </Label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 500))}
              placeholder="Comparte tu experiencia..."
              className="w-full bg-[#2a2a2a] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
              rows={4}
              disabled={isSubmitting}
            />
            <p className="text-gray-500 text-xs mt-1 text-right">
              {comment.length} / 500 caracteres
            </p>
          </div>

          {/* Info Alert */}
          <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3">
            <p className="text-blue-300 text-sm">
              💡 Tu calificación es permanente y ayudará a otros usuarios a tomar decisiones informadas.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-800">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={score === 0 || isSubmitting}
            className="bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-700 hover:to-yellow-900 text-white"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar Calificación
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
