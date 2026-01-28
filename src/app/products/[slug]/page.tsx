"use client";
import { useProductDetail } from "@/hooks/api/useCSProducts";
import { useParams } from "next/navigation";
import { useEffect,useRef,useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug;
  const { data, isLoading, isError } = useProductDetail(slug as string);
  const product = data?.data;
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // const images = product?.images.map((img) => img.url) || []; 

  const media = [
    ...(product?.images?.map((img) => ({ type: "image", url: img.url })) || []),
    ...(product?.videos?.map((vid) => ({ type: "video", url: vid.url })) || []),
  ];

  const startAutoSlide = () => {
    if (!media.length) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % media.length);
    }, 3000);
  };

  useEffect(() => {
    if (!media.length) return;

    startAutoSlide();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [media.length]);

  return (
    <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      <section className="flex flex-col gap-2 bg-amber-500">
        <div className="border rounded-xl overflow-hidden relative h-[400px]">
          <AnimatePresence mode="wait">
            {media[index]?.type === "image" ? (
              <motion.img
                key={media[index].url}
                src={media[index].url}
                alt={product?.name}
                className="w-full h-full object-contain absolute inset-0"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              />
            ) : (
              <motion.video
                key={media[index].url}
                src={media[index].url}
                className="w-full h-full object-contain absolute inset-0"
                autoPlay
                muted
                loop
                playsInline
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-2">
          {media.map((item, i) => (
            <div
              key={i}
              className={`w-20 h-20 rounded border cursor-pointer overflow-hidden flex items-center justify-center ${
                i === index ? "border-red-500" : "border-gray-300"
              }`}
              onMouseEnter={() => {
                setIndex(i);
                startAutoSlide();
              }}
            >
              {item.type === "image" ? (
                <img src={item.url} className="w-full h-full object-cover" />
              ) : (
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  muted
                />
              )}
            </div>
          ))}
        </div>  
      </section>
      <section>
        <h1 className="text-xl mb-4">{product?.name}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
          {product?.category?.name} <span>|</span>{" "}
          {product?.inStock ? product.inStock : "Hết hàng"}
        </div>
        <div>
          {product?.promotion ? (
            <div>Giá tiền có khuyến mãi:</div>
          ) : (
            <div className="bg-red-50 p-4 rounded-lg mb-4">
              <span className="text-3xl text-red-600">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product?.salePrice || 0)}
              </span>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
