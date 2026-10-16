export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  category: "Design" | "Sustainability" | "Technology" | "Editorial";
  publishedAt: string;
  readTime: string;
  featured?: boolean;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "7-prototypes-2-years-1-patent-how-schault-reinvented-the-shoe",
    title: "7 Prototypes, 2 Years, 1 Patent: How an IIT Kanpur Student Reinvented the Shoe",
    excerpt: "An inside look at how Schault, an IIT Kanpur startup, built seven prototypes over two years to create a patented modular footwear system that lets users replace worn-out soles and uppers instead of discarding the entire shoe.",
    category: "Editorial",
    publishedAt: "August 15, 2026",
    readTime: "7 min read",
    image: "/images/shoe-image-for-about-us-section.jpeg",
    featured: true,
    author: {
      name: "Harsh Maheshwari",
      role: "Founder & CEO, Schault",
      avatar: "/images/harsh.jpg",
    },
    content: `
      <p>When did you last wash your shoes? Not wipe them down, actually wash them. If you're hesitating, you're not alone: nearly 60% of users report avoiding a pair of shoes altogether because it felt unclean. And here's the harder question: why did you throw away the whole shoe when only the sole had worn out?</p>
      
      <p>That single, deceptively simple question sits at the center of this story. Every year, roughly <strong>22 billion pairs of shoes</strong> are discarded worldwide, and more than 90% of them end up in landfills — not because the entire shoe failed, but because one part did. This blog walks through how a student at IIT Kanpur turned that frustration into a patented, modular footwear system through seven prototypes, dozens of failures, and two years of relentless iteration. If you're building a hardware startup, or you're just curious what real product development looks like behind the scenes, this is that story.</p>

      <h3>The Problem: Footwear Is Broken Across Three Dimensions</h3>
      <p>Before any prototype existed, the Schault team mapped out exactly why footwear, as a category, was failing consumers:</p>
      <ul class="list-disc pl-6 space-y-2 text-black/70 my-4">
        <li><strong>Hygiene Crisis:</strong> Sweat, dirt, and odour get trapped inside shoes, causing real social anxiety — around 60% of users report hygiene concerns with their footwear.</li>
        <li><strong>Cost Inefficiency:</strong> An entire pair gets replaced when only the sole or upper fails, wasting upwards of ₹3,000 per discarded pair.</li>
        <li><strong>Waste Catastrophe:</strong> With 22 billion pairs discarded yearly and multi-material composites that are nearly impossible to recycle, 90–95% of footwear ends up landfilled or incinerated.</li>
      </ul>
      <p>The irony, as the founders point out, is that India is the world's second-largest shoe manufacturer — yet the category has seen almost no real innovation in decades.</p>

      <h3>The 7-Prototype Evolution</h3>

      <h4>Prototype 1: Early Experiments with Cardboard and Nails</h4>
      <img src="/images/Blog-2/prototype-1.png" alt="Prototype 1: Early Experiments with Cardboard and Nails" class="w-full my-6 rounded-2xl border border-black/5 shadow-sm object-cover" />
      <p>Every hardware product — and yes, a shoe is a hardware product — starts with the cheapest possible way to test an idea. Our very first prototype wasn't glamorous: a basic canvas sneaker with a sole crudely attached using cardboard as a structural spacer and nails as fasteners.</p>
      <p>The goal at this stage was never comfort, aesthetics, or durability. It was singular: <strong>prove that our core sole-attachment concept could physically hold together</strong>. Before spending money on real rubber compounds, custom tooling, or manufacturing partnerships, we needed to know the fundamental idea had legs.</p>
      <p><em>Why it matters for stakeholders:</em> This "kitchen-table prototyping" stage reflects a lean, capital-efficient R&D philosophy. Instead of burning capital on tooling for an unvalidated idea, we spent under a dollar to get our first directional signal.</p>

      <h4>Prototype 2: Initial Sole Prototype — Interlocking Failure</h4>
      <img src="/images/Blog-2/prototype-2.png" alt="Prototype 2: Initial Sole Prototype Interlocking Failure" class="w-full my-6 rounded-2xl border border-black/5 shadow-sm object-cover" />
      <p>With the core concept validated, we moved to our first dedicated sole prototype: a standalone rubber outsole engineered with ridged, grooved patterns. The intent was to create a mechanical interlock between the sole and the shoe's upper, removing dependency on adhesives or stitching.</p>
      <p>Upon testing, the interlock did not hold under wear stresses. Root cause analysis revealed two main issues:</p>
      <ol class="list-decimal pl-6 space-y-2 text-black/70 my-4">
        <li>Insufficiently precise tolerances between the interlocking features.</li>
        <li>Rubber's inherent flexibility, which made a purely rubber-based mold difficult to keep dimensionally stable during interlock.</li>
      </ol>
      <p><em>Why it matters:</em> Failure at this stage was valuable. It told us precisely where the mechanical design needed rework — namely tighter tolerance control and a more rigid structural channel.</p>

      <h4>Prototype 3: First MVP with Functional Challenges</h4>
      <img src="/images/Blog-2/prototype-3.png" alt="Prototype 3: First MVP with Functional Challenges" class="w-full my-6 rounded-2xl border border-black/5 shadow-sm object-cover" />
      <p>Armed with lessons from Prototype 2, we built our first genuinely wearable Minimum Viable Product: a mesh slip-on shoe with an integrated sole. For the first time, someone could put the shoe on and walk in it!</p>
      <p>However, real-world wear testing surfaced functional issues including fit inconsistency, bonding weakness during repeated flexing, and faster-than-acceptable wear.</p>
      <p><em>Why it matters:</em> This stage answered the most important early question in footwear development — <em>"can this actually be worn?"</em> with a qualified yes, providing a clear engineering punch list to solve before scaling.</p>

      <h4>Prototype 4: First 3D-Printed Prototype — Interlocking Issues</h4>
      <img src="/images/Blog-2/prototype-4.png" alt="Prototype 4: First 3D-Printed Prototype Interlocking Issues" class="w-full my-6 rounded-2xl border border-black/5 shadow-sm object-cover" />
      <p>To break out of the precision limitations of hand-cast rubber, we brought in 3D printing. 3D printing let us iterate on interlocking pin, groove, and hole geometry with far greater dimensional accuracy, at a fraction of the cost and time of traditional mold-based tooling.</p>
      <p>Despite improved precision, the interlocking pins still failed to seat correctly into channels under physical load testing.</p>
      <p><em>Why it matters:</em> This stage dramatically accelerated development velocity from weeks per iteration down to days, validating 3D printing as a crucial rapid-prototyping tool.</p>

      <h4>Prototype 5: Refined 3D-Printed Prototype</h4>
      <img src="/images/Blog-2/prototype-5.png" alt="Prototype 5: Refined 3D-Printed Prototype" class="w-full my-6 rounded-2xl border border-black/5 shadow-sm object-cover" />
      <p>Using precise data from Prototype 4, we refined the pin, knob, and channel geometry to achieve a tighter, secure mechanical interlock. This wasn't a redesign from scratch; it was a targeted, data-driven refinement of specific dimensions.</p>
      <p><em>Why it matters:</em> This is where our proprietary interlocking sole attachment system matured from a promising idea into a validated, repeatable engineering solution — resolving the single biggest technical risk on the roadmap.</p>

      <h4>Prototype 6: Final MVP Development</h4>
      <img src="/images/Blog-2/prototype-6.png" alt="Prototype 6: Final MVP Development" class="w-full my-6 rounded-2xl border border-black/5 shadow-sm object-cover" />
      <p>With the interlock mechanism proven, we shifted focus to translating the refined design into premium, real-world materials: genuine leather uppers in tan and cream tones, paired with the validated sole architecture.</p>
      <p><em>Why it matters:</em> Represents the transition from "engineering test rig" to a genuine consumer product that looks, feels, and performs like something ready for retail.</p>

      <h4>Prototype 7: The Final PU-Cast Prototype</h4>
      <img src="/images/Blog-2/prototype-7.png" alt="Prototype 7: The Final PU-Cast Prototype" class="w-full my-6 rounded-2xl border border-black/5 shadow-sm object-cover" />
      <p>In our final stage, we transitioned from 3D-printed soles to <strong>PU (Polyurethane) casting</strong> — the industry-standard process used by major global footwear manufacturers for producing durable, lightweight, flexible soles at scale.</p>
      <p>PU casting involves injecting liquid polyurethane into a precision mold, curing into a durable sole with consistent cushioning superior to 3D-printed materials for long-term wear.</p>
      <p><em>Why it matters:</em> This final stage signals to investors and partners that the product is <strong>production-ready</strong> — moving from prototyping to scalable manufacturing.</p>

      <h3>The Business Case: Why Modularity Makes Financial Sense</h3>
      <p>Beyond sustainability, Schault's business model is built on razor-and-blade economics with high-margin recurring part replacements:</p>
      <ul class="list-disc pl-6 space-y-2 text-black/70 my-4">
        <li><strong>Base shoe:</strong> ₹3,000 selling price (₹1,500 manufacturing cost, ~50% gross margin).</li>
        <li><strong>Replacement upper:</strong> ₹2,000 — <strong>Replacement sole:</strong> ₹1,000 (both recurring high-margin revenue).</li>
        <li>Roughly 50% of customers are expected to buy at least one replacement component, effectively doubling customer lifetime value (LTV).</li>
        <li><strong>Projected 3-year revenue:</strong> ₹1.50 crore across 5,000 pairs sold with an LTV/CAC ratio above 3x.</li>
      </ul>

      <blockquote>
        <strong>Founder Insight:</strong> Sustainability and recurring revenue aren't in tension in the Schault model — they're the exact same design decision.
      </blockquote>

      <h3>What Seven Prototypes Taught the Founders</h3>
      <ul class="list-disc pl-6 space-y-2 text-black/70 my-4">
        <li><strong>Fail fast:</strong> The faster you test an idea, the faster you learn whether it's worth pursuing.</li>
        <li><strong>Build in public:</strong> Sharing the journey openly brought feedback and validation the team couldn't have generated alone.</li>
        <li><strong>Iteration beats perfection:</strong> None of the early prototypes were perfect — progress came from continuous, incremental improvement.</li>
        <li><strong>Sustainability requires real innovation:</strong> Reducing waste isn't only about eco-friendly materials — sometimes the product itself has to be redesigned.</li>
      </ul>

      <h3>Conclusion & Call to Action</h3>
      <p>Seven prototypes. Dozens of failures. Hundreds of design revisions. What began as an experiment with cardboard and nails has evolved into a patented modular footwear system designed for a sustainable future, with a manufacturing partner onboarded.</p>

      <p>Schault is currently raising a <strong>₹1 crore pre-seed round</strong> to launch its D2C website, hit its first 2,000 pairs sold, and validate an LTV/CAC ratio above 3x within 12–15 months.</p>

      <div class="bg-black/5 p-6 rounded-2xl my-6 space-y-2">
        <p class="font-bold text-black/90">Interested in joining our journey?</p>
        <p class="text-sm text-black/70">Reach out to <strong>Harsh Maheshwari</strong> (Founder & CEO) at <a href="mailto:harshm23@iitk.ac.in" class="text-[#0350F0] underline">harshm23@iitk.ac.in</a> or <strong>+91 8755054200</strong>.</p>
        <p class="text-sm text-black/70">Explore our modular collections on <a href="/shop" class="text-[#0350F0] underline font-semibold">Schault Shop</a> or customize your pair in our <a href="/create-your-own-shoe" class="text-[#0350F0] underline font-semibold">3D Customizer</a>.</p>
      </div>
    `,
  },
  {
    slug: "how-schaults-interlocking-sole-technology-works",
    title: "How Schault's Interlocking Sole Technology Works: Replace Your Shoe Sole in Seconds",
    excerpt: "Learn how Schault's innovative interlocking shoe mechanism lets you replace worn-out soles without tools, glue, or a cobbler. Save money, reduce waste, and extend the life of your footwear.",
    category: "Technology",
    publishedAt: "July 15, 2026",
    readTime: "5 min read",
    image: "/images/shoes/bluewhite.jpg",
    featured: false,
    author: {
      name: "Schault Engineering",
      role: "Modular Footwear Team",
      avatar: "/assets/logo.webp",
    },
    content: `
      <p>Footwear is one of the most frequently replaced products in our daily lives. In most cases, people throw away an entire pair of shoes even when only the sole or the upper is damaged. At Schault, we believe there is a smarter and more sustainable footwear solution: <strong>interchangeable shoes</strong> built around <strong>replaceable shoe soles</strong>.</p>
      
      <p>Our patented <strong>modular footwear</strong> system uses an innovative <strong>interlocking shoe technology</strong> that allows users to separate and replace the sole and upper without any tools, adhesives, or professional assistance. It's a simple, effective approach to <strong>shoe sole replacement</strong> that keeps your favorite pair going for longer. Browse our full <a href="/shop" class="text-[#0350F0] underline font-semibold">Schault shoe collections</a> to see the interlocking system in action.</p>
      
      <h3>What Is Schault's Interlocking Mechanism?</h3>
      <p>Schault shoes are designed with a specially engineered locking system that securely connects the upper and the sole. This mechanism keeps the shoe stable during everyday activities while allowing users to easily detach and replace components whenever needed.</p>
      <p>Unlike traditional footwear that is permanently glued or stitched together, Schault shoes are built to be modular — giving you fully <strong>customizable shoes</strong> that adapt as your sole or upper wears down.</p>

      <h3>How to Remove the Sole</h3>
      <p>Removing the sole is simple and takes only a few seconds:</p>
      <ol class="list-decimal pl-6 space-y-2 text-black/70 my-4">
        <li>Hold the shoe firmly.</li>
        <li>Start peeling the sole from the front section of the shoe.</li>
        <li>Continue separating the sole gradually until it is completely detached.</li>
      </ol>

      <blockquote>
        <strong>Important:</strong> Always begin from the front of the shoe. Do not attempt to peel the sole from the back, as the mechanism is designed to disengage from the front for smooth removal.
      </blockquote>

      <h3>No Tools. No Glue. No Cobbler.</h3>
      <p>One of the biggest advantages of Schault footwear is convenience.</p>
      <p>You don't need:</p>
      <ul class="list-disc pl-6 space-y-2 text-black/70 my-4">
        <li>Any tools</li>
        <li>Adhesives or glue</li>
        <li>A shoe repair shop</li>
        <li>A cobbler (mochi)</li>
      </ul>

      <p>If your sole wears out after months of use, simply <a href="/shop" class="text-[#0350F0] underline font-semibold">order a new sole</a> and attach it to your existing upper. Similarly, if your upper gets damaged while the sole remains in good condition, you can keep and reuse it — that's the beauty of a <strong>reusable shoe upper</strong>.</p>

      <h3>Save Money by Replacing Only What You Need</h3>
      <p>Traditional footwear forces customers to purchase an entirely new pair even when only one component is worn out.</p>
      <p>With Schault's modular design:</p>
      <ul class="list-disc pl-6 space-y-2 text-black/70 my-4">
        <li>Replace only the <a href="/shop" class="text-[#0350F0] underline font-semibold">sole</a> when the sole wears out.</li>
        <li>Keep using the component that is still in good condition.</li>
      </ul>
      <p>This significantly reduces the overall cost of footwear ownership and helps consumers get more value from every purchase.</p>

      <h3>Build Your Own Shoes</h3>
      <p>Because the upper and the sole are fully independent components, Schault's interlocking system opens the door to something traditional shoemaking can't offer: true <strong>build your own shoes</strong> customization. Instead of choosing a single pre-made pair, you can mix and match uppers and soles to create a combination that fits your style, activity, and comfort preferences.</p>

      <p>With our <a href="/create-your-own-shoe" class="text-[#0350F0] underline font-semibold">Build Your Own Shoes</a> tool, you can:</p>
      <ul class="list-disc pl-6 space-y-2 text-black/70 my-4">
        <li>Select an upper in the color, material, or design you like.</li>
        <li>Pair it with a sole built for your needs — everyday wear, running, or rugged use.</li>
        <li>Swap either component later without rebuying the entire shoe.</li>
      </ul>
      <p>It's the same interlocking mechanism described above, just put in your hands from the very first purchase. Ready to design your own pair? <a href="/create-your-own-shoe" class="text-[#0350F0] underline font-semibold">Start building your shoes here</a>.</p>

      <h3>A Sustainable Solution for the Future</h3>
      <p>The fashion and footwear industries generate millions of tonnes of waste every year. A major reason is that shoes are discarded long before all their components have reached the end of their life.</p>
      <p>Schault's interchangeable design addresses this problem by extending product life and reducing unnecessary disposal — a core part of what makes <strong>sustainable footwear</strong> and <strong>circular footwear</strong> possible at scale.</p>

      <h3>Environmental Benefits</h3>
      <h4>Reduced Material Waste</h4>
      <p>Instead of discarding an entire shoe, users replace only the worn component. This drastically lowers material consumption and waste generation.</p>

      <h4>Lower Carbon Footprint</h4>
      <p>Manufacturing a complete new pair of shoes requires more raw materials, energy, and transportation. Replacing only a sole or upper reduces the overall environmental impact.</p>

      <h4>Supports Circular Consumption</h4>
      <p>By maximizing the usable life of every component, Schault promotes a more circular and responsible approach to footwear ownership — the foundation of truly <strong>eco-friendly shoes</strong>.</p>

      <h3>Frequently Asked Questions</h3>
      <div class="space-y-4 my-6">
        <div>
          <p class="font-bold text-black/90">Can I replace the sole myself?</p>
          <p class="text-black/70 text-sm">Yes. The interlocking mechanism is designed for easy user replacement without any tools or professional assistance.</p>
        </div>
        <div>
          <p class="font-bold text-black/90">Do I need glue to attach a new sole?</p>
          <p class="text-black/70 text-sm">No. The sole securely locks into the upper using Schault's interlocking technology.</p>
        </div>
        <div>
          <p class="font-bold text-black/90">Which side should I peel from while removing the sole?</p>
          <p class="text-black/70 text-sm">Always start from the front of the shoe. This ensures smooth disengagement of the locking mechanism.</p>
        </div>
        <div>
          <p class="font-bold text-black/90">Can I buy soles and uppers separately?</p>
          <p class="text-black/70 text-sm">Yes. Schault allows customers to purchase compatible soles and uppers individually, depending on which component needs replacement.</p>
        </div>
        <div>
          <p class="font-bold text-black/90">Why is modular footwear more sustainable?</p>
          <p class="text-black/70 text-sm">Modular footwear reduces waste, lowers material consumption, extends product lifespan, and decreases the environmental impact associated with replacing entire shoes.</p>
        </div>
        <div>
          <p class="font-bold text-black/90">Can I design and build my own Schault shoes?</p>
          <p class="text-black/70 text-sm">Yes. Our Build Your Own Shoes tool lets you mix and match uppers and soles to create a fully custom pair suited to your style and needs.</p>
        </div>
      </div>

      <h3>The Future of Footwear Is Modular</h3>
      <p>At Schault, we are reimagining footwear through innovation, sustainability, and affordability. Our interlocking sole technology empowers consumers to customize, repair, and extend the life of their shoes in a way that traditional footwear simply cannot — one more step toward mainstream <strong>modular footwear</strong> and <strong>interchangeable shoes</strong> for everyone.</p>

      <p>Why replace an entire shoe when you only need to replace one part?</p>
      <p><strong>Switch your sole. Keep your style. Reduce waste.</strong> Ready to try it? <a href="/create-your-own-shoe" class="text-[#0350F0] underline font-semibold">Build your own shoes</a> or <a href="/shop" class="text-[#0350F0] underline font-semibold">shop our full collections</a>.</p>
      <p class="font-bold text-black/80 mt-4">#SwitchYourStyle</p>
    `,
  },
  {
    slug: "schault-featured-in-times-of-india-replaceable-shoe-sole-revolution",
    title: "Schault Featured in Times of India: The Replaceable Sole Revolution Has Arrived",
    excerpt: "Times of India covers Schault's breakthrough modular footwear innovation - an IIT Kanpur startup that lets you swap your worn-out sole for just ₹800 instead of buying a whole new pair for ₹1,500.",
    category: "Editorial",
    publishedAt: "September 10, 2026",
    readTime: "4 min read",
    image: "/images/dpiit-certificate.png",
    featured: false,
    author: {
      name: "Harsh Maheshwari",
      role: "Founder & CEO, Schault",
      avatar: "/images/harsh.jpg",
    },
    content: `
      <p>Big news for the Schault family  we made it to the pages of <strong>Times of India</strong>! The story, headlined <em>"Ab Pura Joota Nahi, Sol Badalne Ka Aaya Zamana"</em> (Translation: <em>"Now, the era of replacing just the sole - not the whole shoe - has arrived"</em>), captures something we have believed since day one: the way the world buys footwear is fundamentally broken, and it is time to fix it.</p>

      <h3>What the Coverage Highlighted</h3>
      <p>The Times of India piece, filed from Kanpur, spotlighted how <strong>Harsh Maheshwari</strong> - a final-year BTech student at IIT Kanpur - engineered a separable shoe sole that can be replaced independently of the upper. What the article made crystal clear was the economics that make this a genuine consumer breakthrough:</p>
      <ul class="list-disc pl-6 space-y-2 text-black/70 my-4">
        <li><strong>Full shoe price:</strong> ₹1,500 - for when you want to start fresh.</li>
        <li><strong>Replacement sole price:</strong> ₹800 - for when only the sole wears out.</li>
        <li><strong>Savings per cycle:</strong> ₹700 kept in your pocket instead of thrown away on a part that was still perfectly good.</li>
      </ul>
      <p>The journalist also drew attention to the broader vision: traditional footwear locks consumers into a cycle of wasteful full-pair replacement, while Schault's modular system breaks that cycle entirely.</p>

      <h3>The Story Behind the Story</h3>
      <p>What the article captured beautifully was Harsh's origin story. Walking through his hostel corridors one evening, frustrated by a pair of shoes he was about to discard - sole worn through, upper perfectly intact - he asked the question that would eventually become a startup: <em>"Why am I replacing the entire shoe when only one part failed?"</em></p>
      <p>That question led to eighteen months of research, seven physical prototypes, a filed patent, and eventually, a product that Times of India readers across India are now learning about for the first time.</p>

      <h3>What This Media Moment Means</h3>
      <p>Getting coverage in a publication like Times of India is not just a milestone - it is a market signal. It tells us that the conversation around <strong>modular footwear</strong>, <strong>replaceable shoe soles</strong>, and <strong>sustainable shoe technology</strong> has moved beyond startup circles and into mainstream Indian households.</p>
      <p>The response since the article dropped has been extraordinary. We have heard from:</p>
      <ul class="list-disc pl-6 space-y-2 text-black/70 my-4">
        <li>Customers excited to finally have a shoe they do not have to throw away.</li>
        <li>Potential manufacturing partners curious about the interlocking mechanism.</li>
        <li>Investors who recognised the razor-and-blade business model we have been building toward.</li>
      </ul>

      <h3>The Numbers That Matter</h3>
      <p>The article's framing - ₹1,500 for a full shoe, ₹800 for a replacement sole - is deceptively simple. But the implications are significant:</p>
      <ul class="list-disc pl-6 space-y-2 text-black/70 my-4">
        <li>Over a five-year period, a traditional shoe buyer might replace three full pairs: <strong>₹4,500 spent</strong>.</li>
        <li>A Schault buyer buys one base pair and three replacement soles over the same period: <strong>₹3,900 spent</strong> - with zero compromises on freshness or style.</li>
        <li>And the planet saves the manufacturing cost and landfill burden of two complete pairs of shoes.</li>
      </ul>

      <blockquote>
        <strong>From the article:</strong> "The idea is simple but the engineering is complex - creating a sole that locks securely enough for everyday wear, yet detaches easily enough for any user to swap at home, required extensive R&D and a novel patent."
      </blockquote>

      <h3>What Comes Next</h3>
      <p>This press moment is a launchpad, not a finish line. Here is what we are working toward:</p>
      <ul class="list-disc pl-6 space-y-2 text-black/70 my-4">
        <li>Scaling our D2C shop so customers across India can order both base shoes and replacement soles online.</li>
        <li>Closing our pre-seed funding round to accelerate manufacturing capacity.</li>
        <li>Expanding the sole design catalogue so customers can personalise their refresh, not just replace it.</li>
      </ul>
      <p>If the Times of India coverage brought you here, welcome. The best is absolutely still to come.</p>

      <div class="bg-black/5 p-6 rounded-2xl my-6 space-y-2">
        <p class="font-bold text-black/90">Ready to try modular footwear yourself?</p>
        <p class="text-sm text-black/70">Browse our <a href="/shop" class="text-[#0350F0] underline font-semibold">full shoe collection</a>, or design your own pair in our <a href="/create-your-own-shoe" class="text-[#0350F0] underline font-semibold">3D Customizer</a>. When your sole wears out, ordering a replacement is just a click away.</p>
      </div>
    `,
  },
  {
    slug: "schault-receives-dpiit-startup-india-recognition-certificate",
    title: "Schault Receives Official DPIIT Recognition: Certified as a Startup India Fashion Tech Company",
    excerpt: "Schault Private Limited has been officially recognised by the Department for Promotion of Industry and Internal Trade (DPIIT) under the Startup India programme - a milestone that validates our modular footwear innovation on the national stage.",
    category: "Editorial",
    publishedAt: "May 15, 2026",
    readTime: "3 min read",
    image: "/images/times-of-india-article.jpg",
    featured: false,
    author: {
      name: "Harsh Maheshwari",
      role: "Founder & CEO, Schault",
      avatar: "/images/harsh.jpg",
    },
    content: `
      <p>We are thrilled to announce a landmark moment in Schault's journey: <strong>Schault Private Limited has been officially recognised as a startup by the Department for Promotion of Industry and Internal Trade (DPIIT)</strong>, Government of India, under the Startup India initiative.</p>
      <p>The Certificate of Recognition, bearing certificate number <strong>DIPP262094</strong>, was issued on <strong>15th May 2026</strong> and is valid until <strong>24th April 2036</strong> - a decade of recognition that reflects the long-term potential DPIIT sees in our technology and our mission.</p>

      <h3>What DPIIT Recognition Means</h3>
      <p>Being recognised under the <strong>Startup India</strong> programme is not just a badge - it is a formal endorsement from the Indian government that a company is building something genuinely innovative and commercially significant. To receive recognition, a startup must demonstrate that it is:</p>
      <ul class="list-disc pl-6 space-y-2 text-black/70 my-4">
        <li><strong>Working on innovation, development, or improvement</strong> of products or services.</li>
        <li><strong>Creating a scalable business model</strong> with high potential for job creation or wealth generation.</li>
        <li><strong>Early-stage:</strong> Not more than ten years from the date of incorporation and with turnover below ₹200 crore for any financial year.</li>
      </ul>
      <p>Schault has been recognised specifically under the <strong>'Fashion' Industry</strong> and <strong>'Fashion Technology' sector</strong> - fitting for a company reimagining how footwear is designed, used, and replaced.</p>

      <h3>Our Founding Story - Incorporated April 25, 2026</h3>
      <p>Schault Private Limited was incorporated on <strong>25th April 2026</strong> - a date that marks the formal beginning of our corporate journey, though the real story started much earlier. What began as a late-night frustration in an IIT Kanpur hostel room - <em>why replace the whole shoe when only the sole failed?</em> - evolved through seven hardware prototypes, a filed patent, and an IIT-backed research programme before we formalised as a company.</p>
      <p>In less than a month of incorporation, we received our DPIIT recognition - a reflection of how much validated work preceded the company's formal founding.</p>

      <h3>What This Unlocks for Schault</h3>
      <p>DPIIT recognition opens tangible doors for early-stage startups. For Schault, this means:</p>
      <ul class="list-disc pl-6 space-y-2 text-black/70 my-4">
        <li><strong>Tax Benefits:</strong> Eligibility for income tax exemption under Section 80-IAC and angel tax exemption under Section 56(2)(viib).</li>
        <li><strong>Government Procurement:</strong> Preferred access to government tender processes without prior turnover experience requirements.</li>
        <li><strong>IPR Fast-Tracking:</strong> Access to the DPIIT-facilitated Patent Facilitation Programme for faster processing of our modular footwear patent.</li>
        <li><strong>Credibility Signal:</strong> A trusted, government-backed validation for investors, manufacturing partners, and enterprise buyers evaluating us.</li>
      </ul>

      <h3>A Note from Our Founder</h3>
      <blockquote>
        "Receiving DPIIT recognition within our first month as a company is incredibly motivating. It tells us that the Government of India sees the same gap in the footwear market that we have been working to solve. This is just the beginning - we are building a product and a company that will change how Indian consumers think about their shoes."
        <br/><br/>- <strong>Harsh Maheshwari, Founder & CEO, Schault</strong>
      </blockquote>

      <h3>The Road Ahead</h3>
      <p>This recognition comes at a pivotal moment. We are actively:</p>
      <ul class="list-disc pl-6 space-y-2 text-black/70 my-4">
        <li>Launching our direct-to-consumer shop with our first collection of modular leather shoes.</li>
        <li>Raising a pre-seed round to fund manufacturing scale-up and customer acquisition.</li>
        <li>Expanding our 3D customiser tool so every customer can design their perfect modular pair.</li>
      </ul>
      <p>The DPIIT certificate is not our destination - it is a milestone on a much longer journey. Every pair of Schault shoes sold is one more step toward a future where replacing a sole costs less than a lunch, and throwing away a whole shoe because the bottom wore out is a thing of the past.</p>

      <div class="bg-black/5 p-6 rounded-2xl my-6 space-y-2">
        <p class="font-bold text-black/90">Be part of the modular footwear movement</p>
        <p class="text-sm text-black/70">Explore our collections at <a href="/shop" class="text-[#0350F0] underline font-semibold">Schault Shop</a> or build your own custom pair in our <a href="/create-your-own-shoe" class="text-[#0350F0] underline font-semibold">3D Shoe Customizer</a>.</p>
      </div>
    `,
  },
];
