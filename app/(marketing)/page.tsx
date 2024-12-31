import { type FC } from "react";
import Hero from "@/components/marketing/Hero/Hero";
import Features from "@/components/marketing/Features/Features";
import CTAButton from "@/components/marketing/CTAButton/CTAButton";

const MarketingPage: FC = () => {
  return (
    <main className="relative min-h-screen bg-white">
      <Hero
        title="簡単な勤怠管理を、すべての企業に"
        subtitle="タブレット1台で始められるタイムカードアプリ"
      />
      <Features />
      <CTAButton text="登録企業様ログイン" href="/sign-in" />
    </main>
  );
};

export default MarketingPage;
