"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { IProduct } from "@/types/products";
// import { deleteProduct } from "@/services/products";

interface ProductsTableProps {
  products: IProduct[];
}

const inputClasses =
  "w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-black";

const StatusBadge = ({ inStock }: { inStock: boolean }) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
      inStock
        ? "border-green-200 bg-green-50 text-green-700"
        : "border-red-200 bg-red-50 text-red-700"
    }`}
  >
    {inStock ? "In Stock" : "Out of Stock"}
  </span>
);

const ProductsTable = ({ products }: ProductsTableProps) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [localProducts, setLocalProducts] = useState<IProduct[]>(products);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return localProducts;
    return localProducts.filter(
      (p) =>
        p.name?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query) ||
        p._id?.toLowerCase().includes(query),
    );
  }, [localProducts, search]);

  const handleDelete = async (product: IProduct) => {
    const result = await Swal.fire({
      icon: "warning",
      title: `Delete "${product.name}"?`,
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(product._id as string);
    //   await deleteProduct(product._id as string);
      setLocalProducts((prev) => prev.filter((p) => p._id !== product._id));
      Swal.fire({
        icon: "success",
        title: "Product deleted",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "দুঃখিত!",
        text: error?.message || "Failed to delete product.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* SEARCH */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-xs">
          <FaMagnifyingGlass
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={13}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or category..."
            className={inputClasses}
          />
        </div>
        <p className="shrink-0 text-sm text-gray-400">
          {filteredProducts.length} product
          {filteredProducts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Sizes</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-gray-400"
                  >
                    No products found.
                  </td>
                </tr>
              )}

              {filteredProducts.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-gray-100 transition-colors last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gray-100">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                      <p className="font-semibold">{product.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {product.category || "—"}
                  </td>
                  <td className="px-4 py-3 font-bold">৳{product.price ?? 0}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {product.sizes?.length ? product.sizes.join(", ") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge inStock={(product.stock ?? 0) > 0} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/products/${product._id}/edit`)
                        }
                        aria-label="Edit product"
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition-colors hover:border-black hover:text-black"
                      >
                        <FaEdit size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        disabled={deletingId === product._id}
                        aria-label="Delete product"
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition-colors hover:border-red-500 hover:text-red-500 disabled:opacity-50"
                      >
                        <FaTrash size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsTable;
