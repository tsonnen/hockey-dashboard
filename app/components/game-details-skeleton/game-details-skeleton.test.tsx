import { render } from '@testing-library/react';

import { GameDetailsSkeleton } from './game-details-skeleton';

describe('GameDetailsSkeleton', () => {
  it('renders all main skeleton sections', () => {
    const { container } = render(<GameDetailsSkeleton />);
    expect(container.querySelector('.backButton')).toBeInTheDocument();
    expect(container.querySelector('.scoreDisplay')).toBeInTheDocument();
    expect(container.querySelector('.periodSummary')).toBeInTheDocument();
    expect(container.querySelectorAll('.sectionTitle')).toHaveLength(2);
    expect(container.querySelector('.summaryList')).toBeInTheDocument();
    expect(container.querySelectorAll('.periodGoals')).toHaveLength(3);
    expect(container.querySelector('.matchupGrid')).toBeInTheDocument();
  });
});
