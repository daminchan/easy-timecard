import { FC } from "react";
import Image from "next/image";

type Props = {
  /** メインタイトル */
  title: string;
  /** サブタイトル */
  subtitle: string;
};

export const Hero: FC<Props> = ({ title, subtitle }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white py-32 sm:py-40">
      <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
          <div className="mx-auto max-w-2xl lg:col-span-7 lg:mx-0 lg:pt-4">
            <h1 className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-7xl">
              {title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">{subtitle}</p>
          </div>
          <div className="relative mt-16 sm:mt-24 lg:col-span-5 lg:mt-0">
            <Image
              src="/hero-illustration.svg"
              alt="タイムカード管理のイメージ"
              width={500}
              height={500}
              className="relative mx-auto w-full max-w-lg drop-shadow-xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
