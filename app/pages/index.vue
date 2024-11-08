<template>
    <div class="min-h-screen p-4 sm:p-8 dark:bg-gray-900 bg-gray-50 transition-colors duration-200">
        <div class="max-w-4xl mx-auto space-y-8">
            <!-- Replace the Stats Bar section with the new component -->
            <StatsBar :fingerprint="fingerprint" :entropy-score="entropyScore" :is-complete="isComplete"
                :browser-info="browserInfo" :platform-info="platformInfo" />

            <!-- Header with Fingerprint -->
            <div class="text-center space-y-6">
                <div class="relative inline-block">
                    <FingerprintIcon :size="64" :scanning="loading" :variant="isComplete ? 'success' : 'default'"
                        :pulse="!isComplete && loading" />
                    <button @click="regenerateFingerprint" :disabled="loading"
                        class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                        :class="{ 'animate-spin': loading }">
                        <Icon name="mdi:refresh"
                            class="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors"
                            :class="{ 'opacity-50': loading }" />
                        <span class="sr-only">Regenerate fingerprint</span>
                    </button>
                </div>

                <div class="space-y-2">
                    <h1 class="text-4xl font-bold tracking-tight dark:text-white">Browser Fingerprint</h1>
                    <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Your unique browser fingerprint hash:
                    </p>
                </div>

                <div class="relative max-w-2xl mx-auto">
                    <div v-if="fingerprint?.hash"
                        class="p-4 bg-gray-800 dark:bg-gray-950 text-green-400 rounded-lg font-mono text-sm break-all shadow-lg group">
                        {{ fingerprint.hash }}
                        <div
                            class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                            <button @click="copyFingerprint" :disabled="loading"
                                class="px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                                <Icon :name="isCopied ? 'mdi:check' : 'mdi:clipboard-outline'"
                                    class="h-4 w-4 transition-all"
                                    :class="{ 'text-green-500': isCopied, 'animate-spin': loading }" />
                                <span class="font-medium">
                                    {{ loading ? 'Scanning...' : (isCopied ? 'Copied!' : 'Copy Fingerprint') }}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Stability Warnings -->
            <div v-if="hasStabilityWarnings"
                class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-lg p-4 max-w-2xl mx-auto">
                <div class="flex gap-3">
                    <Icon name="mdi:alert-circle" class="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 class="font-medium text-yellow-800 dark:text-yellow-200">Stability Warnings</h3>
                        <ul class="mt-2 text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                            <li v-for="warning in stabilityWarnings" :key="warning" class="flex items-center gap-2">
                                <span class="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                                {{ warning }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Section Grid -->
            <div class="grid grid-cols-1 gap-6">
                <div v-for="section in sections" :key="section.id"
                    class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700">
                    <button @click="expandedSections[section.id] = !expandedSections[section.id]"
                        class="w-full px-6 py-5 flex items-center justify-between text-left rounded-xl transition-colors group"
                        :class="[
                            expandedSections[section.id] ? 'bg-gray-50/80 dark:bg-gray-700/50' : 'hover:bg-gray-50/50 dark:hover:bg-gray-700/30',
                            'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
                        ]">
                        <div class="flex items-center gap-4">
                            <div
                                class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                                <Icon :name="section.icon"
                                    class="h-6 w-6 text-blue-500 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                            </div>
                            <div class="flex-1">
                                <span class="font-semibold text-gray-900 dark:text-white">{{ section.title }}</span>
                                <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                                    {{ getSectionDescription(section.id) }}
                                </p>
                            </div>
                            <div v-if="loadingStates[section.id]"
                                class="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin ml-4">
                            </div>
                        </div>
                        <Icon :name="expandedSections[section.id] ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                            class="h-5 w-5 text-gray-400 transition-transform duration-200"
                            :class="{ 'rotate-180': expandedSections[section.id] }" />
                    </button>

                    <div v-if="expandedSections[section.id]"
                        class="px-6 pb-6 divide-y dark:divide-gray-700 animate-fadeIn">
                        <div v-if="loadingStates[section.id]" class="py-8 text-center text-gray-500 dark:text-gray-400">
                            <div class="flex flex-col items-center gap-3">
                                <div
                                    class="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin">
                                </div>
                                <p>Loading {{ section.title.toLowerCase() }}...</p>
                            </div>
                        </div>
                        <template v-else-if="fingerprint && fingerprint[section.id]">
                            <template v-for="(value, key) in fingerprint[section.id]" :key="key">
                                <div class="py-4 first:pt-4">
                                    <div class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                                        {{ formatKey(key) }}
                                    </div>
                                    <div class="text-sm text-gray-900 dark:text-gray-200">
                                        <template v-if="Array.isArray(value)">
                                            <div class="space-y-2">
                                                <div v-for="(item, i) in value" :key="i"
                                                    class="flex items-center gap-2.5">
                                                    <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                    <template v-if="typeof item === 'object'">
                                                        <div class="space-y-1">
                                                            <div v-for="(val, k) in item" :key="k"
                                                                class="text-gray-700 dark:text-gray-300">
                                                                <span class="font-medium">{{ formatKey(k) }}:</span> {{
                                                                    val }}
                                                            </div>
                                                        </div>
                                                    </template>
                                                    <template v-else>
                                                        {{ item }}
                                                    </template>
                                                </div>
                                            </div>
                                        </template>
                                        <template v-else-if="key === 'canvasFingerprint'">
                                            <div class="space-y-3">
                                                <div
                                                    class="text-xs font-mono bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                                    {{ value.substring(0, 64) }}...
                                                </div>
                                                <img :src="value" alt="Canvas Fingerprint"
                                                    class="border border-gray-200 dark:border-gray-700 rounded-lg max-w-[200px] shadow-sm" />
                                            </div>
                                        </template>
                                        <template v-else-if="typeof value === 'object'">
                                            <pre
                                                class="text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded-lg overflow-x-auto">{{ JSON.stringify(value, null, 2) }}</pre>
                                        </template>
                                        <template v-else>
                                            {{ value }}
                                        </template>
                                    </div>
                                </div>
                            </template>
                        </template>
                    </div>
                </div>
            </div>

            <!-- Privacy Information Alert -->
            <Alert class="max-w-2xl mx-auto">
                <template #default>
                    <div class="flex gap-3">
                        <Icon name="mdi:shield-alert" class="h-5 w-5 text-blue-500" />
                        <div class="space-y-1">
                            <p class="font-medium">Privacy Information</p>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                This tool demonstrates browser fingerprinting techniques. Your browser's fingerprint can
                                be used to track you across websites, even in private browsing mode or when using VPN
                                services.
                            </p>
                        </div>
                    </div>
                </template>
            </Alert>
        </div>
    </div>
</template>

<script setup>
const loading = ref(false);
const fingerprint = ref(null);
const expandedSections = ref({});
const isComplete = ref(false);
const stabilityWarnings = ref([]);
const entropyScore = ref(0);
const loadingStates = ref({
    browser: true,
    system: true,
    screen: true,
    media: true,
    webgl: true,
    hardware: true
});
const isCopied = ref(false);

const probabilities = {
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
    },
    media: {
        canvasFingerprint: 0.1,
        audioFingerprint: 0.2,
    },
    webgl: {
        renderer: 0.05,
    },
    hardware: {
        deviceMemory: 0.3,
        cpuCores: 0.2,
    },
};

const sections = [
    { id: 'browser', title: 'Browser Information', icon: 'mdi:web' },
    { id: 'system', title: 'System Information', icon: 'mdi:cpu-64-bit' },
    { id: 'screen', title: 'Screen Information', icon: 'mdi:monitor' },
    { id: 'media', title: 'Media Capabilities', icon: 'mdi:harddisk' },
    { id: 'webgl', title: 'WebGL Information', icon: 'mdi:video-3d' },
    { id: 'hardware', title: 'Hardware Information', icon: 'mdi:memory' }
];

const formatKey = (key) => {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
};

const generateCanvasFingerprint = () => {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return null;
        }

        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('Browser Fingerprint', 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('Canvas Test', 4, 45);

        ctx.strokeStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.beginPath();
        ctx.arc(50, 50, 30, 0, Math.PI * 2);
        ctx.stroke();

        return canvas.toDataURL();
    } catch (error) {
        return null;
    }
};

const getAudioFingerprint = async () => {
    try {
        if (!document.body.hasAttribute('data-user-interacted')) {
            return null;
        }

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const analyser = audioContext.createAnalyser();
        const gainNode = audioContext.createGain();
        const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);

        gainNode.gain.value = 0;
        oscillator.type = 'triangle';
        oscillator.connect(analyser);
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start(0);

        return new Promise((resolve) => {
            const audioData = [];
            scriptProcessor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                if (audioData.length < 50) {
                    audioData.push(...inputData.slice(0, 50 - audioData.length));
                }
                if (audioData.length >= 50) {
                    oscillator.stop();
                    audioContext.close();
                    resolve(audioData.slice(0, 50).join(','));
                }
            };
        });
    } catch (error) {
        return null;
    }
};

const getFonts = () => {
    const baseFonts = ['monospace', 'sans-serif', 'serif'];
    const fontList = [
        'Arial', 'Arial Black', 'Arial Narrow', 'Calibri', 'Cambria',
        'Cambria Math', 'Comic Sans MS', 'Courier', 'Courier New',
        'Georgia', 'Helvetica', 'Impact', 'Times', 'Times New Roman',
        'Trebuchet MS', 'Verdana'
    ];

    const testString = 'mmmmmmmmmmlli';
    const testSize = '72px';
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
        return {
            fonts: [],
            total: 0
        };
    }

    const detectFont = (font) => {
        const baseWidth = {};
        baseFonts.forEach(baseFont => {
            context.font = `${testSize} ${baseFont}`;
            baseWidth[baseFont] = context.measureText(testString).width;
        });

        let detected = false;
        for (const baseFont of baseFonts) {
            context.font = `${testSize} ${font}, ${baseFont}`;
            const width = context.measureText(testString).width;
            if (width !== baseWidth[baseFont]) {
                detected = true;
                break;
            }
        }
        return detected;
    };

    const detectedFonts = fontList.filter(font => detectFont(font));

    return {
        fonts: detectedFonts,
        total: detectedFonts.length
    };
};

const getWebGLFingerprint = () => {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (!gl) {
            return {
                error: 'WebGL not supported',
                renderer: null,
                vendor: null
            };
        }

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');

        if (!debugInfo) {
            return {
                error: 'WEBGL_debug_renderer_info not supported',
                renderer: gl.getParameter(gl.RENDERER),
                vendor: gl.getParameter(gl.VENDOR)
            };
        }

        return {
            renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
            vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
            extensions: gl.getSupportedExtensions(),
            parameters: {
                maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
                maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS),
                maxRenderbufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
                aliasedLineWidthRange: gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE),
                aliasedPointSizeRange: gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE),
                maxVertexAttribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
                maxVaryingVectors: gl.getParameter(gl.MAX_VARYING_VECTORS),
                maxVertexUniformVectors: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
                maxFragmentUniformVectors: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS)
            }
        };
    } catch (error) {
        return {
            error: 'Error getting WebGL information',
            renderer: null,
            vendor: null
        };
    }
};

const getHardwareInfo = () => {
    return {
        deviceMemory: navigator.deviceMemory || null,
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

const calculateEntropy = (fp) => {
    if (!fp) return 0;

    let totalEntropy = 0;

    const calculateSurprisal = (prob) => {
        return -Math.log2(prob);
    };

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

    return totalEntropy;
};

async function detectPrivateMode() {
    try {
        const testKey = '__private_test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);

        const db = await new Promise((resolve, reject) => {
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
}

const detectBrowserName = () => {
    const ua = navigator.userAgent;
    let browserName = 'Unknown';

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

    return browserName;
};

const detectBrowserVersion = () => {
    const ua = navigator.userAgent;
    let version = 'Unknown';

    let match = ua.match(/(edg(?:e|ios|a)?)\/(\d+(\.\d+)*)/i);
    if (match) return match[2];

    match = ua.match(/(chrome|chromium|crios)\/(\d+(\.\d+)*)/i);
    if (match) return match[2];

    match = ua.match(/(firefox|fxios)\/(\d+(\.\d+)*)/i);
    if (match) return match[2];

    match = ua.match(/version\/(\d+(\.\d+)*)/i);
    if (match && ua.includes('safari')) return match[1];

    match = ua.match(/(?:ms|\()ie\s(\d+(\.\d+)*)/i);
    if (match) return match[1];

    return version;
};

const generateFingerprint = async () => {
    const fp = {};
    const collectors = createSectionCollectors(fp);

    try {
        await Promise.allSettled(collectors.map(collector => collector()));

        const fingerprintString = JSON.stringify(fp);
        const encoder = new TextEncoder();
        const data = encoder.encode(fingerprintString);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        fp.hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        fingerprint.value = { ...fingerprint.value, hash: fp.hash };

        Object.keys(loadingStates.value).forEach(key => {
            loadingStates.value[key] = false;
        });
        loading.value = false;
        isComplete.value = true;

        return fp;
    } catch (error) {
        Object.keys(loadingStates.value).forEach(key => {
            loadingStates.value[key] = false;
        });
        loading.value = false;
        isComplete.value = true;
        throw error;
    }
};

onMounted(async () => {
    if (process.client) {
        loading.value = true;
        try {
            isComplete.value = false;
            Object.keys(loadingStates.value).forEach(key => {
                loadingStates.value[key] = true;
            });

            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Fingerprint generation timed out')), 10000);
            });

            fingerprint.value = await Promise.race([
                generateFingerprint(),
                timeoutPromise
            ]);

        } catch (error) {
            stabilityWarnings.value.push('Error initializing fingerprint');
        } finally {
            loading.value = false;
            isComplete.value = true;
            Object.keys(loadingStates.value).forEach(key => {
                loadingStates.value[key] = false;
            });
        }
    }
});

const hasStabilityWarnings = computed(() => stabilityWarnings.value.length > 0);

const getSectionDescription = (sectionId) => {
    const descriptions = {
        browser: 'Information about your web browser and its capabilities',
        system: 'Details about your operating system and environment',
        screen: 'Display and resolution information',
        media: 'Audio and visual capabilities',
        hardware: 'Device hardware specifications',
        webgl: 'Graphics and rendering capabilities'
    };
    return descriptions[sectionId];
};

watch(fingerprint, (newValue) => {
    try {
        if (newValue) {
            entropyScore.value = calculateEntropy(newValue);
        }
    } catch (error) {
        entropyScore.value = 0;
    }
}, { deep: true });

const browserInfo = computed(() => {
    if (!fingerprint.value?.browser) return 'Unknown';
    const { browserName, browserVersion } = fingerprint.value.browser;
    return browserName && browserVersion ? `${browserName} ${browserVersion}` : 'Unknown';
});

const platformInfo = computed(() => {
    if (!fingerprint.value?.browser) return 'Unknown';
    const platform = fingerprint.value.browser.platform;
    const ua = fingerprint.value.browser.userAgent;

    const osMatch = ua.match(/(Windows NT|Mac OS X|Linux|Android|iOS) ?([0-9._]+)?/);
    if (osMatch) {
        const os = osMatch[1];
        const version = osMatch[2] ? ` ${osMatch[2].replace(/_/g, '.')}` : '';
        return `${os}${version}`;
    }

    return platform || 'Unknown';
});

onMounted(() => {
    if (process.client) {
        const handleInteraction = () => {
            document.body.setAttribute('data-user-interacted', 'true');
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('keydown', handleInteraction);
        };

        document.addEventListener('click', handleInteraction);
        document.addEventListener('keydown', handleInteraction);
    }
});

const copyFingerprint = async () => {
    if (fingerprint.value?.hash && !loading.value) {
        try {
            await navigator.clipboard.writeText(fingerprint.value.hash);
            isCopied.value = true;
            setTimeout(() => {
                isCopied.value = false;
            }, 2000); // Reset after 2 seconds
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    }
};

const regenerateFingerprint = async () => {
    if (loading.value) return;

    try {
        loading.value = true;
        isComplete.value = false;
        fingerprint.value = null;
        stabilityWarnings.value = [];
        entropyScore.value = 0;

        Object.keys(loadingStates.value).forEach(key => {
            loadingStates.value[key] = true;
        });

        const newFingerprint = await generateFingerprint();
        fingerprint.value = newFingerprint;
    } catch (error) {
        stabilityWarnings.value.push('Error regenerating fingerprint');
    } finally {
        loading.value = false;
        isComplete.value = true;
        Object.keys(loadingStates.value).forEach(key => {
            loadingStates.value[key] = false;
        });
    }
};

const createSectionCollectors = (fp) => [
    async () => {
        try {
            const browserData = {
                userAgent: navigator.userAgent,
                language: navigator.language,
                languages: navigator.languages,
                platform: navigator.platform,
                cookiesEnabled: navigator.cookieEnabled,
                doNotTrack: navigator.doNotTrack || null,
                vendor: navigator.vendor || 'Unknown',
                browserName: detectBrowserName(),
                browserVersion: detectBrowserVersion(),
                isPrivateMode: await detectPrivateMode(),
                plugins: Array.from(navigator.plugins)
                    .map(p => ({
                        name: p.name,
                        description: p.description,
                    }))
                    .filter(p => p.name || p.description),
            };
            fp.browser = browserData;
            fingerprint.value = { ...fingerprint.value, browser: browserData };
        } catch (error) {
            stabilityWarnings.value.push('Error collecting browser information');
        } finally {
            loadingStates.value.browser = false;
        }
    },

    async () => {
        try {
            const systemData = {
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                fonts: getFonts(),
                timezoneOffset: new Date().getTimezoneOffset(),
            };
            fp.system = systemData;
            fingerprint.value = { ...fingerprint.value, system: systemData };
        } catch (error) {
            stabilityWarnings.value.push('Error collecting system information');
        } finally {
            loadingStates.value.system = false;
        }
    },

    async () => {
        try {
            const screenData = {
                width: window.screen.width,
                height: window.screen.height,
                colorDepth: window.screen.colorDepth,
                pixelRatio: window.devicePixelRatio,
                orientation: screen.orientation?.type || 'unknown',
            };
            fp.screen = screenData;
            fingerprint.value = { ...fingerprint.value, screen: screenData };
        } catch (error) {
            stabilityWarnings.value.push('Error collecting screen information');
        } finally {
            loadingStates.value.screen = false;
        }
    },

    async () => {
        try {
            const [canvas, audio] = await Promise.all([
                generateCanvasFingerprint(),
                getAudioFingerprint().catch(() => null)
            ]);
            const mediaData = {
                canvasFingerprint: canvas,
                audioFingerprint: audio
            };
            fp.media = mediaData;
            fingerprint.value = { ...fingerprint.value, media: mediaData };
        } catch (error) {
            stabilityWarnings.value.push('Error collecting media information');
        } finally {
            loadingStates.value.media = false;
        }
    },

    async () => {
        try {
            const webglData = getWebGLFingerprint();
            fp.webgl = webglData;
            fingerprint.value = { ...fingerprint.value, webgl: webglData };
        } catch (error) {
            stabilityWarnings.value.push('Error collecting WebGL information');
        } finally {
            loadingStates.value.webgl = false;
        }
    },

    async () => {
        try {
            const hardwareData = getHardwareInfo();
            fp.hardware = hardwareData;
            fingerprint.value = { ...fingerprint.value, hardware: hardwareData };
        } catch (error) {
            stabilityWarnings.value.push('Error collecting hardware information');
        } finally {
            loadingStates.value.hardware = false;
        }
    }
];
</script>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-4px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fadeIn {
    animation: fadeIn 0.2s ease-out;
}
</style>
