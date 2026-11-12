// Built-in content, taken from the public sources listed in README.md: Wikipedia, the Parliament of Kenya
// member profile, the Mzalendo profile and the EJS Center profile. Anything the sources did not give
// (office email, phone, executive members, programme figures) is left blank for the office to add in the dashboard.
// The dashboard (Firebase) overrides any of this once the office saves its own version.

export const ENGAGEMENT_CATEGORIES = ['County leadership', 'Parliament', 'Party and campaigns', 'Community', 'Other']
export const NEWS_CATEGORIES = ['Profile', 'Press coverage', 'Statements', 'Events']
export const GALLERY_CATEGORIES = ['County', 'Community', 'Events', 'Parliament']
export const POSITION_CATEGORIES = ['County', 'Parliament', 'Party', 'Movements']

export const SITE_NAME = 'Gladys Wanga'
export const SITE_TITLE = 'Gladys Wanga | Governor of Homa Bay County'

export const defaults = {
  profile: {
    name: 'Gladys Wanga',
    officialName: 'Gladys Atieno Nyasuna Wanga',
    title: 'Governor of Homa Bay County',
    office: 'Governor',
    county: 'Homa Bay County',
    party: 'Orange Democratic Movement (ODM)',
    background: 'Health management, project leadership and national politics',
    intro:
      'The first woman elected Governor of Homa Bay County. Before leading the county she served as its Woman Representative in the National Assembly, where she became the first woman to chair the Finance and National Planning Committee.',
    bio: [
      'Gladys Wanga is the Governor of Homa Bay County, the second to hold the office. She took office on 25 August 2022, succeeding Cyprian Awiti, and is the first woman elected to the post. She was one of seven women elected governor in the 2022 general election.',
      'Born Gladys Atieno Nyasuna in Kisumu in 1981, she studied health management at Kenyatta University, where she was elected Secretary General of the students’ union, the first woman to win that seat. She spent about a decade as a programme manager at the Trust for African Rock Art and at Liverpool VCT Care and Treatment before entering politics.',
      'In 2013 she was elected the first Woman Representative for Homa Bay County and held the seat until 2022, retaining it unopposed in 2017. In Parliament she served on the Parliamentary Service Commission, the House Business Committee and the Departmental Committee on Labour and Social Welfare, and in 2020 became the first woman to chair the Departmental Committee on Finance and National Planning.',
      'She is a long-standing advocate for social justice and women’s empowerment, motivated in part by her late father, John Nyasuna, a councillor in Kisumu who brought her onto his campaign trails as a child.',
    ],
    vision: '',
    photo: '',
    interests: ['Homa Bay County', 'Women’s empowerment', 'Social justice', 'Health', 'Public finance', 'Devolution', 'Lake Victoria'],
    focus: [
      {
        title: 'Leading the county',
        text: 'As Governor she heads the county executive, represents Homa Bay in intergovernmental forums and reports to the county assembly each year.',
      },
      {
        title: 'Public finance',
        text: 'Chaired the National Assembly’s Departmental Committee on Finance and National Planning from 2020, the first woman to do so.',
      },
      {
        title: 'Women’s leadership',
        text: 'The first woman elected Governor of Homa Bay and, in 2013, its first Woman Representative. A champion of women’s empowerment.',
      },
      {
        title: 'Health and community',
        text: 'Holds bachelor’s and master’s degrees in health management and worked for a decade on community and HIV care programmes.',
      },
    ],
    timeline: [
      { when: '1981', title: 'Born in Kisumu', detail: 'Born Gladys Atieno Nyasuna. Her late father, John Nyasuna, was a councillor and chairperson of Kisumu County Council.' },
      { when: 'Secondary school', title: 'Head girl at Kisumu Girls High School', detail: 'Served as head girl and was suspended for defending students’ rights.' },
      { when: '2003', title: 'First woman Secretary General of the Kenyatta University students’ union', detail: 'Elected while studying for her bachelor’s degree, which she completed in 2004.' },
      { when: '2004 to 2012', title: 'Programme manager', detail: 'Community Projects at the Trust for African Rock Art (2004 to 2008), then Liverpool VCT Care and Treatment (2008 to 2012). Completed her master’s in health management in 2012.' },
      { when: '2013', title: 'Elected Woman Representative, Homa Bay County', detail: 'The first woman to hold the seat. Joined the Parliamentary Service Commission, becoming the first woman from the Nyanza region to serve as a commissioner, and the House Business Committee.' },
      { when: '2017', title: 'Re-elected unopposed', detail: 'Retained the Woman Representative seat and led Raila Odinga’s Nyanza presidential campaign team.' },
      { when: '2018', title: 'Secretary, ODM Central Management Committee', detail: 'Also serves as chairperson of the ODM in Homa Bay County.' },
      { when: '2020', title: 'First woman to chair the Finance and National Planning Committee', detail: 'Chaired the Departmental Committee on Finance and National Planning in the National Assembly.' },
      { when: '2022', title: 'Elected Governor of Homa Bay County', detail: 'Lead campaigner for the Azimio la Umoja coalition and one of seven women elected governor. Took office on 25 August 2022, the first woman to lead the county.' },
    ],
    education: [
      { when: '2010 to 2012', title: 'MSc, Health Management', detail: 'Kenyatta University' },
      { when: '2000 to 2004', title: 'BSc, Health Management', detail: 'Kenyatta University' },
      { when: '2008 to 2009', title: 'Diploma in Project Management', detail: 'Kenya Institute of Management' },
    ],
  },

  delivery: {
    stats: [
      { value: 8, label: 'Sub-counties in Homa Bay County' },
      { value: 40, label: 'Wards across the county' },
      { value: 1131950, label: 'Residents counted in the 2019 census' },
      { value: 7, label: 'Women elected governor in 2022' },
      { value: 13, label: 'Years in elected office since 2013' },
    ],
    basis:
      'Under Article 179 of the Constitution of Kenya, the executive authority of the county is vested in a county executive committee made up of the Governor, the Deputy Governor and the members the Governor appoints, with the approval of the county assembly.',
    functions: [
      'Heads the county executive committee and the county government.',
      'Appoints, with the approval of the county assembly, the members of the county executive committee, and may dismiss them.',
      'Represents the county in intergovernmental forums and in dealings with the national government.',
      'Gives assent to bills passed by the county assembly.',
      'Submits county plans and policies to the county assembly for approval.',
      'Delivers an annual address to the county assembly on the state of the county.',
      'Promotes democracy, good governance, unity and cohesion in the county.',
      'Promotes peace and order within the county.',
    ],
    exec: [
      { role: 'Governor', name: 'Gladys Wanga', note: 'Elected August 2022. Second Governor of Homa Bay County.' },
      { role: 'Deputy Governor', name: 'Danish Otieno Onyango', note: 'Deputy to the Governor.' },
      { role: 'County Secretary', name: '', note: 'Head of the county public service' },
      { role: 'County Executive Committee Members', name: '', note: 'Heads of the county departments, appointed by the Governor with the approval of the county assembly. The office lists them here.' },
    ],
    execIntro: 'The county executive committee carries out the work of the county government. Names are added here by the Governor’s office once confirmed.',
    commitments: [
      { name: 'Homa Bay County', role: 'Governor', note: 'Since 25 August 2022. The first woman to lead the county.' },
      { name: 'Orange Democratic Movement, Homa Bay branch', role: 'Chairperson', note: 'Leads the party in the county.' },
      { name: 'ODM Central Management Committee', role: 'Secretary', note: 'Since 2018.' },
    ],
    source: 'Sources: the Constitution of Kenya (Article 179), the Parliament of Kenya member profile, Wikipedia and the EJS Center profile. Population and ward figures: Kenya 2019 census and IEBC. The office updates these pages from the dashboard.',
  },

  county: {
    intro: 'Homa Bay County lies on the south-eastern shore of Lake Victoria in the former Nyanza Province. Its headquarters is Homa Bay town.',
    facts: [
      { label: 'County code', value: '43' },
      { label: 'Headquarters', value: 'Homa Bay town' },
      { label: 'Population, 2019', value: '1,131,950' },
      { label: 'Governor', value: 'Gladys Wanga' },
    ],
    subcounties: ['Homa Bay Town', 'Kabondo Kasipul', 'Karachuonyo', 'Kasipul', 'Mbita', 'Ndhiwa', 'Rangwe', 'Suba'],
    note: 'The eight sub-counties above follow the constituencies of Homa Bay County. Figures: Kenya National Bureau of Statistics 2019 census.',
  },

  contact: {
    office: 'Office of the Governor, Homa Bay County',
    assembly: 'Homa Bay town, Homa Bay County',
    email: '',
    phone: '',
    social: [
      { label: 'Facebook', url: 'https://www.facebook.com/GladysWanga043/' },
      { label: 'X', url: 'https://x.com/gladyswanga' },
      { label: 'Instagram', url: 'https://www.instagram.com/hon.gladyswanga/' },
    ],
    links: [
      { label: 'Parliament of Kenya member profile', url: 'https://www.parliament.go.ke/index.php/the-national-assembly/hon-wanga-gladys-atieno-nyasuna' },
      { label: 'Mzalendo profile', url: 'https://info.mzalendo.com/person/gladys-atieno-nyasuna/' },
      { label: 'EJS Center profile', url: 'https://ejscenter.org/ejs-amujae-leaders/gladys-wanga/' },
      { label: 'Kenya Women Parliamentary Association', url: 'https://www.kewopa.org/?page_id=843' },
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Gladys_Wanga' },
    ],
  },

  positions: [
    { id: 'governor', title: 'Governor', organisation: 'Homa Bay County', category: 'County', period: '2022 to present', description: 'Heads the county executive. The first woman elected to the office.', order: 1 },
    { id: 'odm-hbc', title: 'Chairperson', organisation: 'ODM, Homa Bay County', category: 'Party', period: 'Current', description: 'Leads the Orange Democratic Movement in the county.', order: 2 },
    { id: 'odm-cmc', title: 'Secretary', organisation: 'ODM Central Management Committee', category: 'Party', period: '2018 onward', description: 'Party secretary on the central management committee.', order: 3 },
    { id: 'woman-rep', title: 'Woman Representative', organisation: 'Homa Bay County, National Assembly', category: 'Parliament', period: '2013 to 2022', description: 'The first woman to hold the seat. Retained it unopposed in 2017.', order: 4 },
    { id: 'fnp', title: 'Chairperson', organisation: 'Departmental Committee on Finance and National Planning', category: 'Parliament', period: '2020 to 2022', description: 'The first woman to chair the committee.', order: 5 },
    { id: 'psc', title: 'Commissioner', organisation: 'Parliamentary Service Commission', category: 'Parliament', period: '2013 to 2022', description: 'The first woman from the Nyanza region to serve as a commissioner.', order: 6 },
    { id: 'lsw', title: 'Member', organisation: 'Departmental Committee on Labour and Social Welfare', category: 'Parliament', period: '2013 to 2022', description: '', order: 7 },
    { id: 'hbc', title: 'Member', organisation: 'House Business Committee', category: 'Parliament', period: '2013 to 2017', description: '', order: 8 },
    { id: 'embrace', title: 'Founding member', organisation: 'Embrace Kenya movement', category: 'Movements', period: '', description: 'A movement that promoted the Building Bridges Initiative.', order: 9 },
  ],

  engagements: [
    {
      id: '2022-governor',
      title: 'Took office as Governor of Homa Bay County',
      category: 'County leadership',
      date: '2022-08-25',
      venue: 'Homa Bay County',
      description: 'Succeeded Cyprian Awiti as the second Governor of Homa Bay County and the first woman elected to the office, with Danish Otieno Onyango as Deputy Governor.',
      photos: [],
    },
    {
      id: '2022-azimio',
      title: 'Lead campaigner for Azimio la Umoja',
      category: 'Party and campaigns',
      date: '2022-06',
      venue: 'Homa Bay County',
      description: 'Was the lead campaigner for the Azimio la Umoja coalition in the 2022 election, the same election in which she was elected Governor.',
      photos: [],
    },
    {
      id: '2020-finance',
      title: 'First woman to chair the Finance and National Planning Committee',
      category: 'Parliament',
      date: '2020',
      venue: 'National Assembly, Nairobi',
      description: 'Took the chair of the Departmental Committee on Finance and National Planning, which scrutinises the national budget and public finance legislation.',
      photos: [],
    },
    {
      id: '2013-woman-rep',
      title: 'Elected first Woman Representative for Homa Bay County',
      category: 'Parliament',
      date: '2013-03',
      venue: 'Homa Bay County',
      description: 'Entered national politics in 2013 and held the seat until 2022, retaining it unopposed in 2017.',
      photos: [],
    },
  ],

  press: [
    {
      id: 'parliament-profile',
      title: 'Hon. Wanga, Gladys Atieno Nyasuna: member profile',
      outlet: 'Parliament of Kenya',
      date: '2022',
      url: 'https://www.parliament.go.ke/index.php/the-national-assembly/hon-wanga-gladys-atieno-nyasuna',
      image: '',
      category: 'Profile',
      summary: 'The National Assembly’s record of her committees, education and professional background from March 2013.',
    },
    {
      id: 'ejs-profile',
      title: 'Gladys Wanga, EJS Amujae Leaders',
      outlet: 'EJS Center',
      date: '',
      url: 'https://ejscenter.org/ejs-amujae-leaders/gladys-wanga/',
      image: '',
      category: 'Profile',
      summary: 'A profile of her path from student leadership to Governor, and her advocacy for women’s empowerment.',
    },
    {
      id: 'mzalendo-profile',
      title: 'Gladys Atieno Nyasuna on Mzalendo',
      outlet: 'Mzalendo',
      date: '',
      url: 'https://info.mzalendo.com/person/gladys-atieno-nyasuna/',
      image: '',
      category: 'Profile',
      summary: 'The parliamentary monitoring profile covering her party, student politics and background.',
    },
    {
      id: 'wikipedia',
      title: 'Gladys Wanga',
      outlet: 'Wikipedia',
      date: '',
      url: 'https://en.wikipedia.org/wiki/Gladys_Wanga',
      image: '',
      category: 'Profile',
      summary: 'Biography, education and offices held.',
    },
  ],

  gallery: [],
}
