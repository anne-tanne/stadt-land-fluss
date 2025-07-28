import React from 'react'
import { RotateCcw } from 'lucide-react'
import { useTranslation } from '../../translations'
import styles from '../../styles/Quiz.module.css'

interface QuizHeaderProps {
  currentLetter: string
  foundCount: number
  totalCountries: number
  onResetLetter: () => void
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  currentLetter,
  foundCount,
  totalCountries,
  onResetLetter
}) => {
  const { t } = useTranslation()

  return (
    <div className={styles.quizHeader}>
      <div className={styles.letterInfo}>
        <div className={styles.letterDisplay}>
          <span className={styles.currentLetter}>{currentLetter}</span>
          <div className={styles.progressInfo}>
            <span className={styles.progressText}>{foundCount} / {totalCountries}</span>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${(foundCount / totalCountries) * 100}%` }}
              />
            </div>
          </div>
        </div>
        <div className={styles.letterActions}>
          <button className={styles.resetBtn} onClick={onResetLetter}>
            <RotateCcw size={16} />
            {t('resetLetter')}
          </button>
        </div>
      </div>
    </div>
  )
} 