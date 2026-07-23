export const WEDDING_INFO_PAGES = {
    'our-story': {
        slug: 'our-story',
        title: 'Our Story',
        room: 'about',
        description: 'How we met, fell in love, and got engaged.',
        sections: [
            {
                heading: 'How We Met',
                lines: [
                    'We met in Chemistry class in 2020 and started dating on 16 December 2020.',
                    'We moved in together in August 2025 and got engaged on 15 May 2026.',
                    'We cannot wait to celebrate this next chapter with you.',
                ],
            },
        ],
    },
    basics: {
        slug: 'basics',
        title: 'Wedding Basics',
        room: 'about',
        description: 'The key details at a glance.',
        sections: [
            {
                heading: 'Couple',
                lines: ['Scott Jones and Georgina Yates'],
            },
            {
                heading: 'Venue and Core Timings',
                lines: [
                    'Saturday, 11 May 2027',
                    'Holmewood Hall, Church Street, Holme, Peterborough PE7 3PB, United Kingdom.',
                    'Venue exclusive access window: 12:00 PM (Midday) to 12:00 AM (Midnight).',
                    'Guest bedroom check-in starts at 12:00 PM.',
                    'Champagne Bar opens at 11:30 AM and closes 30 minutes before the ceremony.',
                    'Ceremony starts exactly at 2:00 PM.',
                    'Room check-out is 10:00 AM the next morning, with final departure by 10:30 AM.',
                ],
            },
            {
                heading: 'What Is Included',
                lines: [
                    'A full 3-course wedding breakfast is included for attending guests.',
                    'Canapes are included during drinks reception.',
                    'Some drinks are included at key points of the day (welcome drink, meal wine allocation, and toast drink).',
                    'Evening reception includes buffet, bar access, and DJ/disco.',
                ],
            },
        ],
    },
    travel: {
        slug: 'travel',
        title: 'Travel',
        room: 'about',
        description: 'Airports, rail, and local transport suggestions.',
        sections: [
            {
                heading: 'Rail and Public Transport',
                lines: [
                    'Nearest major station: Peterborough.',
                    'From Peterborough station, use a pre-booked taxi or ride-share to the venue.',
                    'Please note late-night public transport is limited in rural areas.',
                ],
            },
            {
                heading: 'Taxi Services',
                lines: [
                    'Please pre-book taxis well in advance for midnight departures; local availability is limited late at night.',
                    'Peterborough Cars: 01733 704444',
                    'Peterborough Taxis 247: 01733 785102',
                    'Royal Taxis Peterborough: 01733 777000',
                    'Nationwide Coaches: 01733 334343',
                ],
            },
            {
                heading: 'Parking and Vehicles',
                lines: [
                    'Free on-site parking is available (vehicles parked at owner risk).',
                    'There are no EV charging stations on-site.',
                ],
            },
        ],
    },
    accommodation: {
        slug: 'accommodation',
        title: 'Accommodation',
        room: 'about',
        description: 'Hotel options and room request guidance.',
        sections: [
            {
                heading: 'At Holmewood Hall',
                lines: [
                    'On-site accommodation is prioritized for close family first, any remaining rooms will be offered by request once family allocation is complete.',
                    'Standard room capacity is up to 2 guests per bedroom.',
                    'No extra beds or airbeds are permitted due to fire safety.',
                    'All rooms include en-suite bathroom, towels, shower wash, hairdryer, water, and tea/coffee facilities.',
                    'Irons and ironing boards are available on request.',
                ],
            },
            {
                heading: 'Nearby Hotels',
                lines: [
                    'Premier Inn Hampton (4.4 miles): 0333 321 1388',
                    'The Bell Inn Hotel, Stilton (4.9 miles): 01733 241066',
                    'The Milestone Peterborough Hotel (5.2 miles): 01733 612695',
                    'Park Inn by Radisson (10 miles): 01733 353750',
                    'Holiday Inn (16 miles): 01733 289988',
                ],
            },
        ],
    },
    schedule: {
        slug: 'schedule',
        title: 'Weekend Schedule',
        room: 'about',
        description: 'Broad-strokes timeline for the wedding weekend.',
        sections: [
            {
                heading: 'Arrival and Pre-Ceremony',
                lines: [
                    '11:30 AM: Champagne Bar opens (soft drinks, tea/coffee, beer, wine, prosecco, sandwiches, and snacks).',
                    '12:00 PM: Guest room check-in opens.',
                    '1:30 PM: Guest arrival window for ceremony.',
                ],
            },
            {
                heading: 'Saturday - Wedding Day',
                lines: [
                    '2:00 PM: Ceremony starts.',
                    '3:00 PM: Drinks reception and canapes.',
                    '4:00 PM: Full 3-course wedding breakfast.',
                    '7:00 PM: Evening reception, music, and dancing.',
                    '12:00 AM: Bar and music close (carriages).',
                ],
            },
            {
                heading: 'Next Morning',
                lines: [
                    '8:30 AM to 9:30 AM: Breakfast service.',
                    '10:00 AM: Room check-out.',
                    '10:30 AM: Final departure from the estate.',
                ],
            },
        ],
    },
    faq: {
        slug: 'faq',
        title: 'Wedding FAQ',
        room: 'about',
        description: 'Answers to common logistics questions.',
        sections: [
            {
                heading: 'Dress Code',
                lines: ['Formal attire: suits, dresses, or equivalent celebration wear.'],
            },
            {
                heading: 'Children and Pets',
                lines: [
                    'Please ask us first before bringing children or pets.',
                    'For on-site rooms, up to two children (16 and under) can stay in select rooms with parent-provided travel cots/beds.',
                ],
            },
            {
                heading: 'Plus-Ones',
                lines: ['Possible by special request due to strict venue capacity limits, subject to final confirmation.'],
            },
        ],
    },
    'venue-policies': {
        slug: 'venue-policies',
        title: 'Venue Policies & Accessibility',
        room: 'about',
        description: 'Food, drink, pets, and accessibility details for Holmewood Hall.',
        sections: [
            {
                heading: '',
                lines: [
                    'Holmewood Hall is cashless (card/contactless payments only).',
                    'No outside alcohol, food, or corkage is permitted anywhere on-site, including bedrooms and grounds.',
                    'No food or drinks are permitted on the dance floor.',
                    'Smoking and vaping are prohibited inside all buildings.',
                    'Baby food/milk can be warmed by staff for infants under 2 years old.',
                    'Please keep the ceremony unplugged and phones away during the vows.',
                    'You are welcome to share photos from the reception afterwards.',
                ],
            }
        ],
    },
};

export const STUDIO_PAGE_SEQUENCE = [
    'our-story',
    'basics',
    'travel',
    'accommodation',
    'schedule',
    'faq',
    'venue-policies',
];

export const getInfoPageBySlug = (slug) => WEDDING_INFO_PAGES[slug] || null;

export const getInfoPagesForPdf = () => {
    return STUDIO_PAGE_SEQUENCE
        .map((slug) => getInfoPageBySlug(slug))
        .filter(Boolean);
};

export const buildEventDetailsText = () => {
    const pages = getInfoPagesForPdf();
    const lines = ["Scott & Georgina Wedding - Event Details", ''];

    pages.forEach((page) => {
        lines.push(page.title.toUpperCase());
        lines.push('-'.repeat(page.title.length));
        page.sections.forEach((section) => {
            lines.push(section.heading + ':');
            section.lines.forEach((line) => lines.push('  - ' + line));
            lines.push('');
        });
        lines.push('');
    });

    return lines;
};