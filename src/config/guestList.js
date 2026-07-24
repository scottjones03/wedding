// Guest List
// ----------
// Add every invited guest's name below (one string per entry).
// Matching is case-insensitive and ignores extra spaces, so "Jane Doe",
// "jane doe" and "  Jane   Doe " all match the same entry.
//
// Tip: if you want to accept either a first name OR a full name for the
// same guest, just add both as separate entries, e.g.
//   'Jane', 'Jane Doe',
//
// NOTE: This is a friendly guest-list check for a wedding invite site, not
// real security - the list ships in the site's JS bundle, so don't put
// anything sensitive here (just names).
export const DAY_GUEST_LIST = [
    // TODO: replace these placeholders with your real day guest list
    'Georgina Yates',
    'Scott Jones',
    'Stuart Yates',
    'Louise Yates',
    'Dominic Yates',
    'Jolie Smith',
    'Theresa Jones', 
    'Owen Jones',
    'Wayne Jones',
    'Ellie Jones',
    'Monica Joseph',
    'Trevor Joseph',
    'Jean Hopkinshon',
    'Michelle Taylor',
    'Chris Taylor',
    'Henry Taylor',
    'Tom Taylor'
];

export const NIGHT_GUEST_LIST = [
    // TODO: replace these placeholders with your real evening guest list
    'Guest Name (Night)',
];

export const GUEST_LIST = [...DAY_GUEST_LIST, ...NIGHT_GUEST_LIST];

/**
 * Checks whether a typed name matches an entry on the guest list.
 * Case-insensitive, trims surrounding whitespace, and collapses internal
 * whitespace so "Jane   Doe" matches "Jane Doe".
 */
export function isGuestOnList(name) {
    const normalized = String(name || '').trim().toLowerCase().replace(/\s+/g, ' ');
    if (!normalized) return false;
    return GUEST_LIST.some(
        (guest) => String(guest).trim().toLowerCase().replace(/\s+/g, ' ') === normalized
    );
}

export function getGuestTypeForName(name) {
    const normalized = String(name || '').trim().toLowerCase().replace(/\s+/g, ' ');
    if (!normalized) return null;

    const isDayGuest = DAY_GUEST_LIST.some(
        (guest) => String(guest).trim().toLowerCase().replace(/\s+/g, ' ') === normalized
    );
    if (isDayGuest) return 'day';

    const isNightGuest = NIGHT_GUEST_LIST.some(
        (guest) => String(guest).trim().toLowerCase().replace(/\s+/g, ' ') === normalized
    );
    if (isNightGuest) return 'night';

    return null;
}
