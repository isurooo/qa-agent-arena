"use client"
import HeroSection from '@/components/HeroSection';
import Button from '@/components/Button';

export default function Home() {
  return (
    <div className="flex flex-col flex-grow">
      <HeroSection />

      <div id="get-started" className="flex-grow flex flex-col items-center justify-center py-12 px-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-2xl w-full flex flex-col items-center">
          <div className="text-center mb-8 text-[var(--muted-foreground)]">
            <h2 className="text-2xl font-semibold mb-2 text-white">Welcome to the Arena</h2>
            <p>Select an action below to get started</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button text="Primary Action" onClick={() => alert('Primary Action Clicked')} type="primary" />
            <Button text="Secondary Action" onClick={() => alert('Secondary Action Clicked')} type="secondary" />
          </div>
        </div>
      </div>
    </div>
  );
}
