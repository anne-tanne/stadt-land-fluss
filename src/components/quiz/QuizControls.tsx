import React from 'react'
import { useTranslation } from '../../translations'
import styles from '../../styles/Quiz.module.css'

interface QuizControlsProps {
  onSaveForLater: () => void
  onEndQuiz: () => void
}

export const QuizControls: React.FC<QuizControlsProps> = ({
  onSaveForLater,
  onEndQuiz
}) => {
  const { t } = useTranslation()

  const handleEndQuiz = () => {
    const confirmed = window.confirm('Bist du sicher, dass du das Quiz beenden möchtest? Alle Fortschritte werden gelöscht.')
    if (confirmed) {
      onEndQuiz()
    }
  }

  return (
    <div className={styles.quizControls}>
      <button className={styles.saveLaterBtn} onClick={onSaveForLater}>
        Später fortsetzen
      </button>
      <button className={styles.endQuizBtn} onClick={handleEndQuiz}>
        {t('endQuiz')}
      </button>
    </div>
  )
} 