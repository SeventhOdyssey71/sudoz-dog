"use client"

import Link from 'next/link'
import { Shield, CheckCircle } from 'lucide-react'
import { useTerms } from './TermsContext'

export default function TermsDialog() {
  const { termsAccepted, showTermsDialog, setShowTermsDialog, acceptTerms } = useTerms()

  if (!showTermsDialog) return null

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-[100] flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-4 relative z-[101]">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-green-400" />
          <h2 className="text-2xl font-bold text-white">Terms & Conditions</h2>
        </div>
        
        <p className="text-gray-300">
          Before connecting your wallet and participating in the SUDOZ ecosystem, you must read and accept our terms and conditions.
        </p>

        <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
          <p className="text-sm text-gray-400 mb-3">
            By accepting, you acknowledge that:
          </p>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>SUDOZ is an experimental NFT ecosystem with fictional narratives</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>All transactions are voluntary and non-refundable</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>No financial returns or guarantees are promised</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>You are solely responsible for your decisions</span>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="terms-checkbox-modal"
            className="w-4 h-4 text-green-400 bg-gray-900 border-gray-600 rounded focus:ring-green-400 focus:ring-2"
            onChange={(e) => {
              if (e.target.checked) {
                acceptTerms();
              }
            }}
          />
          <label htmlFor="terms-checkbox-modal" className="text-gray-300 text-sm">
            I have read and agree to the{" "}
            <Link 
              href="/terms" 
              target="_blank"
              className="text-green-400 hover:text-green-300 underline"
            >
              full Terms and Conditions
            </Link>
          </label>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowTermsDialog(false)}
            className="flex-1 px-4 py-2 rounded-xl bg-gray-700/20 text-gray-400 border border-gray-700/40 text-sm font-bold tracking-wide hover:bg-gray-700/30 transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={acceptTerms}
            disabled={!termsAccepted}
            className={`flex-1 px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-colors ${
              termsAccepted
                ? 'bg-green-400/20 text-green-400 border border-green-400/40 hover:bg-green-400/30'
                : 'bg-gray-700/20 text-gray-500 border border-gray-700/40 cursor-not-allowed'
            }`}
          >
            ACCEPT & CONTINUE
          </button>
        </div>
      </div>
    </div>
  )
}