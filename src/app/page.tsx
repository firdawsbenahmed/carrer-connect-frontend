import NavBar from "../../components/NavBar";
import Definition from "../../components/Definition";
import Stats from "../../components/Stats";
import Features from "../../components/Features";
import Process from "../../components/Process";
import Testimonials from "../../components/Testimonials";
import Starter from "../../components/Starter";
import Footer from "../../components/Footer";
export default function Home() {
  return (
    <div className='flex flex-col items-center scroll-smooth'>
      <NavBar />
      <Definition />
      <Stats />
      <Features />
      <Process />
      <Testimonials />
      <Starter />
      <Footer />
    </div>
  );
}
