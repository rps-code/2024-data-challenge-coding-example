export interface Country {
    code: string
    articleCount: number
}

export interface CountryDetail {
    product: string
    date: string // In the JSON it's a string but I'd personally put this as Date
    headline: string
}
