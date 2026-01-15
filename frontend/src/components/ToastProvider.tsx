'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { Toast, type ToastProps } from './Toast'

interface ToastContextValue {
    showToast: (props: Omit<ToastProps, 'id' | 'onClose'>) => void
    hideToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within ToastProvider')
    }
    return context
}

interface ToastItem extends ToastProps {
    id: string
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([])

    const showToast = useCallback((props: Omit<ToastProps, 'id' | 'onClose'>) => {
        const id = Math.random().toString(36).substring(7)
        const newToast: ToastItem = {
            ...props,
            id,
            onClose: () => hideToast(id),
        }

        setToasts((prev) => [...prev, newToast])

        // Auto-dismiss after duration
        const duration = props.duration || 5000
        setTimeout(() => {
            hideToast(id)
        }, duration)
    }, [])

    const hideToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}

            {/* Toast Container - Fixed at top */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} />
                ))}
            </div>
        </ToastContext.Provider>
    )
}
