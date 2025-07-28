import React from 'react'
import { Play, RotateCcw } from 'lucide-react'
import { useTranslation } from '../../translations'
import { useCountryContext } from '../../contexts/CountryContext'
import styles from '../../styles/QuizStart.module.css'

interface QuizStartScreenProps {
  selectedContinent: string
  onContinentChange: (continent: string) => void
  onStartQuiz: () => void
  onResetProgress: () => void
  hasProgress: boolean
  filteredCountriesCount: number
}

export const QuizStartScreen: React.FC<QuizStartScreenProps> = ({
  selectedContinent,
  onContinentChange,
  onStartQuiz,
  onResetProgress,
  hasProgress,
  filteredCountriesCount
}) => {
  const { t } = useTranslation()
  const { getAvailableContinents } = useCountryContext()

  return (
    <div className={styles.quizStartScreen}>
      <h2>🌍 {t('quizStartTitle')}</h2>
      <p>{t('quizStartDescription')}</p>
      
      <div className={styles.continentSelection}>
        <h3>Wähle einen Kontinent:</h3>
        <select 
          value={selectedContinent} 
          onChange={(e) => onContinentChange(e.target.value)}
          className={styles.continentDropdown}
        >
          {getAvailableContinents().map(continent => (
            <option key={continent} value={continent}>
              {continent === 'Alle' ? '🌍 Alle Kontinente' :
               continent === 'Amerikas' ? '🌎 Amerikas (Nord & Süd)' :
               continent === 'Afrika' ? '🌍 Afrika' :
               continent === 'Asien' ? '🌏 Asien' :
               continent === 'Europa' ? '🌍 Europa' :
               continent === 'Nordamerika' ? '🌎 Nordamerika' :
               continent === 'Südamerika' ? '🌎 Südamerika' :
               continent === 'Ozeanien' ? '🌏 Ozeanien' :
               continent}
            </option>
          ))}
        </select>
      </div>
      
      <div className={styles.quizInfo}>
        <p>Länder für Quiz: <strong>{filteredCountriesCount}</strong></p>
        {selectedContinent !== 'Alle' && (
          <p>Kontinent: <strong>{selectedContinent}</strong></p>
        )}
        {hasProgress && (
          <div className={styles.savedProgressInfo}>
            <p>💾 <strong>Gespeicherter Fortschritt gefunden!</strong></p>
            <p>Du kannst dein Quiz fortsetzen oder neu starten.</p>
          </div>
        )}
      </div>
      
      <div className={styles.startActions}>
        <button 
          className={styles.startQuizBtn} 
          onClick={onStartQuiz}
          disabled={filteredCountriesCount === 0}
        >
          <Play size={20} />
          {hasProgress ? 'Quiz fortsetzen' : t('startQuiz')}
        </button>
        
        {hasProgress && (
          <button className={styles.resetAllBtn} onClick={onResetProgress}>
            <RotateCcw size={20} />
            Neu starten
          </button>
        )}
      </div>
    </div>
  )
} 