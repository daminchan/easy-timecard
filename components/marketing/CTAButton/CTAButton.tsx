import { FC } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type Props = {
  /** ボタンのテキスト */
  text: string;
  /** リンク先のURL */
  href: string;
};

export const CTAButton: FC<Props> = ({ text, href }) => {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary-50/50">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <Link
            href={href}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary-600 px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:bg-primary-500 hover:shadow-primary-200/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            {text}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CTAButton;
