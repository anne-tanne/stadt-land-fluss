import React, { useRef, useEffect } from 'react'
import { Check, Target, Lightbulb } from 'lucide-react'
import { useTranslation } from '../../translations'
import styles from '../../styles/Quiz.module.css'

interface QuizInputProps {
  currentLetter: string
  inputValue: string
  onInputChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  foundCount: number
  totalCountries: number
  onNextLetter: () => void
  onOpenHint: () => void
}

export const QuizInput: React.FC<QuizInputProps> = ({
  currentLetter,
  inputValue,
  onInputChange,
  onSubmit,
  foundCount,
  totalCountries,
  onNextLetter,
  onOpenHint
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [currentLetter])

  const isComplete = foundCount === totalCountries

  return (
    <div className={styles.quizCard}>
      <div className={styles.questionSection}>
        <h3>Nenne Länder, die mit "{currentLetter}" beginnen</h3>
        <p className={styles.hintText}>Tippe einen Ländernamen ein und drücke Enter. Ein Tippfehler ist erlaubt.</p>

        {isComplete ? (
          <div className={styles.completionMessage}>
            <h3>🎉 Alle Länder für "{currentLetter}" gefunden!</h3>
            <button className={styles.changeLetterBtn} onClick={onNextLetter}>
              <Target size={20} />
              {t('nextLetter')}
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className={styles.inputForm}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder={t('enterCountryName')}
              className={styles.countryInput}
              autoComplete="off"
            />
            <button type="submit" className={styles.submitBtn}>
              <Check size={20} />
            </button>
            <button 
              type="button" 
              className={styles.hintBtn}
              onClick={onOpenHint}
              title="Tipp anzeigen"
            >
              <Lightbulb size={20} />
            </button>
          </form>
        )}
      </div>
    </div>
  )
} 