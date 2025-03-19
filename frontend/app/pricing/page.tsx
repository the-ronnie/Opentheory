"use client";

import React from "react";
import Navbar from "../../components/navbar";
import { Button } from "../../components/ui/button";
import { Check, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from '../../components/auth/UserProvider';

export default function PricingPage() {
  const router = useRouter();
  const { user } = useUser();
  
  // Single pricing plan at $49
  const pricingPlan = {
    name: "Professional",
    description: "Complete solution for consultants managing job seekers",
    price: 49,
    features: [
      "Unlimited job seekers",
      "Advanced job matching",
      "Priority support",
      "Resume parsing & optimization",
      "Advanced job search filters",
      "Comprehensive analytics",
      "Email notifications",
      "Custom consultant branding",
      "Premium job listings",
      "API access",
      "Dedicated account manager"
    ],
    buttonText: "Subscribe Now"
  };

  // FAQ items
  const faqItems = [
    {
      question: "What's included in the subscription?",
      answer: "Our all-inclusive subscription provides unlimited job seeker management, advanced matching algorithms, priority support, and all premium features necessary for successful job placement."
    },
    {
      question: "Do you offer a free trial?",
      answer: "Yes, we offer a 14-day free trial so you can explore all features before committing."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, including Visa, Mastercard, and American Express."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period."
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer: "We offer a 30-day money-back guarantee for all new subscriptions. If you're not completely satisfied, contact our support team for a full refund."
    }
  ];
  
  // Handle subscribe button click - redirect to home if logged in, signup if not
  const handleSubscribe = () => {
    if (user) {
      router.push('/');
    } else {
      router.push('/sign-up');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6 space-y-10 text-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Simple, Transparent Pricing
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                One plan, all features included. Everything you need to succeed.
              </p>
            </div>

            {/* Single Pricing Card - Center Aligned */}
            <div className="flex justify-center">
              <div className="w-full max-w-md rounded-lg border-2 border-primary p-8 shadow-lg bg-card">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold">{pricingPlan.name}</h3>
                  <p className="text-muted-foreground">{pricingPlan.description}</p>
                  
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold">${pricingPlan.price}</span>
                    <span className="ml-1 text-muted-foreground">/month</span>
                  </div>
                  
                  <Button
                    variant="default"
                    className="w-full text-lg py-6"
                    onClick={handleSubscribe}
                  >
                    {pricingPlan.buttonText}
                  </Button>
                </div>
                
                <div className="mt-8 space-y-4">
                  <h4 className="text-center font-medium">Everything you need:</h4>
                  <ul className="space-y-3">
                    {pricingPlan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className="text-green-500 h-5 w-5 mr-3 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mt-8">
              All subscriptions include unlimited updates and premium support
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-12 md:py-24 bg-muted">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold text-center mb-10">Frequently Asked Questions</h2>
            
            <div className="grid gap-6 md:gap-8 max-w-3xl mx-auto">
              {faqItems.map((faq, index) => (
                <div key={index} className="bg-card rounded-lg p-6 shadow-sm border">
                  <div className="flex items-start">
                    <HelpCircle className="h-6 w-6 text-primary mr-3 mt-1 shrink-0" />
                    <div>
                      <h3 className="font-medium mb-2">{faq.question}</h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">Still have questions?</p>
              <Button asChild>
                <Link href="/support">Contact Our Support Team</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full py-12 md:py-16 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to transform your consulting business?</h2>
            <p className="mx-auto max-w-[700px] mb-8">Join thousands of successful consultants who have streamlined their job placement process.</p>
            <Button 
              variant="outline" 
              className="bg-white hover:bg-white/90 text-primary hover:text-primary text-lg py-6 px-8" 
              onClick={handleSubscribe}
            >
              Get Started Today
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="w-full py-6 bg-background border-t">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2023 OpenTheory. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="/support" className="text-sm text-muted-foreground hover:underline">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
