import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import Button from '@/components/Button';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <div className="flex justify-center space-x-4 my-8">
        <Button text="Primary Action" onClick={() => alert('Primary Action Clicked')} type="primary" />
        <Button text="Secondary Action" onClick={() => alert('Secondary Action Clicked')} type="secondary" />
      </div>
      <Footer />
    </div>
  );
}
