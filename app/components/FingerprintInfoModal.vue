<template>
  <Dialog :open="isOpen" @update:open="handleClose">
    <DialogContent class="dark:bg-gray-900 bg-gray-50 sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-3">
          <div class="flex items-center justify-center w-10 h-10 transition-transform duration-200 rounded-xl bg-blue-50 dark:bg-blue-900/20 group-hover:scale-105">
            <Icon :name="modalContent?.icon || 'mdi:information'" class="w-6 h-6 text-blue-500" />
          </div>
          <span class="font-semibold tracking-tight">{{ modalContent?.title }}</span>
        </DialogTitle>
        <DialogDescription class="text-gray-600 dark:text-gray-400">
          {{ modalContent?.description }}
        </DialogDescription>
      </DialogHeader>

      <ScrollArea class="max-h-[60vh] pr-4 -mr-4">
        <div v-if="modalContent?.sections" class="prose-sm prose dark:prose-invert max-w-[680px]">
          <!-- Iterate through sections -->
          <div v-for="section in modalContent.sections" :key="section.title" class="mb-8">
            <h2 class="flex items-center gap-3 mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              <Icon :name="section.icon" class="w-5 h-5 text-blue-500" />
              {{ section.title }}
            </h2>

            <!-- Regular content -->
            <p v-if="section.content" 
               class="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">
              {{ section.content }}
            </p>

            <!-- List items -->
            <ul v-if="section.items" class="mt-4 space-y-3">
              <li v-for="item in section.items" :key="item"
                class="flex items-start gap-3 text-base leading-relaxed text-gray-600 dark:text-gray-400"
              >
                <Icon name="mdi:check-circle" class="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
                <span v-html="renderMarkdownLinks(item)" class="flex-1" />
              </li>
            </ul>

            <!-- Resources -->
            <div v-if="section.resources" class="flex flex-wrap gap-3 mt-4">
              <a
                v-for="resource in section.resources"
                :key="resource.url"
                :href="resource.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-4 py-2 text-base text-gray-700 transition-all duration-200 bg-gray-100 border rounded-lg dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 group dark:text-gray-300"
              >
                <Icon :name="resource.icon || 'mdi:link'" class="w-5 h-5" />
                {{ resource.label }}
                <Icon
                  name="mdi:arrow-top-right"
                  class="w-4 h-4 transition-transform duration-200 text-gray-400 dark:text-gray-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>
          </div>
        </div>
      </ScrollArea>

      <DialogFooter class="gap-2 sm:gap-0">
        <Button
          variant="secondary"
          @click="handleClose"
          class="gap-2"
        >
          <Icon name="mdi:close" class="w-4 h-4" />
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  sectionId: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const handleClose = () => {
  emit('update:open', false)
}

const renderMarkdownLinks = (text: string) => {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 transition-colors duration-200 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">$1</a>')
}

// Fetch content data based on sectionId with refresh function
const { data: modalContent, refresh } = await useAsyncData(
  `fingerprint-${props.sectionId}`,
  () => queryContent(`fingerprinting/${props.sectionId}`).findOne()
)

// Watch for sectionId changes to refetch content
watch(() => props.sectionId, async () => {
  if (props.sectionId) {
    await refresh()
  }
})
</script>

<style scoped>
.prose pre {
  position: relative;
  padding: 1rem;
  overflow-x: auto;
  font-family: monospace;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  border-width: 1px;
  background-color: rgb(249 250 251);
}

.dark .prose pre {
  background-color: rgba(17, 24, 39, 0.5);
  border-color: rgb(31, 41, 55);
}

.prose h1 {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgb(17, 24, 39);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0;
  margin-bottom: 1rem;
}

.dark .prose h1 {
  color: rgb(243, 244, 246);
}

.prose h2 {
  font-size: 1.125rem;
  font-weight: 600;
  color: rgb(17, 24, 39);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.dark .prose h2 {
  color: rgb(243, 244, 246);
}

.prose p {
  font-size: 0.875rem;
  color: rgb(75, 85, 99);
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.dark .prose p {
  color: rgb(156, 163, 175);
}

.prose ul {
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.prose li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: rgb(75, 85, 99);
}

.dark .prose li {
  color: rgb(156, 163, 175);
}

.prose a {
  color: rgb(59, 130, 246);
  transition-property: color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.prose a:hover {
  color: rgb(37, 99, 235);
}

.dark .prose a {
  color: rgb(96, 165, 250);
}

.dark .prose a:hover {
  color: rgb(147, 197, 253);
}
</style>