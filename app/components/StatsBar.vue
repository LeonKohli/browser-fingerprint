<template>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <!-- Entropy Score Card -->
        <div
            class="relative overflow-hidden transition-all duration-200 bg-white shadow-sm dark:bg-gray-800 rounded-xl hover:shadow-md group">
            <div class="p-6">
                <div class="flex items-center gap-3 mb-3">
                    <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <Icon name="mdi:chart-bar" class="w-5 h-5 text-blue-500" />
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div class="text-sm font-medium text-gray-500 dark:text-gray-400 cursor-help">
                                    Entropy Score
                                </div>
                            </TooltipTrigger>
                            <TooltipContent class="max-w-xs">
                                <p class="text-sm">
                                    Browser fingerprinting calculates how unique your browser appears among others. The entropy score (measured in bits) indicates this uniqueness. A score of 0 means your browser appears identical to others, while higher scores mean greater uniqueness. However, this score is just an estimate based on limited data.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
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
            class="relative overflow-hidden transition-all duration-200 bg-white shadow-sm dark:bg-gray-800 rounded-xl hover:shadow-md group">
            <div class="p-6">
                <div class="flex items-center gap-3 mb-3">
                    <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                        <Icon name="mdi:web" class="w-5 h-5 text-purple-500" />
                    </div>
                    <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Browser
                    </div>
                </div>
                <div class="space-y-1">
                    <div class="text-2xl font-semibold tracking-tight truncate dark:text-white">
                        {{ browserInfo }}
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ fingerprint?.browser?.vendor || 'Unknown vendor' }}
                    </p>
                </div>
            </div>
            <div
                class="absolute inset-x-0 bottom-0 h-1 transition-colors bg-purple-500/20 group-hover:bg-purple-500/30">
            </div>
        </div>

        <!-- Platform Card -->
        <div
            class="relative overflow-hidden transition-all duration-200 bg-white shadow-sm dark:bg-gray-800 rounded-xl hover:shadow-md group">
            <div class="p-6">
                <div class="flex items-center gap-3 mb-3">
                    <div
                        class="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                        <Icon name="mdi:laptop" class="w-5 h-5 text-emerald-500" />
                    </div>
                    <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Platform
                    </div>
                </div>
                <div class="space-y-1">
                    <div class="text-2xl font-semibold tracking-tight truncate dark:text-white">
                        {{ platformInfo }}
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ fingerprint?.browser?.platform || 'Unknown platform' }}
                    </p>
                </div>
            </div>
            <div
                class="absolute inset-x-0 bottom-0 h-1 transition-colors bg-emerald-500/20 group-hover:bg-emerald-500/30">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Fingerprint {
    browser?: {
        vendor?: string;
        platform?: string;
    };
}

interface Props {
    fingerprint: Fingerprint | null;
    entropyScore: number;
    isComplete: boolean;
    browserInfo: string;
    platformInfo: string;
}

const props = defineProps<Props>();

const uniquenessMessage = computed(() => {
    const score = props.entropyScore;
    if (score >= 20) {
        return 'Your fingerprint appears highly unique, which might make tracking easier.';
    } else if (score >= 15) {
        return 'Your fingerprint shows notable uniqueness among sampled users.';
    } else if (score >= 10) {
        return 'Your fingerprint has moderate distinctiveness.';
    } else if (score >= 5) {
        return 'Your fingerprint shares characteristics with many other users.';
    } else {
        return 'Your fingerprint appears similar to many other users, which may help blend in.';
    }
});
</script>