import HeroSection from '../components/sections/HeroSection';
import InfoSection from '../components/sections/InfoSection';
import TopicsGrid from '../components/sections/TopicsGrid';
import FairUseSection from '../components/sections/FairUseSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <InfoSection />
      <TopicsGrid />
      <FairUseSection />
    </main>
  );
}
