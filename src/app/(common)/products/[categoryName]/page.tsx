import ProductsCard from "@/components/ui/productsCard";
import { getProductsByCategory } from "@/services/products";

type PageProps = {
  params: Promise<{ categoryName: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { categoryName } = await params;
  const allProducts = await getProductsByCategory(categoryName);

  return (
    <div className="m-5 font-semibold">
      <h2 className="text-lg uppercase">Our {categoryName} collection</h2>

      {allProducts && allProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mt-5">
          {allProducts.map((item) => (
            <ProductsCard key={item?._id} product={item} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[50vh] w-full flex-col items-center justify-center text-center">
          <span className="text-4xl">🕐</span>
          <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Coming Soon
          </p>
          <p className="mt-1 text-xs text-gray-400">
            New products are on the way. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
};

export default Page;
