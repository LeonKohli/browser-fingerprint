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
    const devicePixelRatio = useDevicePixelRatio()
    const screenOrientation = useScreenOrientation()

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
            deviceMemory: memory.memory.value?.jsHeapSizeLimit || 0,
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
            }
        }

        return {
            width: window.screen.width,
            height: window.screen.height,
            colorDepth: window.screen.colorDepth,
            pixelRatio: devicePixelRatio.pixelRatio,
            orientation: screenOrientation.orientation.value || 'unknown',
        }
    }

    return {
        getSystemInfo,
        getScreenInfo
    }
} 