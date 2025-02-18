export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    stockQuantity: number;
    description: string;
    status: 
      | "AVAILABLE"
      | "OUT_OF_STOCK";
    createdBy: string;
    createdAt: string;
    updatedBy: string | null;
    updatedAt: string;
    deletedAt: string | null;
  }
  