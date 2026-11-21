import BookCard from '../components/BookCard';
import LanguageRow from '../components/LanguageRow';
import PlanList from '../components/PlanList';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { content } from '../data/content';
import type { InterestKey, PersonalItem, PlanItem } from '../data/content';
import DepthCarousel from '../components/DepthCarousel';
import DiagonalGallery from '../components/DiagonalGallery';

interface InterestGroup {
  key: InterestKey;
  items: PersonalItem[];
  plan: PlanItem[];
  planLabel: string;
}

const { personal } = content;
const { others } = personal;

const groups: InterestGroup[] = [
  {
    key: 'games',
    items: personal.games,
    plan: personal.planToPlay,
    planLabel: personal.columns.planToPlay,
  },
  {
    key: 'animation',
    items: personal.animation,
    plan: personal.planToWatchAnimation,
    planLabel: personal.columns.planToWatch,
  },
  {
    key: 'moviesTv',
    items: personal.moviesTv,
    plan: personal.planToWatchMoviesTv,
    planLabel: personal.columns.planToWatch,
  },
];

export default function Personal() {
  return (
    <>
      {/* Page intro: text left, "Currently" + stats right (stacked on mobile) */}
      <header className="container-page grid gap-10 pb-section pt-10 sm:pt-16 lg:grid-cols-2 lg:items-center lg:gap-12 lg:pt-24">
        <Reveal>
          <SectionHeading
            level={1}
            label={personal.label}
            heading={personal.heading}
            subtext={personal.intro}
          />
        </Reveal>

        <Reveal className="flex items-center justify-center lg:justify-end">
          <p
            lang="ja"
            className="font-bold leading-none tracking-tight text-[#ff1f3d]"
            style={{
              fontSize: 'clamp(3rem, 0.9rem + 6vw, 7rem)',
              textShadow: '0 0 40px rgba(255,31,61,0.45)',
              fontFamily:
                '"Noto Sans JP", "Hiragino Sans", "Yu Gothic", "Meiryo", system-ui, sans-serif',
            }}
          >
            自己紹介
          </p>
        </Reveal>
      </header>

      {/* Interests */}
      <section
        aria-labelledby="interests-heading"
        className="container-page pb-section"
      >
        <Reveal>
          <SectionHeading
            id="interests-heading"
            label={personal.interests.label}
            heading={personal.interests.heading}
            subtext={personal.interests.subtext}
          />
        </Reveal>

        <div className="mt-12 flex flex-col gap-16 sm:mt-16 sm:gap-20">
          {groups.map(({ key, items, plan, planLabel }) => {
            const copy = personal.sections[key];
            const headingId = `${key}-heading`;
            const favoritesId = `${key}-favorites`;

            return (
              <section key={key} aria-labelledby={headingId}>
                <Reveal>
                  <SectionHeading
                    level={3}
                    id={headingId}
                    label={copy.label}
                    heading={copy.heading}
                    subtext={copy.subtext}
                  />
                </Reveal>

                <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-8">
                  {/* Column 1: favorites (image cards). No ancestor clips, so the hover scale is never cut off. */}
                  <div className="flex flex-col gap-4">
                    <Reveal as="p" id={favoritesId} className="eyebrow">
                      {personal.columns.favorites}
                    </Reveal>

                    <Reveal
                      as="ul"
                      stagger
                      role="list"
                      aria-labelledby={favoritesId}
                      className="grid flex-1 auto-rows-fr grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] gap-4 sm:gap-5"
                    >
                        <Reveal className="flex-1">
                          <DepthCarousel
                            label="Favorites"
                            items={items.map((item) => ({
                              title: item.title,
                              note: item.note,
                              genre: item.genre,
                              image: item.image,
                            }))}
                          />
                        </Reveal>

                    </Reveal>
                  </div>

                  {/* Column 2: plan to play / watch */}
                  <PlanList label={planLabel} items={plan} />
                </div>
              </section>
            );
          })}
        </div>
      </section>

      {/* Others */}
      <section
        aria-labelledby="others-heading"
        className="container-page pb-section"
      >
        <Reveal>
          <SectionHeading
            id="others-heading"
            label={others.copy.label}
            heading={others.copy.heading}
            subtext={others.copy.subtext}
          />
        </Reveal>

        <div className="mt-12 flex flex-col gap-16 sm:mt-16 sm:gap-20">
          {/* Photography: full width */}
          <section aria-labelledby="photography-heading">
            <Reveal>
              <SectionHeading
                level={3}
                id="photography-heading"
                label={others.sections.photography.label}
                heading={others.sections.photography.heading}
                subtext={others.sections.photography.subtext}
              />
            </Reveal>

            <Reveal className="mt-8">
              <DiagonalGallery
                label="Photography"
                photos={others.photography.map((photo) => ({
                  title: photo.title,
                  caption: photo.caption,
                  image: photo.src,
                }))}
              />
            </Reveal>
          </section>

          {/* Languages and Books: side by side on desktop */}
          <div className="grid gap-16 sm:gap-20 lg:grid-cols-2 lg:items-start lg:gap-8">
            <section aria-labelledby="languages-heading">
              <Reveal>
                <SectionHeading
                  level={3}
                  id="languages-heading"
                  label={others.sections.languages.label}
                  heading={others.sections.languages.heading}
                  subtext={others.sections.languages.subtext}
                />
              </Reveal>

              <Reveal
                as="ul"
                stagger
                role="list"
                className="mt-8 flex flex-col gap-3 sm:gap-4"
              >
                {others.languages.map((language) => (
                  <Reveal as="li" key={language.id}>
                    <LanguageRow
                      name={language.name}
                      levelLabel={others.levelLabels[language.level]}
                      proficiency={language.proficiency}
                      levelVariant={
                        language.level === 'native' ? 'accent' : 'neutral'
                      }
                    />
                  </Reveal>
                ))}
              </Reveal>
            </section>

            <section aria-labelledby="books-heading">
              <Reveal>
                <SectionHeading
                  level={3}
                  id="books-heading"
                  label={others.sections.books.label}
                  heading={others.sections.books.heading}
                  subtext={others.sections.books.subtext}
                />
              </Reveal>

              <Reveal
                as="ul"
                stagger
                role="list"
                className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(100%,13rem),1fr))] gap-4 sm:gap-5"
              >
                {others.books.map((book) => (
                  <Reveal as="li" key={book.id} className="h-full">
                    <BookCard
                      title={book.title}
                      author={book.author}
                      status={book.status}
                      statusLabel={others.statusLabels[book.status]}
                    />
                  </Reveal>
                ))}
              </Reveal>
            </section>
          </div>
        </div>
      </section>

      {/* Closing quote */}
      <section className="container-page pb-section">
        <Reveal>
          <figure className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
            <span aria-hidden="true" className="block h-px w-12 bg-accent" />
            <blockquote>
              <p className="text-lead text-muted">{personal.quote.text}</p>
            </blockquote>
            <figcaption className="font-mono text-label uppercase text-muted">
              {personal.quote.author}
            </figcaption>
          </figure>
        </Reveal>
      </section>
    </>
  );
}