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
                <h1 className="pb-2 text-left font-bold">{product.title}</h1>
                <p className="text-right font-thin">{`$${product.price}`}</p>
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
            <button
              onClick={closeModal}
              className="bg-amber-400 text-4xl font-bold hover:bg-slate-400 active:bg-slate-50"
            >
              Close
            </button>
            <h1>{currentItem?.title}</h1>
          </Modal>
        </div>
      </>
    );
  }

  if (!!productError) <h1>`Error occurred, please try again later`</h1>;

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
