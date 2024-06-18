<template>
    <div class="p-6 bg-slate-800 text-gray-300 rounded-lg">
        <h2 class="text-white text-2xl font-semibold mb-8">Data Visualisation (Point 4 & 5)</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-slate-700 p-4 rounded-lg shadow">
                <h3 class="text-lg font-semibold text-white mb-2">Articles by Country</h3>
                <apexchart width="100%" type="pie" :options="pieChartOptions" :series="pieChartData"></apexchart>
            </div>

            <div class="bg-slate-700 p-4 rounded-lg shadow">
                <h3 class="text-lg font-semibold text-white mb-2">Articles by Date</h3>
                <apexchart width="100%" type="line" :options="lineChartOptions" :series="lineChartData"></apexchart>
            </div>

            <div class="bg-slate-700 p-4 rounded-lg shadow col-span-2">
                <h3 class="text-lg font-semibold text-white mb-2">Articles by Product</h3>
                <apexchart width="100%" type="bar" :options="barChartOptions" :series="barChartData"></apexchart>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { Data } from '@/types/apiData'

    const props = defineProps<{
        data: Data[]
    }>()

    // By using aggregatedData we are only looping through the data prop once
    const dataByCountry = computed(() => aggregatedData.value.country)
    const dataByDate = computed(() => aggregatedData.value.date)
    const dataByProduct = computed(() => aggregatedData.value.product)

    const aggregatedData = computed(() => {
        const countryCounts: Record<string, number> = {}
        const dateCounts: Record<string, number> = {}
        const productCounts: Record<string, number> = {}

        props.data.forEach(item => {
            countryCounts[item.countrycode] = (countryCounts[item.countrycode] || 0) + 1

            const date = item.date.split(' ')[0]
            dateCounts[date] = (dateCounts[date] || 0) + 1

            productCounts[item.product] = (productCounts[item.product] || 0) + 1
        })

        return {
            country: Object.entries(countryCounts).map(([country, count]) => ({ country, count })),
            date: Object.entries(dateCounts).map(([date, count]) => ({ date, count })),
            product: Object.entries(productCounts).map(([product, count]) => ({ product, count }))
        }
    })

    // Just Apex Charts settings and options
    const pieChartData = ref(dataByCountry.value.map(item => item.count))
    const pieChartOptions = ref({
        labels: dataByCountry.value.map(item => item.country),
        chart: {
            toolbar: {
                show: false
            }
        },
        colors: ['#1e293b', '#2a3547', '#364053', '#424c5f', '#4e576b', '#5a6377'],
        stroke: {
            show: false
        },
        legend: {
            show: false
        }
    })

    const lineChartData = ref([
        {
            name: 'Articles',
            data: dataByDate.value.map(item => item.count)
        }
    ])
    const lineChartOptions = ref({
        chart: {
            type: 'line',
            toolbar: {
                show: false
            }
        },
        xaxis: {
            categories: dataByDate.value.map(item => item.date),
            labels: {
                style: {
                    colors: '#fff'
                }
            }
        },
        colors: ['#6366F1'],
        tooltip: {
            theme: 'dark'
        },
        legend: {
            show: false
        }
    })

    const barChartData = ref([
        {
            name: 'Articles',
            data: dataByProduct.value.map(item => item.count)
        }
    ])
    const barChartOptions = ref({
        chart: {
            type: 'bar',
            toolbar: {
                show: false
            }
        },
        xaxis: {
            categories: dataByProduct.value.map(item => item.product),
            labels: {
                style: {
                    colors: '#fff'
                }
            }
        },
        colors: ['#6366F1'],
        tooltip: {
            theme: 'dark'
        },
        legend: {
            show: false
        }
    })
</script>
