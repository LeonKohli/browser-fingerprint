export function useBrowserFingerprint() {
    const { language } = useNavigatorLanguage()
    const preferredLanguages = usePreferredLanguages()
    const memory = useMemory()
    const battery = useBattery()

    const { getAudioFingerprint } = useAudioFingerprint()
    const { generateCanvasFingerprint } = useCanvasFingerprint()
    const { getWebGLFingerprint } = useWebGLFingerprint()
    const { getSystemInfo, getScreenInfo } = useSystemInfo()
    const { getHardwareAcceleration, getTouchSupport, getColorDepth } = useHardwareInfo()
    const { getFonts } = useFontDetection()
    const { detectIncognito } = useIncognitoDetection()
    const { calculateEntropy } = useEntropyCalculator()
    const { formatKey, copyFingerprint, getSectionDescription } = useFingerprintHelpers()

    const detectBrowserInfo = () => {
        const ua = navigator.userAgent
        let browserName = 'Unknown'
        let version = 'Unknown'

        if (ua.match(/chrome|chromium|crios/i)) {
            browserName = ua.match(/edg/i) ? 'Edge' : 'Chrome'
        } else if (ua.match(/firefox|fxios/i)) {
            browserName = 'Firefox'
        } else if (ua.match(/safari/i)) {
            browserName = 'Safari'
        } else if (ua.match(/opr\//i)) {
            browserName = 'Opera'
        } else if (ua.match(/trident/i)) {
            browserName = 'Internet Explorer'
        }

        const match = ua.match(/(version|edge|chrome|firefox|safari|opr)\/?\s*(\.?\d+(\.\d+)*)/i)
        if (match && match[2]) {
            version = match[2]
        }

        return { browserName, version }
    }

    const detectPrivateMode = async (): Promise<boolean> => {
        const { isPrivate } = await detectIncognito()
        return isPrivate
    }

    const generateFingerprint = async () => {
        const fp: any = {}
        const sectionIssues: Record<string, boolean> = {
            browser: false,
            system: false,
            screen: false,
            media: false,
            webgl: false,
            hardware: false
        }

        try {
            // Collect browser information
            const browserInfo = detectBrowserInfo()
            fp.browser = {
                userAgent: navigator.userAgent,
                language: language.value,
                languages: preferredLanguages.value,
                platform: navigator.platform,
                cookiesEnabled: navigator.cookieEnabled,
                doNotTrack: navigator.doNotTrack || null,
                vendor: navigator.vendor || 'Unknown',
                browserName: browserInfo.browserName,
                browserVersion: browserInfo.version,
                isPrivateMode: await detectPrivateMode(),
                plugins: Array.from(navigator.plugins)
                    .map(p => ({
                        name: p.name,
                        description: p.description,
                    }))
                    .filter(p => p.name || p.description),
            }

            if (memory.memory.value) {
                fp.system = {
                    ...fp.system,
                    memory: memory.memory.value
                }
            }

            if (battery.isSupported.value) {
                fp.system = {
                    ...fp.system,
                    battery: {
                        charging: battery.charging.value,
                        chargingTime: battery.chargingTime.value,
                        dischargingTime: battery.dischargingTime.value,
                        level: battery.level.value
                    }
                }
            }
        } catch (error) {
            console.error('Error collecting browser info:', error)
            sectionIssues.browser = true
        }

        try {
            // Collect system and screen information
            const systemInfo = await getSystemInfo()
            const screenInfo = getScreenInfo()
            fp.system = {
                ...systemInfo,
            }
            fp.screen = {
                ...screenInfo,
            }
        } catch (error) {
            console.error('Error collecting system/screen info:', error)
            sectionIssues.system = true
            sectionIssues.screen = true
        }

        try {
            // Collect media information
            fp.media = {
                canvasFingerprint: await generateCanvasFingerprint(),
                audioFingerprint: await getAudioFingerprint(),
            }
        } catch (error) {
            console.error('Error collecting media info:', error)
            sectionIssues.media = true
        }

        try {
            // Collect WebGL information
            fp.webgl = getWebGLFingerprint()
        } catch (error) {
            console.error('Error collecting WebGL info:', error)
            sectionIssues.webgl = true
        }

        try {
            // Collect hardware information
            fp.hardware = {
                hardwareAcceleration: getHardwareAcceleration(),
                touchSupport: getTouchSupport(),
                colorDepth: getColorDepth(),
            }
        } catch (error) {
            console.error('Error collecting hardware info:', error)
            sectionIssues.hardware = true
        }

        try {
            // Collect font information
            fp.fonts = getFonts()
        } catch (error) {
            console.error('Error collecting font info:', error)
            sectionIssues.fonts = true
        }

        // Calculate entropy
        const entropyScore = calculateEntropy(fp)

        // Generate hash
        const fingerprintString = JSON.stringify(fp)
        const encoder = new TextEncoder()
        const data = encoder.encode(fingerprintString)
        const hashBuffer = await crypto.subtle.digest('SHA-256', data)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        fp.hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

        return { fingerprint: fp, entropyScore, sectionIssues }
    }

    return {
        generateFingerprint,
        formatKey,
        copyFingerprint,
        getSectionDescription,
        detectBrowserInfo,
        detectPrivateMode,
        calculateEntropy,
    }
} 