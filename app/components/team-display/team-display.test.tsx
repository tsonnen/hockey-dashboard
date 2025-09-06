import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';

import { TeamDisplay } from '@/app/components/team-display/team-display';

describe('TeamDisplay', () => {
  const mockTeam = {
    placeName: { default: 'Test Team' },
    logo: '/test-logo.png',
    score: 3,
    sog: 25,
    id: 123,
    commonName: { default: 'Testers' },
    abbrev: 'TST',
    awaySplitSquad: false,
    radioLink: 'WhoUsesRadioIn2025',
    odds: [],
  };

  it('renders team info with stats when game started', () => {
    render(<TeamDisplay gameStarted={true} team={mockTeam} />);
    expect(screen.getByAltText('Test Team logo')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('SOG: 25')).toBeInTheDocument();
  });

  it('renders team info without stats when game not started', () => {
    render(<TeamDisplay gameStarted={false} team={mockTeam} />);
    expect(screen.getByAltText('Test Team logo')).toBeInTheDocument();
    expect(screen.queryByText('3')).not.toBeInTheDocument();
    expect(screen.queryByText('SOG: 25')).not.toBeInTheDocument();
  });
});
