import type { DataItem } from '../types'
import { CountryCard } from './CountryCard'

interface OverallViewProps {
  data: DataItem[]
  onItemToggle?: (itemName: string, learned: boolean) => void
  selectedContinent: string
  dataMode: 'countries' | 'cities'
}

const OverallView = ({ data, selectedContinent, dataMode }: OverallViewProps) => {
  
  // Sort data alphabetically
  const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name))

  // Function to get dynamic title based on selected continent
  const getTitle = () => {
    const itemType = dataMode === 'countries' ? 'Länder' : 'Millionenstädte'
    if (selectedContinent === 'Alle') {
      return `Alle ${itemType} (${sortedData.length})`
    }
    return `Alle ${itemType} in ${selectedContinent} (${sortedData.length})`
  }

  if (sortedData.length === 0) {
    return (
      <div className="overall-view empty">
        <p>Keine {dataMode === 'countries' ? 'Länder' : 'Millionenstädte'} gefunden.</p>
      </div>
    )
  }

  return (
    <div className="overall-view">
      <h2 className="white-box-title">{getTitle()}</h2>
      <div className="countries-grid">
        {sortedData.map(item => (
          <CountryCard
            key={item.name}
            item={item}
            showLetter={false}
            showLearnButton={false}
          />
        ))}
      </div>
    </div>
  )
}

export default OverallView 