import { type DemoProduct } from "~/server/api/routers/demoController";
import { getRandomImage } from "~/utils/helper";
import Image from "next/image";

type ProductPlainTextProps = {
  product: DemoProduct;
};

export default function ProductPlainText({ product }: ProductPlainTextProps) {
  console.log("product sent");

  const {
    id,
    title,
    description,
    price,
    // discountPercentage,
    // rating,
    // stock,
    brand,
    // category,
    // thumbnail,
    images,
  } = product;

  return (
    <div key={id} className="w-[90%] flex-col items-center justify-center py-5">
      <div className={"flex items-center justify-around "}>
        <h1 className="text-3xl">{title}</h1>
        <div className="relative h-12 w-12 items-center justify-center align-middle">
          <Image
            src={getRandomImage(images)}
            alt="product Image"
            loading="lazy"
            sizes="10vw"
            fill
          />
        </div>
      </div>
      <h2>Company: {brand}</h2>
      <p>Price: USD${price}</p>
      <p className="break-words text-xs font-thin">{description}</p>
    </div>
  );
}
