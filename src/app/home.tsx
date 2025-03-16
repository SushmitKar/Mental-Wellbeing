"use client";

// import Link from "next/link"
// import Image from "next/image"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Brain, BarChart3, MessageCircle, Award, ArrowRight } from "lucide-react"

import { useEffect, useState } from "react";



function Home() {
    const [message, setMessage] = useState("Loading...");
  
    useEffect(() => {
      fetch("http://127.0.0.1:8000/")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => setMessage(data.message))
        .catch((error) => {
          console.error("Fetch error:", error);
          setMessage("Failed to load data");
        });
    }, []);
  
    return <h1>{message}</h1>;
}

export default Home