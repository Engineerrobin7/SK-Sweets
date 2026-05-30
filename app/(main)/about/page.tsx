import { Award, Heart, Leaf, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-accent text-primary-foreground py-20 mb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">About SK Sweets</h1>
          <p className="text-xl opacity-90">
            Crafting authentic Indian sweets with 25+ years of tradition and passion
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Story */}
        <section>
          <h2 className="text-4xl font-serif font-bold text-foreground mb-8">Our Journey</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                SK Sweets was founded in 1999 with a simple vision: to bring the authentic taste of traditional Indian sweets to families everywhere. What started as a small family recipe has grown into a beloved brand trusted by thousands.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our founder, Shri Krishna Sharma, learned the art of sweet-making from his grandmother, who was renowned throughout the region for her exquisite sweets. Every recipe carries her legacy of quality, tradition, and love.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Today, SK Sweets continues to maintain the same standards of excellence while embracing modern food safety practices and sustainable sourcing.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-12 rounded-2xl">
              <div className="text-center space-y-6">
                <div className="text-5xl font-serif font-bold text-primary">25+</div>
                <div className="text-muted-foreground">Years of Tradition</div>
                <div className="pt-6 border-t border-primary/20">
                  <div className="text-4xl font-serif font-bold text-primary mb-2">50+</div>
                  <div className="text-muted-foreground">Sweet Varieties</div>
                </div>
                <div className="pt-6 border-t border-primary/20">
                  <div className="text-4xl font-serif font-bold text-primary mb-2">10K+</div>
                  <div className="text-muted-foreground">Happy Customers</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-4xl font-serif font-bold text-foreground mb-12 text-center">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Award,
                title: 'Premium Quality',
                description: 'Only the finest ingredients, no compromises',
              },
              {
                icon: Heart,
                title: 'Made with Love',
                description: 'Handcrafted with care for every occasion',
              },
              {
                icon: Leaf,
                title: 'Pure & Natural',
                description: 'No artificial colors or preservatives',
              },
              {
                icon: Zap,
                title: 'Fresh Always',
                description: 'Made fresh daily, delivered promptly',
              },
            ].map((value, i) => {
              const Icon = value.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-8 rounded-xl border border-border hover:shadow-lg transition-all text-center"
                >
                  <Icon className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Team */}
        <section>
          <h2 className="text-4xl font-serif font-bold text-foreground mb-12 text-center">
            Our Master Artisans
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Shri Krishna Sharma',
                role: 'Founder & Chief Sweet Master',
                description: 'Carries on the 25-year legacy of authentic sweet-making with perfection',
              },
              {
                name: 'Anjali Sharma',
                role: 'Head of Quality Control',
                description: 'Ensures every sweet meets our exacting standards of taste and quality',
              },
              {
                name: 'Rajesh Kumar',
                role: 'Production Manager',
                description: 'Oversees the careful crafting of 50+ sweet varieties daily',
              },
            ].map((member) => (
              <div
                key={member.name}
                className="bg-gradient-to-br from-white to-muted p-8 rounded-2xl border border-border hover:shadow-lg transition-all text-center"
              >
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="bg-muted/50 p-12 rounded-2xl">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-8 text-center">
            Certifications & Standards
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              'ISO 22000 Certified',
              'FSSAI Registered',
              'GMP Compliant Facility',
            ].map((cert) => (
              <div key={cert} className="space-y-3">
                <div className="text-4xl">✓</div>
                <p className="font-semibold text-foreground">{cert}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
