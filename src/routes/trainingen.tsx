import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/estg/page-intro";
import { TrainingCard } from "@/components/estg/training-card";
import { Reveal } from "@/components/estg/ui-bits";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { pageHead } from "@/lib/catalog";
import { academies, practiceTrainings, trainingFaq } from "@/lib/trainings";

export const Route = createFileRoute("/trainingen")({
  head: () =>
    pageHead(
      "Trainingen",
      "Vergroot je kennis. Volg een praktijktraining of e-learning bij ESTG en haar merkpartners.",
    ),
  component: Trainings,
});

function Trainings() {
  return (
    <>
      <PageIntro
        title="Trainingen"
        description="Vergroot je kennis. Volg een training of e-learning bij ESTG."
      />
      <section className="container section" style={{ paddingBottom: 0 }}>
        <Reveal>
          <div className="section-heading">
            <div>
              <h2>Instructeur-trainingen</h2>
              <p>Fysiek op locatie, met een beperkt aantal plekken.</p>
            </div>
          </div>
        </Reveal>
        <div className="training-grid">
          {practiceTrainings.map((t, i) => (
            <Reveal key={t.id} delay={i * 70}>
              <TrainingCard training={t} />
            </Reveal>
          ))}
        </div>
      </section>
      <section className="container section">
        <Reveal>
          <div className="section-heading">
            <div>
              <h2>Merk-academies</h2>
              <p>E-learning, online en in je eigen tempo.</p>
            </div>
          </div>
        </Reveal>
        <div className="training-grid">
          {academies.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 70}>
              <TrainingCard training={t} />
            </Reveal>
          ))}
        </div>
        <p className="sample-note">
          Trainingsaanbod overgenomen van estg.eu. Plekken en inschrijvingen op deze site zijn
          illustratief; er is geen koppeling met de inschrijfsystemen van de merk-academies.
        </p>
      </section>
      <section className="container section" style={{ maxWidth: 860, paddingTop: 0 }}>
        <Reveal>
          <h2 style={{ marginBottom: 24 }}>Veelgestelde vragen over trainingen</h2>
          <Accordion type="single" collapsible>
            {trainingFaq.map((f, i) => (
              <AccordionItem key={f.q} value={`tf-${i}`}>
                <AccordionTrigger className="text-base font-semibold">{f.q}</AccordionTrigger>
                <AccordionContent>
                  <p className="muted" style={{ margin: 0 }}>
                    {f.a}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </section>
    </>
  );
}
