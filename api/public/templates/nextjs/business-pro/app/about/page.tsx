import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Users, Award, TrendingUp, Clock, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Team meeting"
            fill
            priority
            className="object-cover brightness-[0.4]"
          />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white">About Nexus Solutions</h1>
            <p className="text-xl text-gray-200">
              We're a team of passionate business experts dedicated to helping organizations thrive in today's competitive landscape.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2025, Nexus Solutions was born from a vision to bridge the gap between traditional business practices and modern innovation. Our founders, with decades of combined experience across various industries, recognized the need for a consultancy that could help businesses navigate the complexities of today's rapidly evolving marketplace.
                </p>
                <p>
                  What began as a small team of dedicated consultants has grown into a comprehensive business solutions provider with expertise spanning strategic planning, digital transformation, marketing, and operational excellence.
                </p>
                <p>
                  Today, we're proud to have helped hundreds of businesses across diverse sectors achieve their goals, overcome challenges, and position themselves for sustainable growth.
                </p>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Our office"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission & Values */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission & Values</h2>
            <p className="text-muted-foreground text-lg">
              Guiding principles that drive everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  To empower businesses with innovative strategies and solutions that drive sustainable growth, operational excellence, and competitive advantage in an ever-changing marketplace.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground">
                  To be the trusted partner for businesses seeking transformative growth, recognized globally for our expertise, integrity, and the measurable impact we create for our clients.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg">
              <CheckCircle2 className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-muted-foreground">
                We strive for excellence in everything we do, delivering solutions that exceed expectations.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
              <p className="text-muted-foreground">
                We believe in the power of partnership, working closely with our clients to achieve shared goals.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg">
              <Award className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Integrity</h3>
              <p className="text-muted-foreground">
                We uphold the highest standards of honesty, transparency, and ethical conduct in all our interactions.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg">
              <TrendingUp className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                We embrace creative thinking and cutting-edge approaches to solve complex business challenges.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg">
              <Clock className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Adaptability</h3>
              <p className="text-muted-foreground">
                We remain agile and responsive to changing market conditions and client needs.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg">
              <Globe className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
              <p className="text-muted-foreground">
                We promote business practices that support long-term economic, social, and environmental well-being.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Leadership Team</h2>
            <p className="text-muted-foreground text-lg">
              Meet the experts behind Nexus Solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="CEO"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">David Mitchell</h3>
              <p className="text-muted-foreground">CEO & Founder</p>
            </div>
            <div className="text-center">
              <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="COO"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Jennifer Lee</h3>
              <p className="text-muted-foreground">Chief Operations Officer</p>
            </div>
            <div className="text-center">
              <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="CTO"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Marcus Johnson</h3>
              <p className="text-muted-foreground">Chief Technology Officer</p>
            </div>
            <div className="text-center">
              <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="CMO"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Sophia Rodriguez</h3>
              <p className="text-muted-foreground">Chief Marketing Officer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Nexus Solutions</h2>
            <p className="text-muted-foreground text-lg">
              What sets us apart from other business consultancies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Proven Track Record</h3>
                <p className="text-muted-foreground">
                  With a success rate of over 95% and hundreds of satisfied clients, our results speak for themselves.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Industry Expertise</h3>
                <p className="text-muted-foreground">
                  Our team brings specialized knowledge across multiple sectors, ensuring solutions tailored to your industry's unique challenges.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Holistic Approach</h3>
                <p className="text-muted-foreground">
                  We consider all aspects of your business, delivering comprehensive strategies that address both immediate needs and long-term goals.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Innovative Solutions</h3>
                <p className="text-muted-foreground">
                  We stay at the forefront of business trends and technologies, bringing innovative approaches to every client engagement.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Client-Centric Focus</h3>
                <p className="text-muted-foreground">
                  Your success is our priority. We work closely with you to understand your unique needs and deliver solutions that exceed expectations.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Measurable Results</h3>
                <p className="text-muted-foreground">
                  We define clear metrics and KPIs, ensuring you can track the tangible impact of our partnership on your business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Work With Us?</h2>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Let's discuss how Nexus Solutions can help your business reach its full potential.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">Contact Our Team</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}