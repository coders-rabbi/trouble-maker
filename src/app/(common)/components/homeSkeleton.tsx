"use client";

/* ---------- reusable bits ---------- */

const shimmer = "animate-pulse bg-gray-200";

const Block = ({ className = "" }: { className?: string }) => (
  <div className={`${shimmer} rounded-md ${className}`} />
);

const Circle = ({ className = "" }: { className?: string }) => (
  <div className={`${shimmer} rounded-full ${className}`} />
);

/* ---------- product card skeleton ---------- */

const ProductCardSkeleton = () => (
  <div className="w-full">
    <Block className="aspect-[3/4] w-full" />
    <div className="mt-3 flex items-center justify-between gap-2">
      <Block className="h-4 w-2/3" />
      <Block className="h-4 w-10" />
    </div>
  </div>
);

/* ---------- review card skeleton ---------- */

const ReviewCardSkeleton = () => (
  <div className="rounded-2xl border border-gray-100 p-5">
    <Circle className="h-11 w-11" />
    <Block className="mt-3 h-4 w-24" />
    <div className="mt-3 space-y-2">
      <Block className="h-3 w-full" />
      <Block className="h-3 w-full" />
      <Block className="h-3 w-3/4" />
    </div>
    <Block className="mt-4 h-4 w-28" />
    <Block className="mt-1.5 h-3 w-20" />
  </div>
);

/* ---------- section heading skeleton ---------- */

const SectionHeading = ({ withLink = false }: { withLink?: boolean }) => (
  <div className="mb-6 flex items-end justify-between">
    <div>
      <Block className="mb-2 h-3 w-24" />
      <Block className="h-7 w-52" />
    </div>
    {withLink && <Block className="h-4 w-32" />}
  </div>
);

/* ---------- page skeleton ---------- */

const HomeSkeleton = () => {
  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative h-[520px] w-full overflow-hidden bg-gray-200 sm:h-[600px]">
        <div className={`absolute inset-0 ${shimmer} rounded-none`} />

        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-5 px-4">
          <Block className="h-10 w-72 bg-gray-300 sm:h-14 sm:w-[420px]" />
          <Block className="h-4 w-64 bg-gray-300 sm:w-96" />
          <Block className="h-11 w-40 rounded-full bg-gray-300" />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        {/* RIDER APPROVED / REVIEWS */}
        <section className="mb-16">
          <SectionHeading withLink />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ReviewCardSkeleton key={i} />
            ))}
          </div>
        </section>

        {/* TRENDING NOW */}
        <section className="mb-16">
          <Block className="mb-2 h-3 w-24" />
          <SectionHeading />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </section>

        {/* BEST SELLING */}
        <section>
          <Block className="mb-2 h-3 w-24" />
          <SectionHeading />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="mt-10 w-full bg-black py-14">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4">
          <div className="flex items-center gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Circle key={i} className="h-9 w-9 bg-gray-700" />
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Block key={i} className="h-3 w-16 bg-gray-700" />
            ))}
          </div>

          <Block className="h-3 w-48 bg-gray-700" />
        </div>
      </footer>
    </div>
  );
};

export default HomeSkeleton;