import Image from 'next/image';
import type { JSX } from 'react';

interface TeamCellProps {
  logo?: string;
  teamName: string;
  abbrev: string;
}

export function TeamCell({ logo, teamName, abbrev }: TeamCellProps): JSX.Element {
  if (!logo) {
    return (
      <td className="border border-gray-300 p-2">
        <div className="flex items-center space-x-4">{abbrev}</div>
      </td>
    );
  }

  return (
    <td className="border border-gray-300 p-2">
      <div className="flex items-center space-x-4">
        <Image
          alt={`${teamName} logo`}
          className="h-10"
          height={40}
          quality={100}
          src={logo}
          width={40}
        />
        {abbrev}
      </div>
    </td>
  );
}
