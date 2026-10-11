import { Lumora, Kestrel, Halden, Orbitly, Quillo, Fernway, Vantis, Brightloom, Northpeak, Cobalto, Mosaica, Tidepool } from "../shared/logos";

const LOGOS = [
  <Lumora key="1" />,
  <Kestrel key="2" />,
  <Halden key="3" />,
  <Tidepool key="4" />,
  <Quillo key="5" />,
  <Fernway key="6" />,
  <Vantis key="7" />,
  <Orbitly key="8" />,
  <Brightloom key="9" />,
  <Northpeak key="10" />,
  <Cobalto key="11" />,
  <Mosaica key="12" />,
];

interface LogoCloudSimpleProps {
  count?: number;
  description?: string;
  title?: string;
}

export function LogoCloudSimple({
  title = "You're in good company",
  description = "Trusted by leading teams from around the world",
  count = 4,
}: LogoCloudSimpleProps) {
  const logos = LOGOS.slice(0, count);

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto mb-12 max-w-xl text-balance text-center md:mb-16">
          <h2 className="font-semibold text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-2 items-center gap-8 md:grid-cols-4">
          {logos.map((logo) => (
            <div
              className="flex items-center justify-center opacity-60 transition-opacity duration-200 *:fill-foreground hover:opacity-100"
              key={logo.key}
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LogoCloudSimple;
