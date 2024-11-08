<template>
    <div class="fingerprint-container" :class="{ 'animate-pulse': pulse }">
        <svg class="fingerprint-svg mx-auto" :width="size" :height="size" viewBox="0 0 34 34"
            xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(1.000000, 1.000000)" :class="[
                strokeColorClass,
                { 'animate-scan': scanning }
            ]">
                <circle cx="16" cy="16" r="16" fill="none" :stroke-width="strokeWidth" />
                <g transform="translate(7.000000, 6.000000)" stroke-linecap="round" fill="none"
                    :stroke-width="strokeWidth">
                    <path class="fingerprint-path"
                        d="M3.14414922,1.97419264 C3.14414922,1.97419264 5.30885997,0.506351808 9.06036082,0.506351808 C12.8118617,0.506351808 14.781903,1.97419264 14.781903,1.97419264" />
                    <path class="fingerprint-path"
                        d="M0.466210729,7.27628774 C0.466210729,7.27628774 3.19024811,2.75878123 9.09512428,2.96502806 C15.0000005,3.17127489 17.4745821,7.17202872 17.4745821,7.17202872" />
                    <path class="fingerprint-path"
                        d="M2,16.4687762 C2,16.4687762 1.12580828,14.9305411 1.27082278,11.9727304 C1.45871447,8.14036841 5.19587478,5.30175361 9.05270871,5.30175361 C12.9095426,5.30175361 15.0000001,7.82879552 15.8975926,9.33195218 C16.5919575,10.4947729 17.7597991,14.4361492 14.6226101,15.0206592 C12.41268,15.4324056 11.5911303,13.4911155 11.5911303,12.9859143 C11.5911303,11.9727302 11.1054172,10.2336826 9.05270848,10.2336826 C6.99999978,10.2336826 6.11384543,11.8665663 6.4593664,13.7955614 C6.6532895,14.8782069 7.59887942,18.3701197 12.0173963,19.5605638" />
                    <path class="fingerprint-path"
                        d="M7.0204614,19.6657197 C7.0204614,19.6657197 3.88328263,16.5690127 3.88328268,12.9603117 C3.88328274,9.35161068 6.59923746,7.80642537 9.0076008,7.80642554 C11.4159641,7.8064257 14.1798468,9.55747124 14.1798468,12.759562" />
                    <path class="fingerprint-path"
                        d="M8.95538742,12.6694189 C8.95538742,12.6694189 9.04883608,18.1288401 15.069217,17.3610597" />
                </g>
            </g>
        </svg>
    </div>
</template>

<script setup lang="ts">
interface Props {
    size?: number
    strokeWidth?: number
    scanning?: boolean
    pulse?: boolean
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
}

const props = withDefaults(defineProps<Props>(), {
    size: 64,
    strokeWidth: 1,
    scanning: false,
    pulse: false,
    variant: 'default'
})

const variantColors = {
    default: 'stroke-blue-500 dark:stroke-blue-400',
    primary: 'stroke-indigo-500 dark:stroke-indigo-400',
    success: 'stroke-green-500 dark:stroke-green-400',
    warning: 'stroke-yellow-500 dark:stroke-yellow-400',
    error: 'stroke-red-500 dark:stroke-red-400'
}

const strokeColorClass = computed(() => variantColors[props.variant])
</script>

<style scoped>
.fingerprint-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
}

.fingerprint-svg {
    transform-origin: center;
}

.fingerprint-path {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    opacity: 0;
    animation: drawPath 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.fingerprint-path:nth-child(1) {
    animation-delay: 0s;
}

.fingerprint-path:nth-child(2) {
    animation-delay: 0.4s;
}

.fingerprint-path:nth-child(3) {
    animation-delay: 0.8s;
}

.fingerprint-path:nth-child(4) {
    animation-delay: 1.2s;
}

.fingerprint-path:nth-child(5) {
    animation-delay: 1.6s;
}

@keyframes drawPath {
    0% {
        stroke-dashoffset: 100;
        opacity: 0;
    }

    20% {
        opacity: 1;
        stroke-dashoffset: 0;
    }

    40%,
    60% {
        stroke-dashoffset: 0;
        opacity: 1;
    }

    80% {
        opacity: 1;
        stroke-dashoffset: -100;
    }

    100% {
        stroke-dashoffset: -100;
        opacity: 0;
    }
}

.animate-scan {
    animation: scanEffect 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes scanEffect {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(1px);
    }
}
</style>