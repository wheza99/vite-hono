/**
 * Cloudflare Turnstile widget — explicit render.
 * The script loads exactly once (guarded by window.__turnstileLoader), and the
 * onVerify/onExpire/onError callbacks are read from a ref so inline arrow
 * functions (a new identity every render) don't retrigger the render effect and
 * cause an infinite loop. Pattern follows the clawmpany-auth skill.
 */
import { useEffect, useRef, useState } from 'react'

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

interface TurnstileApi {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string
      callback?: (token: string) => void
      'expired-callback'?: () => void
      'error-callback'?: () => void
      theme?: 'light' | 'dark' | 'auto'
    },
  ) => string
  remove: (id: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
    __turnstileLoader?: Promise<void>
  }
}

function loadScript(): Promise<void> {
  if (window.__turnstileLoader) return window.__turnstileLoader
  window.__turnstileLoader = new Promise((resolve, reject) => {
    if (window.turnstile) return resolve()
    const s = document.createElement('script')
    s.src = SCRIPT_SRC
    s.async = true
    s.defer = true
    s.onload = () => resolve()
    s.onerror = () => {
      window.__turnstileLoader = undefined
      reject(new Error('Failed to load Turnstile script'))
    }
    document.head.appendChild(s)
  })
  return window.__turnstileLoader
}

interface TurnstileProps {
  siteKey: string
  onVerify: (token: string) => void
  onExpire?: () => void
  onError?: () => void
  theme?: 'light' | 'dark' | 'auto'
}

export function Turnstile({ siteKey, onVerify, onExpire, onError, theme = 'auto' }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const cbRef = useRef({ onVerify, onExpire, onError })
  cbRef.current = { onVerify, onExpire, onError }

  useEffect(() => {
    let cancelled = false
    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          callback: (token) => cbRef.current.onVerify(token),
          'expired-callback': () => cbRef.current.onExpire?.(),
          'error-callback': () => cbRef.current.onError?.(),
        })
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e))
      })

    return () => {
      cancelled = true
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch {
          /* already removed */
        }
        widgetIdRef.current = null
      }
    }
    // Intentionally NOT depending on the callbacks — see the loop note above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey, theme])

  if (error) return <div className="text-xs text-destructive">Bot check failed to load.</div>
  return <div ref={containerRef} />
}
