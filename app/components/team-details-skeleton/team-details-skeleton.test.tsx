import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';

import { TeamDetailsSkeleton } from './team-details-skeleton';

describe('TeamDetailsSkeleton', () => {
  it('renders all main skeleton sections', () => {
    render(<TeamDetailsSkeleton />);

    // Check for main container
    expect(screen.getByTestId('team-details-skeleton')).toBeInTheDocument();

    // Check for back button skeleton
    expect(screen.getByTestId('back-button-skeleton')).toBeInTheDocument();

    // Check for header skeleton (logo + team info)
    expect(screen.getByTestId('header-skeleton')).toBeInTheDocument();
    expect(screen.getByTestId('logo-skeleton')).toBeInTheDocument();

    // Check for schedule section
    expect(screen.getByTestId('schedule-skeleton')).toBeInTheDocument();

    // Check for roster section
    expect(screen.getByTestId('roster-skeleton')).toBeInTheDocument();
  });
});
