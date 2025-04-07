import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, BarChart3, MessageCircle, Award, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react";
import LandingPage from "./landing"
import Home from "./home"

function Land() {
  return( 
    <main>
      <div>
        <Home />
        <LandingPage />
      </div>
    </main>
  )
}

export default Land
