import { render } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';

import { GameSkeleton } from '@/app/components/game-skeleton/game-skeleton';

describe('GameSkeleton', () => {
  it('renders loading skeleton with correct structure', () => {
    const { container } = render(<GameSkeleton />);
    expect(container.firstChild).toHaveClass('gameCard', 'animate-pulse');
    expect(container.querySelectorAll('.team')).toHaveLength(2);
    expect(container.querySelector('.gameStatus')).toBeInTheDocument();
  });
});
