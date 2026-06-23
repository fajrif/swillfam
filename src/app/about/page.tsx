import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About SwillFam — Creating Jakarta's Most Memorable Nights",
  description:
    "Discover SwillFam's story, philosophy, and mission to create unforgettable experiences in Jakarta's nightlife and hospitality scene.",
};

export default function About() {
  return (
    <main className="min-h-dvh bg-sf-bg font-inter text-sf-text">
      {/* Header overlays the hero */}
      <div className="relative">
        <SiteHeader />
        <HeroSection />
      </div>

      <Reveal>
        <OurStorySection />
      </Reveal>

      <Reveal>
        <PhilosophySection />
      </Reveal>

      <Reveal>
        <PrinciplesSection />
      </Reveal>

      <Reveal>
        <ValuesHighlight />
      </Reveal>

      <Reveal>
        <ExperienceSection />
      </Reveal>

      <Reveal>
        <CareersSection />
      </Reveal>

      <Reveal>
        <PressSection />
      </Reveal>

      <Reveal>
        <BrandResourcesSection />
      </Reveal>

      <SiteFooter />
    </main>
  );
}

function HeroSection() {
  return (
    <div className="relative h-[715px] w-full overflow-hidden">
      <Image
        src="https://api.builder.io/api/v1/image/assets/TEMP/10c95dec735cbeacb2b37eb811a616db0fed2c63?width=2880"
        alt="Hero background"
        fill
        className="object-cover"
        priority
      />
      <Image
        src="https://api.builder.io/api/v1/image/assets/TEMP/efd8f9c6b793a4e6ecfcebffae5ef50e6a44dd07?width=2880"
        alt="Hero overlay"
        fill
        className="object-cover"
        priority
      />

      {/* Gradient overlay */}
      <div className="absolute inset-x-0 bottom-0 h-[225px] bg-gradient-to-t from-sf-bg to-transparent" />

      {/* Hero content */}
      <Container className="relative z-10 flex h-full flex-col justify-end pb-12">
        <h1 className="font-syne text-[60px] font-semibold leading-[65px] text-white uppercase max-w-3xl">
          Creating Jakarta's Most Memorable Nights
        </h1>
      </Container>
    </div>
  );
}

function OurStorySection() {
  return (
    <section className="border-t border-sf-border/60 bg-sf-bg py-16 lg:py-24">
      <Container className="grid gap-12 lg:grid-cols-[1fr,1fr]">
        {/* Left: Images */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <p className="font-inter text-[24px] font-semibold text-white/80">Our Story</p>
            <div className="h-[547px] relative overflow-hidden border border-sf-border/30">
              <Image
                src="https://api.builder.io/api/v1/image/assets/TEMP/47b7d1814fa0084404118e4d65e2b778c660bbc1?width=1366"
                alt="Our story"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="h-[570px] relative overflow-hidden border border-sf-border/30">
            <Image
              src="https://api.builder.io/api/v1/image/assets/TEMP/46f359eb364ab192c7645a001456b2b571f9f839?width=2778"
              alt="Experience showcase"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Right: Story text */}
        <div className="flex flex-col justify-end gap-8">
          <div>
            <h2 className="font-syne text-[64px] font-normal leading-[154px] text-white uppercase mb-8">
              More Than a Hospitality Group
            </h2>
          </div>

          <div className="space-y-6 font-inter text-[24px] font-normal leading-relaxed text-white">
            <p>
              <span className="block font-semibold text-[40px] mb-4">Not simply venues.</span>
              <span className="block font-semibold text-[40px]">Not simply events.</span>
            </p>
            <p className="text-[30px] font-normal">
              But destinations with personality, culture, and community at their core.
            </p>
            <p className="text-[24px]">
              What started as an ambition to create unique experiences has evolved into a growing portfolio of
              hospitality concepts that have become part of Jakarta's social landscape. Each venue is designed with its
              own identity, atmosphere, and purpose, while remaining connected through a shared commitment to
              exceptional experiences.
            </p>
            <p className="text-[24px]">
              Today, SwillFam continues to bring together music, design, food, drinks, entertainment, and people under
              one ecosystem, creating spaces where every visit feels memorable.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

function PhilosophySection() {
  return (
    <section className="border-t border-sf-border/60 bg-sf-bg py-16 lg:py-24">
      <Container className="grid gap-12 lg:grid-cols-2">
        {/* Left: Title and content */}
        <div>
          <p className="font-acumin text-[24px] font-semibold text-white/80 mb-8">Philosophy & Experience</p>
          <h2 className="font-syne text-[64px] font-normal leading-[154px] text-white uppercase mb-8">
            We Design Experiences, Not Just Venues
          </h2>
        </div>

        {/* Right: Description */}
        <div className="flex flex-col justify-center">
          <p className="font-inter text-[24px] font-normal leading-relaxed text-white">
            We believe the best venues are more than places to eat or drink, they become part of people's lives. Every
            SwillFam concept is built around a unique identity, carefully shaped through design, atmosphere, music,
            culinary direction, and service. We pay attention to every detail because great experiences are created
            through thousands of thoughtful decisions.
          </p>
        </div>
      </Container>
    </section>
  );
}

function PrinciplesSection() {
  return (
    <section className="border-t border-sf-border/60 bg-sf-bg py-16 lg:py-24">
      <Container>
        <h2 className="font-syne text-[64px] font-normal text-center text-white uppercase mb-16">
          Our philosophy is grounded in three principles:
        </h2>

        <div className="grid gap-8 lg:grid-cols-3">
          {[
            {
              title: "Creativity First",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            },
            {
              title: "Community Driven",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            },
            {
              title: "Excellence in Every Detail",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            },
          ].map((principle) => (
            <div
              key={principle.title}
              className="border border-sf-border/30 bg-[#131313] p-8 flex flex-col gap-6"
            >
              <h3 className="font-syne text-[24px] font-semibold text-center text-white">{principle.title}</h3>
              <p className="font-inter text-[14px] text-center text-white/70">{principle.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function ValuesHighlight() {
  return (
    <section className="relative bg-[#C6387F] py-8 overflow-hidden">
      <Container className="relative z-10 text-center">
        <p className="font-inter text-[16px] font-normal text-white leading-relaxed max-w-2xl mx-auto">
          SwillFam is built around culture, connection, and shared experiences. Through food, drinks, music, venues,
          and events, SwillFam creates spaces where people come together, express themselves, and become part of the
          city's lifestyle scene.
        </p>
      </Container>

      {/* Repeating text background */}
      <div className="absolute inset-0 -z-10 overflow-hidden whitespace-nowrap text-[96px] font-syne font-bold text-[#C6387F] leading-[114px]">
        <div className="animate-marquee">
          <span className="inline-block pr-8">CULTURE</span>
          <span className="inline-block pr-8">CULTURE</span>
          <span className="inline-block pr-8">CULTURE</span>
          <span className="inline-block pr-8">CULTURE</span>
        </div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section className="border-t border-sf-border/60 bg-sf-bg py-16 lg:py-24">
      <Container>
        <h2 className="font-syne text-[64px] font-normal text-center text-white uppercase mb-16">
          What We Stand For:
        </h2>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Destinations */}
          <div className="flex flex-col gap-8">
            <div className="h-[522px] relative overflow-hidden border border-sf-border/30">
              <Image
                src="https://api.builder.io/api/v1/image/assets/TEMP/b5c4c4ebfd8fc1cefc8fcefeaed2263b7acef965?width=764"
                alt="Destinations"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-syne text-[48px] font-normal text-white uppercase mb-4">
                Destinations with Distinct Personalities
              </h3>
              <p className="font-inter text-[24px] text-white/80">
                Every SwillFam venue has its own concept and atmosphere. From dining and social spaces to nightlife and
                events, each offers a unique experience while reflecting the SwillFam identity. Our venues are designed
                to bring people together and create memorable moments.
              </p>
            </div>
            <Link href="/venues">
              <Button variant="pill-outline" size="pill">
                EXPLORE VENUES
              </Button>
            </Link>
          </div>

          {/* Our Experiences */}
          <div className="flex flex-col gap-8">
            <div className="h-[564px] relative overflow-hidden border border-sf-border/30 bg-[#131313]" />
            <div>
              <h3 className="font-syne text-[48px] font-normal text-white uppercase mb-4">Our Experiences</h3>
              <p className="font-inter text-[24px] text-white/80">
                SwillFam brings together food, drinks, music, entertainment, and community to create memorable moments.
                From events and celebrations to collaborations and nights out, every experience is designed to connect
                people and leave a lasting impression.
              </p>
            </div>
            <Link href="/events">
              <Button variant="pill-outline" size="pill">
                SEE EXPERIENCES
              </Button>
            </Link>
          </div>

          {/* Careers placeholder */}
          <div className="h-[564px] relative overflow-hidden border border-sf-border/30 bg-[#131313]" />
        </div>
      </Container>
    </section>
  );
}

function CareersSection() {
  return (
    <section className="border-t border-sf-border/60 bg-sf-bg py-16 lg:py-24">
      <Container className="grid gap-12 lg:grid-cols-2">
        {/* Left: Career info and button */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="font-syne text-[48px] font-normal text-white uppercase mb-8">Careers at SwillFam</h2>
            <p className="font-inter text-[24px] text-white/80 leading-relaxed">
              Behind every SwillFam experience is a team of people who bring the energy to life. From venue operations
              and hospitality to marketing, events, creative, and management, our team plays an important role in
              shaping every guest experience.
            </p>
            <p className="font-inter text-[24px] text-white/80 leading-relaxed mt-4">
              If you are passionate about lifestyle, hospitality, nightlife, food and beverage, or creative
              experiences, SwillFam is always open to discovering people who want to grow with us.
            </p>
          </div>
          <Link href="/careers">
            <Button variant="pill-outline" size="pill">
              VIEW ALL CAREERS
            </Button>
          </Link>
        </div>

        {/* Right: Image */}
        <div className="h-[564px] relative overflow-hidden border border-sf-border/30">
          <Image
            src="https://api.builder.io/api/v1/image/assets/TEMP/1b1de8e9e757cfd35b4cbeb61630d8c95a521f22?width=1044"
            alt="Careers"
            fill
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}

function PressSection() {
  return (
    <section className="border-t border-sf-border/60 bg-sf-bg py-16 lg:py-24">
      <Container className="grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="font-syne text-[64px] font-normal text-white uppercase mb-8">Press & Media</h2>
          <p className="font-inter text-[24px] text-white/80 leading-relaxed">
            For media mentions, press inquiries, brand information, and official assets, visit the SwillFam Press page.
            Find selected articles, downloadable press kits, logos, and related media resources for SwillFam and our
            venues.
          </p>
        </div>
      </Container>
    </section>
  );
}

function BrandResourcesSection() {
  return (
    <section className="border-t border-sf-border/60 bg-sf-bg py-16 lg:py-24">
      <Container>
        <h2 className="font-syne text-[64px] font-normal text-white uppercase mb-16">
          Brand Resources & Media Downloads
        </h2>

        <div className="grid gap-12 lg:grid-cols-[1fr,1fr]">
          {/* Left: Asset lists */}
          <div className="space-y-8">
            <div>
              <h3 className="font-syne text-[36px] font-normal text-white mb-4">Logos Assets</h3>
            </div>
            <div>
              <h3 className="font-syne text-[36px] font-normal text-white mb-4">Brand Guideline</h3>
            </div>
            <div>
              <h3 className="font-syne text-[36px] font-normal text-white mb-4">Lorem Ipsum</h3>
            </div>
            <div>
              <h3 className="font-syne text-[36px] font-normal text-white mb-4">Lorem Ipsum</h3>
            </div>

            <p className="font-inter text-[24px] text-white/80 leading-relaxed">
              Access official SwillFam brand assets for media, partners, collaborators, and event organizers. Download
              approved logos, brand guidelines, venue imagery, press kits, and other resources for editorial and
              promotional use.
            </p>
          </div>

          {/* Right: Press items */}
          <div className="space-y-12">
            {[1, 2, 3].map((item) => (
              <div key={item}>
                <h3 className="font-syne text-[28px] font-normal text-white mb-2">
                  Lorem Ipsum Dolor Sit Amet, Consectetur Eiusmod Magna
                </h3>
                <p className="font-inter text-[14px] text-white/60">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
