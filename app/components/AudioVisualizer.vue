<script setup lang="ts">
interface Props {
    audioData: { hash: number } | null
}

const props = defineProps<Props>()
const canvasRef = ref<HTMLCanvasElement | null>(null)

const generateVisualizationData = (audioData: { hash: number } | null): number[] => {
    if (!audioData || typeof audioData.hash !== 'number') {
        return new Array(50).fill(0);
    }
    
    const hashString = audioData.hash.toString();
    const data = [];
    for (let i = 0; i < 50; i++) {
        const value = (parseInt(hashString.slice(i % hashString.length, (i % hashString.length) + 1)) / 10) - 0.5;
        data.push(value);
    }
    return data;
}

const drawWaveform = () => {
    const canvas = canvasRef.value
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Get the actual pixel dimensions of the canvas
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set up styling
    ctx.strokeStyle = '#3b82f6' // blue-500
    ctx.lineWidth = 2 * window.devicePixelRatio
    ctx.lineCap = 'round'

    // Calculate dimensions
    const width = canvas.width
    const height = canvas.height
    const padding = 10 * window.devicePixelRatio
    const drawingWidth = width - (padding * 2)
    const drawingHeight = height - (padding * 2)
    const middle = height / 2

    // Generate and draw the waveform
    const data = generateVisualizationData(props.audioData)
    ctx.beginPath()
    ctx.moveTo(padding, middle)

    const step = drawingWidth / (data.length - 1)
    data.forEach((value, index) => {
        const x = padding + (index * step)
        const y = middle + (value * drawingHeight / 2)
        if (index === 0) {
            ctx.moveTo(x, y)
        } else {
            ctx.lineTo(x, y)
        }
    })

    ctx.stroke()

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)' 
    ctx.lineWidth = 1 * window.devicePixelRatio

    // Vertical grid lines
    for (let i = 0; i <= drawingWidth; i += drawingWidth / 10) {
        ctx.beginPath()
        ctx.moveTo(padding + i, padding)
        ctx.lineTo(padding + i, height - padding)
        ctx.stroke()
    }

    // Horizontal grid lines
    for (let i = 0; i <= drawingHeight; i += drawingHeight / 4) {
        ctx.beginPath()
        ctx.moveTo(padding, padding + i)
        ctx.lineTo(width - padding, padding + i)
        ctx.stroke()
    }
}

// Watch for audioData changes and redraw
watch(() => props.audioData, drawWaveform, { immediate: true })

// Handle resize events
onMounted(() => {
    const resizeObserver = new ResizeObserver(drawWaveform)
    if (canvasRef.value) {
        resizeObserver.observe(canvasRef.value)
    }

    onUnmounted(() => {
        resizeObserver.disconnect()
    })
})
</script>

<template>
    <div class="relative w-full h-[100px] bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        <canvas ref="canvasRef" class="absolute inset-0 w-full h-full"></canvas>
    </div>
</template>