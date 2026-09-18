import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import ProductsTable from "./components/productTable";
import { getAllProducts } from "@/services/products";

const ProductsPage = async () => {
  const products = await getAllProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h6 className="text-lg font-bold">Products Page</h6>
        <Link href="/dashboard/products/new">
          <button className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/90 transition-colors">
            <FaPlus size={18} />
            Add Product
          </button>
        </Link>
      </div>
      <div>
        <ProductsTable products={products} />
      </div>
    </div>
  );
};

export default ProductsPage;
