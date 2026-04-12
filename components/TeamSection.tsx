"use client";

import Image from "next/image";
import { MessageSquare, PenTool, Code } from "lucide-react";

const teamData = {
  founder: {
    name: "HARSH MAHESHWARI",
    role: "Founder & CEO",
    image: "/placeholder.jpg",
    note: "I started Schault because I was tired of watching perfectly good shoes end up in landfills over a worn-out sole. As a Materials Science student at IIT Kanpur, I knew there had to be a smarter way — one where engineering meets everyday wear. Schault is that answer: modular, repairable, and built to last.",
  },
  mentors: [
    { 
      name: "DR. AMIT VERMA", 
      title: "Materials Science Advisor", 
      image: "/placeholder.jpg",
      note: "Schault's approach to glue-less assembly is a case study in mechanical interlocking. By eliminating traditional adhesives, they've created a system that isn't just more sustainable, but also more durable and customizable than anything currently on the market."
    },
  ],
  teams: {
    content: [
      { name: "BOYA ANUDEEP", role: "IIT KANPUR", image: "/placeholder.jpg" },
      { name: "VEERAM SHAH", role: "IIT KANPUR", image: "/placeholder.jpg" },
    ],
    design: [
      { name: "ADITI ARYA", role: "NIFT", image: "/images/aditi.jpeg" },
      { name: "SHIVANSHDEEP", role: "IIT KANPUR", image: "/images/shivanshdeep.jpeg" },
    ],
    web: [
      { name: "AUGNIK BANERJEE", role: "WEB HEAD", image: "/placeholder.jpg" },
      { name: "MOHIT", role: "FRONTEND - IIT KANPUR", image: "/images/mohit.jpg" },
      { name: "HARSHIT", role: "FRONTEND - IIT KANPUR", image: "/placeholder.jpg" },
      { name: "DEEVASH", role: "BACKEND", image: "/images/deevash.jpeg" },
    ],
  },
};

function TeamMemberCard({  
  member, 
  teamType,
  index
}: { 
  member: { name: string; role: string; image: string },
  teamType: 'content' | 'design' | 'web',
  index: number
}) {
  const Icon = teamType === 'content' ? MessageSquare : teamType === 'design' ? PenTool : Code;
  
  // Subtle halo background colors inspired by iLovePDF
  const halos = [
    'bg-[#F3F4F6]', // Light Gray
    'bg-[#E0F2FE]', // Light Blue
    'bg-[#F0FDF4]', // Light Green
    'bg-[#FEF2F2]', // Light Red
    'bg-[#FFFBEB]', // Light Yellow
    'bg-[#FAF5FF]', // Light Purple
  ];
  const haloClass = halos[index % halos.length];

  return (
    <div className="group flex flex-col items-center text-center w-full max-w-[260px]">
      <div className="relative mb-6">
        {/* Main circular image with grayscale transition and subtle halo background */}
        <div className={`w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden relative ${haloClass}`}>
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover transition-all duration-300 ease-in-out"
          />
        </div>
        {/* Floating badge wrapper for perimeter rotation */}
        <div className="absolute inset-0 transition-transform duration-700 ease-in-out group-hover:-rotate-[90deg] pointer-events-none">
          <div className="absolute bottom-[3%] right-[3%] w-9 h-9 md:w-12 md:h-12 bg-[#CC0000] rounded-full flex items-center justify-center text-white border-[3px] border-white z-10 shadow-md pointer-events-auto">
            <Icon size={18} className="md:w-6 md:h-6 transition-transform duration-700 ease-in-out group-hover:rotate-[90deg]" />
          </div>
        </div>
      </div>
      <h4 className="font-bebas text-lg md:text-xl tracking-wide text-black/90 group-hover:text-[#CC0000] transition-colors duration-200 mb-1 leading-tight">
        {member.name}
      </h4>
      <p className="font-inter text-[10px] md:text-xs text-black/50 uppercase tracking-[0.2em] px-2 outline-none">
        {member.role}
      </p>
    </div>
  );
}

function TeamSubSection({
  title,
  members,
  teamType,
}: {
  title: string;
  members: Array<{ name: string; role: string; image: string }>;
  teamType: 'content' | 'design' | 'web';
}) {
  return (
    <div className="mb-20 last:mb-0">
      <h3 className="font-bebas text-2xl tracking-widest text-black/90 text-center pb-4 mb-10 border-b border-black/5">
        {title}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
        {members.map((member, idx) => (
          <TeamMemberCard key={member.name} member={member} teamType={teamType} index={idx} />
        ))}
      </div>
    </div>
  );
}

export default function TeamSection() {
  const { founder, mentors, teams } = teamData;
  const mentor = mentors[0];

  return (
    <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
      {/* Section 1 — Founder Block */}
      <div className="team-founder mb-32 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div className="group w-full aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden relative shadow-xl">
          <Image
            src={founder.image}
            alt={founder.name}
            fill
            className="object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col items-start text-left">
          <h2 className="font-bebas text-[48px] md:text-[80px] leading-[0.9] tracking-wide text-black/90 mb-4">
            {founder.name}
          </h2>
          <p className="font-inter text-sm md:text-base text-black/50 uppercase tracking-widest mb-8">
            {founder.role}
          </p>
          <div className="border-l-2 border-[#CC0000] pl-6">
            <p className="font-inter text-base md:text-lg text-black/70 italic leading-relaxed">
              &ldquo;{founder.note}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Section 2 — Mentor Block (Alternating side) */}
      <div className="team-mentors mb-32 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div className="flex flex-col items-start text-left order-2 md:order-1">
          <div className="mb-4">
            <h3 className="font-bebas text-2xl text-[#CC0000] tracking-widest mb-2">MENTOR</h3>
            <h2 className="font-bebas text-[48px] md:text-[80px] leading-[0.9] tracking-wide text-black/90 mb-4">
              {mentor.name}
            </h2>
          </div>
          <p className="font-inter text-sm md:text-base text-black/50 uppercase tracking-widest mb-8">
            {mentor.title}
          </p>
          <div className="border-l-2 border-[#CC0000] pl-6">
            <p className="font-inter text-base md:text-lg text-black/70 italic leading-relaxed">
              &ldquo;{mentor.note}&rdquo;
            </p>
          </div>
        </div>
        <div className="group w-full aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden relative order-1 md:order-2 shadow-xl">
          <Image
            src={mentor.image}
            alt={mentor.name}
            fill
            className="object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
          />
        </div>
      </div>

      {/* Section 3 — Team Grid */}
      <div className="team-grid pt-16 border-t border-black/5">
        <h2 className="font-bebas text-[48px] md:text-[64px] tracking-wide text-black/90 mb-16 text-center uppercase">
          CORE TEAM
        </h2>
        
        {/* Combined Content & Design Team - 4 members total */}
        <div className="mb-20">
          <h3 className="font-bebas text-2xl tracking-widest text-black/90 text-center pb-4 mb-10 border-b border-black/5">
            CONTENT & DESIGN
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
            {teams.content.map((member, idx) => (
              <TeamMemberCard key={member.name} member={member} teamType="content" index={idx} />
            ))}
            {teams.design.map((member, idx) => (
              <TeamMemberCard key={member.name} member={member} teamType="design" index={idx + 2} />
            ))}
          </div>
        </div>

        {/* Web Team - 4 members */}
        <TeamSubSection title="WEB TEAM" members={teams.web} teamType="web" />
      </div>
    </section>
  );
}
