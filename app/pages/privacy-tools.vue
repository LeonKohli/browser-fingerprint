<template>
    <main class="min-h-screen p-4 transition-colors duration-200 sm:p-8 dark:bg-gray-900 bg-gray-50">
        <div class="max-w-4xl mx-auto space-y-8">
            <!-- Header -->
            <div class="space-y-6 text-center">
                <div class="relative inline-block">
                    <div class="flex items-center justify-center w-16 h-16 transition-all duration-200 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
                        <Icon :name="content?.icon || 'mdi:shield-lock'" class="w-8 h-8 text-blue-500 dark:text-blue-400" />
                    </div>
                </div>

                <div class="space-y-2">
                    <h1 class="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        {{ content?.title }}
                    </h1>
                    <p class="max-w-2xl mx-auto text-sm text-gray-600 dark:text-gray-400">
                        {{ content?.description }}
                    </p>
                </div>
            </div>

            <!-- Warning Alert -->
            <Alert v-if="content?.warning" class="max-w-2xl mx-auto">
                <template #default>
                    <div class="flex gap-3">
                        <Icon name="mdi:alert-circle" class="w-5 h-5 text-amber-500" />
                        <div class="space-y-1">
                            <p class="font-medium">{{ content.warning.title }}</p>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {{ content.warning.description }}
                            </p>
                        </div>
                    </div>
                </template>
            </Alert>

            <!-- Tools Grid -->
            <div class="grid gap-6 sm:grid-cols-2">
                <template v-for="category in content?.categories" :key="category.title">
                    <div class="space-y-4">
                        <h2 class="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                            {{ category.title }}
                        </h2>
                        <div class="space-y-4">
                            <div v-for="tool in category.tools" :key="tool.name"
                                class="relative overflow-hidden transition-all duration-200 bg-white shadow-sm dark:bg-gray-800 rounded-xl hover:shadow-md group"
                            >
                                <div class="p-6">
                                    <div class="flex items-center gap-3 mb-3">
                                        <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                            <Icon :name="tool.icon" class="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <div class="text-sm font-medium text-gray-900 dark:text-white">
                                                {{ tool.name }}
                                            </div>
                                            <Badge 
                                                v-if="tool.recommended" 
                                                variant="default" 
                                                class="text-xs font-medium text-green-800 bg-green-100 dark:bg-green-900/30 dark:text-green-300"
                                            >
                                                Recommended
                                            </Badge>
                                        </div>
                                    </div>
                                    <p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
                                        {{ tool.description }}
                                    </p>
                                    <div class="flex flex-wrap items-center gap-3">
                                        <NuxtLink 
                                            v-if="tool.link"
                                            :to="tool.link"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                                        >
                                            Website
                                            <Icon name="mdi:arrow-right" class="w-4 h-4" />
                                        </NuxtLink>
                                        <NuxtLink 
                                            v-if="tool.chromeLink"
                                            :to="tool.chromeLink"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/30 dark:text-gray-300 dark:hover:bg-gray-700/50"
                                        >
                                            <Icon name="mdi:google-chrome" class="w-4 h-4" />
                                            Chrome
                                        </NuxtLink>
                                        <NuxtLink 
                                            v-if="tool.firefoxLink"
                                            :to="tool.firefoxLink"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/30 dark:text-gray-300 dark:hover:bg-gray-700/50"
                                        >
                                            <Icon name="mdi:firefox" class="w-4 h-4" />
                                            Firefox
                                        </NuxtLink>
                                    </div>
                                </div>
                                <div class="absolute inset-x-0 bottom-0 h-1 transition-colors bg-blue-500/20 group-hover:bg-blue-500/30"></div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>

            <!-- Best Practices Section -->
            <div v-if="content?.bestPractices" class="overflow-hidden bg-white shadow-sm dark:bg-gray-800 rounded-xl">
                <div class="p-6">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                            <Icon name="mdi:lightbulb" class="w-5 h-5 text-blue-500" />
                        </div>
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                            {{ content.bestPractices.title }}
                        </h3>
                    </div>
                    <p class="mb-6 text-sm text-gray-600 dark:text-gray-400">
                        {{ content.bestPractices.description }}
                    </p>
                    <div class="grid gap-6 sm:grid-cols-2">
                        <div v-for="(column, index) in content.bestPractices.columns" 
                            :key="index" 
                            class="space-y-3"
                        >
                            <div v-for="item in column.items" 
                                :key="item.text" 
                                class="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400"
                            >
                                <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                {{ item.text }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Back Button -->
            <div class="flex justify-center">
                <NuxtLink 
                    to="/"
                    class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                    <Icon name="mdi:arrow-left" class="w-4 h-4" />
                    Back to Fingerprint Check
                </NuxtLink>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
// Fetch content data
const { data: content } = await useAsyncData('privacy-tools', () => queryContent('privacy-tools').findOne())

// SEO metadata
useSeoMeta({
    title: content.value?.title ? `${content.value.title} - Browser Fingerprinting` : 'Privacy Tools',
    description: content.value?.description || 'Enhance your online privacy and reduce your digital fingerprint.',
    keywords: 'privacy tools, browser privacy, digital privacy, online security, privacy extensions',
    robots: 'index, follow',
    author: 'Browser Fingerprint Team',
    ogTitle: content.value?.title || 'Privacy Tools - Browser Fingerprinting',
    ogDescription: content.value?.description || 'Enhance your online privacy and reduce your digital fingerprint.',
    ogType: 'website',
    twitterCard: 'summary_large_image',
})
</script>