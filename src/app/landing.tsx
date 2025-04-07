import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, BarChart3, MessageCircle, Award, ArrowRight } from "lucide-react"
// import { useEffect, useState } from "react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-500" />
            <span className="text-xl font-semibold">MindHub</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Testimonials
            </Link>
            <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/signin">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-purple-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Track Your Mood, <span className="text-purple-500">Improve Your Mindset</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Our AI-powered platform helps you understand your emotions, track patterns, and develop healthier
                  mental habits.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button variant="outline" size="lg">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative h-[350px] w-full rounded-xl overflow-hidden">
                <Image
                  src="/Peace1.png"
                  alt="Peaceful image"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Features Designed for Your Mental Wellbeing
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                  Our platform offers a comprehensive suite of tools to help you track, understand, and improve your
                  mental health.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="grid gap-6">
                <Card>
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="rounded-full bg-blue-100 p-2">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Mood History</h3>
                      <p className="text-muted-foreground">
                        Track your emotional patterns over time with beautiful, easy-to-understand visualizations.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="rounded-full bg-purple-100 p-2">
                      <Brain className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">AI Sentiment Analysis</h3>
                      <p className="text-muted-foreground">
                        Our AI analyzes your journal entries to provide insights about your emotional state.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-6">
                <Card>
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="rounded-full bg-green-100 p-2">
                      <Award className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Gamified Progress</h3>
                      <p className="text-muted-foreground">
                        Earn badges and track achievements as you develop consistent mental health habits.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="rounded-full bg-teal-100 p-2">
                      <MessageCircle className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Expert Support</h3>
                      <p className="text-muted-foreground">
                        Connect with mental health professionals when you need additional guidance.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-blue-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Users Say</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Real stories from people who have improved their mental wellbeing with MindfulMood.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              {[
                {
                  name: "Aarav Sharma",
                  testimonial: "MindHub has been a great support system for me. As someone dealing with work stress and anxiety, having access to professional therapists through chat and video calls has been really helpful. The guided meditation sessions are also a great feature. However, I think the app could improve by offering more regional language support, as not everyone is comfortable communicating in English. Despite that, it has made a positive impact on my mental well-being.",
                  stars: 5
                },
                {
                  name: "Vikram Patil",
                  testimonial: "The project is a great initiative, but id want to know if i as a user login to MindHub, will i be able to get a personalized dashboard, resources? Will i be able to contact the professionals if i feel like i have to? What benefits can i get from MindHub? Will my personal information be private? These are some important questions and at least these features must be present in MindHub  for it to be a proper mental health support platform.",
                  stars: 4
                },
                {
                  name: "Rohan Verma",
                  testimonial: "I like their idea a lot but what i want to know is how this will be different from existing mental health apps and websites. Will it focus on the self help techniques more or  will it connect users with professionals or will it do both ? How will they make it more engaging than rest of the websites or apps? And i hope there will be an emergency support options as its really important.",
                  stars: 5
                },
                {
                  name: "Meera Nair",
                  testimonial: "While the idea of a mental health platform is very common, it is a good initiative and i hope it will provide a personalized experience for each user as it is one of the most important feature a mental health website should have. Also my or any other user's personal information should not be shared with anyone.",
                  stars: 3                },
                {
                  name: "Priya Iyer",
                  testimonial: "I believe that mental health is a very important issue and that our mental well being plays a very important role in turning us into who we are and what we can achieve. A person with good mental health can achieve anything that they want. So i appreciate that their project MindHub is trying to help those in need. Although i do have a concern about the accessibility and whether this will be free or affordable. If people can connect to professionals with affordable prices or get self help or access to free resources, it will be very valuable. ",
                  stars: 5
                },
                {
                  name: "Vinayak Mittal",
                  testimonial: "Well, this is a wonderful concept. Today, mental health websites are so much in demand; if well implemented, this will positively impact a vast number of people. Just some things to highlight—privacy is of utmost importance in this area, so ensure that users' data and chats have the utmost protection. An AI chatbot that carries out sentiment analysis would be a wonderful addition, but the outputs should sound and feel human—not machine-like. If it could detect distress and present an appropriate response, that would pose a revolution. The gamification angle is enticing, but implementing it rightly is crucial. Mental health is not something that one should 'win' at. Instead of points, maybe the reward should be through resources to self-help exercises or guided meditation. Hope to see this enhancement. Keep developing!",
                  stars: 5
                }
              ].map((user, index) => (
                <Card key={index} className="bg-white">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        {[...Array(user.stars)].map((_, starIndex) => (
                          <svg
                            key={starIndex}
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 fill-purple-500 text-purple-500"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-muted-foreground">"{user.testimonial}"</p>
                      <div className="flex items-center gap-4 pt-4">
                        <div className="rounded-full bg-gray-100 p-1">
                          <div className="h-8 w-8 rounded-full bg-gray-300" />
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          {/* <p className="text-sm text-muted-foreground">{user.duration}</p> */}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Sign Up Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-purple-50 to-blue-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Start Your Mental Wellness Journey Today
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of users who are taking control of their mental health.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                  <Link href="/signup">
                    <Button size="lg" className="bg-purple-600 hover:bg-purple-700 w-full min-[400px]:w-auto">
                      Sign Up Free
                    </Button>
                  </Link>
                  <Link href="/signin">
                    <Button variant="outline" size="lg" className="w-full min-[400px]:w-auto">
                      Sign In
                    </Button>
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground">No credit card required. Start with our free plan.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12 px-4 md:px-6">
          <div className="flex flex-col gap-2 md:gap-4 md:w-1/3">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-500" />
              <span className="text-xl font-semibold">MindfulMood</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Track your mood, improve your mindset, and take control of your mental wellbeing.
            </p>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Product</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Company</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Legal</h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t py-6">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} MindfulMood. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}