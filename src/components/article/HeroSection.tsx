import Image from "next/image";

interface HeroSectionProps {
  image: string;
  alt: string;
  title: string;
  subtitle: string;
  credit?: string;
}

export function HeroSection({ image, alt, title, subtitle, credit }: HeroSectionProps) {
  return (
    <section className="relative w-full h-[60vh] min-h-[400px] max-h-[700px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={alt}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {title}
          </h1>
          <p className="font-body text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Image credit */}
      {credit && (
        <div className="absolute bottom-4 right-4 text-white/50 text-xs font-ui">
          Image: {credit}
        </div>
      )}
    </section>
  );
}
