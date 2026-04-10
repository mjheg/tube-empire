import { Game } from "@/components/Game";
import { LangProvider } from "@/game/LangContext";

export default function Home() {
  return (
    <LangProvider>
      <Game />
    </LangProvider>
  );
}
