import { InfoPage } from '@/src/InfoPage';

/** Terms (placeholder text for the prototype; real terms need legal review). */
export default function Terms() {
  return (
    <InfoPage
      title="Terms"
      updated="8 Oct 2026"
      intro="By using Rescue Network you agree to these terms. They are written to keep animals, reporters, responders and organisations safe."
      sections={[
        { title: 'Using the app', body: [
          'Rescue Network is for helping street cats and dogs. Please report only real animals in distress.',
          'Be kind and respectful in chats. Abusive or misleading messages can be flagged and reviewed.',
        ] },
        { title: 'Reporting an animal', body: [
          'Reporting is free and does not make you responsible for the animal.',
          'Add clear photos and an accurate location so rescue teams can find the animal quickly.',
        ] },
        { title: 'Helping an animal', body: [
          'Only approach an animal if it is safe for you and the animal. You are never required to help physically.',
          'If you take an animal to a veterinary hospital, choose a registered hospital in the app and let them know you are coming.',
        ] },
        { title: 'Adoption', body: [
          'Listings must be honest about the animal’s health, age and temperament.',
          'Rescue Network does not charge for adoption and is not a party to any adoption agreement.',
        ] },
        { title: 'Food donations', body: [
          'Donations are for specific food products requested by registered organisations and delivered to their registered address.',
          'In this prototype, payment and delivery are simulated. No real money is taken.',
        ] },
        { title: 'Organisations', body: [
          'Only organisations approved by our team appear in the app.',
          'Registered organisations agree to provide their services free of cost and never charge reporters or responders.',
        ] },
        { title: 'Changes to these terms', body: ['We may update these terms. We will tell you in the app when something important changes.'] },
      ]}
    />
  );
}
