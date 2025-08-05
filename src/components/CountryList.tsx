import type { DataItem } from '../types'
import { CountryCard } from './CountryCard'

interface CountryListProps {
  data: DataItem[]
  onItemToggle?: (itemName: string, learned: boolean) => void
  selectedContinent?: string
  dataMode: 'countries' | 'cities'
}

const CountryList = ({ data, selectedContinent, dataMode }: CountryListProps) => {
  
  const getTitle = () => {
    if (data.length === 0) return ''
    
    const letter = data[0]?.letter
    const itemType = dataMode === 'countries' ? 'Länder' : 'Millionenstädte'
    if (selectedContinent && selectedContinent !== 'Alle') {
      return `${itemType} in ${selectedContinent}, die mit "${letter}" beginnen (${data.length})`
    }
    return `${itemType} die mit "${letter}" beginnen (${data.length})`
  }
  
  if (data.length === 0) {
    return (
      <div className="country-list empty">
        <p>Keine {dataMode === 'countries' ? 'Länder' : 'Millionenstädte'} für diesen Buchstaben gefunden.</p>
      </div>
    )
  }

  return (
    <div className="country-list">
      <h2 className="white-box-title">{getTitle()}</h2>
      <div className="countries-grid">
        {data.map(item => (
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

export default CountryList 