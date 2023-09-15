import React from "react";
import Modal from "react-modal";
import Image from "next/image";
import { getRandomImage } from "~/utils/helper";
import { ProductModalType } from "~/types/allTypes";

function ProductModal({
  isModalShown,
  setIsModalShown,
  currentItem,
}: ProductModalType) {
  // toggle modal function
  const closeModal = () => {
    setIsModalShown(false);
  };

  return (
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
        <div className="relative h-12 w-12 items-center justify-center align-middle">
          <Image
            src={getRandomImage(currentItem.images)}
            alt="hello"
            loading="lazy"
            sizes="10vw"
            fill
          />
        </div>
        <div className="relative flex-auto p-3">
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
  );
}

export default ProductModal;
