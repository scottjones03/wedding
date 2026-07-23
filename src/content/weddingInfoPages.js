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
        room: 'gallery',
        description: 'The key details at a glance.',
        sections: [
            {
                heading: 'Couple',
                lines: ['Scott and Georgina'],
            },
            {
                heading: 'Ceremony',
                lines: [
                    'Saturday, 11 May 2027',
                    'Ceremony starts at 2:00 PM (please arrive by 1:30 PM).',
                    'Holmewood Hall, Church Street, Holme, Peterborough PE7 3PB, United Kingdom.',
                ],
            },
            {
                heading: 'Reception',
                lines: [
                    'Reception starts at 4:00 PM.',
                    'Holmewood Hall, Church Street, Holme, Peterborough PE7 3PB, United Kingdom.',
                ],
            },
        ],
    },
    travel: {
        slug: 'travel',
        title: 'Travel',
        room: 'gallery',
        description: 'Airports, rail, and local transport suggestions.',
        sections: [
            {
                heading: 'Airports',
                lines: [
                    'London Stansted (STN): around 70 minutes by car.',
                    'London Luton (LTN): around 90 minutes by car.',
                    'Birmingham (BHX): around 100 minutes by car.',
                ],
            },
            {
                heading: 'Rail and Public Transport',
                lines: [
                    'Nearest major station: Peterborough.',
                    'From Peterborough station, take a pre-booked taxi or ride-share to the venue.',
                    'Please note late-night public transport is limited in rural areas.',
                ],
            },
            {
                heading: 'Taxi Services',
                lines: [
                    'Peterborough Cars and Goldstar-style local firms are usually available.',
                    'We recommend pre-booking return journeys for late evening collections.',
                ],
            },
        ],
    },
    accommodation: {
        slug: 'accommodation',
        title: 'Accommodation',
        room: 'gallery',
        description: 'Hotel options and room request guidance.',
        sections: [
            {
                heading: 'Hotel Blocks',
                lines: [
                    'Main hotel block details will be shared here once finalised.',
                    'Please check back for hotel name, full address, booking links, and group code.',
                ],
            },
            {
                heading: 'Nearby Stays',
                lines: [
                    'There are multiple hotels and lodges within Peterborough and surrounding villages.',
                    'Use your RSVP form to request a room suggestion and we will follow up directly.',
                ],
            },
        ],
    },
    schedule: {
        slug: 'schedule',
        title: 'Weekend Schedule',
        room: 'gallery',
        description: 'Broad-strokes timeline for the wedding weekend.',
        sections: [
            {
                heading: 'Friday',
                lines: ['7:00 PM: Welcome drinks (optional).'],
            },
            {
                heading: 'Saturday',
                lines: [
                    '1:30 PM: Guest arrival window.',
                    '2:00 PM: Ceremony starts.',
                    '3:00 PM: Cocktail hour.',
                    '4:00 PM: Reception starts and day meal is served.',
                    '7:00 PM: First dance and evening celebration begins.',
                    '12:00 AM: Carriages.',
                ],
            },
            {
                heading: 'Sunday',
                lines: ['11:00 AM: Post-wedding brunch (optional, details to follow).'],
            },
        ],
    },
    faq: {
        slug: 'faq',
        title: 'Wedding FAQ',
        room: 'gallery',
        description: 'Answers to common logistics questions.',
        sections: [
            {
                heading: 'Dress Code',
                lines: ['Formal attire (suits, dresses, or equivalent).'],
            },
            {
                heading: 'Children',
                lines: ['Children are by invitation only due to venue capacity.'],
            },
            {
                heading: 'Plus-Ones',
                lines: ['Plus-ones are by special request and subject to capacity confirmation.'],
            },
            {
                heading: 'Parking',
                lines: ['On-site parking is available at Holmewood Hall with attendants guiding arrival flow.'],
            },
            {
                heading: 'Photos and Social Media',
                lines: [
                    'Please keep the ceremony unplugged and phones away during the vows.',
                    'You are welcome to share photos from the reception afterwards.',
                ],
            },
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