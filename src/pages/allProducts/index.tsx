import { useState, type ReactElement, useCallback } from "react";
import Image from "next/image";

import { type NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";
import Layout from "~/layouts/productDetailLayout";
import { type DemoProduct } from "~/server/api/routers/demoController";
import ProductModal from "~/components/ProductModal";

const Index: NextPageWithLayout = () => {
  const [isModalShown, setIsModalShown] = useState(false);
  const [currentItem, setCurrentItem] = useState<DemoProduct | null>(null);

  const {
    data: allProducts,
    isLoading: isProductLoading,
    error: productError,
  } = api.demo.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const openModal = (productItem: DemoProduct) => {
    setCurrentItem(productItem);
    setIsModalShown(true);
  };

  const getRandomImage = useCallback((images: string[]): string => {
    const imagesLength = images.length;
    const randomImagePosition = Math.floor(Math.random() * imagesLength);

    return images.at(randomImagePosition)!;
  }, []);

  if (allProducts?.total && !isProductLoading) {
    return (
      <>
        {allProducts.products.map((product) => (
          <div
            key={product.id}
            className="flex w-screen items-center justify-between gap-2 px-1 py-2 align-middle "
            onClick={(e) => {
              e.preventDefault();
              {
                product ? openModal(product) : null;
              }
              setIsModalShown(!isModalShown);
            }}
          >
            <div className="relative h-12 w-12 items-center justify-center align-middle">
              <Image
                src={getRandomImage(product.images)}
                alt="hello"
                loading="lazy"
                sizes="10vw"
                fill
              />
            </div>
            <div>
              <h1 className="pb-2 text-left font-bold text-slate-50">
                {product.title}
              </h1>
              <p className="text-right font-thin text-slate-200">{`$${product.price}`}</p>
            </div>
          </div>
        ))}

        {currentItem ? (
          <ProductModal
            currentItem={currentItem}
            setIsModalShown={setIsModalShown}
            isModalShown={isModalShown}
          />
        ) : null}
      </>
    );
  }

  if (!!productError) <h1>`Error occurred, please try again later`</h1>;

  return null;
};

Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Index;
