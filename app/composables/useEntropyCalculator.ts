// Entropy estimates based on published research:
// - AmIUnique (Laperdrix et al. 2016)
// - Panopticlick (Eckersley 2010)
// - Audio fingerprinting (Chalise et al. 2022)

export function useEntropyCalculator() {
    const calculateEntropy = (fp: any): number => {
        if (!fp) return 0;

        let totalEntropy = 0;

        // Browser features
        if (fp.browser) {
            if (fp.browser.userAgent) {
                totalEntropy += estimateUserAgentEntropy(fp.browser.userAgent);
            }
            if (fp.browser.language) {
                totalEntropy += estimateLanguageEntropy(fp.browser.language);
            }
            if (fp.browser.platform) {
                totalEntropy += estimatePlatformEntropy(fp.browser.platform);
            }
            if (fp.browser.plugins && fp.browser.plugins.length >= 0) {
                totalEntropy += estimatePluginsEntropy(fp.browser.plugins);
            }
            if (fp.browser.doNotTrack !== null) {
                totalEntropy += estimateDoNotTrackEntropy(fp.browser.doNotTrack);
            }
        }

        // System features
        if (fp.system) {
            if (fp.system.timezone) {
                totalEntropy += estimateTimezoneEntropy(fp.system.timezone);
            }
        }

        // Fonts (top-level in fp)
        if (fp.fonts && fp.fonts.fonts && fp.fonts.fonts.length > 0) {
            totalEntropy += estimateFontsEntropy(fp.fonts.fonts);
        }

        // Screen features
        if (fp.screen) {
            if (fp.screen.width && fp.screen.height) {
                totalEntropy += estimateScreenResolutionEntropy(fp.screen.width, fp.screen.height);
            }
            if (fp.screen.colorDepth) {
                totalEntropy += estimateColorDepthEntropy(fp.screen.colorDepth);
            }
        }

        // Media features
        if (fp.media) {
            if (fp.media.canvasFingerprint) {
                totalEntropy += estimateCanvasFingerprintEntropy(fp.media.canvasFingerprint);
            }
            if (fp.media.audioFingerprint) {
                totalEntropy += estimateAudioFingerprintEntropy(fp.media.audioFingerprint);
            }
        }

        // WebGL features
        if (fp.webgl) {
            if (fp.webgl.renderer) {
                totalEntropy += estimateWebGLRendererEntropy(fp.webgl.renderer);
            }
        }

        // Hardware features
        if (fp.hardware) {
            if (fp.hardware.deviceMemory) {
                totalEntropy += estimateDeviceMemoryEntropy(fp.hardware.deviceMemory);
            }
            if (fp.hardware.cpuCores) {
                totalEntropy += estimateCpuCoresEntropy(fp.hardware.cpuCores);
            }
            if (fp.hardware.touchSupport) {
                totalEntropy += estimateTouchSupportEntropy(fp.hardware.touchSupport);
            }
            if (fp.system && fp.system.batteryInfo) {
                totalEntropy += estimateBatteryEntropy(fp.system.batteryInfo);
            }
        }

        return totalEntropy;
    };

    // Canvas: AmIUnique measured 8.28 bits
    const estimateCanvasFingerprintEntropy = (canvasFingerprint: any): number => {
        if (!canvasFingerprint) return 0;
        // Check if canvas returned 'unstable' (anti-fingerprinting detected)
        if (canvasFingerprint === 'unstable' || canvasFingerprint?.unstable) return 0;
        return 8; // AmIUnique: 8.28 bits
    };

    // Audio: Chalise et al. 2022 found only 95 distinct values in 2093 users (~6.5 bits)
    const estimateAudioFingerprintEntropy = (audioFingerprint: any): number => {
        if (!audioFingerprint) return 0;
        return 6; // Research: ~6.5 bits, supplementary to canvas (+9.6% combined)
    };

    // User Agent: AmIUnique measured 9.78 bits, Panopticlick 10.0 bits
    const estimateUserAgentEntropy = (userAgent: string): number => {
        if (!userAgent) return 0;
        return 10; // AmIUnique: 9.78 bits
    };

    // Language: AmIUnique measured 3.93 bits
    const estimateLanguageEntropy = (language: string): number => {
        if (!language) return 0;
        const commonLanguages = ['en-US', 'en', 'en-GB'];
        return commonLanguages.includes(language) ? 2 : 4;
    };

    // Platform: 2.74 bits (AmIUnique)
    const estimatePlatformEntropy = (platform: string): number => {
        if (!platform) return 0;
        return 3; // AmIUnique: 2.74 bits
    };

    // Plugins: NOW FROZEN in modern browsers — provides zero entropy
    const estimatePluginsEntropy = (_plugins: any[]): number => {
        // navigator.plugins is hardcoded since ~2021
        // All modern browsers return the same 5 PDF-related plugins or empty
        return 0;
    };

    // DoNotTrack: ~1 bit, being deprecated
    const estimateDoNotTrackEntropy = (_doNotTrack: string | null): number => {
        return 1;
    };

    // Timezone: AmIUnique measured 3.41 bits, Panopticlick 3.04 bits
    const estimateTimezoneEntropy = (timezone: string): number => {
        if (!timezone) return 0;
        return 3; // AmIUnique: 3.41 bits
    };

    // Fonts: AmIUnique measured 8.51 bits (JS-based detection)
    const estimateFontsEntropy = (fonts: string[]): number => {
        if (!fonts || fonts.length === 0) return 0;
        const numFonts = fonts.length;
        if (numFonts <= 5) return 4;
        if (numFonts <= 15) return 6;
        return 8; // AmIUnique: 8.51 bits
    };

    // Screen: AmIUnique measured 4.42 bits, Panopticlick 4.83 bits
    const estimateScreenResolutionEntropy = (width: number, height: number): number => {
        if (!width || !height) return 0;
        return 4; // AmIUnique: 4.42 bits
    };

    // Color depth: Low entropy, most devices are 24-bit
    const estimateColorDepthEntropy = (_colorDepth: number): number => {
        return 1;
    };

    // WebGL Renderer: AmIUnique measured 7.30 bits
    const estimateWebGLRendererEntropy = (renderer: string): number => {
        if (!renderer) return 0;
        return 7; // AmIUnique: 7.30 bits
    };

    // Device Memory: Limited to Chromium, ~4 distinct values
    const estimateDeviceMemoryEntropy = (deviceMemory: number): number => {
        if (!deviceMemory) return 0;
        return 2;
    };

    // CPU Cores: ~3 bits (common values: 2, 4, 8, 12, 16)
    const estimateCpuCoresEntropy = (cpuCores: number): number => {
        if (!cpuCores) return 0;
        return 3;
    };

    // Touch support: binary signal
    const estimateTouchSupportEntropy = (_touchSupport: any): number => {
        return 1;
    };

    // Battery: Chromium-only, low entropy
    const estimateBatteryEntropy = (batteryInfo: any): number => {
        if (!batteryInfo) return 0;
        return 1;
    };

    return {
        calculateEntropy,
    };
}
