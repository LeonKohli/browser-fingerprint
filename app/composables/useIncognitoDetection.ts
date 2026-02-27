// Incognito/Private mode detection.
//
// WARNING: This is an arms race. Browsers actively patch detection methods.
// Status as of Feb 2026:
// - Safari: IndexedDB Blob method WORKS (tested through Safari 18.4)
// - Chrome: storage.estimate() quota method WORKS but threatened by
//   chrome://flags/#predictable-reported-quota (will break when enabled by default)
// - Firefox: NO RELIABLE METHOD — ServiceWorker detection broken since Firefox 138+
//
// Sources: detectIncognito (Joe12387), FingerprintJS v5 research

interface IncognitoDetectionResult {
  isPrivate: boolean
  browserName: string
  confidence: 'high' | 'medium' | 'low' | 'none'
}

export function useIncognitoDetection() {
  const detectIncognito = async (): Promise<IncognitoDetectionResult> => {
    if (!import.meta.client) {
      return { isPrivate: false, browserName: 'Unknown', confidence: 'none' }
    }

    const browser = detectBrowser()

    try {
      if (browser === 'Safari') {
        return await safariPrivateTest()
      } else if (browser === 'Chrome' || browser === 'Edge' || browser === 'Opera' || browser === 'Brave' || browser === 'Chromium') {
        return await chromiumPrivateTest(browser)
      } else if (browser === 'Firefox') {
        return firefoxPrivateTest()
      }
    } catch {
      // Detection failed — not conclusive
    }

    return { isPrivate: false, browserName: browser, confidence: 'none' }
  }

  /**
   * Detect browser engine using toFixed error message length.
   * This is more reliable than UA string parsing since it tests
   * the actual JS engine, not a spoofable string.
   *
   * Engine identification via (-1).toFixed(-1) error message length:
   * - Safari/JavaScriptCore: 44
   * - Chrome/V8: 51
   * - Firefox/SpiderMonkey: 25
   */
  const detectBrowser = (): string => {
    let engineId = 0
    try {
      // @ts-expect-error intentional invalid argument
      ;(-1).toFixed(-1)
    } catch (e) {
      engineId = (e as Error).message.length
    }

    if (engineId === 44) return 'Safari'
    if (engineId === 51) {
      // Chromium-based — identify specific browser from UA
      const ua = navigator.userAgent
      if ((navigator as any).brave !== undefined) return 'Brave'
      if (ua.includes('Edg/')) return 'Edge'
      if (ua.includes('OPR/')) return 'Opera'
      if (ua.includes('Chrome/')) return 'Chrome'
      return 'Chromium'
    }
    if (engineId === 25) return 'Firefox'

    return 'Unknown'
  }

  /**
   * Safari private browsing detection via IndexedDB Blob storage.
   * Safari private mode does not support storing Blobs in IndexedDB.
   * Still works as of Safari 18.4 (Feb 2026).
   */
  const safariPrivateTest = (): Promise<IncognitoDetectionResult> => {
    return new Promise((resolve) => {
      const dbName = String(Math.random())

      try {
        const request = window.indexedDB.open(dbName, 1)

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result

          try {
            db.createObjectStore('test', { autoIncrement: true }).put(new Blob())
            resolve({ isPrivate: false, browserName: 'Safari', confidence: 'high' })
          } catch (e) {
            const message = e instanceof Error ? e.message : String(e)
            const isPrivate = typeof message === 'string' && message.includes('BlobURLs are not yet supported')
            resolve({ isPrivate, browserName: 'Safari', confidence: isPrivate ? 'high' : 'medium' })
          } finally {
            db.close()
            window.indexedDB.deleteDatabase(dbName)
          }
        }

        request.onerror = () => {
          resolve({ isPrivate: false, browserName: 'Safari', confidence: 'low' })
        }
      } catch {
        resolve({ isPrivate: false, browserName: 'Safari', confidence: 'none' })
      }
    })
  }

  /**
   * Chromium incognito detection via storage quota estimation.
   * In incognito mode, Chrome reports significantly smaller storage quota.
   *
   * WARNING: Google has a flag (predictable-reported-quota) that will kill
   * this method when enabled by default. Not yet default as of Feb 2026.
   */
  const chromiumPrivateTest = async (browserName: string): Promise<IncognitoDetectionResult> => {
    if (!navigator.storage || !navigator.storage.estimate) {
      return { isPrivate: false, browserName, confidence: 'none' }
    }

    try {
      const estimate = await navigator.storage.estimate()
      const quota = estimate.quota || 0

      // In incognito mode, Chrome typically reports quota < 120MB
      // In normal mode, quota is typically > 1GB (based on available disk space)
      // Threshold: if quota < 200MB, likely incognito
      const quotaInMB = quota / (1024 * 1024)
      const isPrivate = quotaInMB < 200

      return { isPrivate, browserName, confidence: 'medium' }
    } catch {
      return { isPrivate: false, browserName, confidence: 'none' }
    }
  }

  /**
   * Firefox private browsing detection.
   *
   * NOTE: As of Firefox 138+ (April 2025), ServiceWorker-based detection
   * is broken because Firefox enabled ServiceWorkers in private mode.
   * No reliable detection method currently exists for Firefox.
   * This returns a low-confidence result.
   */
  const firefoxPrivateTest = (): IncognitoDetectionResult => {
    // ServiceWorker check — was reliable through Firefox 137
    // Firefox 138+ enabled ServiceWorkers in private browsing
    // Keeping as a weak signal but with low confidence
    const swUnavailable = navigator.serviceWorker === undefined

    return {
      isPrivate: swUnavailable,
      browserName: 'Firefox',
      confidence: swUnavailable ? 'low' : 'low',
    }
  }

  return {
    detectIncognito,
  }
}
