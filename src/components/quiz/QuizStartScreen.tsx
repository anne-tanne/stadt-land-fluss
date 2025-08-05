import React from 'react'
import { Play, RotateCcw } from 'lucide-react'
import { useTranslation } from '../../translations'
import { ContinentDropdown } from '../ContinentDropdown'
import { useDataContext } from '../../contexts/CountryContext'
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
  const { dataMode, setDataMode } = useDataContext()

  return (
    <div className={styles.quizStartScreen}>
      <h2>🌍 {t('quizStartTitle')}</h2>
      
      <div className={styles.dataModeSelection}>
        <label>Was willst du abfragen?</label>
        <div className={styles.dataModeButtons}>
          <button 
            className={`${styles.dataModeBtn} ${dataMode === 'cities' ? styles.active : ''}`}
            onClick={() => setDataMode('cities')}
          >
            🏙️ Stadt
          </button>
          <button 
            className={`${styles.dataModeBtn} ${dataMode === 'countries' ? styles.active : ''}`}
            onClick={() => setDataMode('countries')}
          >
            🌍 Land
          </button>
        </div>
      </div>
      
      <ContinentDropdown
        selectedContinent={selectedContinent}
        onContinentChange={onContinentChange}
        label="Wähle einen Kontinent:"
        className={styles.continentSelection}
      />
      
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