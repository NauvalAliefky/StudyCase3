import { Product } from "./product";
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}
  
export type ProductListResponse = ApiResponse<Product[]>;
export type ProductDetailResponse = ApiResponse<Product>;