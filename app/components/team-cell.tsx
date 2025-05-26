interface TeamCellProps {
  logo?: string;
  teamName: string;
  abbrev: string;
}

export function TeamCell({ logo, teamName, abbrev }: TeamCellProps) {
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
        <img src={logo} alt={`${teamName} logo`} className="h-10" />
        {abbrev}
      </div>
    </td>
  );
} 