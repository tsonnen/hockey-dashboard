import { createContext, useContext, useState, type ReactNode, type JSX } from 'react';

import type { Game } from '@/app/models/game';

interface GameContextType {
  game: Game | undefined;
  setGame: (game: Game | undefined) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
  initialGame?: Game;
}

export function GameProvider({ children, initialGame }: GameProviderProps): JSX.Element {
  const [game, setGame] = useState<Game | undefined>(initialGame);

  return (
    <GameContext.Provider value={{ game, setGame }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
} 