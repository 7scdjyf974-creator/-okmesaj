---
name: Instant Messaging Protocol
colors:
  surface: '#f4faff'
  surface-dim: '#ccdce7'
  surface-bright: '#f4faff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#e8f6ff'
  surface-container: '#e0f0fb'
  surface-container-high: '#daebf6'
  surface-container-highest: '#d4e5f0'
  on-surface: '#0e1d25'
  on-surface-variant: '#3e4945'
  inverse-surface: '#23323b'
  inverse-on-surface: '#e3f3fe'
  outline: '#6e7a75'
  outline-variant: '#bdc9c4'
  surface-tint: '#006b58'
  primary: '#006552'
  on-primary: '#ffffff'
  primary-container: '#008069'
  on-primary-container: '#d8fff1'
  inverse-primary: '#76d8bd'
  secondary: '#006d2f'
  on-secondary: '#ffffff'
  secondary-container: '#5dfd8a'
  on-secondary-container: '#007232'
  tertiary: '#00607e'
  on-tertiary: '#ffffff'
  tertiary-container: '#007aa0'
  on-tertiary-container: '#eef8ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#92f5d9'
  primary-fixed-dim: '#76d8bd'
  on-primary-fixed: '#002019'
  on-primary-fixed-variant: '#005141'
  secondary-fixed: '#66ff8e'
  secondary-fixed-dim: '#3de273'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005322'
  tertiary-fixed: '#c0e8ff'
  tertiary-fixed-dim: '#70d2ff'
  on-tertiary-fixed: '#001e2b'
  on-tertiary-fixed-variant: '#004d66'
  background: '#f4faff'
  on-background: '#0e1d25'
  surface-variant: '#d4e5f0'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-md:
    fontFamily: Inter
    fontSize: 19px
    fontWeight: '600'
    lineHeight: 24px
  headline-sm:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 22px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  title-sm:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '500'
    lineHeight: 20px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Inter
    fontSize: 14.5px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.2px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
  chat-timestamp:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 13px
  badge-count:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
  space-2xl: 2rem
---

## Brand & Style

This design system delivers an authentic, high-performance mobile messaging experience tailored for Turkish-speaking users. The aesthetic embodies utility, absolute reliability, and effortless interpersonal communication. Drawing on native mobile instant messaging patterns, the interface balances dense information hierarchy with calm, readable chat surfaces.

The visual style is **Contemporary Native Functionalism**:
- Frictionless, low-cognitive-load communication surfaces.
- Pragmatic content density with immediate visual feedback (e.g., status delivery states, live voice note scrubbing).
- Native platform ergonomics featuring bottom navigation/top tab bars, contextual floating action buttons, and fluid gesture targets.
- Localized messaging nuances (Turkish typography dynamics, diacritics alignment, and conversational conventions like audio-first interaction).

## Colors

The palette reproduces the definitive instant messaging experience with deep emerald greens, energetic action accents, and carefully calibrated conversational surfaces.

### Core Roles
- **Primary (`#008069`)**: Used for the primary app bar/header container in light mode, primary tab indicators, active contact badges, and primary brand surfaces.
- **Secondary (`#25D366`)**: The high-energy neon-emerald used for unread count badges, Floating Action Buttons (FAB), call connect controls, and active online indicator pips.
- **Tertiary (`#53BDEB`)**: Dedicated communication state color for read receipts (double checkmarks) and active audio waveform track scrubbing.
- **Neutral (`#8696A0`)**: Neutral slate used for metadata timestamps, secondary captions, subtle icons, input placeholder copy, and delivered single/double checks.

### Functional Chat Surfaces
- **Chat Canvas Background**: Light mode `#EFEAE2` (with optional subtle structural doodle pattern overlay); Dark mode `#0B141A`.
- **Outgoing Chat Bubble**: Light mode `#D9FDD3` (with inner text `#111B21`); Dark mode `#005C4B` (with inner text `#E9EDEF`).
- **Incoming Chat Bubble**: Light mode `#FFFFFF` (with inner text `#111B21`); Dark mode `#202C33` (with inner text `#E9EDEF`).
- **Header & Structural Containers**: Light mode `#008069` (headers), `#FFFFFF` (surfaces); Dark mode `#1F2C34` (headers), `#121B22` (base canvas).

## Typography

The type scale uses **Inter**, configured for clarity across mobile densities and full linguistic support for Turkish characters (`ç`, `ğ`, `ı`, `İ`, `ö`, `ş`, `ü`). 

- **Chat Message Rendering (`body-md` / 14.5px)**: Sized specifically to maximize readability inside variable-length speech bubbles without introducing awkward line breaks on compound Turkish words.
- **Timestamps (`chat-timestamp` / 11px)**: Displayed alongside delivery glyphs inside message bubbles, right-aligned to float unobtrusively adjacent to message copy.
- **Chat List Item Headers (`title-md` / 16px)**: Medium-bold weighting to immediately separate contact titles from message previews (`body-sm`).
- **Status & Tabs (`label-md` / 12px, uppercase in Android-mode)**: Clear tracking and medium weight for instant scanning.

## Layout & Spacing

Layout conforms to standard mobile viewports (360px - 428px base mobile widths) with fluid adaptation for tablet split-views.

- **Conversation Stream Canvas**:
  - Horizontal message bubble margin: 8px to 16px safe margin from viewport edge.
  - Bubble stack separation: 2px between sequential messages from the same sender; 8px vertical gap when the sender alternates.
  - Bubble maximum width: Capped at 82% of the viewport width on mobile, and 65% on tablet/desktop layouts.
- **Chat List Row Rhythm**:
  - Contact row fixed height: 72px with 50px avatar, 12px horizontal avatar-to-text spacing, and 16px lateral padding.
- **Input Bottom Sheet Bar**:
  - 8px vertical padding, 6px between attachment, emoji, and voice recording actions, maintaining a minimum 48px touch target for all tap surfaces.

## Elevation & Depth

Visual hierarchy leverages crisp tonal separation and subtle ambient shadows rather than dramatic layering.

- **Level 0 (Canvas)**: Background wallpaper/pattern layer (`#EFEAE2` light / `#0B141A` dark).
- **Level 1 (Chat Bubbles & Surfaces)**:
  - Message bubbles: Crisp, flat physical cards elevated by a subtle 0.5px directional drop shadow (`rgba(11, 20, 26, 0.08)` blur 1px, y-offset 1px) to detach cleanly from wallpaper textures.
  - App bar & header: Light mode runs pure `#008069` with 0 1px 3px rgba(0,0,0,0.12); dark mode uses `#1F2C34` with a 1px border-bottom (`rgba(134, 150, 160, 0.15)`).
- **Level 2 (Dropdown Menus & Modals)**:
  - Context menus and media picker cards use `0 4px 16px rgba(11, 20, 26, 0.20)` with high surface contrast.
- **Level 3 (Floating Action Button - FAB)**:
  - Circular action buttons use `0 4px 10px rgba(0, 0, 0, 0.28)` to anchor prominent actions above scrolling lists.

## Shapes

The design system employs asymmetrical rounded geometry for conversational flow and full pill radii for active contextual controls.

- **Chat Bubbles**: Base radius of 8px (`rounded-sm` / 0.5rem). The corner matching the message tail is drawn at 0px radius for initial messages in a stack, creating directional pointers toward incoming or outgoing sources. Sequential bubbles from the same sender transition to full 8px symmetrical corners.
- **Avatars & FAB**: Strict circular geometry (`rounded-full`).
- **Message Input Container**: Pill-shaped radius (24px to 28px) for comfortable one-handed typing.
- **Status Indicator Rings**: 2.5px circular stroke separated from avatars by a 2px outer gap ring.

## Components

### 1. Message Bubbles
- **Incoming**: Background `#FFFFFF` (dark `#202C33`), text `#111B21` (dark `#E9EDEF`), timestamp aligned bottom-right in `#8696A0`. Tail positioned at top-left or bottom-left depending on active mobile platform convention.
- **Outgoing**: Background `#D9FDD3` (dark `#005C4B`), text `#111B21` (dark `#E9EDEF`), bottom-right timestamp followed by delivery state icons.
- **Delivery Receipts**:
  - *Sending*: Single gray clock icon (`#8696A0`).
  - *Sent*: Single gray checkmark (`#8696A0`).
  - *Delivered*: Double gray checkmark (`#8696A0`).
  - *Read*: Double bright cyan checkmark (`#53BDEB`).

### 2. Audio Voice Messages (Sesli Mesaj)
- Contained within outgoing/incoming bubbles.
- Circular play/pause button (36px, primary green background or neutral slate tint).
- Audio waveform visualizer featuring vertical frequency bars (2px width, 2px gap).
- Played track portion renders in `#53BDEB` or `#008069`; unplayed portion renders in `#8696A0`.
- Inline duration label (e.g., `0:24`) and sender avatar with a microphone glyph badge.

### 3. Floating Action Button (FAB)
- 56px circle with `#25D366` surface and pure white center icon.
- Hover/active compression feedback with elevation shift.
- Secondary mini-FAB (44px) positioned above primary for quick status or media creation.

### 4. Input Bar & Voice Record Tray
- Left container: Pill-shaped text input field containing leading emoji trigger icon, expandable multi-line text input ("Bir mesaj yazın"), trailing attachment paperclip, and camera shutter shortcut.
- Right action: Detached circular action button (48px) matching input height. Shows a microphone icon for touch-and-hold instant voice recording (`#008069` or `#25D366`), transitioning dynamically into a send paper plane button upon text input entry.

### 5. Status Rings (Durum)
- Active unviewed story status: Avatar bordered by a 2.5px ring colored in `#25D366`, segmented proportionally by the number of published status items.
- Viewed status: Segment borders transition to neutral slate `#8696A0`.

### 6. Badges & Lists
- Unread message counter badge: Minimum 20px pill, solid `#25D366` background with bold white typography (`#FFFFFF`).
- Pinned chat badge: Subtle angled pin glyph in `#8696A0` aligned beneath metadata time.