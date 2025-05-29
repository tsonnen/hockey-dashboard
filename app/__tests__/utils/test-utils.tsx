import { type ReactElement, type ReactNode } from 'react';

import { GameProvider } from '@/app/contexts/game-context';
import type { Game } from '@/app/models/game';

interface GameProviderWrapperProps {
  children: ReactNode;
  initialGame?: Game;
}

export function GameProviderWrapper({ children, initialGame }: GameProviderWrapperProps): ReactElement {
  return <GameProvider initialGame={initialGame}>{children}</GameProvider>;
} 