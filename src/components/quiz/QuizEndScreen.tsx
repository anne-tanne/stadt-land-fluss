import React from 'react'
import { Trophy, ArrowLeft } from 'lucide-react'

import styles from '../../styles/Quiz.module.css'

interface QuizEndScreenProps {
  selectedContinent: string
  totalFound: number
  totalCountries: number
  hintedCountries: Set<string>
  heavyHintedCountries: Set<string>
  onReturnToBrowse: () => void
}

export const QuizEndScreen: React.FC<QuizEndScreenProps> = ({
  selectedContinent,
  totalFound,
  totalCountries,
  hintedCountries,
  heavyHintedCountries,
  onReturnToBrowse
}) => {


  const getContinentDisplay = () => {
    switch (selectedContinent) {
      case 'Alle':
        return '🌍 Alle Kontinente'
      case 'Amerikas':
        return '🌎 Amerikas (Nord & Süd)'
      case 'Afrika':
        return '🌍 Afrika'
      case 'Asien':
        return '🌏 Asien'
      case 'Europa':
        return '🌍 Europa'
      case 'Nordamerika':
        return '🌎 Nordamerika'
      case 'Südamerika':
        return '🌎 Südamerika'
      case 'Ozeanien':
        return '🌏 Ozeanien'
      default:
        return selectedContinent
    }
  }

  const correctAnswers = totalFound - hintedCountries.size - heavyHintedCountries.size
  const lightHinted = hintedCountries.size
  const heavyHinted = heavyHintedCountries.size

  const getPerformanceMessage = () => {
    // Berechne effektive Punkte: Richtig geraten = 100%, leichte Tipps = 70%, starke Tipps = 40%
    const effectivePoints = correctAnswers + (lightHinted * 0.7) + (heavyHinted * 0.4)
    const maxPossiblePoints = totalCountries
    const effectivePercentage = Math.round((effectivePoints / maxPossiblePoints) * 100)
    
    if (effectivePercentage === 100) {
      return 'Perfekt! Du hast alle Länder ohne Hilfe gefunden! 🎉'
    } else if (effectivePercentage >= 90) {
      return 'Großartig! Du hast fast alle Länder selbst gefunden! 🎯'
    } else if (effectivePercentage >= 75) {
      return 'Gut gemacht! Du hast die meisten Länder selbst gefunden! 👍'
    } else if (effectivePercentage >= 60) {
      return 'Nicht schlecht! Du hast einen guten Teil selbst gefunden! 💪'
    } else if (effectivePercentage >= 40) {
      return 'Du hast viele Tipps gebraucht, aber das ist okay! 📚'
    } else {
      return 'Weiter üben! Du wirst besser! 📚'
    }
  }

  return (
    <div className={styles.quizEndScreen}>
      <div className={styles.endScreenContent}>
        <div className={styles.trophySection}>
          <Trophy size={64} className={styles.trophyIcon} />
          <h1 className={styles.endScreenTitle}>Quiz beendet!</h1>
          <p className={styles.continentTitle}>{getContinentDisplay()}</p>
        </div>

        <div className={styles.performanceSection}>
          <div className={styles.performanceMessage}>
            {getPerformanceMessage()}
          </div>
        </div>

        <div className={styles.statsSection}>
          <h2>Deine Ergebnisse:</h2>
          
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Gefunden:</span>
            <span className={styles.statValue}>{totalFound} / {totalCountries}</span>
          </div>

          <div className={styles.statRow}>
            <span className={styles.statLabel}>Richtig geraten:</span>
            <span className={styles.statValue}>{correctAnswers}</span>
          </div>

          <div className={styles.statRow}>
            <span className={styles.statLabel}>Mit leichten Tipps:</span>
            <span className={`${styles.statValue} ${styles.lightHinted}`}>{lightHinted}</span>
          </div>

          <div className={styles.statRow}>
            <span className={styles.statLabel}>Mit starken Tipps:</span>
            <span className={`${styles.statValue} ${styles.heavyHinted}`}>{heavyHinted}</span>
          </div>

          <div className={styles.statRow}>
            <span className={styles.statLabel}>Effektive Punkte:</span>
            <span className={styles.statValue}>
              {Math.round(correctAnswers + (lightHinted * 0.7) + (heavyHinted * 0.4))} / {totalCountries}
            </span>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.returnBtn} onClick={onReturnToBrowse}>
            <ArrowLeft size={20} />
            Quiz beenden
          </button>
        </div>
      </div>
    </div>
  )
} 