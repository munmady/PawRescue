/**
 * "Who do I call?" FAQ for Help and safety (D141).
 * Information only: the app is not affiliated with these organisations.
 * Numbers are stored with the last four digits already hidden, so full numbers
 * never ship in the app or the repository. Personal numbers of individuals are
 * never listed. Public 4-digit government helplines are shown in full.
 */
export interface Contact { name: string; note?: string; number: string }
export interface Faq { q: string; a: string; contacts?: Contact[] }

export const FAQS: Faq[] = [
  {
    q: 'An animal is badly injured. Where can it be treated?',
    a: 'Report it in the app first so rescue teams nearby are alerted. These animal hospitals treat street animals.',
    contacts: [
      { name: 'Bai Sakarbai Dinshaw Petit Hospital for Animals (BSPCA)', note: 'Parel', number: '93200 5XXXX' },
      { name: 'Sam K9 Animal Hospital', number: '77009 1XXXX' },
    ],
  },
  {
    q: 'How do I get an animal ambulance?',
    a: 'Ambulances can pick up an injured animal or give treatment on the spot.',
    contacts: [
      { name: 'BMC animal ambulance', note: 'Spot treatment', number: '90826 1XXXX' },
      { name: 'Samast Mahajan ambulance', number: '91529 9XXXX' },
      { name: 'Mangal Vardhini ambulance', number: '82912 5XXXX' },
      { name: 'Arham ambulance', number: '76620 0XXXX' },
    ],
  },
  {
    q: 'Which rescue groups can help?',
    a: 'These groups rescue and treat injured street animals.',
    contacts: [
      { name: 'IDA', note: 'Deonar', number: '93200 5XXXX' },
      { name: 'IDA', note: 'Turbhe', number: '93200 5XXXX' },
      { name: 'IDA', note: 'Panvel', number: '93200 5XXXX' },
      { name: 'Help Animals & Birds (HAB)', number: '022 2374 XXXX' },
    ],
  },
  {
    q: 'There is a dead dog or cat on the road. Who do I call?',
    a: 'Call the BMC helpline to have the body removed. Use this app only for animals that are alive and in distress.',
    contacts: [{ name: 'BMC helpline', number: '1916' }],
  },
  {
    q: 'Where can an animal be cremated?',
    a: 'Animal crematoriums offer a respectful farewell for pets and street animals.',
    contacts: [{ name: 'Ghatkopar animal crematorium', number: '77380 5XXXX' }],
  },
  {
    q: 'I found a snake. Who can rescue it?',
    a: 'This app is for street cats and dogs. For snakes, keep your distance and call a trained snake rescuer.',
    contacts: [
      { name: 'Maharashtra Forest Department', number: '1926' },
      { name: 'WWA', number: '97573 2XXXX' },
      { name: 'RAWW', number: '76666 8XXXX' },
      { name: 'PAWS', note: 'Bhandup', number: '98921 7XXXX' },
    ],
  },
  {
    q: 'I found an injured bird or eagle. Who can help?',
    a: 'This app is for street cats and dogs. For birds, contact a bird rescue group.',
    contacts: [
      { name: 'Maharashtra Forest Department', number: '1926' },
      { name: 'Bird helpline', number: '86553 7XXXX' },
      { name: 'PAWS', note: 'Murbad', number: '99207 7XXXX' },
      { name: 'HOPE Foundation', number: '81695 8XXXX' },
      { name: 'Mangal Vardhini', number: '82912 5XXXX' },
    ],
  },
  {
    q: 'How can I get a street dog sterilised?',
    a: 'Sterilisation isn’t handled in this app. The BMC runs a stray dog sterilisation programme.',
    contacts: [{ name: 'VTeams', note: 'BMC stray dog sterilisation', number: '89761 2XXXX' }],
  },
];
