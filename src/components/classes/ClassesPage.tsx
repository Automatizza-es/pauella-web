import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { pagePaths } from "@/lib/page-routes";
import { classContent } from "@/lib/classes/content";
import { classSchema } from "@/lib/classes/seo";
import { siteConfig } from "@/lib/site-config";
import Container from "@/components/layout/Container";
import Reveal from "./Reveal";
import ClassVideo from "./ClassVideo";
import ClassForm from "./ClassForm";

const action = "inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-7 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-shell transition-colors hover:bg-terracotta-deep";
const textLink = "inline-block text-xs font-medium uppercase tracking-[0.18em] underline decoration-current/40 underline-offset-8 transition-colors hover:text-terracotta";
export default function ClassesPage({ locale }: { locale: Locale }) {
  const c = classContent[locale];
  const home = pagePaths.home[locale];
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(classSchema(locale)) }} />
    <section id="top" className="relative flex min-h-[90svh] items-center overflow-hidden bg-charcoal pb-20 pt-32 text-shell sm:py-36">
      <Image src="/images/learn-rice-pour.jpg" alt={c.heroAlt} fill priority sizes="100vw" className="object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/85 via-charcoal/65 to-charcoal/35" aria-hidden />
      <Container className="relative z-10 w-full">
        <nav aria-label={locale === "en" ? "Breadcrumb" : "Migas de pan"} className="mb-10 text-xs text-shell/80"><ol className="flex flex-wrap items-center gap-2"><li><a href={home} className="underline underline-offset-4">{c.home}</a></li><li aria-hidden>/</li><li aria-current="page">{c.name}</li></ol></nav>
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em]">{c.eyebrow}</p>
          <h1 className="mt-6 text-balance text-4xl sm:text-6xl lg:text-7xl">{c.h1}</h1>
          <p className="mt-7 max-w-xl text-lg text-shell/90">{c.intro}</p>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold uppercase tracking-[0.12em]">{c.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
          <div className="mt-10 flex flex-wrap items-center gap-6"><a href="#class-enquiry" className={action}>{c.cta}<span aria-hidden>→</span></a><a href="#class-overview" className={textLink}>{c.explore}</a></div>
        </div>
      </Container>
    </section>
    <section id="class-overview" className="scroll-mt-24 bg-shell py-24 sm:py-32"><Container>
      <Reveal className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div><p className="text-xs font-medium uppercase tracking-[0.28em] text-terracotta">{c.eyebrow}</p><h2 className="mt-5 text-4xl sm:text-5xl">{c.overviewTitle}</h2><p className="mt-6 text-charcoal-soft">{c.overview}</p><p className="mt-5 text-charcoal-soft">{c.invitation}</p><h3 className="mt-10 text-2xl sm:text-3xl">{c.recipeTitle}</h3><p className="mt-5 text-charcoal-soft">{c.recipe}</p><a href={`${home}#menu`} className={`mt-7 ${textLink}`}>{c.menuLink}</a></div>
        <ClassVideo label={c.videoLabel} alt={c.videoAlt} fallback={c.videoFallback} />
      </Reveal>
    </Container></section>
    <section id="class-setup" className="scroll-mt-24 bg-sand-deep py-24 sm:py-32"><Container>
      <Reveal className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20"><div><h2 className="text-4xl sm:text-5xl">{c.setupTitle}</h2><p className="mt-6 text-charcoal-soft">{c.setup}</p></div><ul className="divide-y divide-charcoal/15 border-y border-charcoal/15">{c.kit.map((item, index) => <li key={item} className="flex items-center gap-5 py-6"><span className="text-xs font-medium text-terracotta">0{index + 1}</span><span className="font-serif text-2xl sm:text-3xl">{item}</span></li>)}</ul></Reveal>
    </Container></section>
    <section className="bg-shell py-24 sm:py-32"><Container><Reveal>
      <h2 className="max-w-2xl text-4xl sm:text-5xl">{c.processTitle}</h2><ol className="mt-14 grid gap-10 lg:grid-cols-3">{c.steps.map((step, index) => <li key={step.title} className="border-t border-charcoal/15 pt-6"><span className="text-xs font-medium tracking-[0.18em] text-terracotta">0{index + 1}</span><h3 className="mt-4 text-2xl sm:text-3xl">{step.title}</h3><p className="mt-5 text-charcoal-soft">{step.body}</p></li>)}</ol>
    </Reveal></Container></section>
    <section className="bg-sand py-24 sm:py-32"><Container><Reveal className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
      <Image src="/images/about-pau.jpg" alt={c.portraitAlt} width={1174} height={1583} sizes="(min-width:1024px) 40vw, 90vw" className="mx-auto w-full max-w-sm rounded-sm object-cover" />
      <div><h2 className="text-4xl sm:text-5xl">{c.aboutTitle}</h2><p className="mt-6 text-charcoal-soft">{c.about}</p><a href={`${home}#about`} className={`mt-7 ${textLink}`}>{c.aboutLink}</a><h3 className="mt-12 text-2xl sm:text-3xl">{c.areaTitle}</h3><p className="mt-5 text-charcoal-soft">{c.area}</p></div>
    </Reveal></Container></section>
    <section id="class-faq" className="scroll-mt-24 bg-shell py-24 sm:py-32"><Container className="max-w-3xl"><h2 className="text-4xl sm:text-5xl">{c.faqTitle}</h2><div className="mt-12 divide-y divide-charcoal/15 border-t border-charcoal/15">{c.faq.map((faq) => <details key={faq.question} className="group py-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-6"><h3 className="text-xl sm:text-2xl">{faq.question}</h3><span className="text-2xl text-terracotta group-open:rotate-45" aria-hidden>+</span></summary><p className="mt-4 text-charcoal-soft">{faq.answer}</p></details>)}</div></Container></section>
    <section id="class-enquiry" className="scroll-mt-24 bg-charcoal py-24 text-shell sm:py-32"><Container><div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20"><div><p className="text-xs font-medium uppercase tracking-[0.28em] text-terracotta">{c.eyebrow}</p><h2 className="mt-5 text-4xl sm:text-5xl">{c.enquiryTitle}</h2><p className="mt-6 text-shell/80">{c.enquiry}</p><p className="mt-7 text-sm text-shell/80">{c.emailLabel} <a href={`mailto:${siteConfig.email}`} className="underline underline-offset-4">{siteConfig.email}</a></p></div><ClassForm /></div><div className="mt-16 border-t border-shell/20 pt-8 text-sm text-shell/80"><p>{c.cateringLabel}</p><a href={home} className={`mt-4 text-shell ${textLink}`}>{c.cateringLink}</a></div></Container></section>
  </>;
}
