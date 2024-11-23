import { ClientOnly } from '../../.nuxt/components';
<template>
    <ClientOnly>
        <noscript>
            <div class="p-4 text-center text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400">
                JavaScript is required to use this website. Please enable JavaScript in your browser settings.
            </div>
        </noscript>
    </ClientOnly>
    <main class="min-h-screen p-4 transition-colors duration-200 sm:p-8 dark:bg-gray-900 bg-gray-50">
        <div class="max-w-4xl mx-auto space-y-8">
            <StatsBar 
                :fingerprint="fingerprint" 
                :entropy-score="entropyScore" 
                :is-complete="isComplete"
                aria-label="Fingerprint Statistics" 
            />

            <!-- Header with Fingerprint -->
            <div class="space-y-6 text-center">
                <div class="relative inline-block">
                    <FingerprintIcon :size="64" :scanning="loading" :variant="isComplete ? 'success' : 'default'"
                        :pulse="!isComplete && loading" />
                    <button @click="regenerateFingerprint" :disabled="loading"
                        v-umami="'Regenerate Fingerprint'"
                        class="absolute flex items-center justify-center w-8 h-8 transition-all duration-200 bg-white border border-gray-200 rounded-full shadow-lg -bottom-2 -right-2 dark:bg-gray-800 hover:shadow-xl dark:border-gray-700 group disabled:opacity-50 disabled:cursor-not-allowed"
                        :class="{ 'animate-spin': loading }">
                        <Icon name="mdi:refresh"
                            class="w-4 h-4 text-gray-600 transition-colors dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400"
                            :class="{ 'opacity-50': loading }" />
                        <span class="sr-only">Regenerate fingerprint</span>
                    </button>
                </div>

                <div class="space-y-2">
                    <div class="flex justify-center">
                        <a
                            href="https://github.com/LeonKohli/browser-fingerprint"
                            target="_blank"
                            rel="noopener noreferrer"
                            v-umami="'GitHub Link Click'"
                            class="flex items-center gap-2 text-sm text-gray-500 transition-colors duration-200 group dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                        >
                            <div class="flex items-center gap-1.5">
                                <Icon name="mdi:github" class="w-4 h-4" />
                                <span class="font-medium">Open Source Project</span>
                            </div>
                            <span class="text-xs text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400">
                                •
                            </span>
                            <span class="text-xs">
                                Star us on GitHub
                                <Icon 
                                    name="mdi:arrow-top-right" 
                                    class="inline-block w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
                                />
                            </span>
                        </a>
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <h1 class="text-4xl font-bold tracking-tight dark:text-white cursor-help">
                                    Browser Fingerprint
                                </h1>
                            </TooltipTrigger>
                            <TooltipContent class="max-w-xs">
                                <p class="text-sm">
                                    A browser fingerprint is a collection of unique browser and device characteristics that can be used to identify and track users across the internet, even without cookies.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <div class="flex flex-col items-center space-y-4">
                        <p class="max-w-2xl text-lg text-gray-600 dark:text-gray-400">
                            Your unique browser fingerprint hash:
                        </p>
                    </div>
                </div>
            </div>

            <div class="relative max-w-2xl mx-auto">
                <div v-if="fingerprint?.hash"
                    class="p-4 font-mono text-sm text-center text-green-400 break-all bg-gray-800 rounded-lg shadow-lg dark:bg-gray-950 group">
                    {{ fingerprint.hash }}
                    <div
                        class="absolute inset-0 flex items-center justify-center transition-opacity rounded-lg opacity-0 bg-black/50 group-hover:opacity-100">
                        <button @click="handleCopyFingerprint" :disabled="loading"
                            v-umami="'Copy Fingerprint'"
                            class="flex items-center gap-2 px-4 py-2 text-gray-900 transition-all transform bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:text-white hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                            <Icon :name="isCopied ? 'mdi:check' : 'mdi:clipboard-outline'"
                                class="w-4 h-4 transition-all"
                                :class="{ 'text-green-500': isCopied, 'animate-spin': loading }" />
                            <span class="font-medium">
                                {{ loading ? 'Scanning...' : (isCopied ? 'Copied!' : 'Copy Fingerprint') }}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Section Grid -->
            <div class="grid grid-cols-1 gap-6">
                <div v-for="section in sections" :key="section.id"
                    class="transition-all duration-200 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 rounded-xl hover:shadow-md dark:border-gray-700">
                    <div class="flex items-center justify-between px-6 py-5">
                        <button @click="expandedSections[section.id] = !expandedSections[section.id]"
                            class="flex items-center flex-1 gap-4 text-left transition-colors rounded-xl group">
                            <div class="flex items-center gap-4">
                                <div
                                    class="flex items-center justify-center w-12 h-12 transition-transform duration-200 rounded-xl bg-blue-50 dark:bg-blue-900/20 group-hover:scale-105">
                                    <Icon :name="section.icon"
                                        class="w-6 h-6 text-blue-500 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                                </div>
                                <div class="flex-1">
                                    <span class="font-semibold text-gray-900 dark:text-white">{{ section.title }}</span>
                                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                                        {{ getSectionDescription(section.id) }}
                                    </p>
                                </div>
                                <div v-if="loadingStates[section.id]"
                                    class="w-5 h-5 ml-4 border-2 border-blue-500 rounded-full border-t-transparent animate-spin">
                                </div>
                            </div>
                            <Icon :name="expandedSections[section.id] ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                                class="w-5 h-5 text-gray-400 transition-transform duration-200"
                                :class="{ 'rotate-180': expandedSections[section.id] }" />
                        </button>
                        
                        <!-- Add info button -->
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button 
                                        @click="openInfoModal(section.id)"
                                        class="p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                        v-umami="{ name: 'Info Button Click', sectionTitle: section.title }"
                                    >
                                        <Icon 
                                            name="mdi:information"
                                            class="w-5 h-5 text-gray-400 transition-colors hover:text-blue-500 dark:hover:text-blue-400"
                                        />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Learn more about {{ section.title.toLowerCase() }}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div v-if="expandedSections[section.id]"
                        class="px-6 pb-6 divide-y dark:divide-gray-700 animate-fadeIn">
                        <div v-if="loadingStates[section.id]" class="py-8 text-center text-gray-500 dark:text-gray-400">
                            <div class="flex flex-col items-center gap-3">
                                <div
                                    class="w-8 h-8 border-blue-500 rounded-full border-3 border-t-transparent animate-spin">
                                </div>
                                <p>Loading {{ section.title.toLowerCase() }}...</p>
                            </div>
                        </div>
                        <template v-else-if="fingerprint && fingerprint[section.id]">
                            <p v-if="sectionHasIssues(section.id)" class="mt-2 mb-4 text-sm text-yellow-600 dark:text-yellow-400">
                                Note: Some data in this section may be incomplete or unavailable due to browser restrictions or privacy settings.
                            </p>
                            <template v-for="(value, key) in fingerprint[section.id]" :key="key">
                                <div class="py-4 first:pt-4">
                                    <div class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
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
                                                    class="p-3 font-mono text-xs rounded-lg bg-gray-50 dark:bg-gray-900">
                                                    {{ value.substring(0, 64) }}...
                                                </div>
                                                <img :src="value" alt="Canvas Fingerprint"
                                                    class="border border-gray-200 dark:border-gray-700 rounded-lg max-w-[200px] shadow-sm" />
                                            </div>
                                        </template>
                                        <template v-else-if="key === 'audioFingerprint'">
                                            <div class="space-y-3">
                                                <div
                                                    class="p-3 font-mono text-xs rounded-lg bg-gray-50 dark:bg-gray-900">
                                                    {{ value?.hash || 'No audio fingerprint available' }}
                                                </div>
                                                <div class="relative p-4 overflow-hidden bg-white border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-800">
                                                    <AudioVisualizer :audio-data="value" />
                                                </div>
                                            </div>
                                        </template>
                                        <template v-else-if="typeof value === 'object'">
                                            <pre
                                                class="p-3 overflow-x-auto text-xs rounded-lg bg-gray-50 dark:bg-gray-900">{{ JSON.stringify(value, null, 2) }}</pre>
                                        </template>
                                        <template v-else>
                                            {{ value }}
                                        </template>
                                    </div>
                                </div>
                            </template>
                        </template>
                        <p v-if="sectionIssues[section.id]" class="text-yellow-600">
                            Note: Some data in this section may be incomplete or unavailable.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Navigation Links -->
            <div class="flex flex-wrap items-center justify-center gap-4">
                <NuxtLink 
                    to="/privacy-tools"
                    class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    v-umami="'Privacy Tools Link Click'"
                >
                    <Icon name="mdi:shield-lock" class="w-4 h-4" />
                    View Privacy Tools
                </NuxtLink>

                <NuxtLink 
                    to="/links"
                    class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    v-umami="'Links and Resources Link Click'"
                >
                    <Icon name="mdi:link-variant" class="w-4 h-4" />
                    Links and Resources
                </NuxtLink>

                <a 
                    href="https://www.buymeacoffee.com/LeonKohli"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-yellow-800 transition-colors bg-yellow-100 border border-yellow-200 rounded-lg shadow-sm hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-900/50 dark:hover:bg-yellow-900/50"
                    v-umami="'Buy Me a Coffee Click'"
                >
                    <Icon name="mdi:coffee" class="w-4 h-4" />
                    Buy Me a Coffee
                </a>
            </div>

            <!-- Privacy Information Alert -->
            <Alert class="max-w-2xl mx-auto">
                <template #default>
                    <div class="flex gap-3">
                        <Icon name="mdi:shield-alert" class="w-5 h-5 text-blue-500" />
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
    </main>

    <!-- Update the modal usage -->
    <FingerprintInfoModal
        :is-open="infoModalOpen"
        :section-id="currentSectionId"
        @update:open="handleModalClose"
    />
</template>

<script setup>
const {
    generateFingerprint,
    formatKey,
    copyFingerprint,
    getSectionDescription,
    calculateEntropy
} = useBrowserFingerprint();

const isCopied = ref(false);

const sections = [
    { id: 'browser', title: 'Browser Information', icon: 'mdi:web' },
    { id: 'system', title: 'System Information', icon: 'mdi:cpu-64-bit' },
    { id: 'screen', title: 'Screen Information', icon: 'mdi:monitor' },
    { id: 'media', title: 'Media Capabilities', icon: 'mdi:harddisk' },
    { id: 'webgl', title: 'WebGL Information', icon: 'mdi:video-3d' },
    { id: 'hardware', title: 'Hardware Information', icon: 'mdi:memory' }
];

const loading = ref(false);
const fingerprint = ref(null);
const expandedSections = ref({});
const isComplete = ref(false);
const entropyScore = ref(0);
const loadingStates = ref({
    browser: true,
    system: true,
    screen: true,
    media: true,
    webgl: true,
    hardware: true
});

const sectionIssues = ref({
    browser: false,
    system: false,
    screen: false,
    media: false,
    webgl: false,
    hardware: false
});

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

            const result = await Promise.race([
                generateFingerprint(),
                timeoutPromise
            ]);

            fingerprint.value = result.fingerprint;
            entropyScore.value = result.entropyScore;
            sectionIssues.value = result.sectionIssues || {};

        } catch (error) {
            console.error('Error initializing fingerprint:', error);
            Object.keys(sectionIssues.value).forEach(key => {
                sectionIssues.value[key] = true;
            });
        } finally {
            loading.value = false;
            isComplete.value = true;
            Object.keys(loadingStates.value).forEach(key => {
                loadingStates.value[key] = false;
            });
        }
    }
});

const sectionHasIssues = (sectionId) => {
    return sectionIssues.value[sectionId];
};
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

const handleCopyFingerprint = async () => {
    if (fingerprint.value?.hash && !loading.value) {
        await copyFingerprint(fingerprint.value.hash);
        isCopied.value = true;
        setTimeout(() => {
            isCopied.value = false;
        }, 2000);
    }
};

const regenerateFingerprint = async () => {
    if (loading.value) return;

    try {
        loading.value = true;
        isComplete.value = false;
        fingerprint.value = null;
        entropyScore.value = 0;

        Object.keys(loadingStates.value).forEach(key => {
            loadingStates.value[key] = true;
            sectionIssues.value[key] = false;
        });

        const result = await generateFingerprint();
        fingerprint.value = result.fingerprint;
        entropyScore.value = result.entropyScore;
        sectionIssues.value = result.sectionIssues || {};

    } catch (error) {
        console.error('Error regenerating fingerprint:', error);
        Object.keys(sectionIssues.value).forEach(key => {
            sectionIssues.value[key] = true;
        });
        entropyScore.value = 0;
    } finally {
        loading.value = false;
        isComplete.value = true;
        Object.keys(loadingStates.value).forEach(key => {
            loadingStates.value[key] = false;
        });
    }
};

watch(fingerprint, (newValue) => {
    try {
        if (newValue) {
            entropyScore.value = calculateEntropy(newValue);
        }
    } catch (error) {
        console.error('Error calculating entropy:', error);
        entropyScore.value = 0;
    }
}, { deep: true, immediate: true });

const colorMode = useColorMode();

const isDark = computed(() => colorMode.value === 'dark');

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};

const infoModalOpen = ref(false);
const currentSectionId = ref('');

const handleModalClose = (value) => {
  infoModalOpen.value = value;
  if (!value) {
    currentSectionId.value = '';
  }
};

const openInfoModal = (sectionId) => {
  currentSectionId.value = sectionId;
  infoModalOpen.value = true;
};
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
