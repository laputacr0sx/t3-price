import { useState, type ReactElement } from "react";
import Image from "next/image";

import { type NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";
import Layout from "~/layouts/productDetailLayout";
import { type DemoProduct } from "~/server/api/routers/demoController";
import Modal from "react-modal";

const Index: NextPageWithLayout = () => {
  const [isModalShown, setIsModalShown] = useState(false);
  const [currentItem, setCurrentItem] = useState<DemoProduct | null>(null);

  // const router = useRouter();
  // const productId = router.query.productId as string;

  const {
    data: allProducts,
    isLoading: isProductLoading,
    error: productError,
  } = api.demo.getAll.useQuery(undefined, { refetchOnWindowFocus: false });

  const openModal = (productItem: DemoProduct) => {
    setCurrentItem(productItem);
    setIsModalShown(true);
  };

  const closeModal = () => {
    setIsModalShown(false);
  };

  if (allProducts?.total && !isProductLoading) {
    return (
      <>
        <div>
          {allProducts.products.map((product) => (
            <div
              key={product.id}
              className="flex w-screen items-center justify-between gap-2 px-1 py-2 align-middle"
              onClick={(e) => {
                e.preventDefault();
                product && openModal(product);
                setIsModalShown(!isModalShown);
              }}
            >
              <div className="flex h-12 w-12  items-center justify-center align-middle">
                <Image
                  src="https://image.dummyjson.com/128x128"
                  alt="hello"
                  loading="lazy"
                  width={48}
                  height={48}
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
        </div>
        <div>
          <Modal
            onRequestClose={closeModal}
            isOpen={isModalShown}
            ariaHideApp={false}
          >
            <h1 className="text-3xl font-semibold">{currentItem?.title}</h1>
            <button className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-black opacity-5 outline-none focus:outline-none">
              <span className="block h-6 w-6 bg-transparent text-2xl text-black opacity-5 outline-none focus:outline-none">
                ×
              </span>
            </button>
            <div className="relative flex-auto p-6">
              <p className="my-2 text-xs leading-relaxed text-slate-500">
                {currentItem?.description}
              </p>
            </div>
            <div className="flex items-center justify-end rounded-b border-t border-solid border-slate-200 p-6">
              <button
                className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                type="button"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </Modal>
        </div>
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
