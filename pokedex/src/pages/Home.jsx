import HeroSection from '../components/sections/HeroSection';
import InfoSection from '../components/sections/InfoSection';
import FairUseSection from '../components/sections/FairUseSection';
import TopicsGrid from '../components/sections/TopicsGrid';
import WrappersSection from '../components/sections/WrappersSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <InfoSection />
      <TopicsGrid />
      <FairUseSection />
      <WrappersSection />
    </main>
  );
}
