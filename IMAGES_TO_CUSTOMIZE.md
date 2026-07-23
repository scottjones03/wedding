# 🖼️ Which images do I need to edit?

This site was originally a developer portfolio, so most of the hand-drawn art
still shows the old "developer" character and dev-tool logos. Everything below
is grouped by priority so you can edit as few files as possible.

All file paths are relative to the `public/` folder (e.g. `favico.png` means
`public/favico.png`). Every image can be replaced **in place** — keep the exact
same file name and folder — and the site will pick it up automatically, no
code changes required.

---

## 🔴 Must edit (shows the old developer / dev logos)

| File | What it is | Where it's used |
|---|---|---|
| `favico.png` | Browser tab icon — currently the old character's face | [index.html](index.html) |
| `og-image.webp` | Social share preview image, **and now also the main hero photo shown in a frame at the start of the corridor** | [index.html](index.html), [HeroPhoto.jsx](src/components/canvas/corridor/HeroPhoto.jsx) ✅ *already edited* — also set the `VITE_SITE_URL` env var (see [README.md](README.md#-environment-variables)) so social apps can actually load it as an absolute URL |
| `textures/entrance/avatar_window.webp` | Character waving in the entrance window | [texturePreloadList.js](src/config/texturePreloadList.js) |
| `textures/about/awatarnachmurce.webp` | Same character lying on a cloud in the About room | [InfiniteSkyManager.jsx](src/components/canvas/rooms/About/InfiniteSkyManager.jsx) |
| `textures/entrance/sign.webp` | Hanging sign, currently reads "PORTFOLIO" | [texturePreloadList.js](src/config/texturePreloadList.js) |
| `textures/doors/door_left_sketch.webp` + `door_left_painted.webp` | Main entrance door, covered in HTML/JS/TypeScript stickers | [EntranceDoors.jsx](src/components/canvas/entrance/EntranceDoors.jsx) |
| `textures/doors/door_right_sketch.webp` + `door_right_painted.webp` | Main entrance door, covered in React/Node/CSS3 stickers | [EntranceDoors.jsx](src/components/canvas/entrance/EntranceDoors.jsx) |

**Tip on the avatar (2 remaining files):** the entrance window and the About
room cloud still show the old drawn character (the corridor's 3rd copy was
replaced by the `og-image.webp` hero photo). You can drop the **same one new
image** (e.g. a simple drawing or photo cutout of the two of you) into both
`avatar_window.webp` and `awatarnachmurce.webp` to keep things consistent.

---

## 🟡 Recommended to edit (placeholder "content" photos)

These already have wedding-appropriate titles/descriptions hardcoded in the
code — only the images themselves are still the old placeholders.

**Gallery room** ([GalleryRoom.jsx](src/components/canvas/rooms/Gallery/GalleryRoom.jsx), `FALLBACK_PROJECTS`):
| File | Card |
|---|---|
| `textures/gallery/monetuneprzod.webp` + `_painted` | "How We Met" |
| `textures/gallery/timberkittyprzod.webp` + `_painted` | "The Proposal" |
| `textures/gallery/youngmultiprzod.webp` + `_painted` | "Engagement Shoot" |
| `textures/gallery/bioprzod.webp` + `_painted` | "Save the Date" |

**Studio room** ([contentData.js](src/components/canvas/rooms/Studio/contentData.js), `RAW_CONTENT_DATA`):
| File | Item |
|---|---|
| `textures/studio/tvfront_filmikprojektdlamultiego.webp` + `_painted` | "Save the Date!" video |
| `textures/studio/tvfront_filmikedytowaniezdjec.webp` + `_painted` | "How We Got Engaged" video |
| `textures/studio/monitorfront_postnafbdoublewinner.webp` + `_painted` | "Save the Date Announcement" blog post |
| `textures/studio/phonefront_followmeontiktok.webp` + `_painted` | "Follow our wedding journey!" TikTok |

**About room "our story" islands** ([InfiniteSkyManager.jsx](src/components/canvas/rooms/About/InfiniteSkyManager.jsx), `JourneyMilestone`):
| File | Island label |
|---|---|
| `textures/about/uowyspa.webp` | "How We Met" |
| `textures/about/freelancewyspa.webp` | "The Proposal" |

**Contact room RSVP form** ([MessagePaper.jsx](src/components/canvas/rooms/Contact/MessagePaper.jsx)):
| File | Note |
|---|---|
| `textures/contact/paper_form.webp` | The paper's baked-in field labels are drawn into this image, not rendered by code. It may still visually say "email / subject / message" — redraw it to say "email / plus ones / dietary requirements" to match the RSVP form. |

Tech-stack logo badges on the gallery cards (React/CSS/HTML/etc.) are already
disabled in code (`techStack: []`), so those logo files are unused — ignore
them.

The old "Awards" (SOTD/SOTM/SOTY/button) card textures and the "Skills"
floating balloon textures (React, Three.js, GSAP, etc.) are **no longer
rendered at all** — those two sections were removed from the About room, so
every file under `textures/about/SOTY*`, `SOTD*`, `SOTM*`, `button*`, and
`*balon*` is now unused dead weight you can ignore or delete.

---

## 🟢 Safe to leave alone (generic decoration, no personal content)

Walls, floors, plants, furniture, lamps, the sky/clouds, the corridor door
icons for Projects/Social/Contact (blueprint, Instagram/TikTok, envelope),
and every `textures/**/backups/` folder (unused leftover files from earlier
edits, not referenced by any code). None of these show a face, a name, or
dev-specific text that's out of place for a wedding site, so you can leave the
whole rest of `public/` untouched.

---

## How the code is organized

- [src/config/texturePreloadList.js](src/config/texturePreloadList.js) is the
  master list of every texture the app loads, grouped by scene, with
  `EDIT ME` comments next to the identity-critical files above.
- Fallback/placeholder content (Gallery, Studio) lives in small hardcoded
  arrays (`FALLBACK_PROJECTS`, `RAW_CONTENT_DATA`) — the file path, title, and
  description for each item are always right next to each other, so search
  the relevant file to update text and swap the matching image file together.
