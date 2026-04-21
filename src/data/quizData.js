// src/data/quizData.js
export const levels = [

  // ─── LEVEL 1 – Color Contrast ───
  {
    id: 1,
    title: 'Color Contrast',
    emoji: '🎨',
    colorKey: 'c1',
    xp: 250,
    questions: [
      {
        id: 'q1_1',
        text: 'A button has light grey text on a white background. What WCAG issue does this cause?',
        options: [
          'The button is too small to tap',
          'The text has insufficient color contrast for readability',
          'The button lacks an accessible label',
          'The font size is too small',
        ],
        correctIndex: 1,
        wcag: 'WCAG 1.4.3 – Contrast (Minimum): Text must have a contrast ratio of at least 4.5:1 against its background.',
      },
      {
        id: 'q1_2',
        text: 'What is the minimum contrast ratio required by WCAG AA for normal body text?',
        options: ['3:1', '4.5:1', '7:1', '2:1'],
        correctIndex: 1,
        wcag: 'WCAG 1.4.3 – Contrast (Minimum): Normal text requires a 4.5:1 ratio. Large text (18pt+) requires 3:1.',
      },
      {
        id: 'q1_3',
        text: 'A designer uses red text on a green background. Besides contrast, what other accessibility issue exists?',
        options: [
          'The font is too decorative',
          'It relies solely on color to convey meaning, excluding color-blind users',
          'The background pattern is too complex',
          'There is no issue beyond contrast',
        ],
        correctIndex: 1,
        wcag: 'WCAG 1.4.1 – Use of Color: Color must not be the only means of conveying information.',
      },
      {
        id: 'q1_4',
        text: 'Which tool would you use to check if a color combination meets WCAG contrast requirements?',
        options: [
          'A color picker tool',
          'A contrast ratio checker like WebAIM Contrast Checker',
          'A screen reader like TalkBack',
          'A font size calculator',
        ],
        correctIndex: 1,
        wcag: 'WCAG 1.4.3 – Contrast checkers calculate the luminance ratio between foreground and background colors.',
      },
      {
        id: 'q1_5',
        text: 'Large text (18pt or 14pt bold) has a different contrast requirement. What is it?',
        options: ['4.5:1', '7:1', '3:1', '2:1'],
        correctIndex: 2,
        wcag: 'WCAG 1.4.3 – Large text only requires a 3:1 contrast ratio because its size makes it easier to read.',
      },
    ],
  },

  // ─── LEVEL 2 – Alternative Text ───
  {
    id: 2,
    title: 'Alternative Text',
    emoji: '🖼️',
    colorKey: 'c2',
    xp: 300,
    questions: [
      {
        id: 'q2_1',
        text: 'A mobile app shows product images without any text descriptions. What accessibility issue does this create?',
        options: [
          'The app loads slower on older devices',
          'Screen readers cannot convey the image content to blind users',
          'The images appear pixelated on high-resolution screens',
          'The app uses more battery than necessary',
        ],
        correctIndex: 1,
        wcag: 'WCAG 1.1.1 – Non-text Content: All images must have descriptive alt text so screen readers can communicate the image purpose.',
      },
      {
        id: 'q2_2',
        text: 'An image is purely decorative (e.g. a background pattern). What should its alt text be?',
        options: [
          'A detailed description of the pattern',
          'The word "decorative"',
          'An empty alt attribute (alt="")',
          'The filename of the image',
        ],
        correctIndex: 2,
        wcag: 'WCAG 1.1.1 – Decorative images should have an empty alt attribute so screen readers skip them entirely.',
      },
      {
        id: 'q2_3',
        text: 'A button contains only an icon with no visible text label. What must it have?',
        options: [
          'A tooltip that appears on long press',
          'An accessibility label describing its action',
          'A larger touch target',
          'A border to make it visible',
        ],
        correctIndex: 1,
        wcag: 'WCAG 1.1.1 – Icon-only buttons must have an accessible label so screen reader users know what the button does.',
      },
      {
        id: 'q2_4',
        text: 'What makes a good alt text for an image of a dog catching a frisbee in a park?',
        options: [
          '"Image"',
          '"Dog"',
          '"A golden retriever catching a red frisbee in a sunny park"',
          '"Photo123.jpg"',
        ],
        correctIndex: 2,
        wcag: 'WCAG 1.1.1 – Alt text should convey the meaning and context of the image, not just its subject.',
      },
      {
        id: 'q2_5',
        text: 'A graph shows sales data. Its alt text says "Chart". Is this sufficient?',
        options: [
          'Yes, screen readers can interpret charts automatically',
          'No, the alt text should describe the key data or trends shown',
          'Yes, as long as the chart has colors',
          'No, charts should never have alt text',
        ],
        correctIndex: 1,
        wcag: 'WCAG 1.1.1 – Complex images like charts need alt text that conveys the key information a sighted user would get.',
      },
    ],
  },

  // ─── LEVEL 3 – Touch Targets ───
  {
    id: 3,
    title: 'Touch Targets',
    emoji: '👆',
    colorKey: 'c3',
    xp: 350,
    questions: [
      {
        id: 'q3_1',
        // WCAG 2.2 AA minimum is 2.5.8 at 24×24 CSS px; 44×44px is AAA 2.5.5
        text: 'What is the minimum touch target size required by WCAG 2.2 AA (2.5.8) for interactive elements?',
        options: ['16x16 CSS px', '24x24 CSS px', '44x44 CSS px', '32x32 CSS px'],
        correctIndex: 1,
        wcag:
          'WCAG 2.5.8 – Target Size (Minimum) [AA, new in WCAG 2.2]: Interactive elements must be at least 24×24 CSS pixels, or have sufficient spacing around them to compensate. Note: 44×44px is the stricter Level AAA requirement under WCAG 2.5.5.',
      },
      {
        id: 'q3_2',
        text: 'A settings screen has toggle switches that are only 16×16 CSS px with no surrounding spacing. What is the main problem?',
        options: [
          'They are too colorful',
          'They are too small to tap accurately, especially for users with motor impairments',
          'They load too slowly',
          'They do not have labels',
        ],
        correctIndex: 1,
        wcag:
          'WCAG 2.5.8 – Target Size (Minimum): Targets smaller than 24×24 CSS px must have adequate spacing to offset the small size; otherwise they fail the AA criterion.',
      },
      {
        id: 'q3_3',
        text: 'Two buttons are placed right next to each other with no spacing. What accessibility issue does this create?',
        options: [
          'The buttons will not animate correctly',
          'Users may accidentally tap the wrong button due to insufficient spacing',
          'The layout will break on small screens',
          'The colors will clash',
        ],
        correctIndex: 1,
        wcag:
          'WCAG 2.5.8 – Target Size (Minimum): When a target is smaller than 24×24 CSS px, spacing around it can satisfy the criterion. Placing targets with no spacing removes this fallback and risks accidental activation.',
      },
      {
        id: 'q3_4',
        text: 'A "Delete Account" link is styled as tiny fine print text at the bottom of a form. What should be improved?',
        options: [
          'Change the text color to red only',
          'Increase the touch target size and make the action clearly visible',
          'Move it to a different screen',
          'Remove it entirely',
        ],
        correctIndex: 1,
        wcag:
          'WCAG 2.5.8 – Target Size (Minimum): All interactive elements, including destructive ones, must meet the 24×24 CSS px minimum or have adequate offset spacing.',
      },
      {
        id: 'q3_5',
        text: 'Which group of users benefits MOST from larger touch targets?',
        options: [
          'Users with visual impairments only',
          'Users with motor impairments, tremors, or large fingers',
          'Users with hearing impairments only',
          'Users on slow internet connections',
        ],
        correctIndex: 1,
        wcag:
          "WCAG 2.5.8 – Target Size (Minimum): Larger touch targets primarily benefit users with motor disabilities, Parkinson's, tremors, or limited dexterity, as well as users with assistive pointing devices like head pointers or eye-gaze systems.",
      },
    ],
  },

  // ─── LEVEL 4 – Navigation & Structure ───
  {
    id: 4,
    title: 'Navigation & Structure',
    emoji: '🧭',
    colorKey: 'c4',
    xp: 400,
    questions: [
      {
        id: 'q4_1',
        text: 'A screen has no visible headings and all text looks the same size. What WCAG principle does this violate?',
        options: [
          'Perceivable — content must be distinguishable',
          'Operable — users must be able to navigate',
          'Understandable — content must be readable',
          'Robust — content must be interpreted by assistive technologies',
        ],
        correctIndex: 0,
        wcag:
          'WCAG 1.3.1 – Info and Relationships: Structure and relationships must be programmatically determinable.',
      },
      {
        id: 'q4_2',
        text: 'A screen reader announces items in a random order that does not match the visual layout. What is violated?',
        options: [
          'WCAG 1.4.3 Color Contrast',
          'WCAG 1.3.2 Meaningful Sequence — content order must be logical',
          'WCAG 2.5.8 Target Size',
          'WCAG 1.1.1 Non-text Content',
        ],
        correctIndex: 1,
        wcag:
          'WCAG 1.3.2 – Meaningful Sequence: The reading order exposed to assistive technologies must match the visual order.',
      },
      {
        id: 'q4_3',
        text: 'A modal dialog opens but the screen reader focus stays on the content behind it. What should happen?',
        options: [
          'Nothing, the user can navigate back manually',
          'Focus should automatically move to the modal so screen reader users know it opened',
          'The modal should close immediately',
          'The background content should be read first',
        ],
        correctIndex: 1,
        wcag:
          'WCAG 2.4.3 – Focus Order: When a dialog opens, focus must move to it so keyboard and screen reader users are not left behind.',
      },
      {
        id: 'q4_4',
        text: 'An app has a back button that looks like a left arrow but has no accessible label. What should be added?',
        options: [
          'A tooltip',
          'An accessibility label such as "Go back to previous screen"',
          'A larger icon',
          'A border around the button',
        ],
        correctIndex: 1,
        wcag:
          'WCAG 4.1.2 – Name, Role, Value: All UI components must have a programmatically determinable name. WCAG 2.4.6 additionally requires descriptive labels so the purpose of controls is clear to all users.',
      },
      {
        id: 'q4_5',
        text: 'A form has five fields but no labels — only placeholder text inside each input. What is the problem?',
        options: [
          'Placeholder text disappears when the user starts typing, leaving no label for screen readers',
          'Placeholder text is too light in color',
          'The form is too long',
          'There is no submit button',
        ],
        correctIndex: 0,
        wcag:
          'WCAG 1.3.1 – Placeholder text is not a substitute for labels. Labels must remain visible and be programmatically associated.',
      },
    ],
  },

  // ─── LEVEL 5 – Multimedia Accessibility ───
  {
    id: 5,
    title: 'Multimedia Accessibility',
    emoji: '🎬',
    colorKey: 'c5',
    xp: 450,
    questions: [
      {
        id: 'q5_1',
        text: 'A tutorial video has no captions. Which group of users is most directly excluded?',
        options: [
          'Users with visual impairments',
          'Users who are deaf or hard of hearing',
          'Users with motor impairments',
          'Users with cognitive disabilities',
        ],
        correctIndex: 1,
        wcag:
          'WCAG 1.2.2 – Captions (Prerecorded): All prerecorded video with audio must include synchronized captions.',
      },
      {
        id: 'q5_2',
        text: 'A video plays automatically with sound when the app opens. What WCAG criterion does this violate?',
        options: [
          'WCAG 1.4.3 Color Contrast',
          'WCAG 1.4.2 Audio Control — users must be able to pause or stop audio',
          'WCAG 2.5.8 Target Size',
          'WCAG 1.1.1 Non-text Content',
        ],
        correctIndex: 1,
        wcag:
          'WCAG 1.4.2 – Audio Control: If audio plays automatically for more than 3 seconds, users must be able to pause or stop it.',
      },
      {
        id: 'q5_3',
        text: 'A complex instructional animation has no alternative for users who cannot perceive motion. What is needed?',
        options: [
          'A slower version of the animation',
          'An audio description or text alternative explaining what the animation shows',
          'A larger play button',
          'A transcript of any spoken words only',
        ],
        correctIndex: 1,
        wcag:
          'WCAG 1.2.5 – Audio Description: Visual information in video that is not conveyed through audio must have an audio description.',
      },
      {
        id: 'q5_4',
        text: 'Flashing content appears 4 times per second in a video. What risk does this create?',
        options: [
          'It may drain the device battery faster',
          'It can trigger seizures in users with photosensitive epilepsy',
          'It slows down the video playback',
          'It makes the video file too large',
        ],
        correctIndex: 1,
        wcag:
          'WCAG 2.3.1 – Three Flashes: Content must not flash more than 3 times per second to avoid triggering seizures.',
      },
      {
        id: 'q5_5',
        text: 'A podcast embedded in an app has no transcript. What should be provided?',
        options: [
          'A volume control',
          'A full text transcript so deaf users and those in noisy environments can access the content',
          'A skip button',
          'A download link',
        ],
        correctIndex: 1,
        wcag:
          'WCAG 1.2.1 – Audio-only content must have a text transcript that presents the same information.',
      },
    ],
  },

  // ─── LEVEL 6 – Focus Visibility ───
  {
    id: 6,
    title: 'Focus Visibility',
    emoji: '🔍',
    colorKey: 'c6',
    xp: 500,
    questions: [
      {
        id: 'q6_1',
        text: 'A webpage uses a sticky header. When a user tabs through the page, the focused link scrolls behind the header and disappears completely. Which WCAG 2.2 criterion does this violate?',
        options: [
          'WCAG 1.4.3 – Contrast (Minimum)',
          'WCAG 2.4.11 – Focus Not Obscured (Minimum)',
          'WCAG 2.4.7 – Focus Visible',
          'WCAG 1.3.1 – Info and Relationships',
        ],
        correctIndex: 1,
        wcag:
          'WCAG 2.4.11 – Focus Not Obscured (Minimum) [AA, new in WCAG 2.2]: When a component receives keyboard focus, it must not be entirely hidden by author-created content such as sticky headers or overlapping overlays.',
      },
      {
        id: 'q6_2',
        text: 'A focused button is half-covered by a cookie consent banner. Does this pass or fail WCAG 2.4.11?',
        options: [
          'Fail — any obscuring of a focused element is not allowed',
          'Pass — the criterion only fails if the element is entirely hidden',
          'Fail — cookie banners are always inaccessible',
          'Pass — only sticky headers are covered by this rule',
        ],
        correctIndex: 1,
        wcag:
          'WCAG 2.4.11 – Focus Not Obscured (Minimum): Partial obscuring is permitted at the AA level. The element fails only when it is completely hidden. The stricter AAA criterion 2.4.12 “Focus Not Obscured (Enhanced)” disallows even partial obscuring.',
      },
      {
        id: 'q6_3',
        text: 'A developer removes the default browser focus outline and replaces it with a 1px dotted border that barely changes visually. Which WCAG 2.2 criterion is most at risk?',
        options: [
          'WCAG 2.4.13 – Focus Appearance',
          'WCAG 1.4.1 – Use of Color',
          'WCAG 2.5.8 – Target Size (Minimum)',
          'WCAG 3.2.3 – Consistent Navigation',
        ],
        correctIndex: 0,
        wcag:
          'WCAG 2.4.13 – Focus Appearance [AAA, new in WCAG 2.2]: When a focus indicator is visible, it must meet minimum size (at least a 2px perimeter outline or equivalent area) and have a contrast ratio of at least 3:1 between the focused and unfocused states. This requirement is Level AAA, but it represents good practice even when targeting AA.',
      },
      {
        id: 'q6_4',
        text: 'What is the minimum focus indicator contrast ratio required by WCAG 2.4.13 between the focused and unfocused states?',
        options: ['1.5:1', '2:1', '3:1', '4.5:1'],
        correctIndex: 2,
        wcag:
          'WCAG 2.4.13 – Focus Appearance [AAA]: The focus indicator area must have a contrast ratio of at least 3:1 against adjacent colors and between the focused and unfocused states of the component.',
      },
      {
        id: 'q6_5',
        text: 'A user opens a dropdown menu and then tabs to a link underneath it. The link is fully hidden by the open menu, but the user can close the menu by pressing Escape without moving focus. Does this fail WCAG 2.4.11?',
        options: [
          'Yes — the link is fully hidden so it always fails',
          'No — user-dismissible content that can be closed without moving focus is an explicit exception',
          'Yes — dropdown menus must always close automatically',
          'No — keyboard users are not covered by this criterion',
        ],
        correctIndex: 1,
        wcag:
          'WCAG 2.4.11 – Focus Not Obscured (Minimum): Content opened by the user (such as dropdowns or popovers) that can be dismissed without moving focus — for example, by pressing Escape — is an explicit exception and does not cause a failure.',
      },
    ],
  },

  // ─── LEVEL 7 – Dragging Movements ───
  {
    id: 7,
    title: 'Dragging Movements',
    emoji: '🖱️',
    colorKey: 'c7',
    xp: 550,
    questions: [
      {
        id: 'q7_1',
        text: 'A Kanban board only allows users to reorder cards by dragging them between columns. What does WCAG 2.5.7 require?',
        options: [
          'The drag handles must be at least 44×44 CSS px',
          'A single-pointer alternative (such as buttons or a menu) must also be provided to move cards',
          'Keyboard shortcuts alone are sufficient to satisfy the criterion',
          'Nothing — drag-and-drop is exempt from WCAG requirements',
        ],
        correctIndex: 1,
        wcag:
          'WCAG 2.5.7 – Dragging Movements [AA, new in WCAG 2.2]: All functionality that uses a dragging movement must also be achievable by a single pointer without dragging, unless dragging is essential. Providing up/down buttons or a context menu satisfies this.',
      },
      {
        id: 'q7_2',
        text: 'An app has a custom volume slider that can only be adjusted by dragging the thumb. What is the accessible fix?',
        options: [
          'Increase the size of the drag thumb to 44×44 CSS px',
          'Add +/- buttons or allow a tap anywhere on the slider track to set the value directly',
          'Provide a keyboard shortcut and nothing else',
          'No fix is needed — native range inputs are always exempt',
        ],
        correctIndex: 1,
        wcag:
          'WCAG 2.5.7 – Dragging Movements: Custom sliders that require a press-and-drag interaction must offer a single-tap or single-click alternative. Adding +/- increment buttons or click-to-position behaviour satisfies the criterion.',
      },
      {
        id: 'q7_3',
        text: 'Which users benefit most from having single-pointer alternatives to dragging interactions?',
        options: [
          'Users with visual impairments who use screen readers',
          'Users with motor disabilities who use trackballs, head pointers, or eye-gaze systems',
          'Users with hearing impairments',
          'Users on slow network connections',
        ],
        correctIndex: 1,
        wcag:
          'WCAG 2.5.7 – Dragging Movements: Users with motor disabilities, tremors, or those using assistive pointing devices (trackballs, head pointers, eye-gaze systems) often cannot perform the precise press-hold-drag sequence required.',
      },
      {
        id: 'q7_4',
        text: 'A map component requires users to drag to pan around. Is a keyboard arrow-key alternative sufficient to satisfy WCAG 2.5.7?',
        options: [
          'Yes — any keyboard alternative fully satisfies the criterion',
          'No — WCAG 2.5.7 specifically requires a single-pointer (tap or click) alternative, not just a keyboard one',
          'Yes — maps are exempt from WCAG 2.5.7',
          'No — maps must remove the drag-to-pan feature entirely',
        ],
        correctIndex: 1,
        wcag:
          'WCAG 2.5.7 – Dragging Movements: Keyboard alternatives (covered separately by WCAG 2.1.1) do not by themselves satisfy 2.5.7. A single-pointer option — such as directional buttons the user can tap — is required, because many mobile users have no keyboard.',
      },
      {
        id: 'q7_5',
        text: 'A file upload zone lets users drag files from their desktop to upload them. There is also a "Browse files" button. Does this satisfy WCAG 2.5.7?',
        options: [
          'No — file upload areas are never compliant with WCAG 2.5.7',
          'Yes — the "Browse files" button provides a single-pointer alternative to dragging',
          'No — both methods must involve dragging',
          'Yes — but only if the drag area is at least 44×44 CSS px',
        ],
        correctIndex: 1,
        wcag:
          'WCAG 2.5.7 – Dragging Movements: The criterion is satisfied when an equivalent single-pointer alternative exists. A "Browse files" button that opens the system file picker is a valid non-dragging alternative.',
      },
    ],
  },

  // ─── LEVEL 8 – Accessible Authentication ───
  {
    id: 8,
    title: 'Accessible Authentication',
    emoji: '🔐',
    colorKey: 'c8',
    xp: 600,
    questions: [
      {
        id: 'q8_1',
        text: 'A login form blocks users from pasting into the password field. What WCAG 2.2 criterion does this most directly affect?',
        options: [
          'WCAG 1.3.5 – Identify Input Purpose',
          'WCAG 3.3.8 – Accessible Authentication (Minimum)',
          'WCAG 4.1.2 – Name, Role, Value',
          'WCAG 1.4.3 – Contrast (Minimum)',
        ],
        correctIndex: 1,
        wcag:
          'WCAG 3.3.8 – Accessible Authentication (Minimum) [AA, new in WCAG 2.2]: Authentication must not rely on a cognitive function test (such as remembering and typing a password) unless a mechanism like paste or a password manager is available to assist. Blocking paste removes that mechanism and can cause a failure.',
      },
      {
        id: 'q8_2',
        text: 'A login page requires users to solve a complex jigsaw CAPTCHA with no alternative. Which users are most directly harmed?',
        options: [
          'Users with visual impairments using screen readers',
          'Users with cognitive disabilities who cannot solve puzzles or complete memory tasks',
          'Users with hearing impairments',
          'Users on mobile devices with small screens',
        ],
        correctIndex: 1,
        wcag:
          'WCAG 3.3.8 – Accessible Authentication (Minimum): Requiring a puzzle-solving cognitive function test without an alternative excludes users with cognitive disabilities such as memory impairments, dyslexia, or dyscalculia.',
      },
      {
        id: 'q8_3',
        text: 'A site requires a username and password to log in. The login form supports autocomplete and browser password managers. Does this satisfy WCAG 3.3.8?',
        options: [
          'No — passwords are always a cognitive function test that must be removed',
          'Yes — allowing password managers provides a mechanism to assist users, satisfying the criterion',
          'No — biometric authentication must also be offered',
          'Yes — but only if the password field has a visible label',
        ],
        correctIndex: 1,
        wcag:
          'WCAG 3.3.8 – Accessible Authentication (Minimum): A username/password form satisfies the criterion when users can rely on password managers or browser autocomplete to fill in the fields, because the “mechanism” exception is met.',
      },
      {
        id: 'q8_4',
        text: 'A multi-factor authentication step requires users to transcribe a one-time code from an authenticator app into a separate input. What must the site provide?',
        options: [
          'Nothing — one-time codes are always exempt from WCAG 3.3.8',
          'An alternative authentication method that does not require transcription, or the ability to paste the code',
          'A visible countdown timer only',
          'A larger input field',
        ],
        correctIndex: 1,
        wcag:
          'WCAG 3.3.8 – Accessible Authentication (Minimum): Transcribing a code is a cognitive function test. The site must either allow paste (so password managers or the clipboard can supply it) or offer an alternative method that avoids transcription entirely.',
      },
      {
        id: 'q8_5',
        text: 'A CAPTCHA asks users to identify which images contain traffic lights. Is this compliant with WCAG 3.3.8 at AA?',
        options: [
          'No — all CAPTCHAs are prohibited by WCAG 3.3.8',
          'Yes — object recognition (identifying objects in images) is an explicit exception under WCAG 3.3.8 at Level AA',
          'No — image-based CAPTCHAs violate WCAG 1.1.1',
          'Yes — but only if the images have alt text',
        ],
        correctIndex: 1,
        wcag:
          'WCAG 3.3.8 – Accessible Authentication (Minimum) [AA]: Object recognition — asking users to identify familiar objects like traffic lights or cars — is an explicit exception, because recognising common objects is considered achievable without demanding memory or transcription. The AAA criterion 3.3.9 “Accessible Authentication (Enhanced)” removes this exception.',
      },
    ],
  },
];

export const TOTAL_LEVELS = levels.length;
export const TOTAL_QUESTIONS = levels.reduce((acc, l) => acc + l.questions.length, 0);
