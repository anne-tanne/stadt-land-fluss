import React from 'react'
import { useDataContext } from '../contexts/CountryContext'

interface ContinentDropdownProps {
  selectedContinent: string
  onContinentChange: (continent: string) => void
  className?: string
  label?: string
}

export const ContinentDropdown: React.FC<ContinentDropdownProps> = ({
  selectedContinent,
  onContinentChange,
  className = '',
  label = 'Wähle einen Kontinent:'
}) => {
  const { getAvailableContinents } = useDataContext()

  return (
    <div className={`continent-dropdown-container ${className}`}>
      {label && <h3>{label}</h3>}
      <select
        value={selectedContinent}
        onChange={(e) => onContinentChange(e.target.value)}
        className="continent-dropdown"
      >
        {getAvailableContinents.map((continent: string) => (
          <option key={continent} value={continent}>
            {continent === 'Alle' ? '🌍 Alle Kontinente' :
             continent === 'Amerikas' ? '🌎 Amerikas (Nord & Süd)' :
             continent === 'Afrika' ? '🌍 Afrika' :
             continent === 'Asien' ? '🌏 Asien' :
             continent === 'Europa' ? '🌍 Europa' :
             continent === 'Nordamerika' ? '🌎 Nordamerika' :
             continent === 'Südamerika' ? '🌎 Südamerika' :
             continent === 'Ozeanien' ? '🌏 Ozeanien' :
             continent === 'Australien' ? '🌏 Australien' :
             continent}
          </option>
        ))}
      </select>
    </div>
  )
} 