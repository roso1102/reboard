import { useState } from 'react'

export function ReusabilityScoreLabel({ score, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left text-sm text-gray-600 hover:text-gray-900 underline decoration-dotted"
    >
      Reusability: {score}%
    </button>
  )
}

export function ReusabilityModal({ open, onClose }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-soft-lg p-6 max-w-md w-full border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Reusability Score</h3>
        <p className="text-sm text-gray-600 mb-4">
          The reusability score is derived from layered functional testing. Each layer (GPIO, ADC, WiFi, etc.)
          is tested; working layers contribute to a higher score. Components with higher scores are suitable
          for more use cases and have longer expected lifespan in circular use.
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Scores are certified by the E-Grade Functional Valuation System and displayed on all listed components.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
        >
          Close
        </button>
      </div>
    </div>
  )
}
