import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Page from '../components/ui/Page';
import SectionHeading from '../components/ui/SectionHeading';
import { LEGAL_UPDATED } from './legalContent';

const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function Legal({ document }) {
  const { title, intro, sections } = document;

  return (
    <Page width="max-w-5xl">
      <SectionHeading eyebrow="Legal" title={title} description={intro} className="mb-10 md:mb-14" />

      <div className="grid grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)] gap-10 items-start">
        <nav aria-label="On this page" className="hidden lg:block sticky top-24">
          <p className="text-caption muted mb-3">On this page</p>
          <ol className="list-none p-0 m-0 flex flex-col gap-1">
            {sections.map(({ heading }, i) => (
              <li key={heading}>
                <Link to={{ hash: `#${slug(heading)}` }} className="link-quiet text-compact block py-1.5 leading-snug">
                  <span className="tabular">{i + 1}.</span> {heading}
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <div className="card p-6 md:p-10 flex flex-col gap-9">
          {sections.map(({ heading, paragraphs, list }, i) => (
            <section key={heading} id={slug(heading)} className="flex flex-col gap-3">
              <h2 className="text-statement max-w-none">
                <span className="muted tabular">{i + 1}.</span> {heading}
              </h2>
              {paragraphs.map((text) => (
                <p key={text} className="text-body muted max-w-none">{text}</p>
              ))}
              {list && (
                <ul className="list-disc pl-5 flex flex-col gap-2 text-body muted marker:text-steel">
                  {list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          <p className="text-caption muted pt-2 border-t border-hairline-silver">Last updated {LEGAL_UPDATED}</p>
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <Button to="/" variant="outline">Back to home</Button>
      </div>
    </Page>
  );
}
