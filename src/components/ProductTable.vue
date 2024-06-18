<template>
    <div class="relative overflow-x-auto block p-6 rounded-lg w-full mb-8 shadow bg-slate-800">
        <h2 class="text-white text-2xl font-semibold mb-4 pl-2">Products (Point 3)</h2>
        <table class="w-full text-sm text-left text-gray-300">
            <thead class="text-xs uppercase border-b border-gray-600 text-gray-300">
                <tr>
                    <th class="pl-3 py-5" width="80%">Product</th>
                    <th>Number of Articles</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in paginatedProducts" :key="product.name" class="border-b border-gray-600 h-12">
                    <td>
                        <th class="font-medium text-white pl-3">{{ product.name }}</th>
                    </td>
                    <td>{{ product.articleCount }}</td>
                </tr>
            </tbody>
        </table>
        <Pagination :currentPage="currentPage" :totalItems="allProducts.length" :pageSize="pageSize" @update:currentPage="updatePage" />
    </div>
</template>

<script setup lang="ts">
    import type { Data } from '@/types/apiData'
    import { ref, computed } from 'vue'
    import Pagination from '@/components/core/Pagination.vue'

    const props = defineProps<{
        data: Data[]
    }>()

    const currentPage = ref(1)
    const pageSize = ref(12)

    const allProducts = computed(() => {
        const counts: { [key: string]: number } = {}
        props.data.forEach(item => {
            counts[item.product] = (counts[item.product] || 0) + 1
        })

        return Object.entries(counts).map(([name, articleCount]) => ({
            name,
            articleCount
        }))
    })

    const paginatedProducts = computed(() => {
        const start = (currentPage.value - 1) * pageSize.value
        const end = start + pageSize.value
        return allProducts.value.slice(start, end)
    })

    const updatePage = (page: number) => {
        currentPage.value = page
    }
</script>
