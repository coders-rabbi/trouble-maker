import ProductForm from "../components/ProductForm";

export default function CreateProductPage() {
  return (
    <div className="mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill in the details below to list a new product.
        </p>
      </div>

      <ProductForm />
    </div>
  );
}
