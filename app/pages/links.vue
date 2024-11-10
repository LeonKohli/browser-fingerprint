<template>
    <main class="min-h-screen p-4 transition-colors duration-200 sm:p-8 dark:bg-gray-900 bg-gray-50">
        <div class="max-w-4xl mx-auto space-y-8">
            <!-- Header -->
            <div class="space-y-6 text-center">
                <div class="relative inline-block">
                    <div class="flex items-center justify-center w-16 h-16 transition-all duration-200 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl">
                        <Icon :name="content?.icon || 'mdi:link-variant'" class="w-8 h-8 text-blue-500 dark:text-blue-400" />
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

            <!-- Links Sections -->
            <div class="grid gap-6">
                <template v-for="section in content?.sections" :key="section.title">
                    <div class="space-y-4">
                        <h2 class="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                            {{ section.title }}
                        </h2>
                        
                        <!-- Scientific Articles Grid -->
                        <div v-if="section.type === 'papers'" class="space-y-4">
                            <div v-for="paper in section.links" :key="paper.title"
                                class="relative overflow-hidden transition-all duration-200 bg-white shadow-sm dark:bg-gray-800 rounded-xl hover:shadow-md group"
                            >
                                <div class="p-6">
                                    <div class="flex items-center gap-3 mb-3">
                                        <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                            <Icon name="mdi:file-document" class="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <div class="text-sm font-medium text-gray-900 dark:text-white">
                                                {{ paper.title }}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                        <p>{{ paper.authors }}</p>
                                        <p>{{ paper.conference }} - {{ paper.year }}</p>
                                    </div>
                                    <div class="mt-4">
                                        <NuxtLink 
                                            :to="paper.url"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                                        >
                                            View Paper
                                            <Icon name="mdi:arrow-right" class="w-4 h-4" />
                                        </NuxtLink>
                                    </div>
                                </div>
                                <div class="absolute inset-x-0 bottom-0 h-1 transition-colors bg-blue-500/20 group-hover:bg-blue-500/30"></div>
                            </div>
                        </div>

                        <!-- Regular Links Grid -->
                        <div v-else class="grid gap-4 sm:grid-cols-2">
                            <NuxtLink v-for="link in section.links" :key="link.title"
                                :to="link.url"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="relative overflow-hidden transition-all duration-200 bg-white shadow-sm dark:bg-gray-800 rounded-xl hover:shadow-md group"
                            >
                                <div class="p-6">
                                    <div class="flex items-center gap-3 mb-3">
                                        <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                            <Icon :name="link.icon || 'mdi:link-variant'" class="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div class="text-sm font-medium text-gray-900 dark:text-white">
                                            {{ link.title }}
                                        </div>
                                    </div>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">
                                        {{ link.description }}
                                    </p>
                                </div>
                                <div class="absolute inset-x-0 bottom-0 h-1 transition-colors bg-blue-500/20 group-hover:bg-blue-500/30"></div>
                            </NuxtLink>
                        </div>
                    </div>
                </template>
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
const { data: content } = await useAsyncData('links', () => queryContent('links').findOne())

// SEO metadata
useSeoMeta({
    title: content.value?.title ? `${content.value.title} - Browser Fingerprinting` : 'Resources & Links',
    description: content.value?.description || 'Comprehensive collection of resources about browser fingerprinting.',
    keywords: 'browser fingerprinting, research papers, technical resources, privacy articles',
    robots: 'index, follow',
    author: 'Browser Fingerprint Team',
    ogTitle: content.value?.title || 'Browser Fingerprinting Resources & Links',
    ogDescription: content.value?.description || 'Explore comprehensive resources about browser fingerprinting.',
    ogType: 'website',
    twitterCard: 'summary_large_image',
})
</script>