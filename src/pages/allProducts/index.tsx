import { useState, type ReactElement } from "react";
import { type NextPageWithLayout } from "~/pages/_app";

import Layout from "~/layouts/productDetailLayout";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Image from "next/image";

const Index: NextPageWithLayout = () => {
  const [isModalShown, setIsModalShown] = useState(false);

  const router = useRouter();
  const productId = router.query.productId as string;

  const { data: allProducts, isLoading: isProductLoading } =
    api.demo.getAll.useQuery();

  const priceTag = (price: number): string => {
    return `$${price}`;
  };

  if (allProducts?.total && !isProductLoading) {
    return allProducts.products.map((product) => (
      <>
        <div
          key={product.id}
          className="flex w-max py-2"
          onClick={(e) => {
            e.preventDefault();
            setIsModalShown(!isModalShown);
          }}
        >
          <div className="flex h-12 w-12 min-w-fit items-center justify-center align-middle">
            <Image
              src="https://image.dummyjson.com/128x128"
              alt="hello"
              loading="lazy"
              width={48}
              height={48}
            />
          </div>
          <div>
            <h1 className="pb-2 font-bold">{product.title}</h1>
            <p className="text-right font-thin">{priceTag(product.price)}</p>
          </div>
        </div>
        {isModalShown ? (
          <>
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
              <div className="relative mx-auto my-6 w-auto max-w-3xl">
                {/*content*/}
                <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between rounded-t border-b border-solid border-slate-200 p-5">
                    <h3 className="text-3xl font-semibold">{product.title}</h3>
                    <button
                      className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-black opacity-5 outline-none focus:outline-none"
                      onClick={() => setIsModalShown(false)}
                    >
                      <span className="block h-6 w-6 bg-transparent text-2xl text-black opacity-5 outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative flex-auto p-6">
                    <p className="my-4 text-lg leading-relaxed text-slate-500">
                      {product.description}
                    </p>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end rounded-b border-t border-solid border-slate-200 p-6">
                    <button
                      className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                      type="button"
                      onClick={() => setIsModalShown(false)}
                    >
                      Close
                    </button>
                    <button
                      className="mb-1 mr-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                      type="button"
                      onClick={() => setIsModalShown(false)}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
          </>
        ) : null}
      </>
    ));
  }

  return (
    <>
      <p className="">loading product page ......</p>
    </>
  );
};

Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Index;
