import React, { useRef, useEffect } from 'react'
import { X, ChevronRight, Eye, Check } from 'lucide-react'
import styles from '../../styles/Quiz.module.css'

interface HintPopupProps {
  isOpen: boolean
  hintCountry: string
  hintLevel: number
  inputValue: string
  onInputChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
  onShowNextLetter: () => void
  onShowFullCountry: () => void
  onRevealCountry: () => void
}

export const HintPopup: React.FC<HintPopupProps> = ({
  isOpen,
  hintCountry,
  hintLevel,
  inputValue,
  onInputChange,
  onSubmit,
  onClose,
  onShowNextLetter,
  onShowFullCountry,
  onRevealCountry
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  const visibleLetters = hintCountry.substring(0, hintLevel)
  const remainingLetters = hintCountry.substring(hintLevel)
  const canShowMore = hintLevel < hintCountry.length
  const isFullyRevealed = hintLevel === hintCountry.length

  return (
    <div className={styles.hintPopupOverlay}>
      <div className={styles.hintPopup}>
        <div className={styles.hintPopupHeader}>
          <h3>💡 Tipp</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.hintContent}>
          <div className={styles.hintDisplay}>
            <span className={styles.visibleLetters}>{visibleLetters}</span>
            {remainingLetters.split('').map((_, index) => (
              <span key={index} className={styles.hiddenLetter}>_</span>
            ))}
          </div>

          <div className={styles.hintActions}>
            {canShowMore && (
              <button 
                className={styles.hintActionBtn}
                onClick={onShowNextLetter}
                title="Nächsten Buchstaben anzeigen"
              >
                <ChevronRight size={16} />
                Mehr anzeigen
              </button>
            )}
            
            {!isFullyRevealed && (
              <button 
                className={styles.hintActionBtn}
                onClick={onShowFullCountry}
                title="Vollständigen Namen anzeigen"
              >
                <Eye size={16} />
                Alles anzeigen
              </button>
            )}
            
            <button 
              className={`${styles.hintActionBtn} ${styles.revealBtn}`}
              onClick={onRevealCountry}
              title="Land direkt hinzufügen (rot markiert)"
            >
              <Check size={16} />
              Direkt hinzufügen
            </button>
          </div>

          <form onSubmit={onSubmit} className={styles.hintInputForm}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Ländernamen eingeben..."
              className={styles.hintInput}
              autoComplete="off"
            />
            <button type="submit" className={styles.hintSubmitBtn}>
              <Check size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 