export interface Product {
    id: number,
    thumbnail: string,
    name: string,
    slug:string,
    price: number,
    discount_percentage?: number
}

export interface ProductSectionProps {
    title: string,
    products: Product[],
    isLoading?: boolean,
    error?: any
}

