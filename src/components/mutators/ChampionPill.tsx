
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface ChampionPillProps {
  championName: string;
  type: "good" | "bad";
}

export const ChampionPill = ({ championName, type }: ChampionPillProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/champion/${championName}`, { 
      state: { fromMutators: true } 
    });
  };

  return (
    <Badge
      className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
        type === "good" 
          ? "bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30" 
          : "bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30"
      }`}
      onClick={handleClick}
    >
      {championName.trim()}
    </Badge>
  );
};
