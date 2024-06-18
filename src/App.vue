<template>
    <main class="w-full h-full">
        <div v-if="error">
            <!-- Minimal error handling given being an example project, would be more description on a full-scale application -->
            <div class="flex flex-col items-center justify-center text-center">
                <h1 class="text-4xl font-bold text-red-500 mb-4">ERROR</h1>
                <p class="text-lg text-white mb-8">{{ error }}</p>
            </div>
        </div>
        <div v-else-if="loading">
            <!-- Simple little loading state -->
            <div class="flex space-x-2 justify-center items-center">
                <span class="sr-only">Loading...</span>
                <div class="h-8 w-8 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div class="h-8 w-8 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div class="h-8 w-8 bg-indigo-500 rounded-full animate-bounce"></div>
            </div>
            <p class="text-gray-300 text-xl mt-8 text-center">Fetching data...</p>
        </div>
        <div v-else="data">
            <!-- Load components and pass the data... if given more time would explore the options of splitting the data up and passing minimal data to the components -->
            <CountryTable :data="data" />
            <ProductTable :data="data" />
            <Charts :data="data" />
        </div>
    </main>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { Data } from '@/types/apiData'
    import CountryTable from '@/components/CountryTable.vue'
    import ProductTable from '@/components/ProductTable.vue'
    import Charts from '@/components/Charts.vue'
    import axios from 'axios'

    const data = ref<Data | null>(null)
    const loading = ref(true)
    const error = ref<string | null>(null)

    // Async call on app mount for the data
    onMounted(async () => {
        try {
            const response = await axios.get<Data>('https://www.fancensus.com/test/dataset1.json')
            data.value = response.data
        } catch (err) {
            error.value = `Failed to fetch data from the API: ${err}`
        } finally {
            loading.value = false
        }
    })
</script>
