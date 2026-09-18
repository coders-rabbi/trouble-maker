"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { IProduct } from "@/types/products";
import { createProduct } from "@/services/products";
import RichTextEditor from "@/components/ui/ReachTextEditor";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Uploads a single file directly to the backend and returns the hosted URL.
// Kept inline (same pattern as the working web-about-info page) so there's
// no import/alias resolution involved.
const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/upload/upload_file`, {
    method: "POST",
    body: formData,
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Upload failed");
  }

  return result.data.url as string;
};

// Form input shape — mirrors IProduct but without server-generated fields
type ProductFormInputs = Omit<IProduct, "_id"> & {
  sizeInput?: string; // temp field for comma-separated size entry
  colorInput?: string; // temp field for comma-separated color entry
  tagsInput?: string; // temp field for comma-separated tags entry
};

const inputClasses =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-black";

const labelClasses = "mb-1.5 block text-sm font-medium text-gray-700";

const errorClasses = "mt-1 text-xs text-red-600";

const sectionClasses = "rounded-xl border border-gray-200 bg-white p-5 sm:p-6";

const sectionTitleClasses = "mb-4 text-base font-semibold text-gray-900";

type GalleryItem = {
  id: string;
  previewUrl: string;
  uploadedUrl: string | null;
  uploading: boolean;
  error: boolean;
};

const PRODUCT_CATEGORIES = ["oversized", "dropshoulder", "racing", "graphic-tees", "t-shirt", "jerseys", "accesseries", "sale"] as const;

const ProductForm = () => {
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [mainImageUploading, setMainImageUploading] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryImageInputRef = useRef<HTMLInputElement>(null);

  const MAX_GALLERY_IMAGES = 4;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormInputs>({
    defaultValues: {
      pricingInventory: {
        stockStatus: "In Stock",
      },
    },
  });

  const mainImageUrl = watch("media.mainImage");

  const handleMainImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setMainImagePreview(previewUrl);
    setMainImageUploading(true);
    e.target.value = "";

    try {
      const uploadedUrl = await uploadFile(file);
      setValue("media.mainImage", uploadedUrl, { shouldValidate: true });
      setValue("media.thumbnailImage", uploadedUrl);
    } catch (error: any) {
      setMainImagePreview(null);
      Swal.fire({
        icon: "error",
        title: "দুঃখিত!",
        text: error?.message || "Main image upload failed.",
      });
    } finally {
      setMainImageUploading(false);
    }
  };

  const handleGalleryImagesChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const remainingSlots = MAX_GALLERY_IMAGES - galleryItems.length;
    const selectedFiles = files.slice(0, remainingSlots);
    e.target.value = "";

    const newItems: GalleryItem[] = selectedFiles.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      previewUrl: URL.createObjectURL(file),
      uploadedUrl: null,
      uploading: true,
      error: false,
    }));

    setGalleryItems((prev) => [...prev, ...newItems]);

    await Promise.all(
      selectedFiles.map(async (file, index) => {
        const item = newItems[index];
        try {
          const uploadedUrl = await uploadFile(file);
          setGalleryItems((prev) => {
            const updated = prev.map((g) =>
              g.id === item.id ? { ...g, uploadedUrl, uploading: false } : g,
            );
            setValue(
              "media.galleryImages",
              updated
                .filter((g) => g.uploadedUrl)
                .map((g) => g.uploadedUrl as string),
              { shouldValidate: true },
            );
            return updated;
          });
        } catch {
          setGalleryItems((prev) =>
            prev.map((g) =>
              g.id === item.id ? { ...g, uploading: false, error: true } : g,
            ),
          );
        }
      }),
    );
  };

  const handleRemoveGalleryImage = (id: string) => {
    setGalleryItems((prev) => {
      const updated = prev.filter((g) => g.id !== id);
      setValue(
        "media.galleryImages",
        updated
          .filter((g) => g.uploadedUrl)
          .map((g) => g.uploadedUrl as string),
        { shouldValidate: true },
      );
      return updated;
    });
  };

  const onSubmit: SubmitHandler<ProductFormInputs> = async (data) => {
    if (mainImageUploading || galleryItems.some((g) => g.uploading)) {
      Swal.fire({
        icon: "info",
        title: "অপেক্ষা করুন",
        text: "Images are still uploading. Please wait.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload: Omit<IProduct, "_id"> = {
        ...data,
        variation: {
          ...data.variation,
          size:
            typeof data.sizeInput === "string"
              ? data.sizeInput
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : data.variation.size,
          color:
            typeof data.colorInput === "string"
              ? data.colorInput
                  .split(",")
                  .map((c) => c.trim())
                  .filter(Boolean)
              : data.variation.color,
        },
        organization: {
          ...data.organization,
          searchTags:
            typeof data.tagsInput === "string"
              ? data.tagsInput
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
              : data.organization.searchTags,
        },
      };

      await createProduct(payload);

      await Swal.fire({
        icon: "success",
        title: "Product created",
        timer: 1400,
        showConfirmButton: false,
      });

      // form + local state reset
      reset({
        pricingInventory: {
          stockStatus: "In Stock",
        },
      });
      setMainImagePreview(null);
      setGalleryItems([]);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "দুঃখিত!",
        text: error?.message || "Failed to create product.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* BASIC INFO */}
      <section className={sectionClasses}>
        <h2 className={sectionTitleClasses}>Basic Information</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClasses}>Product ID / SKU</label>
            <input
              {...register("id", { required: "Product ID is required" })}
              placeholder="SHR260003"
              className={inputClasses}
            />
            {errors.id && <p className={errorClasses}>{errors.id.message}</p>}
          </div>

          <div>
            <label className={labelClasses}>Product Name</label>
            <input
              {...register("basicInfo.productName", {
                required: "Product name is required",
              })}
              placeholder="Shadow Camo Black Cargo Pants"
              className={inputClasses}
            />
            {errors.basicInfo?.productName && (
              <p className={errorClasses}>
                {errors.basicInfo.productName.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className={labelClasses}>Short Description</label>
            <input
              {...register("basicInfo.shortDescription", {
                required: "Short description is required",
              })}
              placeholder="One-line summary shown on listing cards"
              className={inputClasses}
            />
            {errors.basicInfo?.shortDescription && (
              <p className={errorClasses}>
                {errors.basicInfo.shortDescription.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <RichTextEditor
              label="Long Description"
              value={watch("basicInfo.longDescription") || ""}
              onChange={(val: string) =>
                setValue("basicInfo.longDescription", val, {
                  shouldValidate: true,
                })
              }
              placeholder="Write your description..."
            />

            {/* hidden input যাতে react-hook-form validation ধরতে পারে */}
            <input
              type="hidden"
              {...register("basicInfo.longDescription", {
                required: "Long description is required",
              })}
            />

            {errors.basicInfo?.longDescription && (
              <p className={errorClasses}>
                {errors.basicInfo.longDescription.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* PRICING & INVENTORY */}
      <section className={sectionClasses}>
        <h2 className={sectionTitleClasses}>Pricing & Inventory</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelClasses}>Price (৳)</label>
            <input
              type="number"
              step="0.01"
              {...register("pricingInventory.price", {
                required: "Price is required",
                valueAsNumber: true,
                min: { value: 0, message: "Price cannot be negative" },
              })}
              placeholder="1450"
              className={inputClasses}
            />
            {errors.pricingInventory?.price && (
              <p className={errorClasses}>
                {errors.pricingInventory.price.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClasses}>Discount Price (৳)</label>
            <input
              type="number"
              step="0.01"
              {...register("pricingInventory.discountPrice", {
                valueAsNumber: true,
              })}
              placeholder="999"
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>Discount %</label>
            <input
              type="number"
              {...register("pricingInventory.discountPercentage", {
                valueAsNumber: true,
              })}
              placeholder="31"
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>SKU</label>
            <input
              {...register("pricingInventory.sku", {
                required: "SKU is required",
              })}
              placeholder="SHR260003"
              className={inputClasses}
            />
            {errors.pricingInventory?.sku && (
              <p className={errorClasses}>
                {errors.pricingInventory.sku.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClasses}>Stock Quantity</label>
            <input
              type="number"
              {...register("pricingInventory.stockKeepingUnit", {
                required: "Stock quantity is required",
                valueAsNumber: true,
                min: { value: 0, message: "Stock cannot be negative" },
              })}
              placeholder="60"
              className={inputClasses}
            />
            {errors.pricingInventory?.stockKeepingUnit && (
              <p className={errorClasses}>
                {errors.pricingInventory.stockKeepingUnit.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClasses}>Stock Status</label>
            <select
              {...register("pricingInventory.stockStatus")}
              className={inputClasses}
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Low Stock">Low Stock</option>
            </select>
          </div>
        </div>
      </section>

      {/* VARIATION */}
      <section className={sectionClasses}>
        <h2 className={sectionTitleClasses}>Variation</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelClasses}>Sizes (comma separated)</label>
            <input
              {...register("sizeInput")}
              placeholder="S, M, L, XL, XXL"
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>Colors (comma separated)</label>
            <input
              {...register("colorInput", {
                required: "At least one color is required",
              })}
              placeholder="Black, Olive, Sand"
              className={inputClasses}
            />
            {errors.colorInput && (
              <p className={errorClasses}>{errors.colorInput.message}</p>
            )}
          </div>

          <div>
            <label className={labelClasses}>Material</label>
            <input
              {...register("variation.material", {
                required: "Material is required",
              })}
              placeholder="Ripstop Cotton Blend"
              className={inputClasses}
            />
            {errors.variation?.material && (
              <p className={errorClasses}>
                {errors.variation.material.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* MEDIA */}
      <section className={sectionClasses}>
        <h2 className={sectionTitleClasses}>Media</h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className={labelClasses}>Main Image</label>

            <input
              ref={mainImageInputRef}
              type="file"
              accept="image/*"
              onChange={handleMainImageChange}
              className="hidden"
            />

            {mainImagePreview ? (
              <button
                type="button"
                onClick={() => mainImageInputRef.current?.click()}
                className="group relative h-40 w-40 overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
              >
                <Image
                  src={mainImagePreview}
                  alt="Main image preview"
                  fill
                  className="object-cover"
                />
                {mainImageUploading ? (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-medium text-white">
                    Uploading...
                  </span>
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-xs font-medium text-white opacity-0 transition-opacity group-hover:bg-black/40 group-hover:opacity-100">
                    Change
                  </span>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => mainImageInputRef.current?.click()}
                className="flex h-40 w-40 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 bg-gray-50 text-xs text-gray-400 transition-colors hover:border-black hover:text-black"
              >
                <span className="text-2xl leading-none">+</span>
                <span>Upload image</span>
              </button>
            )}
          </div>

          <div>
            <label className={labelClasses}>
              Gallery Images{" "}
              <span className="font-normal text-gray-400">
                ({galleryItems.length}/{MAX_GALLERY_IMAGES})
              </span>
            </label>

            <input
              ref={galleryImageInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryImagesChange}
              className="hidden"
            />

            <div className="flex flex-wrap gap-3">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                >
                  <Image
                    src={item.previewUrl}
                    alt="Gallery preview"
                    fill
                    className="object-cover"
                  />
                  {item.uploading && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-[10px] font-medium text-white">
                      Uploading...
                    </span>
                  )}
                  {item.error && (
                    <span className="absolute inset-0 flex items-center justify-center bg-red-600/70 text-[10px] font-medium text-white">
                      Failed
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(item.id)}
                    aria-label="Remove image"
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-xs leading-none text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}

              {galleryItems.length < MAX_GALLERY_IMAGES && (
                <button
                  type="button"
                  onClick={() => galleryImageInputRef.current?.click()}
                  className="flex h-20 w-20 flex-col items-center justify-center gap-0.5 rounded-lg border border-dashed border-gray-300 bg-gray-50 text-[10px] text-gray-400 transition-colors hover:border-black hover:text-black"
                >
                  <span className="text-lg leading-none">+</span>
                  <span>Add More</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ORGANIZATION */}
      <section className={sectionClasses}>
        <h2 className={sectionTitleClasses}>Organization</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelClasses}>Category</label>
            <select
              {...register("organization.category", {
                required: "Category is required",
              })}
              defaultValue=""
              className={inputClasses}
            >
              <option value="" disabled>
                Select a category
              </option>
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.organization?.category && (
              <p className={errorClasses}>
                {errors.organization.category.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClasses}>Brand</label>
            <input
              {...register("organization.brand", {
                required: "Brand is required",
              })}
              placeholder="Flame"
              className={inputClasses}
            />
            {errors.organization?.brand && (
              <p className={errorClasses}>
                {errors.organization.brand.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClasses}>
              Search Tags (comma separated)
            </label>
            <input
              {...register("tagsInput")}
              placeholder="cargo, pants, streetwear"
              className={inputClasses}
            />
          </div>
        </div>
      </section>

      {/* ADVANCE INFO */}
      <section className={sectionClasses}>
        <h2 className={sectionTitleClasses}>Additional Details</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelClasses}>Weight</label>
            <input
              {...register("advanceInfo.weight")}
              placeholder="480g"
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>Dimensions</label>
            <input
              {...register("advanceInfo.dimensions")}
              placeholder="38x28x3 cm"
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>Warranty / Return Policy</label>
            <input
              {...register("advanceInfo.warrantyReturnPolicy")}
              placeholder="7 Days Easy Return"
              className={inputClasses}
            />
          </div>
        </div>
      </section>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3">
        <button
          type="reset"
          className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:border-black hover:text-black"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={
            submitting ||
            mainImageUploading ||
            galleryItems.some((g) => g.uploading)
          }
          className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
