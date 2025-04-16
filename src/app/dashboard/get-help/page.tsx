'use client';

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ContactForm from "@/components/ContactForm"; // ✅ Adjust this import if needed

// Animation variant
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

const therapists = [
  {
    name: "Dr. Aisha Mehra",
    qualification: "Ph.D. Clinical Psychology, 10+ yrs experience",
    image: "/defaultt.jpg",
  },
  {
    name: "Rohan Gupta",
    qualification: "M.Sc. Counseling Psychologist, CBT Expert",
    image: "/defaultt.jpg",
  },
  {
    name: "Dr. Neha Singh",
    qualification: "Psychiatrist, Specializes in Adolescent Therapy",
    image: "/defaultt.jpg",
  },
  {
    name: "Meera Desai",
    qualification: "Therapist & Mindfulness Coach",
    image: "/defaultt.jpg",
  },
  {
    name: "Dr. Aarav Kapoor",
    qualification: "Behavioral Therapist, Focus on Stress & Anxiety",
    image: "/defaultt.jpg",
  },
  {
    name: "Simran Kaur",
    qualification: "LGBTQ+ Affirmative Therapist, Trauma Specialist",
    image: "/defaultt.jpg",
  },
];

const GetHelpPage = () => {
  const [selectedTherapist, setSelectedTherapist] = useState<null | typeof therapists[0]>(null);

  // Dummy function for phone call initiation (You can integrate it with actual calling services later)
  const initiatePhoneCall = (phoneNumber: string) => {
    alert(`Initiating a call to ${phoneNumber}`);
    // Here you can integrate with any phone service like Twilio or WebRTC
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#e0f2fe] via-[#fef9ff] to-[#f0fdf4] px-6 py-12 text-gray-800 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-200 rounded-full opacity-30 blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-0 w-[400px] h-[400px] bg-pink-100 rounded-full opacity-20 blur-2xl -z-10 animate-pulse delay-1000" />

      <div className="max-w-6xl mx-auto">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold text-center bg-gradient-to-r from-purple-500 via-pink-400 to-indigo-500 text-transparent bg-clip-text drop-shadow-xl mb-10"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          🧠 Connect with a Professional
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {therapists.map((therapist, i) => (
            <motion.div
              key={i}
              className="bg-white bg-opacity-70 p-6 rounded-3xl shadow-xl text-center border hover:shadow-2xl transition"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Image
                src={therapist.image}
                alt={therapist.name}
                width={100}
                height={100}
                className="mx-auto rounded-full mb-4 shadow-md"
              />
              <h3 className="text-xl font-bold text-purple-700">{therapist.name}</h3>
              <p className="text-gray-600 mt-2">{therapist.qualification}</p>
              <button
                onClick={() => setSelectedTherapist(therapist)}
                className="mt-4 px-5 py-2 bg-purple-600 text-white rounded-full shadow hover:bg-purple-700 transition"
              >
                Contact
              </button>
              <button
                onClick={() => initiatePhoneCall('123-456-7890')} // Pass the actual phone number here
                className="mt-4 ml-4 px-5 py-2 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition"
              >
                Phone Call
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedTherapist && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full space-y-4 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                onClick={() => setSelectedTherapist(null)}
                className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
              >
                &times;
              </button>
              <h2 className="text-2xl font-semibold text-purple-600">Contact {selectedTherapist.name}</h2>
              <p className="text-gray-600 text-sm">{selectedTherapist.qualification}</p>

              {/* Inject dynamic contact form here */}
              <ContactForm therapistId={selectedTherapist.name} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GetHelpPage;