interface BrowserInfo {
    browserName: string;
    version: string;
}

export function useFingerprintHelpers() {
    const isCopied = ref(false);

    const formatKey = (key: string): string => {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    };

    const copyFingerprint = async (hash: string | undefined): Promise<void> => {
        if (!process.client || !hash) return;

        try {
            await navigator.clipboard.writeText(hash);
            isCopied.value = true;
            setTimeout(() => {
                isCopied.value = false;
            }, 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const detectBrowserInfo = (): BrowserInfo => {
        if (!process.client) {
            return { browserName: 'Unknown', version: 'Unknown' };
        }

        const ua = navigator.userAgent;
        let browserName = 'Unknown';
        let version = 'Unknown';

        // Detect browser name
        if (ua.match(/chrome|chromium|crios/i)) {
            if (ua.match(/edg/i)) browserName = 'Edge';
            else if (ua.match(/opr\//i)) browserName = 'Opera';
            else browserName = 'Chrome';
        } else if (ua.match(/firefox|fxios/i)) {
            browserName = 'Firefox';
        } else if (ua.match(/safari/i)) {
            browserName = 'Safari';
        } else if (ua.match(/trident/i)) {
            browserName = 'Internet Explorer';
        }

        if (ua.match(/mobile/i)) {
            browserName += ' Mobile';
        }

        // Detect version
        let match = ua.match(/(edg(?:e|ios|a)?)\/(\d+(\.\d+)*)/i);
        if (match && match[2]) version = match[2];
        else {
            match = ua.match(/(chrome|chromium|crios)\/(\d+(\.\d+)*)/i);
            if (match && match[2]) version = match[2];
            else {
                match = ua.match(/(firefox|fxios)\/(\d+(\.\d+)*)/i);
                if (match && match[2]) version = match[2];
                else {
                    match = ua.match(/version\/(\d+(\.\d+)*)/i);
                    if (match && match[1] && ua.includes('safari')) version = match[1];
                    else {
                        match = ua.match(/(?:ms|\()ie\s(\d+(\.\d+)*)/i);
                        if (match && match[1]) version = match[1];
                    }
                }
            }
        }

        return { browserName, version };
    };

    const detectPrivateMode = async (): Promise<boolean> => {
        if (!process.client) return false;

        try {
            const testKey = '__private_test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);

            const db = await new Promise((resolve) => {
                const req = indexedDB.open('__private_test__');
                req.onerror = () => resolve(false);
                req.onsuccess = () => {
                    req.result.close();
                    indexedDB.deleteDatabase('__private_test__');
                    resolve(true);
                };
            });

            return !db;
        } catch (e) {
            return true;
        }
    };

    const getHardwareInfo = () => {
        if (!process.client) {
            return {
                deviceMemory: null,
                hardwareConcurrency: null,
                cpuCores: null,
                maxTouchPoints: 0,
                battery: false,
                bluetooth: false,
                gamepads: false,
                mediaCapabilities: false,
                scheduling: false,
                virtualReality: false,
                wakeLock: false
            };
        }

        return {
            deviceMemory: (navigator as any).deviceMemory || null,
            hardwareConcurrency: navigator.hardwareConcurrency || null,
            cpuCores: navigator.hardwareConcurrency || null,
            maxTouchPoints: navigator.maxTouchPoints || 0,
            battery: 'getBattery' in navigator,
            bluetooth: 'bluetooth' in navigator,
            gamepads: 'getGamepads' in navigator,
            mediaCapabilities: 'mediaCapabilities' in navigator,
            scheduling: 'scheduling' in navigator,
            virtualReality: 'xr' in navigator,
            wakeLock: 'wakeLock' in navigator
        };
    };

    const getSectionDescription = (sectionId: string): string => {
        const descriptions: Record<string, string> = {
            browser: 'Information about your web browser and its capabilities',
            system: 'Details about your operating system and environment',
            screen: 'Display and resolution information',
            media: 'Audio and visual capabilities',
            hardware: 'Device hardware specifications',
            webgl: 'Graphics and rendering capabilities'
        };
        return descriptions[sectionId] || '';
    };

    return {
        isCopied,
        formatKey,
        copyFingerprint,
        detectBrowserInfo,
        detectPrivateMode,
        getHardwareInfo,
        getSectionDescription
    };
} 