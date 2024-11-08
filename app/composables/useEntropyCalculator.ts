interface Probabilities {
    browser: {
        hasJavaScript: number
        userAgent: number
        language: number
        platform: number
    }
    system: {
        timezone: number
        fonts: number
    }
    screen: {
        resolution: number
        colorDepth: number
    }
    media: {
        canvasFingerprint: number
        audioFingerprint: number
    }
    webgl: {
        renderer: number
        hardwareAcceleration: number
    }
    hardware: {
        deviceMemory: number
        cpuCores: number
        touchSupport: number
        battery: number
        network: number
    }
}

const probabilities: Probabilities = {
    browser: {
        hasJavaScript: 0.98,
        userAgent: 0.01,
        language: 0.1,
        platform: 0.2,
    },
    system: {
        timezone: 0.05,
        fonts: 0.01,
    },
    screen: {
        resolution: 0.05,
        colorDepth: 0.03,
    },
    media: {
        canvasFingerprint: 0.1,
        audioFingerprint: 0.2,
    },
    webgl: {
        renderer: 0.05,
        hardwareAcceleration: 0.02,
    },
    hardware: {
        deviceMemory: 0.3,
        cpuCores: 0.2,
        touchSupport: 0.15,
        battery: 0.1,
        network: 0.05,
    },
};

export function useEntropyCalculator() {
    const calculateSurprisal = (prob: number): number => {
        return -Math.log2(prob);
    };

    const calculateEntropy = (fp: any): number => {
        if (!fp) return 0;

        let totalEntropy = 0;

        if (fp.browser) {
            totalEntropy += calculateSurprisal(probabilities.browser.hasJavaScript);
            if (fp.browser.userAgent) totalEntropy += calculateSurprisal(probabilities.browser.userAgent);
            if (fp.browser.language) totalEntropy += calculateSurprisal(probabilities.browser.language);
            if (fp.browser.platform) totalEntropy += calculateSurprisal(probabilities.browser.platform);
        }

        if (fp.system) {
            if (fp.system.timezone) totalEntropy += calculateSurprisal(probabilities.system.timezone);
            if (fp.system.fonts?.total > 0) totalEntropy += calculateSurprisal(probabilities.system.fonts);
        }

        if (fp.screen?.width && fp.screen?.height) {
            totalEntropy += calculateSurprisal(probabilities.screen.resolution);
        }

        if (fp.media) {
            if (fp.media.canvasFingerprint) totalEntropy += calculateSurprisal(probabilities.media.canvasFingerprint);
            if (fp.media.audioFingerprint) totalEntropy += calculateSurprisal(probabilities.media.audioFingerprint);
        }

        if (fp.webgl?.renderer) {
            totalEntropy += calculateSurprisal(probabilities.webgl.renderer);
        }

        if (fp.hardware) {
            if (fp.hardware.deviceMemory) totalEntropy += calculateSurprisal(probabilities.hardware.deviceMemory);
            if (fp.hardware.cpuCores) totalEntropy += calculateSurprisal(probabilities.hardware.cpuCores);
        }

        if (fp.screen) {
            if (fp.screen.colorDepth) totalEntropy += calculateSurprisal(probabilities.screen.colorDepth);
        }

        if (fp.webgl) {
            if (fp.webgl.hardwareAcceleration) totalEntropy += calculateSurprisal(probabilities.webgl.hardwareAcceleration);
        }

        if (fp.hardware) {
            if (fp.hardware.touchSupport) totalEntropy += calculateSurprisal(probabilities.hardware.touchSupport);
            if (fp.hardware.battery) totalEntropy += calculateSurprisal(probabilities.hardware.battery);
            if (fp.hardware.network) totalEntropy += calculateSurprisal(probabilities.hardware.network);
        }

        return totalEntropy;
    };

    return {
        calculateEntropy,
    };
} 