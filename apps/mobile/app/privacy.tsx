import { InfoPage } from '@/src/InfoPage';

/** Privacy (placeholder text for the prototype; real copy needs legal review, docs/07). */
export default function Privacy() {
  return (
    <InfoPage
      title="Privacy"
      updated="8 Oct 2026"
      intro="Rescue Network helps people report and help street animals in distress. This page explains, in plain words, what information the app uses and who can see it."
      sections={[
        { title: 'What we collect', body: [
          'Your name, email address and mobile number when you set up your account.',
          'The photos, videos, location pin and details you add when you report an animal.',
          'Messages you send in case chats and adoption chats.',
        ] },
        { title: 'Who can see your mobile number', body: [
          'Your mobile number is never shown publicly.',
          'When you report, only the registered organisation or veterinary hospital handling the case can see it.',
          'When you take an animal to a hospital, only the hospital you choose can see it.',
        ] },
        { title: 'Your location', body: [
          'We use your location only while you report an animal or travel to help one.',
          'We never share your live location with anyone and we do not keep a location history.',
        ] },
        { title: 'Photos and case chats', body: [
          'Case photos and the animal’s location are visible to everyone, so others can help.',
          'Sensitive photos stay blurred until someone taps to view them.',
          'Shared links never include your name, contact details or the case chat.',
        ] },
        { title: 'Your choices', body: [
          'You can turn notifications on or off in Notification settings.',
          'You can choose what you write in chats. Only share contact details if you want to.',
        ] },
        { title: 'Contact us', body: ['Questions about your privacy? Write to privacy@rescuenetwork.example.'] },
      ]}
    />
  );
}
