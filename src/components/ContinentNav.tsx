import type { Country } from '../types'
import { useTranslation } from '../translations'

interface ContinentNavProps {
  selectedContinent: string
  onContinentSelect: (continent: string) => void
  countries: Country[]
}

const ContinentNav = ({ selectedContinent, onContinentSelect, countries }: ContinentNavProps) => {
  const { t } = useTranslation()
  
  // Get unique continents from countries data
  const continents = [t('all'), ...Array.from(new Set(countries.map(country => country.continent)))]
  
  // Get continent emojis
  const continentEmojis: { [key: string]: string } = {
    [t('all')]: '🌍',
    'Afrika': '🌍',
    'Asien': '🌏',
    'Europa': '🌍',
    'Nordamerika': '🌎',
    'Südamerika': '🌎',
    'Ozeanien': '🌏'
  }

  return (
    <nav className="continent-nav">
      <div className="continent-buttons">
        {continents.map(continent => (
          <button
            key={continent}
            className={`continent-btn ${selectedContinent === continent ? 'active' : ''}`}
            onClick={() => onContinentSelect(continent)}
          >
            <span className="continent-emoji">{continentEmojis[continent]}</span>
            <span className="continent-name">{continent}</span>
            {continent !== t('all') && (
              <span className="continent-count">
                {countries.filter(country => country.continent === continent).length}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default ContinentNav 