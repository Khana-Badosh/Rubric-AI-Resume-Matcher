import { BRAND } from '../lib/config';

// Draft policy text. It describes how the product works today and assumes standard practice where
// the product is silent. Have it reviewed against the real data handling before launch.

export const LEGAL_UPDATED = '31 October 2026';

export const PRIVACY = {
  title: 'Privacy Policy',
  intro: `This policy explains what ${BRAND} collects when you use it and how that information is handled.`,
  sections: [
    {
      heading: 'What we collect',
      paragraphs: ['We collect only what the service needs to work.'],
      list: [
        'Files and text you submit: resumes and job descriptions.',
        'Results we generate from them: scores and keyword lists as well as suggestions and cover letters.',
        'Account details if you sign up: your email address and a password we store in hashed form.',
        'A guest identifier stored in your browser so we can count free analyses.',
      ],
    },
    {
      heading: 'How we use it',
      paragraphs: [
        'We use your submissions to produce your match report and nothing else. We do not sell your information and we do not use your resume to advertise to you.',
        'To write suggestions and cover letters we send the text of your resume and the job description to a third party AI provider. That provider processes it only to return a response to us.',
      ],
    },
    {
      heading: 'Storage and retention',
      paragraphs: [
        'Reports are stored so that you can return to them through their link. Anyone who has a report link can open that report so please share it with care.',
        'We keep reports and uploaded text for up to 90 days and then delete them. You can ask us to delete your account and its reports sooner.',
      ],
    },
    {
      heading: 'Cookies and local storage',
      paragraphs: [
        'We do not use advertising cookies. Your browser local storage holds a sign in token and your guest identifier so the site can recognise you between visits. Clearing your browser data removes both.',
      ],
    },
    {
      heading: 'Security',
      paragraphs: [
        'Data travels over encrypted connections and passwords are never stored in readable form. No system is perfectly secure so avoid uploading information you are not comfortable sharing such as government identification numbers.',
      ],
    },
    {
      heading: 'Your choices',
      paragraphs: [
        'You may ask to see delete or correct the information we hold about you. You may also stop using the service at any time. Contact the site operator to make a request.',
      ],
    },
    {
      heading: 'Changes to this policy',
      paragraphs: ['If we change this policy we will update the date at the top of this page.'],
    },
  ],
};

export const TERMS = {
  title: 'Terms of Service',
  intro: `These terms apply when you use ${BRAND}. By using the service you agree to them.`,
  sections: [
    {
      heading: 'The service',
      paragraphs: [
        `${BRAND} compares a resume with a job description and produces a match score and suggestions as well as a draft cover letter. Results are generated automatically and are meant as guidance.`,
      ],
    },
    {
      heading: 'Your account and guest use',
      paragraphs: [
        'You can try the service as a guest within the free analysis limit shown on the analyze page. An account removes that limit. You are responsible for keeping your password private and for activity under your account.',
      ],
    },
    {
      heading: 'Acceptable use',
      paragraphs: ['You agree not to:'],
      list: [
        'Upload files you do not have the right to use.',
        'Upload malware or attempt to disrupt or overload the service.',
        'Use automated tools to bypass the free analysis limit.',
        'Use the service to unlawfully discriminate against candidates.',
      ],
    },
    {
      heading: 'Your content',
      paragraphs: [
        'You keep ownership of everything you upload and of the cover letters generated for you. You give us permission to process your content as needed to run the service as described in the Privacy Policy.',
      ],
    },
    {
      heading: 'No guarantee of outcomes',
      paragraphs: [
        'A high match score does not guarantee an interview or a job offer. Generated text can contain mistakes so please review it before you send it to anyone.',
      ],
    },
    {
      heading: 'Availability and liability',
      paragraphs: [
        'We provide the service as is and may change or suspend it at any time. To the extent the law allows we are not liable for indirect or consequential losses that arise from using it.',
      ],
    },
    {
      heading: 'Changes to these terms',
      paragraphs: ['We may update these terms. Continued use of the service after an update means you accept the new version.'],
    },
  ],
};
