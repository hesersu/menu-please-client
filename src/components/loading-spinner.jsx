import React from 'react'

export const LoadingSpinner = () => {
  return (
    <svg
                className="mr-2 h-8 w-8 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                >
                {/* Background circle */}
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />

                {/* Rotating arc */}
                <g className="animate-spin origin-center">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray="20 140"
                    strokeLinecap="round"
                    className="opacity-75"
                  />
                </g>
              </svg>
  )
}
