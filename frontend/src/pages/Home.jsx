import { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import TrialModal from '../features/trial/components/TrialModal';
import useSiteData from '../features/home/hooks/useSiteData';
import HeroSection from '../features/home/sections/HeroSection';
import InfoBar from '../features/home/sections/InfoBar';
import AboutSection from '../features/home/sections/AboutSection';
import ValuesSection from '../features/home/sections/ValuesSection';
import ModalitiesSection from '../features/home/sections/ModalitiesSection';
import PlansSection from '../features/home/sections/PlansSection';
import ScheduleSection from '../features/home/sections/ScheduleSection';
import GallerySection from '../features/home/sections/GallerySection';
import LocationSection from '../features/home/sections/LocationSection';
import ContactSection from '../features/home/sections/ContactSection';
import FaqSection from '../features/home/sections/FaqSection';
import CtaSection from '../features/home/sections/CtaSection';
import PlanInterestModal from '../features/plans/components/PlanInterestModal';

export default function Home() {
  const { data, error, retry } = useSiteData();
  const [trialOpen, setTrialOpen] = useState(false);
  const [trialModality, setTrialModality] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const openTrial = (modality = '') => {
    setSelectedPlan(null);
    setTrialModality(typeof modality === 'string' ? modality : '');
    setTrialOpen(true);
  };
  const openPlan = (plan) => {
    setTrialOpen(false);
    setSelectedPlan(plan);
  };
  return (
    <>
      <a className="skip" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header onTrial={openTrial} whatsappUrl={data?.contact.whatsapp_url} />
      <main id="conteudo">
        <HeroSection onTrial={openTrial} />
        <InfoBar />
        <AboutSection />
        <ValuesSection />
        <ModalitiesSection data={data} error={error} onRetry={retry} onTrial={openTrial} />
        <PlansSection data={data} error={error} onPlanSelect={openPlan} />
        <ScheduleSection schedules={data?.schedules} error={error} onTrial={openTrial} />
        <GallerySection />
        <LocationSection />
        <ContactSection contact={data?.contact} />
        <FaqSection />
        <CtaSection onTrial={openTrial} />
      </main>
      <Footer contact={data?.contact} />
      {trialOpen && (
        <TrialModal
          modalities={data?.modalities || []}
          initialModality={trialModality}
          onClose={() => setTrialOpen(false)}
        />
      )}
      {selectedPlan && (
        <PlanInterestModal
          key={selectedPlan.id}
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </>
  );
}
