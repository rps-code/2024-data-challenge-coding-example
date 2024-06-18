<template>
    <div class="relative overflow-x-auto block p-6 rounded-lg w-full shadow bg-slate-800 mb-8">
        <h2 class="text-white text-2xl font-semibold mb-4 pl-2">Countries (Point 1 & 2)</h2>
        <table class="w-full text-sm text-left text-gray-300">
            <thead class="text-xs uppercase border-b border-gray-600 text-gray-300">
                <tr>
                    <th class="pl-3 py-5" width="80%">Country</th>
                    <th>Code</th>
                    <th>Article Count</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="country in paginatedCountries"
                    :key="country.code"
                    @click="countryClicked(country)"
                    class="hover:bg-gray-600 h-20 cursor-pointer"
                >
                    <td>
                        <div class="flex items-center h-full pl-3">
                            <img v-if="imageErrors[country.code]" :src="`https://placehold.co/60x40?text=${country.code}`" />
                            <img v-else :src="`https://flagsapi.com/${country.code}/flat/64.png`" @error="handleImageError(country.code)" />
                            <th class="font-medium text-white ml-5">{{ getCountryName(country.code) }}</th>
                        </div>
                    </td>
                    <td>{{ country.code }}</td>
                    <td>{{ country.articleCount }}</td>
                </tr>
            </tbody>
        </table>

        <Pagination :currentPage="currentPage" :totalItems="allCountries.length" :pageSize="pageSize" @update:currentPage="updatePage" />

        <div
            :class="{ hidden: !selectedCountry, flex: selectedCountry }"
            tabindex="-1"
            class="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black bg-opacity-50"
            @click.self="clearSelection"
        >
            <div
                class="relative p-4 w-full max-w-[calc(100vw-20rem)] max-h-[calc(100vh-6rem)] bg-white rounded-lg shadow dark:bg-gray-700"
                @click.stop
            >
                <h3 class="text-white text-xl font-semibold mb-4">
                    {{ selectedCountry?.code }} | {{ getCountryName(selectedCountry?.code || '') }} ({{ selectedCountry?.articleCount }}
                    Articles)
                </h3>

                <div class="max-h-[calc(100vh-15rem)] custom-scrollbar overflow-y-auto">
                    <table class="w-full text-sm text-left text-gray-300">
                        <thead class="text-xs uppercase border-b border-gray-600 text-gray-300">
                            <tr>
                                <th class="pl-3 py-5">Product</th>
                                <th>Headline</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="detail in countryDetails" :key="detail.date" class="h-10 border-b border-gray-600">
                                <td class="font-medium text-white ml-5 pl-3">{{ detail.product }}</td>
                                <td width="60%">{{ detail.headline }}</td>
                                <td>{{ detail.date }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { Data, Country, CountryDetail } from '@/types/types'
    import { getCountryName } from '@/helpers/useCountry'
    import { ref, computed } from 'vue'
    import Pagination from '@/components/core/Pagination.vue'

    const props = defineProps<{
        data: Data[]
    }>()

    const imageErrors = ref<{ [key: string]: boolean }>({})
    const currentPage = ref(1)
    const pageSize = ref(8)
    const selectedCountry = ref<Country | null>(null)
    const countryDetails = ref<CountryDetail[]>([])

    const allCountries = computed<Country[]>(() => {
        const counts: { [key: string]: number } = {}

        props.data.forEach((item: Data) => {
            counts[item.countrycode] = (counts[item.countrycode] || 0) + 1
        })

        return Object.entries(counts).map(([code, articleCount]) => ({
            code,
            articleCount
        }))
    })

    const paginatedCountries = computed(() => {
        const start = (currentPage.value - 1) * pageSize.value
        const end = start + pageSize.value
        return allCountries.value.slice(start, end)
    })

    const handleImageError = (countryCode: string) => {
        imageErrors.value[countryCode] = true
    }

    const countryClicked = (country: Country) => {
        selectedCountry.value = country
        countryDetails.value = props.data.filter((item: Data) => item.countrycode === country.code)
    }

    const clearSelection = () => {
        selectedCountry.value = null
        countryDetails.value = []
    }

    const updatePage = (page: number) => {
        currentPage.value = page
    }
</script>
