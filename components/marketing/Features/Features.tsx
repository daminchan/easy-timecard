import { FC } from "react";
import Image from "next/image";
import { Clock, Users, Calculator } from "lucide-react";

const features = [
  {
    name: "シンプルな打刻",
    description:
      "タブレット1台で簡単に出退勤の記録が可能。従業員は名前を選んでタップするだけです。",
    icon: Clock,
    image: "/features/time-tracking.svg",
  },
  {
    name: "従業員管理",
    description:
      "従業員の登録・編集・削除が簡単に行えます。時給の設定や管理者権限の付与も可能です。",
    icon: Users,
    image: "/features/team-management.svg",
  },
  {
    name: "給与計算",
    description:
      "勤務時間と時給から自動で給与計算。休憩時間も自動で除外されるため、正確な計算が可能です。",
    icon: Calculator,
    image: "/features/calculation.svg",
  },
];

export const Features: FC = () => {
  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-500">
            主な機能
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            必要な機能を、シンプルに。
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            タイムカード管理に必要な機能を、使いやすく提供します。
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-12 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <div className="mb-8 flex h-[200px] items-center justify-center rounded-xl bg-primary-50/50 p-4">
                  <div className="relative h-[160px] w-[240px]">
                    <Image
                      src={feature.image}
                      alt={feature.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="relative flex flex-1 flex-col pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                      <feature.icon
                        className="h-6 w-6 text-primary-600"
                        aria-hidden="true"
                      />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 flex-1 text-base leading-7 text-gray-600">
                    {feature.description}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};

export default Features;
