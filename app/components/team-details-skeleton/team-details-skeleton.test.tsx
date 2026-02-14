import { render } from '@testing-library/react';

import { TeamDetailsSkeleton } from './team-details-skeleton';
import { describe, it, expect } from '@jest/globals';

describe('TeamDetailsSkeleton', () => {
  it('renders all main skeleton sections', () => {
    const { container } = render(<TeamDetailsSkeleton />);
    
    // Check for back button skeleton
    const backButton = container.querySelector('.mb-6.h-10.w-24');
    expect(backButton).toBeInTheDocument();
    
    // Check for header skeleton (logo + team info)
    const logo = container.querySelector('.size-32.rounded-full');
    expect(logo).toBeInTheDocument();
    
    // Check for schedule section
    const scheduleSections = container.querySelectorAll('section');
    expect(scheduleSections.length).toBeGreaterThanOrEqual(2);
    
    // Check for roster section - should have multiple subsections
    const rosterSubsections = container.querySelectorAll('.space-y-12 > div > div');
    expect(rosterSubsections.length).toBeGreaterThan(0);
  });
});
