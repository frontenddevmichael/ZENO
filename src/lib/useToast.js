import { useState, useCallback } from 'react'

export function useToast() {
    const [toast, setToast] = useState({ message: null, type: 'error', description: null, action: null })

    const showToast = useCallback((message, type = 'error', options = {}) => {
        setToast({ message, type, description: options.description ?? null, action: options.action ?? null })
    }, [])

    const dismissToast = useCallback(() => {
        setToast({ message: null, type: 'error', description: null, action: null })
    }, [])

    return { toast, showToast, dismissToast }
}