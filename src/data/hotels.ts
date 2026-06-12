import { Hotel, TripCosts, GroupSize } from '../types';
import { formatTripMoney } from '../utils/currency';

// Sample manually collected reviews for Hotel Grand Pacific, Cox’s Bazar
export const GRAND_PACIFIC_REVIEWS = [
  {
    author: 'Yasir Babu',
    date: '01 April 2026',
    score: 4,
    status: 'Very Good',
    text: 'Overall, the experience was good. When I arrived, there were some issues, but after I contacted support, they solved the problem quickly. The best part was that the team stayed in active communication and resolved the issue as soon as possible. It was a happy and comfortable stay.'
  },
  {
    author: 'Nupur Chowdhury',
    date: '02 March 2026',
    score: 4,
    status: 'Very Good',
    text: 'The lobby, swimming pool, and rooms were excellent, but hot water supply was not available during the stay. Food was also very good.'
  },
  {
    author: 'Apu Dev',
    date: '15 March 2026',
    score: 4,
    status: 'Very Good',
    text: 'It is an under-construction hotel, so some facilities were absent. Overall the experience was good.'
  },
  {
    author: 'Rafiqul Haque Rashel',
    date: '25 March 2026',
    score: 3,
    status: 'Average',
    text: 'The number of hotel staff is very low. Service was slow. Breakfast quality and quantity need improvement. Facilities need to improve.'
  },
  {
    author: 'SHEIKH FORID LITON',
    date: '27 March 2026',
    score: 5,
    status: 'Outstanding',
    text: 'Everything is good.'
  },
  {
    author: 'MD HASSIBUL HAKAM IBN SAMAD',
    date: '27 March 2026',
    score: 5,
    status: 'Outstanding',
    text: 'Nice stay, but the swimming pool section needs improvement. No warm water bath and the pool is small.'
  },
  {
    author: 'Habibul Islam',
    date: '29 March 2026',
    score: 4,
    status: 'Very Good',
    text: 'No written review provided.'
  },
  {
    author: 'Mr. Hiran Mitra Chakma',
    date: '18 May 2026',
    score: 4,
    status: 'Very Good',
    text: 'No written review provided.'
  },
  {
    author: 'ANWAR HOSEN',
    date: '29 March 2026',
    score: 5,
    status: 'Outstanding',
    text: 'No written review provided.'
  },
  {
    author: 'Sudip Sarker',
    date: '30 March 2026',
    score: 3,
    status: 'Average',
    text: 'Improve staff behaviour. Others are not bad.'
  }
];

// Sample manually collected reviews for Hotel Windy Terrace, Cox’s Bazar
export const WINDY_TERRACE_REVIEWS = [
  {
    author: 'Md.Abir Ahmed',
    date: '19 December 2025',
    score: 4,
    status: 'Very Good',
    text: 'Windy Terrace is close to Kalatali Beach, around a 5-7 minute walk, but far enough from main road noise. Staff are polite and helpful. Check-in is usually smooth. Rooms have comfortable beds, working AC, decent Wi-Fi, and Smart Android TV. The free breakfast buffet has a good mix of local Bengali food and some continental items. Good mid-range boutique hotel for couples or small families.'
  },
  {
    author: 'Sharif Zzaman',
    date: '17 December 2025',
    score: 4,
    status: 'Very Good',
    text: 'No written review provided.'
  },
  {
    author: 'Md Joynal Abedin Joynal',
    date: '20 December 2025',
    score: 5,
    status: 'Outstanding',
    text: 'No written review provided.'
  },
  {
    author: 'Hamim Rahman',
    date: '21 December 2025',
    score: 4,
    status: 'Very Good',
    text: 'No written review provided.'
  },
  {
    author: 'Moin Sikder',
    date: '01 April 2026',
    score: 4,
    status: 'Very Good',
    text: 'No written review provided.'
  },
  {
    author: 'Tareq Ahmed Raju',
    date: '23 December 2025',
    score: 4,
    status: 'Very Good',
    text: 'No written review provided.'
  },
  {
    author: 'Nilam Saha',
    date: '26 December 2025',
    score: 5,
    status: 'Outstanding',
    text: 'No written review provided.'
  },
  {
    author: 'Kamrul Kamrul',
    date: '29 December 2025',
    score: 5,
    status: 'Outstanding',
    text: 'Good Resort.'
  },
  {
    author: 'SUJON ISLAM',
    date: '29 December 2025',
    score: 5,
    status: 'Outstanding',
    text: 'No written review provided.'
  },
  {
    author: 'Farhat Zaman',
    date: '01 January 2026',
    score: 5,
    status: 'Outstanding',
    text: 'No written review provided.'
  }
];

// Sample manually collected reviews for Hotel Sea Crown, Cox’s Bazar
export const SEA_CROWN_REVIEWS = [
  {
    author: 'MOSTOFA HAIDER',
    date: '09 January 2026',
    score: 4,
    status: 'Very Good',
    text: 'Very good hotel to stay with the great beach view of Cox’s Bazar.'
  },
  {
    author: 'Md Tuhin Ahmed',
    date: '26 January 2026',
    score: 2,
    status: 'Rating Score',
    text: 'The bed and bed set are dirty.'
  },
  {
    author: 'Md. Salim Ahmed Ahmed',
    date: '28 March 2026',
    score: 1,
    status: 'Rating Score',
    text: 'Bad.'
  },
  {
    author: 'MD SOLAIMAN HOSSAIN',
    date: '19 January 2026',
    score: 1,
    status: 'Rating Score',
    text: 'No written review provided.'
  },
  {
    author: 'Mustafa Kanan',
    date: '01 April 2026',
    score: 4,
    status: 'Very Good',
    text: 'Best location.'
  },
  {
    author: 'Alamgir Mondol',
    date: '24 March 2026',
    score: 4,
    status: 'Very Good',
    text: 'Overall good. Suggested booking a sea-view room because the hotel is very close to the sea beach.'
  },
  {
    author: 'Anwar Uddin Ahmed',
    date: '30 December 2025',
    score: 5,
    status: 'Outstanding',
    text: 'Guest felt like home.'
  },
  {
    author: 'Md Shakil Khan',
    date: '14 May 2026',
    score: 5,
    status: 'Outstanding',
    text: 'Fairly good. Food quality was good.'
  },
  {
    author: 'Md.Al-Wakil Mazumder',
    date: '09 February 2026',
    score: 4,
    status: 'Very Good',
    text: 'No written review provided.'
  },
  {
    author: 'Nahid Hasan Jamil',
    date: '31 January 2026',
    score: 5,
    status: 'Outstanding',
    text: 'They are well behaved. Service is good.'
  }
];

// Sample manually collected reviews for Hotel Sea Uttara
export const SEA_UTTARA_REVIEWS = [
  {
    author: 'Md Tazmir Bhuiyan',
    date: '20 December 2025',
    score: 4,
    status: 'Very Good',
    text: 'No written review provided.'
  },
  {
    author: 'Liton Sarker',
    date: '20 December 2025',
    score: 4,
    status: 'Very Good',
    text: 'The guest said they did not get the room as per booking. They expected a higher-floor room with a better sea view but received a 6th-floor room without a good view. Other things were okay.'
  },
  {
    author: 'Mahmud Hasan Menon',
    date: '21 December 2025',
    score: 4,
    status: 'Very Good',
    text: 'No written review provided.'
  },
  {
    author: 'MD MEHEDI HASAN RIAZ',
    date: '28 April 2026',
    score: 5,
    status: 'Outstanding',
    text: 'No written review provided.'
  },
  {
    author: 'JANNATUL FERDOUS',
    date: '25 April 2026',
    score: 3,
    status: 'Average',
    text: 'The guest had a bad experience and said the room was uncomfortable and not clean. They stayed one night and did not extend because the room and bathroom quality were poor.'
  },
  {
    author: 'Samiha Afroz Khanam',
    date: '09 January 2026',
    score: 2,
    status: 'Rating Score',
    text: 'The guest said night staff were rude during check-in. Morning staff were good, but breakfast items were not up to the mark.'
  },
  {
    author: 'MD MOZAHIDUL ISLAM BOKHARY',
    date: '12 January 2026',
    score: 5,
    status: 'Outstanding',
    text: 'No written review provided.'
  },
  {
    author: 'Shahriar Omar',
    date: '05 April 2026',
    score: 5,
    status: 'Outstanding',
    text: 'No written review provided.'
  },
  {
    author: 'Kazi Talim',
    date: '18 January 2026',
    score: 5,
    status: 'Outstanding',
    text: 'Expectations met reality within budget. Good.'
  },
  {
    author: 'Marufur Rahman',
    date: '20 January 2026',
    score: 3,
    status: 'Average',
    text: 'No written review provided.'
  }
];

export const WHITE_ORCHID_SAPPHIRE_REVIEWS = [
  {
    author: 'kazi nazrul islam',
    date: '27 April 2026',
    score: 5,
    status: 'Outstanding',
    text: 'Great stay at White Orchid Sapphire. The guest said it is one of the better choices in the Kolatoli area. They liked the buffet breakfast, fresh food, local Bengali items, modern clean rooms, working AC, quiet location, and polite staff. They would return for the breakfast spread.'
  },
  {
    author: 'ROBI ULLAH',
    date: '16 May 2026',
    score: 5,
    status: 'Outstanding',
    text: 'Overall good.'
  },
  {
    author: 'Abdullah-Al-Baki Aornob',
    date: '24 December 2025',
    score: 4,
    status: 'Very Good',
    text: 'No written review provided.'
  },
  {
    author: 'Debajit Ghosh',
    date: '28 December 2025',
    score: 5,
    status: 'Outstanding',
    text: 'No written review provided.'
  },
  {
    author: 'Rupkumar Karmakar',
    date: '24 April 2026',
    score: 3,
    status: 'Average',
    text: 'The guest said it was not appropriate for ocean view and felt like a fully closed environment.'
  },
  {
    author: 'Arittra Ghosh',
    date: '04 January 2026',
    score: 5,
    status: 'Outstanding',
    text: 'No written review provided.'
  },
  {
    author: 'Md. Jashim Uddin Dipu',
    date: '04 January 2026',
    score: 4,
    status: 'Very Good',
    text: 'No written review provided.'
  },
  {
    author: 'Mashruk Asad',
    date: '08 January 2026',
    score: 5,
    status: 'Outstanding',
    text: 'Very good-looking boutique hotel. The guest said it feels like a Bangkok boutique hotel, family friendly and budget friendly. Staff were well behaved. Location is not far from the beach, though the view is an issue.'
  },
  {
    author: 'Zubayer Novel',
    date: '24 April 2026',
    score: 5,
    status: 'Outstanding',
    text: 'The overall experience was more than expected. Spacious rooms, delicious food, attentive service, and environment made the stay worthwhile for the price. Buffet breakfast quality could improve slightly.'
  },
  {
    author: 'Masiat Mohammad',
    date: '02 April 2026',
    score: 2,
    status: 'Rating Score',
    text: 'No written review provided.'
  }
];

export const WHITE_ORCHID_REVIEWS = [
  {
    author: 'SHAMIM HOSSAIN',
    date: '20 December 2025',
    score: 4,
    status: 'Very Good',
    text: 'Just awesome hotel.'
  },
  {
    author: 'B.M.Omor Faruq',
    date: '29 December 2025',
    score: 5,
    status: 'Outstanding',
    text: 'The experience was great honestly.'
  },
  {
    author: 'Abdul Matin',
    date: '11 January 2026',
    score: 5,
    status: 'Outstanding',
    text: 'thanks to white orchid'
  },
  {
    author: 'Majbahul Alam',
    date: '11 January 2026',
    score: 5,
    status: 'Outstanding',
    text: 'No written review provided.'
  },
  {
    author: 'Ridoy Rahman',
    date: '17 May 2026',
    score: 5,
    status: 'Outstanding',
    text: 'No written review provided.'
  },
  {
    author: 'Bijoy Mazumder',
    date: '21 March 2026',
    score: 2,
    status: 'Rating Score',
    text: 'It was the worst experience in my life.'
  },
  {
    author: 'Md Shahriyar Hasan',
    date: '23 January 2026',
    score: 5,
    status: 'Outstanding',
    text: 'No written review provided.'
  },
  {
    author: 'MD RIDWAN UL ISLAM NILOY',
    date: '26 January 2026',
    score: 4,
    status: 'Very Good',
    text: 'No written review provided.'
  },
  {
    author: 'Rafiul Haque Tanvir',
    date: '07 February 2026',
    score: 4,
    status: 'Very Good',
    text: 'No written review provided.'
  },
  {
    author: 'Sourov Halder',
    date: '08 February 2026',
    score: 4,
    status: 'Very Good',
    text: 'No written review provided.'
  }
];

export const SURESTAY_REVIEWS = [
  {
    author: 'MD Ibn Sina',
    date: '21 December 2025',
    score: 4,
    status: 'Very Good',
    text: 'I had a pleasant stay at SureStay by Best Western, Cox’s Bazar. The room was clean and well maintained, and the staff were friendly and helpful. The receptionist was particularly cooperative, which made the experience even better. I also enjoyed the breakfast menu. Thank you.'
  },
  {
    author: 'Rifat Rudro',
    date: '22 December 2025',
    score: 5,
    status: 'Outstanding',
    text: 'Best place to stay.'
  },
  {
    author: 'Zaki Md Ziaul Islam',
    date: '22 December 2025',
    score: 4,
    status: 'Very Good',
    text: 'Good well maintained hotel. Staffs are well behaved and cordial. Nice rooftop restaurant, very tasty food. A bit expensive.'
  },
  {
    author: 'Dr.Md.Tofazzale Hosain',
    date: '26 December 2025',
    score: 5,
    status: 'Outstanding',
    text: 'The management of that hotel are so welcoming and helpful, I am very much impressed and recommend that hotel gladly.'
  },
  {
    author: 'Sanjoy Bhowmik',
    date: '29 December 2025',
    score: 4,
    status: 'Very Good',
    text: 'Couple and family friendly, well maintained. According to price should have swimming pool.'
  },
  {
    author: 'Md Jubaidur Rahman',
    date: '30 December 2025',
    score: 4,
    status: 'Very Good',
    text: 'No written review provided.'
  },
  {
    author: 'Md. Ashik Mahmud',
    date: '05 January 2026',
    score: 4,
    status: 'Very Good',
    text: 'Cleanliness at its peak, room service and facilities are very good. Restaurant foods are quite expensive and not up to the mark. Security is outstanding. Everything found very warming and welcoming.'
  },
  {
    author: 'Mohammad Lutful Kabir',
    date: '06 January 2026',
    score: 4,
    status: 'Very Good',
    text: 'No written review provided.'
  },
  {
    author: 'Ahsanur Rahman Shuvo',
    date: '08 March 2026',
    score: 5,
    status: 'Outstanding',
    text: 'No written review provided.'
  },
  {
    author: 'Abrar Masud',
    date: '31 January 2026',
    score: 5,
    status: 'Outstanding',
    text: 'No written review provided.'
  }
];

export const SEA_PARADISE_REVIEWS = [
  {
    author: 'Sakil Adnan',
    date: '18 December 2025',
    score: 4,
    status: 'Very Good',
    text: 'No written review provided.'
  },
  {
    author: 'Ashraf Islam',
    date: '29 December 2025',
    score: 4,
    status: 'Very Good',
    text: 'No written review provided.'
  },
  {
    author: 'Towsif Haider',
    date: '02 January 2026',
    score: 1,
    status: 'Rating Score',
    text: 'No written review provided.'
  },
  {
    author: 'Riddy Raiyan Saimon',
    date: '04 January 2026',
    score: 3,
    status: 'Average',
    text: 'No written review provided.'
  },
  {
    author: 'Rajib kumer Paul',
    date: '24 January 2026',
    score: 5,
    status: 'Outstanding',
    text: 'No written review provided.'
  },
  {
    author: 'Sipu Sarkar',
    date: '19 March 2026',
    score: 5,
    status: 'Outstanding',
    text: 'Everything is good.'
  },
  {
    author: 'Md Saiful Islam Saif',
    date: '28 March 2026',
    score: 3,
    status: 'Average',
    text: 'No written review provided.'
  },
  {
    author: 'Hasan Khan',
    date: '30 March 2026',
    score: 4,
    status: 'Very Good',
    text: 'Swimming pool has small and foods test has good and delicious. at the roof top of the hotel, see the sunset and take tea is a wonderful moments.'
  },
  {
    author: 'Md Niaz Uddin',
    date: '02 May 2026',
    score: 2,
    status: 'Rating Score',
    text: 'No written review provided.'
  },
  {
    author: 'MD AZIZUL Hakim',
    date: '16 April 2026',
    score: 5,
    status: 'Outstanding',
    text: 'No written review provided.'
  }
];

export const GRACE_COX_REVIEWS = [
  {
    author: 'Md Alauddin',
    date: '09 January 2026',
    score: 3,
    status: 'Average',
    text: 'I was shocked when I noticed the spring mattress on bed. Being a 4 star hotel, this is not acceptable at all. Comfort and convenience is the key to customer satisfaction in hospitality industry thus this issue must be addressed immediately.'
  },
  {
    author: 'Ehfaz Rezwan',
    date: '13 January 2026',
    score: 5,
    status: 'Outstanding',
    text: 'Great place to stay for the price! Staff are super friendly and very accommodating.'
  },
  {
    author: 'Md Forhad Hossain',
    date: '25 February 2026',
    score: 3,
    status: 'Average',
    text: 'No written review provided.'
  },
  {
    author: 'Rumana Khatun',
    date: '25 April 2026',
    score: 4,
    status: 'Very Good',
    text: 'No written review provided.'
  }
];

// Images are prepared from the Google Drive hotel image folder and should be placed inside public/hotels/ before deployment.
// Ocean Paradise images are loaded from public Google Drive image thumbnails for demo use. For production stability, local public/hotels assets are recommended.
const getDriveImageUrl = (fileId: string) =>
  `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;

const ALL_HOTELS: Hotel[] = [
  {
    id: 'ocean-paradise',
    hotelGroupId: 'group-ocean-paradise',
    name: 'Ocean Paradise Hotel & Resort',
    roomName: 'Deluxe Double Without Balcony',
    planType: 'Breakfast Included',
    breakfast: true,
    refundable: true,
    basePrice: 7906,
    taxesAndFees: 2094,
    notes: '5-star hotel, airport transfer mentioned, good premium option',
    category: 'premium',
    tags: ['5-Star', 'Airport Transfer', 'Top Rated', 'Couple Friendly'],
    imageUrl: getDriveImageUrl('1fmQqGWL_BAf_ZhI6jsRGxK80DclhzXMi'),
    galleryImages: [
      getDriveImageUrl('1fmQqGWL_BAf_ZhI6jsRGxK80DclhzXMi'),
      getDriveImageUrl('1clvEjmdo2KiRqkU6YXIIlABL_j0thuRo'),
      getDriveImageUrl('1oQwUcdDcxiG2GWt0N_iFAjzEpx2X4We7'),
      getDriveImageUrl('1D7xk92usAvHa4mK8PSFImcmgfiBCaJxy'),
      getDriveImageUrl('1GP6JxR3Y9bGyp00uiRwl40TU3s_jiJcb'),
      getDriveImageUrl('1K2LnA6Ne7ZuJA2AIkmcpwBs4frh0d5Ux'),
      getDriveImageUrl('1rjuL3YZvQHqAxy_mcablKwpnq5RAbKLY')
    ],
    starRating: '5.0 Star',
    details: {
      id: 'ocean-paradise',
      hotelName: 'Ocean Paradise Hotel & Resort',
      roomName: 'Deluxe Double Without Balcony',
      starRating: '5.0 Star',
      address: '28-29, Hotel Motel Zone, Kolatoli, Cox’s Bazar, Bangladesh',
      reviewSummary: {
        text: 'Excellent',
        count: 18,
        score: 4.1,
        locationScore: 4.3,
        comfortScore: 4.2,
        cleanlinessScore: 4.1,
        facilitiesScore: 4.2,
        valueScore: 4.0
      },
      nearby: [
        '0.66 km from Sea Inn Beach Point',
        '0.6 km from Kolatoli Beach',
        '1.1 km from Shalik Restaurant & Biriyani House',
        '4.8 km from Cox’s Bazar Airport'
      ],
      tags: ['Couple Friendly', 'Luxury Pick', 'Premium 5-Star'],
      description: 'Ocean Paradise Hotel & Resort is an excellent choice for travelers visiting Cox’s Bazar, offering a luxury environment alongside many helpful amenities designed to enhance your stay.',
      roomDetails: {
        roomType: 'Double',
        occupancy: '2 Adults, 1 Child',
        adultOccupancy: 2,
        childOccupancy: 1,
        maxGuests: 3,
        size: '320 sq ft',
        view: 'City View'
      },
      roomFacilities: {
        others: ['Housekeeping', '220V Socket', 'Electric Kettle', 'Room Service'],
        bathroom: ['Toiletries', 'Bathroom', 'Hairdryer', 'Hot Water', 'Towels'],
        bedroom: ['Air Conditioning', 'Closet', 'Curtain', 'Blankets'],
        media: ['Cable TV', 'Internet', 'Telephone', 'Wi-Fi'],
        food: ['Coffee/Tea Maker', 'Free Bottled Water']
      },
      hotelFacilities: {
        wellness: ['Swimming Pool', 'Gym', 'Spa & Massage'],
        food: ['Buffet Lunch', 'Buffet Dinner', 'Set Menu Lunch'],
        general: ['Lockers', 'City Centre', 'Smoke detector', 'Check-In', 'Air Conditioning', 'Check-Out', 'Elevator', 'ID Required', 'Couple Friendly'],
        safety: ['24-Hour Security'],
        transport: ['Car Rental', 'Free Airport Shuttle Service']
      },
      policies: {
        checkIn: '14:00',
        checkOut: '12:00',
        childPolicy: 'Allowed. Up to 2 children below 5 years can stay in the same room and enjoy complimentary breakfast.',
        petPolicy: 'Not Allowed',
        houseRules: [
          'For refundable bookings with 72+ hours before check-in, please cancel and rebook for new dates.',
          'Buffet breakfast timing is 7 AM - 10:30 AM.',
          '1 hour access to the swimming pool.'
        ]
      },
      price: 7906,
      taxes: 2094,
      breakfastIncluded: true,
      refundable: true
    }
  },
  {
    id: 'green-nature-resort',
    hotelGroupId: 'group-green-nature',
    name: 'Green Nature Resort and Suites',
    roomName: 'Deluxe King without Balcony, Ground Floor',
    planType: 'Breakfast Included',
    breakfast: true,
    refundable: true,
    basePrice: 7906,
    taxesAndFees: 2094,
    notes: 'Complimentary breakfast & airport shuttle included, lovely resort vibes. 0.35 km from Sugondha Sea Beach.',
    category: 'premium',
    tags: ['Complimentary Breakfast', 'King Bed', 'Couple Friendly', 'Free Airport Shuttle Service', 'Swimming Pool', 'Only 10 rooms left'],
    // Green Nature Resort and Suites images are loaded from public Google Drive image thumbnails for demo use. For production stability, local public/hotels assets are recommended.
    imageUrl: getDriveImageUrl('1lWjeysL7-GMcUmMI0Si1MWvJyXuOyLnf'),
    galleryImages: [
      getDriveImageUrl('1lWjeysL7-GMcUmMI0Si1MWvJyXuOyLnf'),
      getDriveImageUrl('1TK-4P3D4IQeRlk9Q89Zq8ffDrDnqbffp'),
      getDriveImageUrl('1Bg57ibDXssbUHFirGcbRXQKI4zESYimx'),
      getDriveImageUrl('100RCGRqbURjTv_jVRMh-Ssk6e0yRRzmW'),
      getDriveImageUrl('1CwjmXCb4cAOpMtgP-Xz4Wlf0Jsa2hKpz'),
      getDriveImageUrl('1uqu65nWaWbKmGVlyceLoZf6CIJoKxZjz'),
      getDriveImageUrl('1TwCs_nTUWaBnq70WbcsiPvO3PaXidZam'),
      getDriveImageUrl('1Lbrde7u3YdkbL-ID1YxwjkchjCMJuAMQ'),
      getDriveImageUrl('1hEtd0Gq84XOFjGl8jOCz8JHxf2DkUn3N'),
      getDriveImageUrl('140rh6Szjeh3mlf8O1a3QqADNzWMs7W0D'),
      getDriveImageUrl('1qLdDpYnsoC6vBzWW69oA5HyOhWPaUS1f'),
      getDriveImageUrl('1q-VuHmqF0i7dpzR-yPYOlEAPkHIN74lx'),
      getDriveImageUrl('1Fz3LPJ9pN2DYqBVaf1wsbQOIg5Kgk127')
    ],
    starRating: '4.0 Star',
    details: {
      id: 'green-nature-resort',
      hotelName: 'Green Nature Resort and Suites',
      roomName: 'Deluxe King without Balcony (Ground Floor)',
      starRating: '4.0 Star',
      address: '157/A, Sugondha Beach Point Road, Sugondha, Cox’s Bazar, Bangladesh',
      reviewSummary: {
        text: 'Very Good',
        count: 39,
        score: 4.0,
        locationScore: 3.9,
        comfortScore: 4.2,
        cleanlinessScore: 4.3,
        facilitiesScore: 4.0,
        valueScore: 3.9,
        staffScore: 4.1
      },
      nearby: [
        '0.35 km from Sugondha Sea Beach',
        '0.75 km from Kolatoli Beach, Cox’s Bazar',
        '1.2 km from Laboni Beach',
        '4.2 km from Cox’s Bazar Airport',
        '6.2 km from Cox’s Bazar Railway Station',
        '0.4 km from Kolatoli Bus Stand'
      ],
      tags: ['Couple Friendly', 'Free Airport Shuttle Service', 'Swimming Pool'],
      description: 'Green Nature Resort and Suites features a quiet garden context and top-tier amenities just steps away from Sugondha Beach Point. Known for its couples-friendly atmosphere, welcoming staff, and complimentary shuttle dispatch, guests can enjoy a high-quality stay with beautiful interior grounds, sparkling swimming pool, and exceptional hospitality near the heart of Cox’s Bazar.',
      roomDetails: {
        roomType: 'Double',
        occupancy: '2 Adults, 1 Child. Max 2 Guests',
        adultOccupancy: 2,
        childOccupancy: 1,
        maxGuests: 2,
        size: '260 sq.ft',
        view: 'None'
      },
      roomFacilities: {
        bedroom: ['Air Conditioning', 'Closet', 'Blankets', 'Iron & Ironing Board', 'In-room safe/locker'],
        media: ['Flat-screen TV with satellite channels', 'Wi-Fi Coverage'],
        food: ['Electric Kettle', 'Free Bottled Water', 'Tea & Coffee ingredients'],
        bathroom: ['Complimentary Toiletries', 'En-suite Private Bathroom', 'Hot Water', 'Towels', 'Shower cap'],
        others: ['Housekeeping service', 'Power outlets', 'Room Service']
      },
      hotelFacilities: {
        wellness: ['Swimming Pool', 'Spa & Wellness Center'],
        food: ['Complimentary buffet breakfast', 'Coffee/Tea in Lobby', 'Onsite dine-in restaurant'],
        general: ['Accessible Bathroom', 'Air Conditioning', 'Elevator', 'In-room Accessibility', 'Check-In', 'Check-Out', '24-hour Front Desk', 'Gardens', 'Non-smoking property'],
        parking: ['Free Onsite Parking'],
        safety: ['24-Hour Security', 'CCTV in common areas', 'Smoke Detectors'],
        transport: ['Free Airport Shuttle Service', 'Car Rental assistance']
      },
      policies: {
        checkIn: '14:00 (19 Jun 2026, Friday)',
        checkOut: '12:00 (21 Jun 2026, Sunday)',
        childPolicy: 'Complimentary child occupancy up to 1 child. On Demand Extra Bed is not available. Maximum occupancy restricts to 2 adult guests.',
        petPolicy: 'Not Allowed',
        houseRules: [
          'Complimentary buffet breakfast with airport transfer included.',
          'A valid Government-issued Photo ID (e.g., NID, passport) is required at check-in.',
          'Couple-friendly: Marriage certificate or matching IDs might be requested per local policies.',
          'Outside food is restricted in public dining zones.',
          'Refund policy: Free cancellation if requested within refundable timeline bounds.'
        ]
      },
      price: 7906,
      taxes: 2094,
      breakfastIncluded: true,
      refundable: true,
      reviews: [
        {
          author: 'Md Saifur Rahman',
          date: '01 April 2026',
          score: 1,
          status: 'Poor',
          text: 'The road to the hotel was very bad according to the guest. They complained that traveling through the road in front of the hotel by rickshaw, auto-rickshaw, or private car was uncomfortable.'
        },
        {
          author: 'Iffat Jahan Erin',
          date: '20 December 2025',
          score: 5,
          status: 'Outstanding',
          text: 'No written review provided.'
        },
        {
          author: 'MD Ridwanul Akbar',
          date: '28 December 2025',
          score: 4,
          status: 'Very Good',
          text: 'They forgot to give complimentary juice, otherwise service was good.'
        },
        {
          author: 'Afsana Bintay Kabir',
          date: '28 April 2026',
          score: 4,
          status: 'Very Good',
          text: 'No written review provided.'
        },
        {
          author: 'Rafsun Mahmud',
          date: '02 January 2026',
          score: 4,
          status: 'Very Good',
          text: 'No written review provided.'
        },
        {
          author: 'Sheikh Shabbir Hossain',
          date: '10 January 2026',
          score: 3,
          status: 'Average',
          text: 'No written review provided.'
        },
        {
          author: 'Fuad Hasan Chowdhury',
          date: '11 January 2026',
          score: 4,
          status: 'Very Good',
          text: 'No written review provided.'
        },
        {
          author: 'Md Zarin Tasnim',
          date: '08 January 2026',
          score: 5,
          status: 'Outstanding',
          text: 'No written review provided.'
        },
        {
          author: 'Kamal Hossain',
          date: '12 January 2026',
          score: 5,
          status: 'Outstanding',
          text: 'Staying experience was excellent and staff behaviour and inside environment were fantastic.'
        },
        {
          author: 'Kamal Hossain',
          date: '12 January 2026',
          score: 4,
          status: 'Very Good',
          text: 'Excellent experience. Will stay again.'
        }
      ]
    }
  },
  {
    id: 'windy-terrace-standard',
    hotelGroupId: 'group-windy-terrace',
    name: 'Windy Terrace Hotel',
    roomName: 'Standard King Deluxe',
    planType: 'Breakfast Included',
    breakfast: true,
    refundable: true,
    basePrice: 6552,
    taxesAndFees: 1736,
    notes: 'Good mid-range option. Only 10 rooms left!',
    category: 'mid-range',
    tags: ['Couple Friendly', 'Only 10 rooms left'],
    // Windy Terrace Hotel images are loaded from public Google Drive image thumbnails for demo use. General hotel images are shared across both Windy Terrace room option galleries. For production stability, local public/hotels assets are recommended.
    imageUrl: getDriveImageUrl('1X1muwdGzke1LesrYS4VLMUk3t679uflb'),
    galleryImages: [
      getDriveImageUrl('1X1muwdGzke1LesrYS4VLMUk3t679uflb'),
      getDriveImageUrl('1OZUHoQfkNYDDEww-PL2DTYz5vJyT4LG2'),
      getDriveImageUrl('1PqPApxBxJFyjWffbvwjf6BrKG4HqzkVs'),
      getDriveImageUrl('1giKRTiF0pGz2RULmnbziYQwPL4ZyITLo'),
      getDriveImageUrl('1cI5q4EZUpOqk6VbbnNpyTwqdYgch_cjb'),
      getDriveImageUrl('1mNR77K4jXNsXL9Q9HDp02Ir0RXjzHBVk'),
      getDriveImageUrl('16xFnjMUWDtbLRQRyp1Vmx2Eb-RWiOK6p'),
      getDriveImageUrl('1XD0qkzGI-sQNt1j9PErbgAK1sLk2EA_e'),
      getDriveImageUrl('1P9E9IRT5Tof-hAfP5LPBwogwJs2g9Jzb'),
      getDriveImageUrl('1T9foYqH7cVN632WXDkui8dIYgVQ0w4pf'),
      getDriveImageUrl('1a2-pQzPRAsp4mub4p5gW6QsLkBXP0SfW'),
      getDriveImageUrl('11dFglzWajT7n79XbJjqFx6oOzTIr_nSq')
    ],
    starRating: '3.0 Star',
    details: {
      id: 'windy-terrace-standard',
      hotelName: 'Windy Terrace Hotel',
      roomName: 'Standard King Deluxe',
      starRating: '3.0 Star',
      address: 'Plot # 39-40, Block-C, Kolotaoli, Cox’s Bazar-4700, Hotel–Motel Zone, Cox’s Bazar, Bangladesh',
      reviewSummary: {
        text: 'Very Good',
        count: 26,
        score: 4.0,
        staffScore: 4.2,
        comfortScore: 4.2,
        locationScore: 4.2,
        facilitiesScore: 4.0,
        cleanlinessScore: 4.5,
        valueScore: 4.2
      },
      nearby: [
        '0.8 km from Kolatoli Beach',
        '4.1 km from Cox’s Bazar Airport',
        '6.9 km from Cox’s Bazar Railway Station'
      ],
      tags: ['Couple Friendly'],
      description: 'Number of Rooms: 163\nNumber of Floors: 13\n\nHotel Windy Terrace features air-conditioned accommodation in Cox’s Bazar. Among the facilities of this property are a swimming pool, a restaurant, a 24-hour front desk, and room service, along with free WiFi. The rooms at the hotel are fitted with a seating area. Hotel Windy Terrace rooms have a desk, a flat-screen TV, and a private bathroom. The accommodation offers a continental or Asian breakfast.',
      roomDetails: {
        roomType: 'Double',
        occupancy: '2 Adults, 1 Child',
        adultOccupancy: 2,
        childOccupancy: 1,
        maxGuests: 3,
        size: '310 sq.ft',
        view: 'None'
      },
      roomFacilities: {
        bathroom: ['Bathroom', 'Hot Water', 'Toiletries', 'Towels'],
        others: ['Housekeeping', 'Slippers', '220V Socket'],
        food: ['Free Bottled Water', 'Mini Fridge'],
        bedroom: ['Air Conditioning', 'In-Room Safe', 'Blankets', 'Closet', 'Curtain', 'Extra Bedding'],
        media: ['Wi-Fi', 'TV', 'Cable TV', 'Internet', 'Telephone', 'Television Content']
      },
      hotelFacilities: {
        business: ['Auditorium'],
        wellness: ['Swimming Pool', 'Massage'],
        food: ['Set Menu Lunch', 'Brunch'],
        general: ['Smoke detector', 'Towel', 'Coffee/Tea in Lobby', 'Sofa Bed', 'Elevator', 'Air Conditioning', 'Check-In', 'Check-Out', 'Clothes Dryer', 'ID Required', 'Lockers', 'Couple Friendly', 'Disability Friendly', 'Garden'],
        media: ['Photocopier', 'Printer', 'Telephone', 'Mobile Phone Coverage'],
        safety: ['24-Hour Security'],
        services: ['Medical Service'],
        transport: ['Airport Shuttle Service', 'Car Rental', 'Free Airport Shuttle Service']
      },
      policies: {
        checkIn: '14:00 (19 Jun 2026, Friday)',
        checkOut: '12:00 (21 Jun 2026, Sunday)',
        childPolicy: 'Allowed\n\nChildren under 5 years of age can stay in the same room and enjoy a complimentary breakfast.\nChildren above 5 years to 11 years can stay in the same room but need to pay breakfast cost of 380 BDT.\nChildren from 12 years of age will be considered adults, and an extra bed will be required.\nThe rate of an extra bed with breakfast is BDT 1,500.\nThe charge for an extra bed and breakfast may change at any time as per the hotel’s policy prior to the check-in date.',
        petPolicy: 'Not Allowed',
        houseRules: [
          'Hotel check-in time is 14:00 / 2:00 PM, and check-out time is 12:00 / 12:00 PM.',
          'Buffet breakfast timing is 7:00 AM - 10:00 AM.',
          '1 hour swimming pool access. Timing is within 9:00 AM - 5:00 PM.',
          'Complimentary airport transfer.',
          'Additional charges may apply for late check-out.',
          'Please bring NID or passport copies at the time of check-in.',
          'Any cancellation must be processed 24 hours prior to the check-in date. Cancellations made later than this lead period will incur a charge of one night per room booked.',
          'Actual charges will be calculated by the hotel in its local currency.',
          'Early check-in and late check-out are not guaranteed. It is subject to availability and at the property’s discretion. It might be chargeable.',
          'Room rents are non-refundable on block dates and long holidays.',
          'Outside food is not allowed in the hotel premises.',
          'Arms and pets are not allowed in the room.',
          'The rate of an extra bed with breakfast is BDT 1,500.',
          'No driver accommodation is available at the hotel premise.'
        ]
      },
      price: 6552,
      taxes: 1736,
      breakfastIncluded: true,
      refundable: true,
      reviews: WINDY_TERRACE_REVIEWS
    }
  },
  {
    id: 'windy-terrace-superior',
    hotelGroupId: 'group-windy-terrace',
    name: 'Windy Terrace Hotel',
    roomName: 'Superior King Deluxe',
    planType: 'Breakfast Included',
    breakfast: true,
    refundable: true,
    basePrice: 7261,
    taxesAndFees: 1923,
    notes: 'Premium superior double option. Only 10 rooms left!',
    category: 'mid-range',
    tags: ['Couple Friendly', 'Only 10 rooms left'],
    imageUrl: getDriveImageUrl('101VULAH7LGsEd61jJHgOa27kl4zbq3Dq'),
    galleryImages: [
      getDriveImageUrl('101VULAH7LGsEd61jJHgOa27kl4zbq3Dq'),
      getDriveImageUrl('1y6H9R7gOfPlH8vv2mp13XSenAUuqUAL9'),
      getDriveImageUrl('1LlWeU20qLQAtTNTtQUR5WlG2zxr_evof'),
      getDriveImageUrl('1sSjla1GSC2kSOA9khfW-shXz0HfjceLJ'),
      getDriveImageUrl('1TUk9cMro-wg9ePZY7GzXMgZ7PhnxfuL-'),
      getDriveImageUrl('1CO8L1m-NegiHIEyU6wONaFT61S6wOB0_'),
      getDriveImageUrl('1mNR77K4jXNsXL9Q9HDp02Ir0RXjzHBVk'),
      getDriveImageUrl('16xFnjMUWDtbLRQRyp1Vmx2Eb-RWiOK6p'),
      getDriveImageUrl('1XD0qkzGI-sQNt1j9PErbgAK1sLk2EA_e'),
      getDriveImageUrl('1P9E9IRT5Tof-hAfP5LPBwogwJs2g9Jzb'),
      getDriveImageUrl('1T9foYqH7cVN632WXDkui8dIYgVQ0w4pf'),
      getDriveImageUrl('1a2-pQzPRAsp4mub4p5gW6QsLkBXP0SfW'),
      getDriveImageUrl('11dFglzWajT7n79XbJjqFx6oOzTIr_nSq')
    ],
    starRating: '3.0 Star',
    details: {
      id: 'windy-terrace-superior',
      hotelName: 'Windy Terrace Hotel',
      roomName: 'Superior King Deluxe',
      starRating: '3.0 Star',
      address: 'Plot # 39-40, Block-C, Kolotaoli, Cox’s Bazar-4700, Hotel–Motel Zone, Cox’s Bazar, Bangladesh',
      reviewSummary: {
        text: 'Very Good',
        count: 26,
        score: 4.0,
        staffScore: 4.2,
        comfortScore: 4.2,
        locationScore: 4.2,
        facilitiesScore: 4.0,
        cleanlinessScore: 4.5,
        valueScore: 4.2
      },
      nearby: [
        '0.8 km from Kolatoli Beach',
        '4.1 km from Cox’s Bazar Airport',
        '6.9 km from Cox’s Bazar Railway Station'
      ],
      tags: ['Couple Friendly'],
      description: 'Number of Rooms: 163\nNumber of Floors: 13\n\nHotel Windy Terrace features air-conditioned accommodation in Cox’s Bazar. Among the facilities of this property are a swimming pool, a restaurant, a 24-hour front desk, and room service, along with free WiFi. The rooms at the hotel are fitted with a seating area. Hotel Windy Terrace rooms have a desk, a flat-screen TV, and a private bathroom. The accommodation offers a continental or Asian breakfast.',
      roomDetails: {
        roomType: 'Double',
        occupancy: '2 Adults, 1 Child',
        adultOccupancy: 2,
        childOccupancy: 1,
        maxGuests: 3,
        size: '300 sq.ft',
        view: 'City View'
      },
      roomFacilities: {
        bedroom: ['Air Conditioning', 'Fan', 'Cot on Demand', 'In-Room Safe', 'Blankets', 'Carpeted floors', 'Closet', 'Curtain'],
        media: ['Cable TV', 'TV', 'Wi-Fi', 'Telephone'],
        food: ['Mini Fridge', 'Free Bottled Water', 'Coffee/Tea Maker'],
        others: ['Soundproof', 'Slippers', 'Safe', 'Room Service', 'Non-Smoking', 'Make-up Mirror', 'Linens', 'Housekeeping', 'Free Newspaper', '220V Socket', 'Electric Kettle', 'Smoke detector'],
        bathroom: ['Bathroom', 'Hairdryer', 'Hot Water', 'Toiletries', 'Towels']
      },
      hotelFacilities: {
        business: ['Auditorium'],
        wellness: ['Swimming Pool', 'Massage'],
        food: ['Set Menu Lunch', 'Brunch'],
        general: ['Smoke detector', 'Towel', 'Coffee/Tea in Lobby', 'Sofa Bed', 'Elevator', 'Air Conditioning', 'Check-In', 'Check-Out', 'Clothes Dryer', 'ID Required', 'Lockers', 'Couple Friendly', 'Disability Friendly', 'Garden'],
        media: ['Photocopier', 'Printer', 'Telephone', 'Mobile Phone Coverage'],
        safety: ['24-Hour Security'],
        services: ['Medical Service'],
        transport: ['Airport Shuttle Service', 'Car Rental', 'Free Airport Shuttle Service']
      },
      policies: {
        checkIn: '14:00 (19 Jun 2026, Friday)',
        checkOut: '12:00 (21 Jun 2026, Sunday)',
        childPolicy: 'Allowed\n\nChildren under 5 years of age can stay in the same room and enjoy a complimentary breakfast.\nChildren above 5 years to 11 years can stay in the same room but need to pay breakfast cost of 380 BDT.\nChildren from 12 years of age will be considered adults, and an extra bed will be required.\nThe rate of an extra bed with breakfast is BDT 1,500.\nThe charge for an extra bed and breakfast may change at any time as per the hotel’s policy prior to the check-in date.',
        petPolicy: 'Not Allowed',
        houseRules: [
          'Hotel check-in time is 14:00 / 2:00 PM, and check-out time is 12:00 / 12:00 PM.',
          'Buffet breakfast timing is 7:00 AM - 10:00 AM.',
          '1 hour swimming pool access. Timing is within 9:00 AM - 5:00 PM.',
          'Complimentary airport transfer.',
          'Additional charges may apply for late check-out.',
          'Please bring NID or passport copies at the time of check-in.',
          'Any cancellation must be processed 24 hours prior to the check-in date. Cancellations made later than this lead period will incur a charge of one night per room booked.',
          'Actual charges will be calculated by the hotel in its local currency.',
          'Early check-in and late check-out are not guaranteed. It is subject to availability and at the property’s discretion. It might be chargeable.',
          'Room rents are non-refundable on block dates and long holidays.',
          'Outside food is not allowed in the hotel premises.',
          'Arms and pets are not allowed in the room.',
          'The rate of an extra bed with breakfast is BDT 1,500.',
          'No driver accommodation is available at the hotel premise.'
        ]
      },
      price: 7261,
      taxes: 1923,
      breakfastIncluded: true,
      refundable: true,
      reviews: WINDY_TERRACE_REVIEWS
    }
  },
  {
    id: 'hotel-sea-crown',
    hotelGroupId: 'group-sea-crown',
    name: 'Hotel Sea Crown',
    roomName: 'Super Deluxe with Balcony',
    planType: 'Breakfast Included',
    breakfast: true,
    refundable: true,
    basePrice: 6167,
    taxesAndFees: 1633,
    notes: 'Balcony option, good value',
    category: 'balcony',
    tags: ['Couple Friendly', 'With Balcony', 'Beachfront', 'Only 3 rooms left', 'Near Beach', '0.02 km from Kolatoli Beach'],
    // Hotel Sea Crown images are loaded from public Google Drive image thumbnails for demo use. For production stability, local public/hotels assets are recommended.
    imageUrl: getDriveImageUrl('1em4lQSCSeDX6hvvOttiNAEE_DqzibuYQ'),
    galleryImages: [
      getDriveImageUrl('1em4lQSCSeDX6hvvOttiNAEE_DqzibuYQ'),
      getDriveImageUrl('1oBUOKRAUP1X0dPYaZjfwN6ukn_cZ684F'),
      getDriveImageUrl('1PQIKDvyktB7J5S--3iDx2AyBd6_oh3H5'),
      getDriveImageUrl('1vqq3h9thEFA3IEi3SDN5mVjRfkZX4sOF'),
      getDriveImageUrl('14uYpQvrtEe17fjF3GsKCKl7twZXlHkNz'),
      getDriveImageUrl('108NOX5OYZxOSttGCMWaMn61VbvqWN9fy'),
      getDriveImageUrl('1HIyg0otRGifSGg8DKAdLmRRuaaZJWbkj'),
      getDriveImageUrl('1n8pRnrzhHlZguNUdXK7GrkwkfBVuyFbH'),
      getDriveImageUrl('10TLJqyV0bOyvbZo9iTzcdYuNpAuhCrKM'),
      getDriveImageUrl('1Iu6gWiJf6QR-3fs18i3kyInrBVSUXeXD'),
      getDriveImageUrl('1UZjL6pdd8zBcwQWVlNX9pvFFDYkxv3Eo'),
      getDriveImageUrl('1u4wib0pH8NHBlk1Lbbm5aexWqOfEd5Gy')
    ],
    starRating: '3.0 Star',
    details: {
      id: 'hotel-sea-crown',
      hotelName: 'Hotel Sea Crown',
      roomName: 'Super Deluxe with Balcony',
      starRating: '3.0 Star',
      address: 'Marin Drive, New Beach Road, Kolatoli, Cox’s Bazar, Bangladesh',
      reviewSummary: {
        text: 'Good',
        count: 41,
        score: 3.4,
        locationScore: 4.4,
        comfortScore: 3.6,
        cleanlinessScore: 3.5,
        facilitiesScore: 3.2,
        valueScore: 3.4,
        staffScore: 3.7
      },
      nearby: [
        '0.01 km from Angel Beach Cafe',
        '0.02 km from Kolatoli Beach',
        '0.6 km from Cox’s Bazar Sea Beach',
        '4.7 km from Cox’s Bazar Airport'
      ],
      tags: ['Couple Friendly'],
      description: 'Number of Rooms: 90\nNumber of Floors: 7\n\nHotel Sea Crown started its business from late 2004. Sea Crown is a three-star deluxe hotel designed with traditional hospitality, courteous service, attractive personalized service, and a convenient beachfront location. It is located around 100 meters from Kolatoli turning point and around 3 kilometers from the airport in Cox’s Bazar.',
      roomDetails: {
        roomType: 'Double',
        occupancy: '2 Adults, 1 Child. Max 3 Guests',
        adultOccupancy: 2,
        childOccupancy: 1,
        extraBed: 1,
        maxGuests: 3,
        smokingAllowed: false,
        characteristics: 'Deluxe',
        size: 'Not provided in screenshot',
        view: 'Not provided in screenshot'
      },
      roomFacilities: {
        others: ['Room Service', 'Housekeeping', '220V Socket'],
        bathroom: ['Toiletries', 'Hot Water', 'Bathroom'],
        bedroom: ['Extra Bedding', 'Closet', 'Blankets', 'Air Conditioning', 'Balcony'],
        media: ['TV', 'Cable TV', 'Wi-Fi'],
        food: ['Free Bottled Water']
      },
      hotelFacilities: {
        business: ['Auditorium'],
        food: ['Set Menu Lunch', 'Buffet Lunch', 'Brunch'],
        general: [
          'Accessible Bathroom',
          'Disability Friendly',
          'Elevator',
          'Towel',
          'In-room Accessibility',
          'Garden',
          'Lockers',
          'Check-Out',
          'Check-In',
          'Air Conditioning',
          'Couple Friendly'
        ],
        media: ['Mobile Phone Coverage', 'Printer', 'Photocopier'],
        parking: ['Large Vehicle Parking'],
        safety: ['24-Hour Security'],
        services: ['Bicycle Rental'],
        transport: ['Airport Shuttle Service', 'Car Rental']
      },
      policies: {
        checkIn: '14:00 (19 Jun 2026, Friday)',
        checkOut: '11:00 (21 Jun 2026, Sunday)',
        childPolicy: 'Allowed\n\nUp to 1 child below 7 years can stay in the same room and enjoy a complimentary breakfast.\nChildren from 7 years to 10 years will be charged BDT 400 for breakfast.\nChildren above 10 years will be charged BDT 1,350 for breakfast and an extra bed.\nThe charge for an extra bed and breakfast may change any time as per the hotel’s policy prior to the check-in date.',
        petPolicy: 'Not Allowed',
        houseRules: [
          'Please note that the property is partially under renovation. Loud noise may occur during the stay, which could disturb comfort. Guests should consider this before booking.',
          'For refundable bookings with 72+ hours before check-in, please cancel and rebook for new dates.',
          'Complimentary buffet breakfast timing: 7:30 AM - 10:00 AM.',
          'Each guest has to present a copy of their valid NID or other identification document during check-in.',
          'Guests should carry their vaccination certificate during check-in.',
          'Check-in time is 2:00 PM.',
          'Check-out time is 11:00 AM.',
          'During long weekends and festive seasons, the no-refund cancellation policy applies.',
          'All special requests are subject to availability upon arrival.',
          'The quoted rates include 10% VAT and 5% service charge.',
          'Airport pick and drop is chargeable: BDT 1,200 one way, BDT 2,400 two way, any number of passengers up to 8 people. Car type: Noah.',
          'The rate of an extra bed with breakfast is BDT 1,350.',
          'The charge for an extra bed and breakfast may change any time as per the hotel’s policy prior to the check-in date.',
          'No driver accommodation is available at the hotel premise.',
          'Due to construction works, noise may occur.'
        ]
      },
      price: 6167,
      taxes: 1633,
      breakfastIncluded: true,
      refundable: true,
      reviews: SEA_CROWN_REVIEWS
    }
  },
  {
    id: 'white-orchid-sapphire',
    hotelGroupId: 'group-white-orchid-sapphire',
    name: 'White Orchid Sapphire',
    roomName: 'Premier King with Balcony',
    planType: 'Breakfast Included',
    breakfast: true,
    refundable: true,
    basePrice: 7115,
    taxesAndFees: 1885,
    notes: 'Balcony option, premium-mid range, Complimentary Buffet Breakfast, Only 6 rooms left',
    category: 'balcony',
    tags: ['Couple Friendly', 'Breakfast Included', 'Refundable', 'Only 6 rooms left'],
    // White Orchid Sapphire images are loaded from public Google Drive image thumbnails for demo use. For production stability, local public/hotels assets are recommended.
    imageUrl: getDriveImageUrl('1RFjTj9QUVdMErjpoiu7UItlu4l8v4q4a'),
    galleryImages: [
      getDriveImageUrl('1RFjTj9QUVdMErjpoiu7UItlu4l8v4q4a'),
      getDriveImageUrl('1CwnC90zmFCsTvQqzRgi2ZOrhkGNg87Zz'),
      getDriveImageUrl('16stVoMHWYR-XwuvnGblUkEfoD29fMZbf'),
      getDriveImageUrl('1tchK8hgdy7YcWc6K1krVpLhcsJ0Gkb6t'),
      getDriveImageUrl('1LNX5Z8IHQfN_lRKtE04rUpsKA8vAcx-1'),
      getDriveImageUrl('1XDnrRwNFj3EBdagCpMk5bHx2wzt117RO'),
      getDriveImageUrl('1jmllCMcH_aS7caUaqibLNksOx6rr9RjQ'),
      getDriveImageUrl('14xE_4AlKXSq6XLLIONm53Lgf7EC2L0lN'),
      getDriveImageUrl('1vJqFiwPEuLc48-Five1MtjHvnXhIcqWn'),
      getDriveImageUrl('1M1WMEuKWgNSIYdCiAorQo-PwRURxI2u2'),
      getDriveImageUrl('1-qYiL_JHqef7MJYOecQ4YqVEA1fVLGgV'),
      getDriveImageUrl('12ChnRAMoONDbFMnj1Zz0tsglumAgUtgi')
    ],
    starRating: '3.0 Star',
    details: {
      id: 'white-orchid-sapphire',
      hotelName: 'White Orchid Sapphire',
      roomName: 'Premier King with Balcony',
      starRating: '3.0 Star',
      address: 'Flat #32, Block #C, Kolatoli Road, Hotel–Motel Zone, Cox’s Bazar, Bangladesh',
      reviewSummary: {
        text: 'Excellent',
        count: 34,
        score: 4.3,
        locationScore: 3.7,
        comfortScore: 4.2,
        cleanlinessScore: 4.3,
        facilitiesScore: 4.4,
        valueScore: 4.1,
        staffScore: 4.4
      },
      nearby: [
        '1.1 km from Sugondha Sea Beach',
        '0.9 km from Kolatoli Beach, Cox’s Bazar',
        '1.9 km from Laboni Beach, Cox’s Bazar',
        '4.1 km from Cox’s Bazar Airport',
        '0.7 km from Kolatoli Bus Stand',
        '5.3 km from Cox’s Bazar Railway Station'
      ],
      tags: ['Couple Friendly'],
      description: 'Number of Rooms: 47\nNumber of Floors: 9\nYear of construction: 2023\n\nWhite Orchid Sapphire features 3-star accommodations. Among the facilities of this property are a restaurant, room service, and a 24-hour front desk, along with free Wi-Fi throughout the property. Some of the rooms at the property feature a city view. Guests at the hotel can enjoy a buffet breakfast.',
      roomDetails: {
        roomType: 'King',
        occupancy: '2 Adults, 1 Child. Max 3 Guests',
        adultOccupancy: 2,
        childOccupancy: 1,
        extraBed: 1,
        maxGuests: 3,
        smokingAllowed: false,
        characteristics: 'Deluxe Premier',
        size: '265 sq.ft',
        view: 'City View'
      },
      roomFacilities: {
        bedroom: ['Air Conditioning', 'Balcony', 'Blankets', 'Closet', 'Curtain', 'Extra Bedding'],
        others: ['220V Socket', 'Desk', 'Electric Kettle', 'Linens', 'Slippers', 'Non-Smoking', 'Room Service'],
        bathroom: ['Bathroom', 'Hot Water', 'Toiletries', 'Towels'],
        media: ['Internet', 'Telephone', 'TV', 'Wi-Fi'],
        food: ['Free Bottled Water', 'Coffee/Tea Maker']
      },
      hotelFacilities: {
        wellness: ['Swimming Pool', 'Gym'],
        food: ['Set Menu Lunch', 'Brunch'],
        general: ['Accessible Bathroom', 'Air Conditioning', 'ID Required', 'Towel', 'Couple Friendly', 'Elevator', 'City Centre'],
        media: ['Mobile Phone Coverage', 'Printer', 'Telephone'],
        parking: ['Garage'],
        safety: ['24-Hour Security'],
        services: ['Tours/Ticket Assistance']
      },
      policies: {
        checkIn: '14:00 (19 Jun 2026, Friday)',
        checkOut: '12:00 (21 Jun 2026, Sunday)',
        childPolicy: 'Allowed\n\n1 child under 5 years of age can stay in the same room and enjoy a complimentary breakfast.\n1 child from 5 to 10 years of age will have a buffet breakfast charge of BDT 375.\nChildren above 10 years of age will be considered adults, and an extra bed will be required.\nThe rate of an extra bed with breakfast is BDT 1,500.\nThe charge for an extra bed and breakfast may change any time as per the hotel’s policy prior to the check-in date.',
        petPolicy: 'Not Allowed',
        houseRules: [
          'For refundable bookings with 72+ hours before check-in, please cancel and rebook for new dates.',
          'Hotel check-in time is 14:00 / 2:00 PM.',
          'Hotel check-out time is 11:00 AM according to the house rules note. If there is a conflict with the policy summary showing 12:00, display both and mark it as “Recheck checkout time before booking.”',
          'Checkout time conflict: policy summary shows 12:00, but house rules mention 11:00 AM. Recheck before booking.',
          'Buffet breakfast timing is 7:00 AM to 10:00 AM.',
          '1 hour limited access to swimming pool. Time is within 10:00 AM to 5:00 PM.',
          '1 hour limited access to gym. Time is within 8:00 AM to 8:00 PM.',
          'Additional charges may apply for late check-out.',
          'Please bring NID or passport copies at the time of check-in.',
          'Any cancellation must be processed 24 hours prior to the check-in date. Cancellations made later than this lead period will incur a charge of one night per room booked.',
          'Actual charges will be calculated by the hotel in its local currency.',
          'Early check-in and late check-out are not guaranteed. It is subject to availability and at the property’s discretion. It might be chargeable.',
          'Room rents are non-refundable on block dates and long holidays.',
          'Outside food is not allowed in the hotel premises.',
          'Arms and pets are not allowed in the room.',
          'The rate of an extra bed with breakfast is BDT 1,500. Extra bed type: mattress.',
          'No driver accommodation is available at the hotel premise.',
          'All rooms are non-smoking. If evidence of smoking is found in a room, a penalty will be applied to cover odor removal.',
          'Odor cleaning charge: Junior Suite: BDT 2,500 / Premier Room: BDT 2,000',
          'Non-smoking penalty applies if smoking evidence is found.'
        ]
      },
      price: 7115,
      taxes: 1885,
      breakfastIncluded: true,
      refundable: true,
      reviews: WHITE_ORCHID_SAPPHIRE_REVIEWS
    }
  },
  {
    id: 'grace-cox-standard-double-queen',
    hotelGroupId: 'group-grace-cox',
    name: 'Grace Cox Smart Hotel',
    roomName: 'Standard Double Queen',
    planType: 'Breakfast Included',
    breakfast: true,
    refundable: true,
    basePrice: 5218,
    taxesAndFees: 1382,
    notes: 'Complimentary breakfast with airport transfer. Free cancellation before 00:01 on Tue, 16 Jun 2026.',
    category: 'mid-range',
    tags: ['Couple Friendly', 'City Centre', 'Free Airport Shuttle Service', 'Breakfast Included', 'Refundable'],
    // Grace Cox Smart Hotel images are loaded from public Google Drive image thumbnails for demo use. General hotel images are shared across both Grace Cox room option galleries. For production stability, local public/hotels assets are recommended.
    imageUrl: getDriveImageUrl('1bO6h4H7jIDcv1OVU_kSiTsY_HtF5bisg'),
    galleryImages: [
      getDriveImageUrl('1bO6h4H7jIDcv1OVU_kSiTsY_HtF5bisg'),
      getDriveImageUrl('1vQYpyev1S_Y1p_cD3fx4vjhXJIiErURs'),
      getDriveImageUrl('1UVej1uiXcQoLIy_XqEK4VNg2e5M4TnA5'),
      getDriveImageUrl('1gqAHIl0avpiPetL5JAD8y_lA1KolBr7t'),
      getDriveImageUrl('1wzXFLCmPljNoowlQf6kWtY_aOyI1KQhT'),
      getDriveImageUrl('1aWBQppcrhSDuvo0kmZKW5WcJY0KX74kZ'),
      getDriveImageUrl('1RlTcJ6DMc3iEZLT8neLyeGVp8mJ8vDrL'),
      getDriveImageUrl('1aqM2rRJ_ua4XlydDFJPEJD4wFWFgvelx')
    ],
    starRating: '3.0 Star',
    details: {
      id: 'grace-cox-standard-double-queen',
      hotelName: 'Grace Cox Smart Hotel',
      roomName: 'Standard Double Queen',
      starRating: '3.0 Star',
      address: "Grace Cox Smart Hotel, House 22, Kolatoli, Cox's Bazar, Bangladesh",
      reviewSummary: {
        text: 'Very Good',
        count: 4,
        score: 3.8,
        locationScore: 3.2,
        comfortScore: 3.8,
        cleanlinessScore: 3.8,
        facilitiesScore: 3.0,
        valueScore: 3.5,
        staffScore: 4.5
      },
      nearby: [
        '4 km from Cox\'s Bazar Airport',
        '0.65 km from Kolatoli Bus Stand'
      ],
      tags: ['Couple Friendly', 'City Centre', 'Free Airport Shuttle Service', 'Breakfast Included', 'Refundable'],
      description: 'Number of Rooms: 70. Number of Floors: 8. Year of construction: 2019. An elegantly designed hotel GRACE COX is now operating at Cox\'s Bazar. Having 70 rooms, the extraordinary interior with a splash of eye-catching rooms waiting for you. All the related services will be provided by the hotel looking after your comfortability and satisfaction during your stay with us. The hotel is located just close proximity to the Sughandha sea beach Point. The hotel has a live kitchen with another elegantly decorated Food and Beverage outlet to cater to your needs and kiddies food.',
      roomDetails: {
        roomType: 'Double',
        occupancy: '2 Adults',
        adultOccupancy: 2,
        childOccupancy: 0,
        extraBed: 0,
        maxGuests: 2,
        smokingAllowed: false,
        characteristics: 'Standard',
        size: '250 sq.ft',
        view: 'None'
      },
      roomFacilities: {
        others: ['Electric Kettle', 'Remote Control Unit', 'Slippers', 'Room Service', 'Fitness Center', 'Wake-Up Call', 'Non-Smoking', '220V Socket'],
        bathroom: ['Towels', 'Toiletries', 'Hot Water', 'Hairdryer', 'Bathroom'],
        bedroom: ['Curtain', 'Air Conditioning', 'In-Room Safe', 'Blankets', 'Closet'],
        media: ['Cable TV', 'Wi-Fi', 'Telephone'],
        food: ['Free Bottled Water', 'Mini Fridge', 'Coffee/Tea Maker']
      },
      hotelFacilities: {
        business: ['Conference Hostess'],
        wellness: ['Gym', 'Swimming Pool'],
        food: ['Set Menu Lunch', 'Brunch'],
        general: ['Lockers', 'Elevator', 'Coffee/Tea in Lobby', 'Clothes Dryer', 'Couple Friendly', 'City Centre', 'Check-Out', 'Check-In', 'Air Conditioning', 'Accessible Bathroom', 'Smoke detector', 'Late Arrival Fees', 'ID Required', 'No Alcohol', 'Towel'],
        media: ['Mobile Phone Coverage'],
        parking: ['Garage'],
        safety: ['24-Hour Security'],
        transport: ['Car Rental', 'Free Airport Shuttle Service']
      },
      policies: {
        checkIn: '14:00',
        checkOut: '11:00',
        childPolicy: 'Allowed',
        petPolicy: 'Not Allowed',
        houseRules: [
          'For any date change requests on refundable bookings within 72+ hours before check-in, customers are advised to cancel and rebook for a new date.',
          'Buffet breakfast timing is 7:30 AM - 10:30 AM.',
          'Buffet breakfast may not be available if the hotel has low occupancy.',
          '1 hour access to both swimming pool and gym within 9 AM - 9 PM.',
          'Hotel check-in time is 02:00 PM, and check-out time is 11:00 AM.',
          'All guests must present a valid NID or passport copy at the time of check-in.',
          'Actual charges will be calculated by the hotel in its local currency.',
          'Early check-in and late check-out are not guaranteed and are subject to availability and the property\'s discretion.',
          'Room rents are non-refundable during block dates and long holidays.',
          'Arms and pets are not allowed inside the rooms.',
          'Outside food is not allowed within the hotel premises.',
          'Extra bed with breakfast is BDT 1,500.',
          'Extra breakfast charge is BDT 700 net per night for adults above 11 years.',
          'Extra breakfast charge is BDT 500 per night for children within 5 to 11 years.',
          'The charge for an extra bed and breakfast may change any time as per the hotel\'s policy prior to the check-in date.'
        ]
      },
      price: 5218,
      taxes: 1382,
      breakfastIncluded: true,
      refundable: true,
      reviews: GRACE_COX_REVIEWS
    }
  },
  {
    id: 'grace-cox-deluxe-double-king',
    hotelGroupId: 'group-grace-cox',
    name: 'Grace Cox Smart Hotel',
    roomName: 'Deluxe Double King',
    planType: 'Breakfast Included',
    breakfast: true,
    refundable: true,
    basePrice: 6008,
    taxesAndFees: 1592,
    notes: 'Complimentary breakfast with airport transfer. Free cancellation before 00:01 on Tue, 16 Jun 2026.',
    category: 'mid-range',
    tags: ['Couple Friendly', 'City Centre', 'Free Airport Shuttle Service', 'Breakfast Included', 'Refundable'],
    imageUrl: getDriveImageUrl('1zuPs5S-5mHOYcxLtREbEaH403odWPsCu'),
    galleryImages: [
      getDriveImageUrl('1zuPs5S-5mHOYcxLtREbEaH403odWPsCu'),
      getDriveImageUrl('1GVQO1zrhZUNE_7u52wf54loHWBpeU0H3'),
      getDriveImageUrl('1NJjGG4Rph6q7APIHz3o4nVpPCfvPye8g'),
      getDriveImageUrl('1b80U7vn4897UZIqqyQ25vzMGBPpFRCgc'),
      getDriveImageUrl('1wzXFLCmPljNoowlQf6kWtY_aOyI1KQhT'),
      getDriveImageUrl('1aWBQppcrhSDuvo0kmZKW5WcJY0KX74kZ'),
      getDriveImageUrl('1RlTcJ6DMc3iEZLT8neLyeGVp8mJ8vDrL'),
      getDriveImageUrl('1aqM2rRJ_ua4XlydDFJPEJD4wFWFgvelx')
    ],
    starRating: '3.0 Star',
    details: {
      id: 'grace-cox-deluxe-double-king',
      hotelName: 'Grace Cox Smart Hotel',
      roomName: 'Deluxe Double King',
      starRating: '3.0 Star',
      address: "Grace Cox Smart Hotel, House 22, Kolatoli, Cox's Bazar, Bangladesh",
      reviewSummary: {
        text: 'Very Good',
        count: 4,
        score: 3.8,
        locationScore: 3.2,
        comfortScore: 3.8,
        cleanlinessScore: 3.8,
        facilitiesScore: 3.0,
        valueScore: 3.5,
        staffScore: 4.5
      },
      nearby: [
        '4 km from Cox\'s Bazar Airport',
        '0.65 km from Kolatoli Bus Stand'
      ],
      tags: ['Couple Friendly', 'City Centre', 'Free Airport Shuttle Service', 'Breakfast Included', 'Refundable'],
      description: 'Number of Rooms: 70. Number of Floors: 8. Year of construction: 2019. An elegantly designed hotel GRACE COX is now operating at Cox\'s Bazar. Having 70 rooms, the extraordinary interior with a splash of eye-catching rooms waiting for you. All the related services will be provided by the hotel looking after your comfortability and satisfaction during your stay with us. The hotel is located just close proximity to the Sughandha sea beach Point. The hotel has a live kitchen with another elegantly decorated Food and Beverage outlet to cater to your needs and kiddies food.',
      roomDetails: {
        roomType: 'Double',
        occupancy: '2 Adults, 1 Child',
        adultOccupancy: 2,
        childOccupancy: 1,
        extraBed: 1,
        maxGuests: 3,
        smokingAllowed: false,
        characteristics: 'Deluxe',
        size: '285 sq.ft',
        view: 'None'
      },
      roomFacilities: {
        others: ['Wake-Up Call', 'Non-Smoking', 'Electric Kettle', 'Slippers', '220V Socket'],
        bathroom: ['Bathroom', 'Hot Water', 'Toiletries', 'Towels', 'Hairdryer'],
        bedroom: ['Air Conditioning', 'Closet', 'Blankets', 'In-Room Safe', 'Curtain', 'Extra Bedding'],
        media: ['Cable TV', 'TV', 'Internet', 'Wi-Fi'],
        food: ['Coffee/Tea Maker', 'Free Bottled Water', 'Mini Fridge']
      },
      hotelFacilities: {
        business: ['Conference Hostess'],
        wellness: ['Gym', 'Swimming Pool'],
        food: ['Set Menu Lunch', 'Brunch'],
        general: ['Lockers', 'Elevator', 'Coffee/Tea in Lobby', 'Clothes Dryer', 'Couple Friendly', 'City Centre', 'Check-Out', 'Check-In', 'Air Conditioning', 'Accessible Bathroom', 'Smoke detector', 'Late Arrival Fees', 'ID Required', 'No Alcohol', 'Towel'],
        media: ['Mobile Phone Coverage'],
        parking: ['Garage'],
        safety: ['24-Hour Security'],
        transport: ['Car Rental', 'Free Airport Shuttle Service']
      },
      policies: {
        checkIn: '14:00',
        checkOut: '11:00',
        childPolicy: 'Allowed',
        petPolicy: 'Not Allowed',
        houseRules: [
          'For any date change requests on refundable bookings within 72+ hours before check-in, customers are advised to cancel and rebook for a new date.',
          'Buffet breakfast timing is 7:30 AM - 10:30 AM.',
          'Buffet breakfast may not be available if the hotel has low occupancy.',
          '1 hour access to both swimming pool and gym within 9 AM - 9 PM.',
          'Hotel check-in time is 02:00 PM, and check-out time is 11:00 AM.',
          'All guests must present a valid NID or passport copy at the time of check-in.',
          'Actual charges will be calculated by the hotel in its local currency.',
          'Early check-in and late check-out are not guaranteed and are subject to availability and the property\'s discretion.',
          'Room rents are non-refundable during block dates and long holidays.',
          'Arms and pets are not allowed inside the rooms.',
          'Outside food is not allowed within the hotel premises.',
          'Extra bed with breakfast is BDT 1,500.',
          'Extra breakfast charge is BDT 700 net per night for adults above 11 years.',
          'Extra breakfast charge is BDT 500 per night for children within 5 to 11 years.',
          'The charge for an extra bed and breakfast may change any time as per the hotel\'s policy prior to the check-in date.'
        ]
      },
      price: 6008,
      taxes: 1592,
      breakfastIncluded: true,
      refundable: true,
      reviews: GRACE_COX_REVIEWS
    }
  },
  {
    id: 'hotel-sea-paradise-higher-floor',
    hotelGroupId: 'group-hotel-sea-paradise',
    name: 'Hotel Sea Paradise',
    roomName: 'Deluxe Couple Side Sea View - Higher Floor',
    planType: 'Breakfast Included',
    breakfast: true,
    refundable: true,
    basePrice: 7906,
    taxesAndFees: 2094,
    notes: 'Complimentary breakfast with infinity swimming pool. Free cancellation before 00:01 on Tue, 16 Jun 2026.',
    category: 'premium',
    tags: ['Couple Friendly', 'Breakfast Included', 'Refundable', 'Swimming Pool', 'Sea View', 'Kolatoli Beach'],
    // Hotel Sea Paradise images are loaded from public Google Drive image thumbnails for demo use. General hotel images are shared across both Hotel Sea Paradise room option galleries. For production stability, local public/hotels assets are recommended.
    imageUrl: getDriveImageUrl('1sabDr5WFY2LRHsP6Pj5jc2muQHXjtxUk'),
    galleryImages: [
      getDriveImageUrl('1sabDr5WFY2LRHsP6Pj5jc2muQHXjtxUk'),
      getDriveImageUrl('1BvOs44o1kcf4Brg7sATEVgKDUPL94PN_'),
      getDriveImageUrl('1OL9MCQ4e4olEDhjO1vLnx56nlGb-DQAv'),
      getDriveImageUrl('1xPuBy6MbN06YCzMj01sazrsJwEAMkNTO'),
      getDriveImageUrl('17T48ZNN6-H54XUUaf5FlqjkOFqFDpAgq'),
      getDriveImageUrl('18hYk4qCLErOKTZzWiL1fU5JgHGYmBoU0'),
      getDriveImageUrl('1etmHeTBV9aiZYWGFt6TCHcohYZJXVEEv'),
      getDriveImageUrl('1jdTmelikEqc7n4CGEVP2NOYv8KkdHh6s'),
      getDriveImageUrl('1rY4S13VKhRE_DNgBOsw2ZyAr88z8Szzv')
    ],
    starRating: '3.0 Star',
    details: {
      id: 'hotel-sea-paradise-higher-floor',
      hotelName: 'Hotel Sea Paradise',
      roomName: 'Deluxe Couple Side Sea View - Higher Floor',
      starRating: '3.0 Star',
      address: 'Kolatoli Beach Point, Kolatoli, Cox\'s Bazar, Bangladesh',
      reviewSummary: {
        text: 'Very Good',
        count: 11,
        score: 3.7,
        locationScore: 4.6,
        comfortScore: 3.9,
        cleanlinessScore: 3.7,
        staffScore: 3.5,
        facilitiesScore: 3.5,
        valueScore: 3.3
      },
      nearby: [
        "4.6 km from Cox's Bazar Airport, Cox's Bazar",
        "5 km from Cox's Bazar Railway Station"
      ],
      tags: ['Couple Friendly', 'Breakfast Included', 'Refundable', 'Swimming Pool', 'Sea View', 'Kolatoli Beach'],
      description: 'Number of Rooms: 57. Number of Floors: 7. Year of construction: 2024. Sea Paradise in Kolatoli has 3-star accommodation with a terrace. Among the facilities of this property are a restaurant, room service, and a 24-hour front desk, along with free Wi-Fi throughout the property. The hotel features family rooms. The hotel rooms come with air conditioning, a desk, a balcony with a sea view, a private bathroom, a flat-screen TV, bed linen, and towels.',
      roomDetails: {
        roomType: 'Double',
        smokingAllowed: false,
        characteristics: 'Deluxe',
        size: '300 sq.ft',
        view: 'City View',
        occupancy: '2 Adults, 1 Child',
        adultOccupancy: 2,
        childOccupancy: 1,
        extraBed: 1,
        maxGuests: 3
      },
      roomFacilities: {
        bedroom: ['Air Conditioning', 'Alarm Clock', 'Blankets', 'Closet', 'Curtain', 'Extra Bedding'],
        others: [
          '220V Socket',
          'Desk',
          'Electric Kettle',
          'Housekeeping',
          'Linens',
          'Make-up Mirror',
          'Room Service',
          'Slippers',
          'Sofa',
          'Wake-Up Call'
        ],
        food: ['Mini Fridge', 'Coffee/Tea Maker'],
        bathroom: ['Bathroom', 'Hot Water', 'Towels', 'Toiletries'],
        media: ['Cable TV', 'Internet', 'Telephone', 'TV', 'Wi-Fi']
      },
      hotelFacilities: {
        business: ['Conference Hostess'],
        wellness: ['Swimming Pool'],
        food: ['Set Menu Lunch'],
        general: [
          'Air Conditioning',
          'Check-In',
          'Check-Out',
          'Coffee/Tea in Lobby',
          'ID Required',
          'Towel',
          'Couple Friendly',
          'No Alcohol',
          'Lockers'
        ],
        media: ['Mobile Phone Coverage', 'Telephone'],
        parking: ['Large Vehicle Parking'],
        safety: ['24-Hour Security'],
        services: ['Tours/Ticket Assistance']
      },
      policies: {
        checkIn: '13:00',
        checkOut: '11:00',
        childPolicy: 'Allowed',
        petPolicy: 'Not Allowed',
        houseRules: [
          'For any date change requests on refundable bookings within 72+ hours before check-in, customers are advised to cancel and rebook for a new date.',
          'Buffet breakfast timing is 7:00 AM - 10:00 AM.',
          'Buffet breakfast may not be available if the hotel has low occupancy.',
          '1 hour access to the swimming pool within 9:00 AM to 5:00 PM.',
          'Swimming pool policy may change at any time as per the hotel\'s policy prior to the check-in date.',
          'Hotel check-in time is 13:00 hours, and check-out time is 11:00 hours.',
          'Please bring NID or passport copies at the time of check-in.',
          'Actual charges will be calculated by the hotel in its local currency.',
          'Early check-in and late check-out are not guaranteed and are subject to availability and the property\'s discretion.',
          'Room rents are non-refundable during block dates and long holidays.',
          'Arms and pets are not allowed inside the rooms.',
          'Outside food is not allowed within the hotel premises.',
          'An additional bed with breakfast costs BDT 1,500.',
          'Extra bed is subject to availability.',
          'No driver accommodation is available at the hotel premise.'
        ]
      },
      price: 7906,
      taxes: 2094,
      breakfastIncluded: true,
      refundable: true,
      reviews: SEA_PARADISE_REVIEWS
    }
  },
  {
    id: 'hotel-sea-paradise-balcony',
    hotelGroupId: 'group-hotel-sea-paradise',
    name: 'Hotel Sea Paradise',
    roomName: 'Deluxe Couple Side Sea View with Balcony',
    planType: 'Breakfast Included',
    breakfast: true,
    refundable: true,
    basePrice: 7906,
    taxesAndFees: 2094,
    notes: 'Complimentary breakfast with infinity swimming pool. Free cancellation before 00:01 on Tue, 16 Jun 2026.',
    category: 'premium',
    tags: ['Couple Friendly', 'Breakfast Included', 'Refundable', 'Swimming Pool', 'Sea View', 'Kolatoli Beach'],
    // Hotel Sea Paradise images are loaded from public Google Drive image thumbnails for demo use. General hotel images are shared across both Hotel Sea Paradise room option galleries. For production stability, local public/hotels assets are recommended.
    imageUrl: getDriveImageUrl('1IX2NcXaJOZu0fnl9CPfd1wG8pi9P5pPX'),
    galleryImages: [
      getDriveImageUrl('1IX2NcXaJOZu0fnl9CPfd1wG8pi9P5pPX'),
      getDriveImageUrl('1LvKDrG_6hb20nNJY7ellt4QIptHRrqAx'),
      getDriveImageUrl('1SrybRPVRmPxsQhsxheMCHg13FfxRhKZt'),
      getDriveImageUrl('1JfKG4_oSb4RXbMBS4lnmqOW9q8U7j7VL'),
      getDriveImageUrl('18hYk4qCLErOKTZzWiL1fU5JgHGYmBoU0'),
      getDriveImageUrl('1etmHeTBV9aiZYWGFt6TCHcohYZJXVEEv'),
      getDriveImageUrl('1jdTmelikEqc7n4CGEVP2NOYv8KkdHh6s'),
      getDriveImageUrl('1rY4S13VKhRE_DNgBOsw2ZyAr88z8Szzv')
    ],
    starRating: '3.0 Star',
    details: {
      id: 'hotel-sea-paradise-balcony',
      hotelName: 'Hotel Sea Paradise',
      roomName: 'Deluxe Couple Side Sea View with Balcony',
      starRating: '3.0 Star',
      address: 'Kolatoli Beach Point, Kolatoli, Cox\'s Bazar, Bangladesh',
      reviewSummary: {
        text: 'Very Good',
        count: 11,
        score: 3.7,
        locationScore: 4.6,
        comfortScore: 3.9,
        cleanlinessScore: 3.7,
        staffScore: 3.5,
        facilitiesScore: 3.5,
        valueScore: 3.3
      },
      nearby: [
        "4.6 km from Cox's Bazar Airport, Cox's Bazar",
        "5 km from Cox's Bazar Railway Station"
      ],
      tags: ['Couple Friendly', 'Breakfast Included', 'Refundable', 'Swimming Pool', 'Sea View', 'Kolatoli Beach'],
      description: 'Number of Rooms: 57. Number of Floors: 7. Year of construction: 2024. Sea Paradise in Kolatoli has 3-star accommodation with a terrace. Among the facilities of this property are a restaurant, room service, and a 24-hour front desk, along with free Wi-Fi throughout the property. The hotel features family rooms. The hotel rooms come with air conditioning, a desk, a balcony with a sea view, a private bathroom, a flat-screen TV, bed linen, and towels.',
      roomDetails: {
        roomType: 'Double',
        smokingAllowed: false,
        characteristics: 'Deluxe',
        size: '250 sq.ft',
        view: 'City View',
        occupancy: '2 Adults, 1 Child',
        adultOccupancy: 2,
        childOccupancy: 1,
        extraBed: 1,
        maxGuests: 3
      },
      roomFacilities: {
        bedroom: ['Air Conditioning', 'Balcony', 'In-Room Safe', 'Blankets', 'Closet', 'Curtain', 'Extra Bedding'],
        others: [
          '220V Socket',
          'Desk',
          'Housekeeping',
          'Linens',
          'Slippers',
          'Electric Kettle',
          'Make-up Mirror',
          'Refrigerator',
          'Room Service',
          'Sofa',
          'Wheelchair Friendly'
        ],
        bathroom: ['Bathroom', 'Hot Water', 'Toiletries', 'Towels'],
        food: ['Free Bottled Water', 'Coffee/Tea Maker', 'Mini Fridge'],
        media: ['Internet', 'Wi-Fi', 'TV', 'Telephone', 'Cable TV']
      },
      hotelFacilities: {
        business: ['Conference Hostess'],
        wellness: ['Swimming Pool'],
        food: ['Set Menu Lunch'],
        general: [
          'Air Conditioning',
          'Check-In',
          'Check-Out',
          'Coffee/Tea in Lobby',
          'ID Required',
          'Towel',
          'Couple Friendly',
          'No Alcohol',
          'Lockers'
        ],
        media: ['Mobile Phone Coverage', 'Telephone'],
        parking: ['Large Vehicle Parking'],
        safety: ['24-Hour Security'],
        services: ['Tours/Ticket Assistance']
      },
      policies: {
        checkIn: '13:00',
        checkOut: '11:00',
        childPolicy: 'Allowed',
        petPolicy: 'Not Allowed',
        houseRules: [
          'For any date change requests on refundable bookings within 72+ hours before check-in, customers are advised to cancel and rebook for a new date.',
          'Buffet breakfast timing is 7:00 AM - 10:00 AM.',
          'Buffet breakfast may not be available if the hotel has low occupancy.',
          '1 hour access to the swimming pool within 9:00 AM to 5:00 PM.',
          'Swimming pool policy may change at any time as per the hotel\'s policy prior to the check-in date.',
          'Hotel check-in time is 13:00 hours, and check-out time is 11:00 hours.',
          'Please bring NID or passport copies at the time of check-in.',
          'Actual charges will be calculated by the hotel in its local currency.',
          'Early check-in and late check-out are not guaranteed and are subject to availability and the property\'s discretion.',
          'Room rents are non-refundable during block dates and long holidays.',
          'Arms and pets are not allowed inside the rooms.',
          'Outside food is not allowed within the hotel premises.',
          'An additional bed with breakfast costs BDT 1,500.',
          'Extra bed is subject to availability.',
          'No driver accommodation is available at the hotel premise.'
        ]
      },
      price: 7906,
      taxes: 2094,
      breakfastIncluded: true,
      refundable: true,
      reviews: SEA_PARADISE_REVIEWS
    }
  },
  {
    id: 'white-orchid-executive-couple-garden-view',
    hotelGroupId: 'group-white-orchid',
    name: 'White Orchid',
    roomName: 'Executive Couple Garden View',
    planType: 'Breakfast Included',
    breakfast: true,
    refundable: true,
    basePrice: 4744,
    taxesAndFees: 1256,
    originalPrice: 14230,
    discountLabel: '66% off',
    bedType: 'King',
    availabilityNote: 'Hurry Up! Only 2 Rooms Left',
    notes: 'Complimentary breakfast. Refundable. Free cancellation before 00:01 on Tue, 16 Jun 2026.',
    warningForLargeGroup: true,
    category: 'budget',
    tags: ['Couple Friendly', 'Breakfast Included', 'Refundable', 'Garden View', 'Airport Shuttle', 'Free Wi-Fi'],
    // Hotel White Orchid images are loaded from public Google Drive image thumbnails for demo use. For production stability, local public/hotels assets are recommended.
    imageUrl: getDriveImageUrl('1Lx5jWL5M2k5Q4txYDo1gFPS3v8bgwz8L'),
    galleryImages: [
      getDriveImageUrl('1Lx5jWL5M2k5Q4txYDo1gFPS3v8bgwz8L'),
      getDriveImageUrl('1MYoIwnGjEuuOzovDT2s0MRw2FurkaC_f'),
      getDriveImageUrl('1BiZf7jSz4weQtIhwOrX6pOcIShaJnNOY'),
      getDriveImageUrl('1yT3ZsE4q1bVUDdkkyAdLKi3okb16Cx1R'),
      getDriveImageUrl('1dIX1g8XCjY1LVolq1A5iW3QVHnFESZsM'),
      getDriveImageUrl('1fJBwewGI6Syhfd2IuDDo4v9A1rCIje2-'),
      getDriveImageUrl('1wOhrmfYD3so5OtgRCV_uJyfZT0rxGCxF'),
      getDriveImageUrl('1mAfiBt1yfPLyz3ymTCylWgRb23ZL0Ojl'),
      getDriveImageUrl('1QjNnoPPq1an1_TVMvkRYjG_ZyaIzHbC6'),
      getDriveImageUrl('1aREmnLFtlWtpWTxP5rBHmgSTIvAq84x4'),
      getDriveImageUrl('1OdpKShUBUGwjN-3sApeKI7vjvwF4kdYy'),
      getDriveImageUrl('1wARVW9H_lr0ZuZwVwBk5NEznoVo6V4aP'),
      getDriveImageUrl('17JV8-_b3XA6df7VEE3MoKb2DwU8rcbXV'),
      getDriveImageUrl('1Hpx2eNsMK-GCbUyLu4Zu7vEO_OaoDNYM'),
      getDriveImageUrl('1Whp7oGBn1DlgMmZBuJsKkZbwE22sM3C9'),
      getDriveImageUrl('1eGWcgvPF8if640MooK9AaqdfK-jV_zPQ'),
      getDriveImageUrl('1LrgSvHVHOn3EJbjaTUEs9wOvFyOMT7MW'),
      getDriveImageUrl('1RISPWMe_Sk-VN1sphlfM4fa2VUZo61j9')
    ],
    starRating: '3.0 Star',
    details: {
      id: 'white-orchid-executive-couple-garden-view',
      hotelName: 'White Orchid',
      roomName: 'Executive Couple Garden View',
      starRating: '3.0 Star',
      address: 'Plot 30, Block No. B, Sea Beach Road, Hotel–Motel zone, Cox\'s Bazar, Bangladesh',
      reviewSummary: {
        text: 'Very Good',
        count: 22,
        score: 3.9,
        staffScore: 4.0,
        locationScore: 4.0,
        comfortScore: 3.9,
        facilitiesScore: 3.6,
        cleanlinessScore: 3.9,
        valueScore: 3.4
      },
      nearby: [
        '0.95 km from Kolatoli Beach Cox\'s Bazar',
        '0.75 km from Shugondha Sea Beach',
        '1.8 km from Laboni Beach, Cox\'s Bazar',
        '3.9 km from Cox\'s Bazar Airport',
        '0.7 km from Kolatoli Bus Stand',
        '5.3 km from Cox\'s Bazar Railway Station'
      ],
      tags: ['Couple Friendly', 'Breakfast Included', 'Refundable', 'Garden View', 'Airport Shuttle', 'Free Wi-Fi'],
      description: 'Number of Rooms: 66. Number of Floors: 10. Year of construction: 2012. White Orchid, a 3-star hotel, offers guests a comfortable stay with a range of convenient amenities. Guests can enjoy a complimentary continental breakfast each morning and make use of the round-trip airport shuttle service. The hotel features an on-site restaurant serving international cuisine, as well as a terrace for relaxation. Additional services include dry cleaning and laundry facilities, free in-room WiFi, and complimentary self-parking. Guests can also take advantage of bike rentals, luggage storage, newspapers in the lobby, tour and ticket assistance, barbecue grills, and a 24-hour front desk. Reviews often highlight the helpful staff and reliable WiFi. The hotel’s 66 rooms are designed for comfort, featuring 24-hour room service, air conditioning, and separate dining areas. Each room is equipped with a private bathroom that includes a shower and free toiletries, along with cable channels and ceiling fans to enhance the stay.',
      roomDetails: {
        roomType: 'Executive',
        smokingAllowed: false,
        characteristics: 'Premium',
        size: '280 sq.ft',
        view: 'None',
        occupancy: '2 Adults, 1 Child',
        adultOccupancy: 2,
        childOccupancy: 1,
        extraBed: 1,
        maxGuests: 3
      },
      roomFacilities: {
        bedroom: ['Air Conditioning', 'Fan', 'Blankets', 'Closet', 'Extra Bedding'],
        others: [
          '220V Socket',
          'Desk',
          'Fitness Center',
          'Garden View',
          'Housekeeping',
          'Make-up Mirror',
          'Room Service',
          'Slippers',
          'Swimming Pool',
          'Wheelchair Friendly'
        ],
        media: ['Internet', 'Telephone', 'TV', 'Wi-Fi'],
        food: ['Free Bottled Water'],
        bathroom: ['Bathroom', 'Hot Water', 'Toiletries', 'Towels']
      },
      hotelFacilities: {
        business: ['Auditorium'],
        food: ['Free breakfast', 'Set Menu Lunch', 'Brunch'],
        general: [
          'Wheelchair Friendly',
          '24-Hour Front Desk',
          'Restaurant',
          'Terrace',
          'Luggage Storage',
          'Newspaper',
          'Air Conditioning',
          'Check-In',
          'Check-Out',
          'Coffee/Tea in Lobby',
          'In-room Accessibility',
          'Couple Friendly',
          'Elevator',
          'Garden',
          'ID Required',
          'Towel'
        ],
        media: ['Free Wi-Fi', 'Telephone', 'Mobile Phone Coverage'],
        parking: ['Parking', 'Large Vehicle Parking'],
        safety: ['24-Hour Security'],
        services: ['Laundry Facilities']
      },
      policies: {
        checkIn: '13:00',
        checkOut: '11:00',
        childPolicy: 'Allowed',
        petPolicy: 'Not Allowed',
        houseRules: [
          'For refundable bookings with 72+ hours before check-in, please cancel and rebook for new dates.',
          'The hotel\'s check-in time is 13:00 HRS, and check-out time is 11:00 HRS.',
          'The hotel does not have an in-house swimming pool facility. Guests can access the swimming pool of White Orchid Sapphire, which is under the same ownership and located opposite White Orchid.',
          'Breakfast timing is 8 AM to 10 AM.',
          'The management will not be responsible for valuables left in the room.',
          'The management reserves the right to charge guests for missing items from the room after departure.',
          'Complaints after check-out are not applicable or receivable.',
          'Guests must provide valid ID or passport as per hotel policy.',
          'Guests are subject to all security procedures requested by White Orchid.',
          'Credit cannot be given unless prior arrangements have been made with the hotel.',
          'Guests should hand over room keys to reception before leaving the hotel.',
          'Lost room keys will incur a BDT 500 charge.',
          'Pets are not allowed inside the hotel premises.',
          'Guests are not permitted to carry weapons, ammunition, knives, narcotic drugs, or restricted items inside the hotel premises.',
          'Guests cannot hand over a room key to a third person.',
          'Extra bed with breakfast is BDT 1,200.',
          'The charge for extra bed and breakfast may change at any time, as per the hotel\'s policy prior to the check-in date.',
          'Unmarried couples are not allowed.',
          'No driver accommodation is available at the hotel premise.',
          'Extra-person charges may apply and vary depending on property policy.',
          'Government-issued photo identification and a credit card, debit card, or cash deposit may be required at check-in for incidental charges.',
          'Special requests are subject to availability upon check-in and may incur additional charges.',
          'Special requests cannot be guaranteed.',
          'This property accepts credit cards.',
          'This property offers transfers from the airport with possible surcharges. Guests must contact the property with arrival details before travel, using the contact information on the booking confirmation. Front desk staff will greet guests on arrival.',
          'Children below 5 years can stay in the same room and enjoy complimentary breakfast.',
          'Children from 5 years to 10 years can stay in the same room and will be charged 270 BDT for breakfast.',
          'Children aged 10 years and above will be charged BDT 1,500 for an extra bed and breakfast.',
          'The charge for an extra bed and breakfast may change at any time, as per the hotel\'s policy prior to the check-in date.'
        ]
      },
      price: 4744,
      taxes: 1256,
      breakfastIncluded: true,
      refundable: true,
      reviews: WHITE_ORCHID_REVIEWS
    }
  },
  {
    id: 'surestay-premium-deluxe',
    hotelGroupId: 'group-surestay',
    name: 'SureStay by Best Western Cox’s Bazar',
    roomName: 'Premium Deluxe',
    planType: 'Breakfast Included',
    breakfast: true,
    refundable: true,
    basePrice: 7906,
    taxesAndFees: 2094,
    originalPrice: 19921,
    discountLabel: '60% off',
    bedType: 'King',
    availabilityNote: 'Hurry Up! Only 5 Rooms Left',
    notes: 'Complimentary buffet breakfast. Free cancellation before 00:01 on Tue, 16 Jun 2026.',
    category: 'premium',
    tags: [
      'Couple Friendly',
      'Breakfast Included',
      'Refundable',
      'International Chain',
      'Premium Deluxe',
      'Airport Shuttle Service'
    ],
    // SureStay by Best Western Cox’s Bazar images are loaded from public Google Drive image thumbnails for demo use. For production stability, local public/hotels assets are recommended.
    imageUrl: getDriveImageUrl('1eZp3J9WhEAZ8El_3BIEcBko6OdPSNc7G'),
    galleryImages: [
      getDriveImageUrl('1eZp3J9WhEAZ8El_3BIEcBko6OdPSNc7G'),
      getDriveImageUrl('1l_hUPTJ88wNzHkiv__WEducjMiFRDjqK'),
      getDriveImageUrl('1RwJhZpkoAF_aux0hPPj67t9udfBvhqHX'),
      getDriveImageUrl('19NaMbhCXcJdHFioK3O0i-ZyYpD61mxUR'),
      getDriveImageUrl('19EvPfuD9665Tg_hSx0XnpAeq4nfHLZRS'),
      getDriveImageUrl('1Of7KCZlv9Z9Thi3x3jw5DkSV8X3tsl3M'),
      getDriveImageUrl('1RN2A32MDzOqyY2Wgva5dOm5_tDBKIjq9'),
      getDriveImageUrl('1HmAhgs_xxEnxkiHMd03yFOlgFeOgJraf'),
      getDriveImageUrl('1tpFWZFf541Y59hpJ_tNnHdqVJSksS37U'),
      getDriveImageUrl('1Qq4w1thZFHdQYbrn3OyGY6arKlGCJdsH'),
      getDriveImageUrl('1JqAEyejdmZhXxv5rWZfQiMHuU6iRMsvy'),
      getDriveImageUrl('1IZ2tOSpaWFKQSB8LS-hgiFQOg4FbG3t0'),
      getDriveImageUrl('1H0qdy1-9AtEZFXA8u3APzG1ZO_jStym_'),
      getDriveImageUrl('1PKOj7NTDhbQRiDfpOqkN9-cE9937Ixi7'),
      getDriveImageUrl('1DxvSSRYAflvz2CYG8EUeN0Z2WWbJvCco'),
      getDriveImageUrl('1w-oTdewNOZBM5NyGWuKinvflsspkG8_W'),
      getDriveImageUrl('1Gu545oys3F0vWjvapoM2FvU9ENfOmdRZ')
    ],
    starRating: '4.0 Star',
    details: {
      id: 'surestay-premium-deluxe',
      hotelName: 'SureStay by Best Western Cox’s Bazar',
      roomName: 'Premium Deluxe',
      starRating: '4.0 Star',
      address: 'Plot- 31, Block –C, PWD R/A, Kolatoli, Cox\'s Bazar, Bangladesh',
      reviewSummary: {
        text: 'Excellent',
        count: 23,
        score: 4.4,
        cleanlinessScore: 4.6,
        staffScore: 4.5,
        comfortScore: 4.5,
        locationScore: 4.1,
        facilitiesScore: 4.4,
        valueScore: 4.2
      },
      nearby: [
        '0.9 km from Sugondha Sea Beach, Cox\'s Bazar',
        '0.95 km from Kolatoli Beach, Cox\'s Bazar',
        '1.7 km from Laboni Beach',
        '2.9 km from Radiant Fish World, Jhawtola Main Rd, Cox\'s Bazar',
        '23.2 km from Inani Beach, Coxs Bazar',
        '4.5 km from Cox\'s Bazar Airport',
        '5.5 km from Cox\'s Bazar Railway Station',
        '0.7 km from Kolatoli Bus Stand'
      ],
      tags: [
        'Couple Friendly',
        'Breakfast Included',
        'Refundable',
        'International Chain',
        'Premium Deluxe',
        'Airport Shuttle Service'
      ],
      description: 'Number of Rooms: 60. Number of Floors: 10. Year of construction: 2022. SureStay By Best Western Cox\'s Bazar is a 4-star international chain lifestyle hotel in one of the most pristine atolls in Cox’s Bazar. The 62-key hotel offers an immersive art and design experience with a holistic, integrated approach to well-being. The hotel\'s facilities include 2 vibrant and innovative Food & Beverage outlets, fitness and wellbeing areas, and various leisure facilities.',
      roomDetails: {
        roomType: 'Double',
        smokingAllowed: false,
        characteristics: 'None',
        size: 'None',
        view: 'None',
        occupancy: '2 Adults, 2 Children',
        adultOccupancy: 2,
        childOccupancy: 2,
        extraBed: 1,
        maxGuests: 3
      },
      roomFacilities: {
        bedroom: [
          'Air Conditioning',
          'Fan',
          'In-Room Safe',
          'Blankets',
          'Closet',
          'Curtain',
          'Extra Bedding'
        ],
        others: [
          '220V Socket',
          'Desk',
          'Electric Kettle',
          'Free Newspaper',
          'Housekeeping',
          'In-room Dining',
          'Linens',
          'Non-Smoking',
          'Room Service',
          'Slippers',
          'Wheelchair Friendly'
        ],
        bathroom: [
          'Bathroom',
          'Hairdryer',
          'Toiletries',
          'Towels',
          'Hot Water'
        ],
        media: [
          'Internet',
          'Telephone',
          'TV',
          'Wi-Fi'
        ],
        food: [
          'Coffee/Tea Maker',
          'Mini Fridge',
          'Free Bottled Water'
        ]
      },
      hotelFacilities: {
        business: ['Conference Hostess'],
        wellness: ['Gym', 'Massage'],
        food: ['Buffet Dinner', 'Buffet Lunch', 'Set Menu Lunch', 'Brunch'],
        general: [
          'Air Conditioning',
          'Check-In',
          'Check-Out',
          'Coffee/Tea in Lobby',
          'Elevator',
          'Garden',
          'ID Required',
          'Lockers',
          'Smoke detector',
          'Towel',
          'Couple Friendly'
        ],
        media: ['Mobile Phone Coverage'],
        parking: ['Garage', 'Large Vehicle Parking'],
        safety: ['24-Hour Security'],
        services: ['Airport Shuttle Service', 'Paid Shuttle Service']
      },
      policies: {
        checkIn: '14:00',
        checkOut: '12:00',
        childPolicy: 'Allowed',
        petPolicy: 'Not Allowed',
        houseRules: [
          'For refundable bookings with 72+ hours before check-in, please cancel and rebook for new dates.',
          'Hotel check-in time is 14:00 hours, and check-out time is 12:00 hours.',
          'Buffet breakfast timing is 7:00 AM - 10:00 AM.',
          'Additional charges may apply for late check-out.',
          'Please bring NID or passport copies at the time of check-in.',
          'The actual charges will be calculated by the hotel in its local currency.',
          'Early check-in and late check-out are not guaranteed; it is subject to availability and at the property\'s discretion.',
          'Room rents are non-refundable on block dates and long holidays.',
          'Outside food is not allowed in the hotel premises.',
          'Arms and pets are not allowed in the room.',
          'Extra bed with breakfast is BDT 2,000.',
          'The charge for extra bed and breakfast may change at any time as per the hotel\'s policy prior to the check-in date.',
          'Airport pick and drop rate per way is BDT 250 per person.',
          'Airport pick and drop car type: Shuttle.',
          'No driver accommodation is available at the hotel premise.'
        ]
      },
      price: 7906,
      taxes: 2094,
      breakfastIncluded: true,
      refundable: true,
      reviews: SURESTAY_REVIEWS
    }
  },
  {
    id: 'grand-pacific-premier',
    hotelGroupId: 'group-grand-pacific',
    name: 'Hotel Grand Pacific, Cox’s Bazar',
    roomName: 'Premier Deluxe King [City View]',
    planType: 'Breakfast Included',
    breakfast: true,
    refundable: true,
    basePrice: 7906,
    taxesAndFees: 2094,
    notes: 'Premium plush king bed with central views. Only 10 rooms left!',
    category: 'premium',
    tags: ['Complimentary Breakfast', 'King Bed', 'City View', 'Balcony Breeze', 'Couple Friendly', 'Only 10 rooms left'],
    // Hotel Grand Pacific images are loaded from public Google Drive image thumbnails for demo use. For production stability, local public/hotels assets are recommended.
    imageUrl: getDriveImageUrl('1qHXXesPmRCXK0WwEn4Vpgilk7yvguTcf'),
    galleryImages: [
      getDriveImageUrl('1qHXXesPmRCXK0WwEn4Vpgilk7yvguTcf'),
      getDriveImageUrl('1GD3kXRomtM3qlLHuk69eje4udRnRoLaR'),
      getDriveImageUrl('1Y3DZKD5sEYxqe2oC4MSawuI_jV8UMpKh'),
      getDriveImageUrl('1KHI6XRgL0EOLFqJOJ16SL3FEYcOlPZFL'),
      getDriveImageUrl('1yaT1hOLp1PpKAr8KohQT1-8lJPN_0DOx'),
      getDriveImageUrl('1DxJaoQu5PolVenZUaL8eJBOPB6cDeHZu'),
      getDriveImageUrl('1oxNb-WqyJavBmybazfCoxiMYV7GiH9S5'),
      getDriveImageUrl('1cSyBDaKJOkjDq5bJccwZ8LnFKSRtPkS7'),
      getDriveImageUrl('1mg7p6Kq1T9RcYqXXyx_XjAnvsqI1pBOa'),
      getDriveImageUrl('1PiB8lsEk-x4VUU3P-dpasid6Y2QSvWiX'),
      getDriveImageUrl('1SsdAjO5oaaw86Z69FvUk5Jgujl9n5lPi'),
      getDriveImageUrl('1a7l0K2XgLl3_40V-owufIjd6UVrFQYnI'),
      getDriveImageUrl('1oJg5PfC0822xYeQXW90UlRKfX4rQl-vx'),
      getDriveImageUrl('1OXCkPuqOzo65epC8HE3D3Jjyw0HXxKC-'),
      getDriveImageUrl('1aWbH4f4am4e_OV9IgOScxu9WaDRZYVJc'),
      getDriveImageUrl('1JihLkgHzUlpdf2T1Tr40eowsmvam8jI5'),
      getDriveImageUrl('1RkbLdtG0v-dUzN5mpzjTj8kPaEArTf8d'),
      getDriveImageUrl('1c1XNyq1Jk8jdy3dMAfrRgggePTU_DoZU'),
      getDriveImageUrl('18so7xcOvqNcFY7Wd88OZ5Tj2CZecmKM0'),
      getDriveImageUrl('1XJ5ehfi7f8YOegvtUyl3ZROensqdwT-B'),
      getDriveImageUrl('1D_CkQrLnu20aUuzs_QwyyvN8FQXYMi3k'),
      getDriveImageUrl('1z7Iovjq5bIkW1pVJXsXnKXGgZe9jlmNw')
    ],
    starRating: '4.0 Star',
    details: {
      id: 'grand-pacific-premier',
      hotelName: 'Hotel Grand Pacific, Cox’s Bazar',
      roomName: 'Premier Deluxe King [City View]',
      starRating: '4.0 Star',
      address: '176, Kolatoli, Kolatoli, Cox’s Bazar, Bangladesh',
      reviewSummary: {
        text: 'Excellent',
        count: 24,
        score: 4.1,
        locationScore: 4.5,
        comfortScore: 4.5,
        cleanlinessScore: 4.7,
        facilitiesScore: 4.0,
        valueScore: 4.2
      },
      nearby: [
        '0.5 km from Kolatoli Beach, Cox’s Bazar',
        '1.5 km from Sugondha Sea Beach, Cox’s Bazar',
        '2.7 km from Laboni Beach',
        '23.2 km from Inani Beach',
        '3.9 km from Radiant Fish World',
        '3.5 km from Shalik Restaurant',
        '4.7 km from Cox’s Bazar Airport',
        '5.8 km from Cox’s Bazar Railway Station',
        '0.24 km from Kolatoli Bus Stand'
      ],
      tags: ['Couple Friendly', 'King Bed', 'City View Balcony', 'New 2025 Property'],
      description: 'Enjoy world-class hospitality in an eco-friendly and charming setting with central views, luxurious amenities, and exceptional service in a 12-story layout.',
      roomDetails: {
        roomType: 'King Bed',
        occupancy: '2 Guests Max',
        adultOccupancy: 2,
        childOccupancy: 0,
        maxGuests: 2,
        size: '310 sq ft',
        view: 'City View with Balcony'
      },
      roomFacilities: {
        others: ['Power Outlet', 'Balcony Chair'],
        bathroom: ['Toiletries', 'Bathroom', 'Hairdryer', 'Hot Water', 'Towels'],
        bedroom: ['Air Conditioning', 'Balcony', 'Safe/Locker', 'Closet'],
        media: ['Digital TV', 'Wi-Fi Coverage'],
        food: ['Electric Kettle', 'Free Bottled Water']
      },
      hotelFacilities: {
        wellness: ['Swimming Pool'],
        food: ['Set Menu Lunch'],
        general: ['Air Conditioning', 'Check-Out', 'Check-In', 'Elevator', 'ID Required', 'Lockers', 'Smoke detector', 'Couple Friendly', 'Accessible Bathroom', 'No Alcohol'],
        parking: ['Free Large Vehicle Parking'],
        safety: ['24-Hour Security'],
        transport: ['Car Rental', 'Airport Shuttle Service']
      },
      policies: {
        checkIn: '14:00',
        checkOut: '12:00',
        childPolicy: 'Allowed.',
        petPolicy: 'Not Allowed',
        houseRules: [
          'For any date change requests on refundable bookings within 72+ hours before check-in, customers are advised to cancel and rebook for a new date.',
          'Breakfast timing is 7:30 AM to 10:30 AM.',
          'Swimming pool access limited to 1 hour (9:00 AM to 6:00 PM).',
          'All guests must present a valid NID at check-in.',
          'Outside food is not allowed.'
        ]
      },
      price: 7906,
      taxes: 2094,
      breakfastIncluded: true,
      refundable: true,
      reviews: GRAND_PACIFIC_REVIEWS
    }
  },
  {
    id: 'hotel-sea-uttara',
    hotelGroupId: 'group-sea-uttara',
    name: 'Hotel Sea Uttara',
    roomName: 'Premier Double King with Balcony (Higher Floor)',
    planType: 'Breakfast Included',
    breakfast: true,
    refundable: true,
    basePrice: 5692,
    taxesAndFees: 1508,
    notes: 'Premium double king, balcony, higher floor',
    category: 'balcony',
    tags: ['Couple Friendly', 'With Balcony', 'Only 10 rooms left', 'City Centre', '0.15 km from Kolatoli Bus Stand'],
    // Hotel Sea Uttara images are loaded from public Google Drive image thumbnails for demo use. For production stability, local public/hotels assets are recommended.
    imageUrl: getDriveImageUrl('1u_fpayRmV9VrNEpdtmzDW4DOoKBy5Tfw'),
    galleryImages: [
      getDriveImageUrl('1u_fpayRmV9VrNEpdtmzDW4DOoKBy5Tfw'),
      getDriveImageUrl('1m0SXAr-Cjb5arZgkqB1iEm5tEZpxKosR'),
      getDriveImageUrl('1VewRfLLbZRSQyEy6qLVqBM72wSGx2ee1'),
      getDriveImageUrl('1R_-mmLlcXhaZ8KiIRvfNFnQRYf68VPun'),
      getDriveImageUrl('1Tc9oGsGfEHKOS12HDxbd_76M_Kygq5Q-'),
      getDriveImageUrl('1NBPCQs-GNtEN3HACXyqSO5HR88EY_G20'),
      getDriveImageUrl('1eW7AnYJwg9zw9BaVmMCHuDRAlze3C5Nm'),
      getDriveImageUrl('1-AeV35aoNaHdxKFwFQ9LxPbqvsdE-fQK'),
      getDriveImageUrl('1_LVvFMrgqYdZTfw4EkgT5EdaOnGbEtFE'),
      getDriveImageUrl('1U8cRwV_dPfD_CUlDtWr_v8ul2C67bcte'),
      getDriveImageUrl('1-wrr5HR1sRPOVHkuKMLcRnZ_ll3Tla22')
    ],
    starRating: '3.0 Star',
    details: {
      id: 'hotel-sea-uttara',
      hotelName: 'Hotel Sea Uttara',
      roomName: 'Premier Double King with Balcony (Higher Floor)',
      starRating: '3.0 Star',
      address: 'Dolphin Circle Beach Road, New Beach Rd, Kolatoli, Cox’s Bazar, Bangladesh',
      reviewSummary: {
        text: 'Very Good',
        count: 26,
        score: 4.0,
        staffScore: 4.2,
        comfortScore: 4.0,
        locationScore: 4.2,
        facilitiesScore: 3.6,
        cleanlinessScore: 4.1,
        valueScore: 3.7
      },
      nearby: [
        '0.35 km from Kolatoli Beach',
        '1.3 km from Sugondha Sea Beach',
        '2.5 km from Laboni Beach, Cox’s Bazar',
        '0.05 km from Shalik Restaurant & Biriyani House',
        '5.2 km from Cox’s Bazar Airport',
        '0.15 km from Kolatoli Bus Stand',
        '5.5 km from Cox’s Bazar Railway Station'
      ],
      tags: ['Couple Friendly'],
      description: 'Hotel Sea Uttara is located in Dolphin Circle Beach Road offering well-furnished premium rooms with private balcony access and standard convenience features.',
      roomDetails: {
        roomType: 'Double',
        occupancy: '2 Adults, 1 Child. Max 3 Guests',
        adultOccupancy: 2,
        childOccupancy: 1,
        extraBed: 1,
        maxGuests: 3,
        smokingAllowed: false,
        characteristics: 'Premium',
        size: '330 sq.ft',
        view: 'None'
      },
      roomFacilities: {
        media: ['Wi-Fi', 'Cable TV', 'TV', 'Telephone', 'Internet'],
        bedroom: ['Air Conditioning', 'Balcony', 'Fan', 'Blankets', 'Extra Bedding'],
        bathroom: ['Toiletries', 'Towels', 'Bathroom', 'Hot Water'],
        food: ['Free Bottled Water', 'Mini Fridge', 'Coffee/Tea Maker'],
        others: [
          'Housekeeping',
          'Room Service',
          'Electric Kettle',
          'Desk',
          'Linens',
          'Make-up Mirror',
          'Non-Smoking',
          'Refrigerator',
          'Slippers',
          'Wake-Up Call',
          '220V Socket',
          'Bike Rental',
          'In-room Dining',
          'Smart Lock'
        ]
      },
      hotelFacilities: {
        business: ['Conference Hostess'],
        food: ['Set Menu Lunch', 'Brunch'],
        general: [
          'Check-Out',
          'Check-In',
          'City Centre',
          'Towel',
          'No Alcohol',
          'Elevator',
          'Lockers',
          'Couple Friendly',
          'ID Required',
          'Air Conditioning'
        ],
        media: ['Computer', 'Mobile Phone Coverage', 'Telephone', 'Printer', 'Photocopier'],
        parking: ['Large Vehicle Parking'],
        safety: ['24-Hour Security'],
        services: ['Bicycle Rental', 'Medical Service', 'Tours/Ticket Assistance'],
        transport: ['Car Rental', 'Paid Shuttle Service', 'Airport Shuttle Service']
      },
      policies: {
        checkIn: '13:00',
        checkOut: '11:00',
        childPolicy: 'Allowed\n\nChildren below 5 years can stay in the same room and enjoy free food.\nChildren above 5 years are chargeable.\nChildren from 5 years to 10 years will be charged BDT 200 for breakfast.\nChildren above 10 years will be charged BDT 300 for breakfast only.\nAbove 10 years, if an extra bed is taken, then BDT 1,000 will be added for the extra bed and breakfast.\nExtra mattress bed will be charged BDT 1,000, including 1 person breakfast per night per bed.\nChildren are allowed to stay in the same room if they can accommodate themselves in the same bed.',
        petPolicy: 'Not Allowed',
        houseRules: [
          'For refundable bookings with 72+ hours before check-in, please cancel and rebook for new dates.',
          'Hotel check-in time is 13:00 / 1:00 PM, and check-out time is 11:00 / 11:00 AM.',
          'Breakfast timing is 7:00 AM - 10:00 AM.',
          'Additional charges may apply for late check-out.',
          'Hotel Sea Uttara does not allow guests to bring food and beverage items from outside to the hotel without management’s prior written approval.',
          'Rooms may not be guaranteed for early arrivals unless pre-reserved from the previous night.',
          'Each guest has to present a copy of their valid NID or other identification documents during check-in.',
          'Actual charges will be calculated by the hotel in its local currency.',
          'During blackout or long holiday periods, the cancellation policy will not be applicable.',
          'Extra mattress bed will be charged BDT 1,000, including 1 person breakfast per night per bed.',
          'No driver accommodation is available at the hotel premise.'
        ]
      },
      price: 5692,
      taxes: 1508,
      breakfastIncluded: true,
      refundable: true,
      reviews: SEA_UTTARA_REVIEWS
    }
  }
];

export const HOTELS: Hotel[] = ALL_HOTELS.filter(h => h.id === 'grand-pacific-premier');

export function getRoomsNeeded(groupSize: GroupSize): number {
  if (groupSize === 2) return 1;
  if (groupSize === 3) return 2;
  if (groupSize === 4) return 2;
  if (groupSize === 5) return 3;
  if (groupSize === 6) return 3;
  return 2; // Default fallback
}

export function calculateBkashDiscount(basePrice: number): number {
  // bKash discount is 3% of base room price
  return Math.round(basePrice * 0.03);
}

export function calculatePerRoomFinal(basePrice: number, taxesAndFees: number): number {
  const discount = calculateBkashDiscount(basePrice);
  return basePrice + taxesAndFees - discount;
}

export function calculateHotelTotal(perRoomFinal: number, rooms: number): number {
  return perRoomFinal * rooms;
}

export function calculateBusTotal(groupSize: GroupSize, oneWayBusFare: number): number {
  if (groupSize === 4) {
    const confirmedOutboundBusTotal = 8700;
    const expectedReturnBusTotal = 8700;
    return confirmedOutboundBusTotal + expectedReturnBusTotal;
  }
  return groupSize * (oneWayBusFare * 2);
}

export function calculateTripTotal(hotelTotal: number, busTotal: number): number {
  return hotelTotal + busTotal;
}

export function calculatePerPerson(tripTotal: number, groupSize: GroupSize): number {
  return Math.round(tripTotal / groupSize);
}

/**
 * Calculates complete trip costs for a hotel option
 */
export function calculateAllTripCosts(
  hotel: Hotel,
  groupSize: GroupSize,
  oneWayBusFare: number
): TripCosts {
  const basePrice = hotel.basePrice;
  const taxesAndFees = hotel.taxesAndFees;
  const bkashDiscount = calculateBkashDiscount(basePrice);
  const finalPerRoomCost = calculatePerRoomFinal(basePrice, taxesAndFees);
  const roomCount = getRoomsNeeded(groupSize);
  const hotelTotal = calculateHotelTotal(finalPerRoomCost, roomCount);
  const busTotal = calculateBusTotal(groupSize, oneWayBusFare);
  const fullTripTotal = calculateTripTotal(hotelTotal, busTotal);
  const individualCost = calculatePerPerson(fullTripTotal, groupSize);

  return {
    basePrice,
    taxesAndFees,
    bkashDiscount,
    finalPerRoomCost,
    roomCount,
    hotelTotal,
    busTotal,
    fullTripTotal,
    individualCost,
  };
}

/**
 * Format currency using centralized formatTripMoney
 * All source amounts are stored in BDT. USD is display-only. Update BDT_PER_USD when needed.
 */
export function formatBDT(amount: number): string {
  return formatTripMoney(amount);
}

const POOL_ACCESS_DATA: Record<string, { poolAccess: 'included' | 'shared' | 'not_available' | 'not_provided'; poolNote: string }> = {
  'ocean-paradise': { poolAccess: 'included', poolNote: 'Pool available.' },
  'green-nature-resort': { poolAccess: 'not_provided', poolNote: 'Pool information not provided in screenshot.' },
  'windy-terrace-standard': { poolAccess: 'not_provided', poolNote: 'Pool information not provided in screenshot.' },
  'windy-terrace-superior': { poolAccess: 'not_provided', poolNote: 'Pool information not provided in screenshot.' },
  'hotel-sea-crown': { poolAccess: 'not_provided', poolNote: 'Pool information not provided in screenshot.' },
  'white-orchid-sapphire': { poolAccess: 'included', poolNote: 'Pool access shown through hotel/facility context.' },
  'grace-cox-standard-double-queen': { poolAccess: 'included', poolNote: 'Swimming pool and gym access mentioned in policy.' },
  'grace-cox-deluxe-double-king': { poolAccess: 'included', poolNote: 'Swimming pool and gym access mentioned in policy.' },
  'hotel-sea-paradise-higher-floor': { poolAccess: 'included', poolNote: 'Infinity swimming pool / swimming pool access mentioned.' },
  'hotel-sea-paradise-balcony': { poolAccess: 'included', poolNote: 'Infinity swimming pool / swimming pool access mentioned.' },
  'white-orchid-executive-couple-garden-view': { poolAccess: 'shared', poolNote: 'No in-house swimming pool. Guests may access White Orchid Sapphire pool under same ownership.' },
  'surestay-premium-deluxe': { poolAccess: 'not_available', poolNote: 'No swimming pool mentioned; review says according to price should have swimming pool.' },
  'grand-pacific-premier': { poolAccess: 'not_provided', poolNote: 'Pool information not provided in screenshot.' },
  'hotel-sea-uttara': { poolAccess: 'not_provided', poolNote: 'Pool information not provided in screenshot.' }
};

HOTELS.forEach(hotel => {
  const poolInfo = POOL_ACCESS_DATA[hotel.id];
  if (poolInfo) {
    hotel.poolAccess = poolInfo.poolAccess;
    hotel.poolNote = poolInfo.poolNote;
  }
});

