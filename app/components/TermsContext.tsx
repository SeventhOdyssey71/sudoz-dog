"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface TermsContextType {
  termsAccepted: boolean
  showTermsDialog: boolean
  setShowTermsDialog: (show: boolean) => void
  acceptTerms: () => void
}

const TermsContext = createContext<TermsContextType | undefined>(undefined)

export function TermsProvider({ children }: { children: React.ReactNode }) {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showTermsDialog, setShowTermsDialog] = useState(false)

  // Check if terms were previously accepted
  useEffect(() => {
    const accepted = localStorage.getItem('sudoz-terms-accepted')
    if (accepted === 'true') {
      setTermsAccepted(true)
    }
  }, [])

  const acceptTerms = () => {
    setTermsAccepted(true)
    localStorage.setItem('sudoz-terms-accepted', 'true')
    setShowTermsDialog(false)
  }

  return (
    <TermsContext.Provider value={{ termsAccepted, showTermsDialog, setShowTermsDialog, acceptTerms }}>
      {children}
    </TermsContext.Provider>
  )
}

export function useTerms() {
  const context = useContext(TermsContext)
  if (context === undefined) {
    throw new Error('useTerms must be used within a TermsProvider')
  }
  return context
}