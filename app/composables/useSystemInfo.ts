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
    const getSystemInfo = async (): Promise<{
        osInfo: string;
        cpuCores: number;
        deviceMemory: number;
        batteryInfo: BatteryInfo | null;
        bluetoothAvailable: boolean;
    }> => {
        if (!import.meta.client) {
            return {
                osInfo: 'Unknown',
                cpuCores: 0,
                deviceMemory: 0,
                batteryInfo: null,
                bluetoothAvailable: false,
            };
        }

        const nav = navigator as NavigatorExtended;
        let osInfo = 'Unknown';
        let cpuCores = nav.hardwareConcurrency;
        let deviceMemory = nav.deviceMemory || 0;

        // Attempt to get more accurate OS information
        if (nav.userAgentData) {
            osInfo = nav.userAgentData.platform;
        } else {
            const userAgent = nav.userAgent.toLowerCase();
            if (userAgent.includes('win')) osInfo = 'Windows';
            else if (userAgent.includes('mac')) osInfo = 'macOS';
            else if (userAgent.includes('linux')) osInfo = 'Linux';
            else if (userAgent.includes('android')) osInfo = 'Android';
            else if (userAgent.includes('ios')) osInfo = 'iOS';
        }

        // Get battery information
        let batteryInfo: BatteryInfo | null = null;
        if (nav.getBattery) {
            try {
                const battery = await nav.getBattery();
                batteryInfo = {
                    charging: battery.charging,
                    chargingTime: battery.chargingTime,
                    dischargingTime: battery.dischargingTime,
                    level: battery.level,
                };
            } catch (error) {
                console.error('Error getting battery info:', error);
            }
        }

        // Check Bluetooth availability
        const bluetoothAvailable = 'bluetooth' in nav;

        return {
            osInfo,
            cpuCores,
            deviceMemory,
            batteryInfo,
            bluetoothAvailable,
        };
    };

    const getScreenInfo = (): {
        width: number;
        height: number;
        colorDepth: number;
        pixelRatio: number;
        orientation: string;
    } => {
        if (!import.meta.client) {
            return {
                width: 0,
                height: 0,
                colorDepth: 0,
                pixelRatio: 1,
                orientation: 'unknown',
            };
        }

        return {
            width: window.screen.width,
            height: window.screen.height,
            colorDepth: window.screen.colorDepth,
            pixelRatio: window.devicePixelRatio,
            orientation: screen.orientation?.type || 'unknown',
        };
    };

    return {
        getSystemInfo,
        getScreenInfo
    };
} 