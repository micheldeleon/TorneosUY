import { Edit } from "lucide-react";
import { Card } from "../ui/Card";

interface ProfileCardProps {
  name: string;
  email?: string;
  imageUrl?: string;
  onEdit: () => void;
}

export function ProfileCard({ name, email, imageUrl, onEdit }: ProfileCardProps) {
  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="bg-[#2a2a2a] border-gray-800 p-6">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Avatar */}
        <div className="relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-24 h-24 rounded-full object-cover border-2 border-purple-600"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center border-2 border-purple-600">
              <span className="text-white text-2xl">{getInitials(name)}</span>
            </div>
          )}
          <button
            onClick={onEdit}
            className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center border-2 border-[#2a2a2a] transition-colors"
          >
            <Edit className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* User Info */}
        <div>
          <h3 className="text-white text-xl mb-1">{name}</h3>
          {email && <p className="text-gray-400 text-sm">{email}</p>}
        </div>
      </div>
    </Card>
  );
}
