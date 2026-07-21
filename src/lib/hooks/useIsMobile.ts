import { useEffect, useState } from 'react'

/**
 * useIsMobile
 * A hook to detect if the current screen width is mobile (less than 768px).
 * Uses lazy initializer to avoid setState-in-effect warnings and handle SSR safely.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768
    }
    return false
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isMobile
}
