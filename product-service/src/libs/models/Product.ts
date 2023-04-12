export interface ProductInterface {
    description: string,
    id: string,
    price: number,
    title: string
};

export type Product = ProductInterface;

export type AvaliableProduct = ProductInterface & {
    count?: number
};

export type ProductsList = Array<AvaliableProduct>;