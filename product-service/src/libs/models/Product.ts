export interface ProductInterface {
    description: String,
    id: String,
    price: number,
    title: String
};

export type Product = ProductInterface;

export type AvaliableProduct = ProductInterface & {
    count?: number
};

export type ProductsList = Array<AvaliableProduct>;