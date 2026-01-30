import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import Solutions from "../components/home/Solutions";

export default function Home() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  useEffect(() => {
    if (!status) return;

    if (status == 1) {
      toast.success("Parking booked successfully!");
    }

    if (status == 0) {
      toast.error("Parking booking failed! Please try again.");
    }
  }, [status]);

  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Solutions />
      <Footer />
    </>
  );
}
