interface BatteryInfo {
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
    level: number;
}

interface NavigatorExtended extends Navigator {
    deviceMemory?: number;
    hardwareConcurrency: number;
    userAgentData?: {
        platform: string;
        brands: Array<{ brand: string; version: string }>;
        mobile: boolean;
    };
    getBattery?: () => Promise<BatteryManager>;
}

interface BatteryManager {
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
    level: number;
}

export function useSystemInfo() {
    const preferredLanguages = usePreferredLanguages()
    const memory = useMemory()
    const battery = useBattery()
    const { pixelRatio } = useDevicePixelRatio()
    const screenOrientation = useScreenOrientation()
    const windowSize = useWindowSize()

    const getSystemInfo = async () => {
        if (!import.meta.client) {
            return {
                osInfo: 'Unknown',
                cpuCores: 0,
                deviceMemory: 0,
                batteryInfo: null,
                bluetoothAvailable: false,
            }
        }

        const nav = navigator as NavigatorExtended
        let osInfo = 'Unknown'
        let cpuCores = nav.hardwareConcurrency

        // Attempt to get more accurate OS information
        if (nav.userAgentData) {
            osInfo = nav.userAgentData.platform
        } else {
            const userAgent = nav.userAgent.toLowerCase()
            if (userAgent.includes('win')) osInfo = 'Windows'
            else if (userAgent.includes('mac')) osInfo = 'macOS'
            else if (userAgent.includes('linux')) osInfo = 'Linux'
            else if (userAgent.includes('android')) osInfo = 'Android'
            else if (userAgent.includes('ios')) osInfo = 'iOS'
        }

        return {
            osInfo,
            cpuCores,
            // navigator.deviceMemory returns RAM in GB (0.25, 0.5, 1, 2, 4, 8)
            // Only available in Chromium browsers. Returns undefined in Firefox/Safari.
            deviceMemory: (navigator as any).deviceMemory || null,
            batteryInfo: battery.isSupported.value ? {
                charging: battery.charging.value,
                chargingTime: battery.chargingTime.value,
                dischargingTime: battery.dischargingTime.value,
                level: battery.level.value,
            } : null,
            bluetoothAvailable: 'bluetooth' in nav,
            languages: preferredLanguages.value,
        }
    }

    const getScreenInfo = () => {
        if (!import.meta.client) {
            return {
                width: 0,
                height: 0,
                colorDepth: 0,
                pixelRatio: 1,
                orientation: 'unknown',
                windowWidth: 0,
                windowHeight: 0,
            }
        }

        // Sort dimensions descending for rotation independence
        // Remove window dimensions (too unstable for fingerprinting)
        const w = window.screen.width
        const h = window.screen.height
        return {
            width: Math.max(w, h),
            height: Math.min(w, h),
            colorDepth: window.screen.colorDepth,
            pixelRatio: pixelRatio.value,
            orientation: screenOrientation.orientation?.value || 'unknown',
        }
    }

    return {
        getSystemInfo,
        getScreenInfo
    }
} 