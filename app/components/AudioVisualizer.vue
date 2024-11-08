<script setup lang="ts">

interface Props {
    data: number[]
}

const props = defineProps<Props>()

// Transform the audio data into the format expected by the chart
const chartData = computed(() => {
    return props.data.map((value, index) => ({
        timestamp: index,
        amplitude: value
    }))
})
</script>

<template>
    <div class="w-full h-[100px]">
        <LineChart :data="chartData" :categories="['amplitude']" index="timestamp" class="h-[100px]" :y-formatter="(tick, i) => {
            return typeof tick === 'number' ? tick.toFixed(2) : ''
        }" :show-tooltip="false" :show-grid-line="false" :show-legend="false" :show-x-axis="false"
            :show-y-axis="false" />
    </div>
</template>