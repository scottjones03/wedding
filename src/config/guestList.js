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
export const GUEST_LIST = [
    // TODO: replace these placeholders with your real guest list
    'Guest Name',
];

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
