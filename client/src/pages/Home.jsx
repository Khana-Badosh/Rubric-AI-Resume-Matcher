import Hero from '../components/home/Hero';
import HowItWorks from '../components/home/HowItWorks';
import WhyChoose from '../components/home/WhyChoose';
import CallToAction from '../components/home/CallToAction';

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <HowItWorks />
      <WhyChoose />
      <CallToAction />
    </main>
  );
}
