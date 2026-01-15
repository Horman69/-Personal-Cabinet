'use client'

import { useState } from 'react'

interface TooltipProps {
    content: string | string[]
    children?: React.ReactNode
}

export default function Tooltip({ content, children }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false)

    const contentArray = Array.isArray(content) ? content : [content]

    return (
        <div className="relative inline-block">
            <button
                type="button"
                className="ml-1 inline-flex items-center justify-center w-4 h-4 text-xs text-gray-400 hover:text-gray-600 focus:outline-none"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onFocus={() => setIsVisible(true)}
                onBlur={() => setIsVisible(false)}
            >
                {children || (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                )}
            </button>

            {isVisible && (
                <div className="absolute z-10 w-64 p-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg shadow-lg left-full ml-2 top-1/2 -translate-y-1/2">
                    <div className="space-y-1">
                        {contentArray.map((line, index) => (
                            <div key={index} className="flex items-start">
                                {contentArray.length > 1 && (
                                    <span className="mr-2 text-primary-600">•</span>
                                )}
                                <span>{line}</span>
                            </div>
                        ))}
                    </div>
                    {/* Стрелка */}
                    <div className="absolute w-2 h-2 bg-white border-l border-t border-gray-200 transform rotate-45 -left-1 top-1/2 -translate-y-1/2"></div>
                </div>
            )}
        </div>
    )
}
