<template>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <!-- Entropy Score Card -->
        <div
            class="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group">
            <div class="p-6">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                        <Icon name="mdi:chart-bar" class="h-5 w-5 text-blue-500" />
                    </div>
                    <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Entropy Score
                    </div>
                </div>
                <div class="space-y-1">
                    <div class="flex items-baseline gap-1">
                        <span class="text-3xl font-semibold tracking-tight dark:text-white">
                            {{ entropyScore.toFixed(2) }}
                        </span>
                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">bits</span>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ uniquenessMessage }}
                    </p>
                </div>
            </div>
            <div class="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500/40 to-blue-500"
                :style="{ width: `${Math.min((entropyScore / 20) * 100, 100)}%` }"
                :class="{ 'transition-all duration-500': isComplete }">
            </div>
        </div>

        <!-- Browser Card -->
        <div
            class="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group">
            <div class="p-6">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                        <Icon name="mdi:web" class="h-5 w-5 text-purple-500" />
                    </div>
                    <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Browser
                    </div>
                </div>
                <div class="space-y-1">
                    <div class="text-2xl font-semibold tracking-tight dark:text-white truncate">
                        {{ browserInfo }}
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ fingerprint?.browser?.vendor || 'Unknown vendor' }}
                    </p>
                </div>
            </div>
            <div
                class="absolute bottom-0 inset-x-0 h-1 bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
            </div>
        </div>

        <!-- Platform Card -->
        <div
            class="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group">
            <div class="p-6">
                <div class="flex items-center gap-3 mb-3">
                    <div
                        class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                        <Icon name="mdi:laptop" class="h-5 w-5 text-emerald-500" />
                    </div>
                    <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Platform
                    </div>
                </div>
                <div class="space-y-1">
                    <div class="text-2xl font-semibold tracking-tight dark:text-white truncate">
                        {{ platformInfo }}
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ fingerprint?.browser?.platform || 'Unknown platform' }}
                    </p>
                </div>
            </div>
            <div
                class="absolute bottom-0 inset-x-0 h-1 bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-colors">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    fingerprint: any;
    entropyScore: number;
    isComplete: boolean;
    browserInfo: string;
    platformInfo: string;
}

const props = defineProps<Props>();

const uniquenessMessage = computed(() => {
    const score = props.entropyScore;
    if (score >= 20) {
        return 'Your fingerprint is extremely unique among internet users.';
    } else if (score >= 15) {
        return 'Your fingerprint is highly unique among internet users.';
    } else if (score >= 10) {
        return 'Your fingerprint is moderately unique.';
    } else if (score >= 5) {
        return 'Your fingerprint has some unique characteristics.';
    } else {
        return 'Your fingerprint shares common characteristics with many users.';
    }
});
</script>