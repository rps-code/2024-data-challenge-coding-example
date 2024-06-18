<template>
    <div class="flex justify-between items-center py-4">
        <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-4 py-2 bg-gray-600 text-gray-300 rounded hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            Previous
        </button>
        <span class="text-gray-300">
            Page <b class="text-white">{{ currentPage }}</b> of <b class="text-white">{{ totalPages }}</b>
        </span>
        <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 bg-gray-600 text-gray-300 rounded hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            Next
        </button>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue'

    const props = defineProps<{
        currentPage: number
        totalItems: number
        pageSize: number
    }>()

    // Sends an emit of the current page the user is on
    const emits = defineEmits(['update:currentPage'])

    const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize))

    const nextPage = () => {
        if (props.currentPage < totalPages.value) emits('update:currentPage', props.currentPage + 1)
    }

    const prevPage = () => {
        if (props.currentPage > 1) emits('update:currentPage', props.currentPage - 1)
    }
</script>
