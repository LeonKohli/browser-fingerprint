interface CanvasFingerprintResult {
  text: string | null
  geometry: string | null
  winding: boolean
  unstable: boolean
}

export function useCanvasFingerprint() {
  const generateCanvasFingerprint = (): CanvasFingerprintResult | null => {
    if (!import.meta.client) return null

    try {
      const winding = testWinding()
      const text = renderTextImage()
      const geometry = renderGeometryImage()

      // Stability check: render text twice and compare
      // If different, browser is injecting anti-fingerprinting noise
      const textCheck = renderTextImage()
      const unstable = text !== textCheck

      return {
        text: unstable ? 'unstable' : text,
        geometry: unstable ? 'unstable' : geometry,
        winding,
        unstable,
      }
    } catch (error) {
      console.error('Error generating canvas fingerprint:', error)
      return null
    }
  }

  const testWinding = (): boolean => {
    const canvas = document.createElement('canvas')
    canvas.width = 2
    canvas.height = 2
    const ctx = canvas.getContext('2d')
    if (!ctx) return false

    // Evenodd winding test
    ctx.beginPath()
    ctx.rect(0, 0, 2, 2)
    ctx.rect(1, 1, 2, 2)
    return ctx.isPointInPath(1, 1, 'evenodd')
  }

  /**
   * Text rendering produces high entropy from:
   * - Font rendering differences (hinting, anti-aliasing, subpixel rendering)
   * - Emoji rendering (platform-specific emoji sets)
   * - Color blending from overlapping transparent text
   *
   * Based on FingerprintJS v5 approach.
   */
  const renderTextImage = (): string | null => {
    const canvas = document.createElement('canvas')
    canvas.width = 240
    canvas.height = 60
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.textBaseline = 'alphabetic'

    // Orange background rectangle
    ctx.fillStyle = '#f60'
    ctx.fillRect(100, 1, 62, 20)

    // First text layer: dark blue, Times New Roman
    // Using built-in font to isolate from user font preferences
    ctx.font = '11pt "Times New Roman"'
    ctx.fillStyle = '#069'
    // Pangram + emoji for maximum platform differentiation
    // Emoji triggers platform-specific rendering (different emoji sets per OS)
    ctx.fillText('Cwm fjordbank gly ' + String.fromCharCode(55357, 56835), 2, 15)

    // Second text layer: semi-transparent green, Arial, overlapping
    // The overlap creates color blending that differs across rendering engines
    ctx.font = '18pt Arial'
    ctx.fillStyle = 'rgba(102, 204, 0, 0.2)'
    ctx.fillText('Cwm fjordbank gly ' + String.fromCharCode(55357, 56835), 4, 45)

    return canvas.toDataURL()
  }

  /**
   * Geometry rendering produces entropy from:
   * - GPU-dependent composite blending (multiply mode)
   * - Anti-aliasing differences in arc rendering
   * - Evenodd fill rule implementation differences
   *
   * Based on FingerprintJS v5 approach.
   */
  const renderGeometryImage = (): string | null => {
    const canvas = document.createElement('canvas')
    canvas.width = 122
    canvas.height = 110
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    // Multiply blending: GPU-dependent color mixing
    ctx.globalCompositeOperation = 'multiply'

    // Three overlapping colored circles
    // Magenta
    ctx.fillStyle = '#f2f'
    ctx.beginPath()
    ctx.arc(40, 40, 40, 0, Math.PI * 2)
    ctx.fill()

    // Cyan
    ctx.fillStyle = '#2ff'
    ctx.beginPath()
    ctx.arc(80, 40, 40, 0, Math.PI * 2)
    ctx.fill()

    // Yellow
    ctx.fillStyle = '#ff2'
    ctx.beginPath()
    ctx.arc(60, 80, 40, 0, Math.PI * 2)
    ctx.fill()

    // Reset composite operation for winding test
    ctx.globalCompositeOperation = 'source-over'

    // Evenodd winding fill test
    // Two concentric arcs: tests path winding implementation
    ctx.fillStyle = '#f9c'
    ctx.beginPath()
    ctx.arc(60, 60, 60, 0, Math.PI * 2)
    ctx.arc(60, 60, 20, 0, Math.PI * 2)
    ctx.fill('evenodd')

    return canvas.toDataURL()
  }

  return {
    generateCanvasFingerprint,
  }
}
