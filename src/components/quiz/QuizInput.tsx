import React, { useRef, useEffect } from 'react'
import { Check, Target } from 'lucide-react'
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
}

export const QuizInput: React.FC<QuizInputProps> = ({
  currentLetter,
  inputValue,
  onInputChange,
  onSubmit,
  foundCount,
  totalCountries,
  onNextLetter
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
          </form>
        )}
      </div>
    </div>
  )
} 