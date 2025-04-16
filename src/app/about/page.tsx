'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

// Reusable animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

const AboutPage = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#e0f2fe] via-[#fef9ff] to-[#f0fdf4] text-gray-800 px-4 py-12 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-200 rounded-full opacity-30 blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-0 w-[400px] h-[400px] bg-pink-100 rounded-full opacity-20 blur-2xl -z-10 animate-pulse delay-1000" />

      <div className="max-w-6xl mx-auto space-y-12">

        {/* Title */}
        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold text-center bg-gradient-to-r from-purple-500 via-pink-400 to-indigo-500 text-transparent bg-clip-text drop-shadow-xl"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          🧘 About MindHub
        </motion.h1>

        <div className="w-40 h-2 bg-purple-300/30 mx-auto blur-sm rounded-full mt-2" />

        {/* Mission */}
        <motion.section 
          className="flex flex-col md:flex-row items-center gap-8 bg-white bg-opacity-60 backdrop-blur-lg p-8 rounded-3xl shadow-xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Image src="/Peace2.png" alt="Mission" width={300} height={100} className="rounded-xl shadow-md" />
          <div>
            <h2 className="text-3xl font-semibold text-purple-600 mb-2">Our Mission</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              At MindHub, we believe mental health is just as important as physical health. Our mission is to empower individuals to better understand, track, and nurture their emotional well-being through accessible and intelligent tools.
            </p>
          </div>
        </motion.section>

        {/* Problem */}
        <motion.section 
          className="flex flex-col-reverse md:flex-row items-center gap-8 bg-purple-50 bg-opacity-50 backdrop-blur-sm p-8 rounded-3xl shadow-xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div>
            <h2 className="text-3xl font-semibold text-purple-600 mb-2">The Problem</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              Millions struggle with mental health issues silently due to stigma, lack of access to help, or limited self-awareness. MindHub addresses this by offering tools for self-reflection, mood tracking, and personalized support.
            </p>
          </div>
          <Image src="/Problem.png" alt="Problem" width={400} height={300} className="rounded-xl shadow-md" />
        </motion.section>

        {/* Features */}
        <motion.section 
          className="text-center bg-white bg-opacity-60 backdrop-blur-md p-8 rounded-3xl shadow-xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl font-semibold text-purple-600 mb-4">✨ Features</h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 text-lg mt-4">
            {[
              "🌈 Real-time Mood Tracker",
              "📓 Daily Journaling",
              "🤖 AI-Powered Insights",
              "📊 Mood Trends",
              "🏆 Gamification and Achievements",
              "👩‍⚕️ Doctor Contact Integration",
            ].map((feature, i) => (
              <motion.li
                key={i}
                className="bg-white p-5 rounded-xl shadow-md border border-purple-100 hover:shadow-lg transition"
                custom={i}
                variants={fadeInUp}
              >
                {feature}
              </motion.li>
            ))}
          </ul>
        </motion.section>

        {/* Tech Stack */}
        <motion.section 
          className="text-center space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl font-semibold text-purple-600">🛠️ Tech Stack</h2>
          <div className="flex justify-center flex-wrap rounded-full gap-6">
            {[
              { src: "/nextjs.png", alt: "Next.js" },
              { src: "/reactjs.png", alt: "React" },
              { src: "/tailwind.png", alt: "Tailwind" },
              { src: "/python.png", alt: "Python" },
              { src: "/fastapi.png", alt: "FastAPI" },
              { src: "/mongodb.png", alt: "MongoDB" },
              { src: "/opencv.png", alt: "OpenCV" },
            ].map((tech, i) => (
              <motion.div
                key={i}
                className="p-2 bg-white rounded-full border shadow hover:shadow-xl transition-shadow"
                custom={i}
                variants={fadeInUp}
              >
                <Image src={tech.src} alt={tech.alt} width={50} height={50} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team Section (optional, editable) */}
        <motion.section 
          className="text-center bg-white bg-opacity-60 backdrop-blur-md p-8 rounded-3xl shadow-xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl font-semibold text-purple-600 mb-8">👥 Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { name: "Arjun Chaudhary", role: "AI Chatbot & Sentiment Analysis", image: "/team1.jpg" },
              { name: "Sushmit Kar", role: "AI/ML & Backend", image: "/team2.jpg" },
              { name: "Tanisha Gusain", role: "Frontend Design & API Integration", image: "/team3.jpg" },
              { name: "Medhansh Nijhawan", role: "Gamification & Community", image: "/team3.jpg" },
            ].map((member, i) => (
              <motion.div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition"
                custom={i}
                variants={fadeInUp}
              >
                <Image src={member.image} alt={member.name} width={100} height={100} className="mx-auto rounded-full mb-4" />
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-purple-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section 
          className="text-center space-y-10 mt-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl font-semibold text-purple-600">Join Us</h2>
          <p className="text-lg max-w-2xl mx-auto text-gray-700">
            Whether you're taking your first step toward mental wellness or looking to support others, MindHub is here for you. Start your journey today.
          </p>
          <Link href="/signup" passHref>
            <button className="mt-6 px-8 py-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition border-2 border-purple-400 hover:border-purple-600">
              Get Started
            </button>
          </Link>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutPage;