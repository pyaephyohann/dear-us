import type { TranslationDict } from "./types";

export const en: TranslationDict = {
  // ---------------------------------------------------------------------------
  // Brand / Tagline
  // ---------------------------------------------------------------------------
  brand: "DearUs",
  tagline: "for you, for us 💕",
  taglineShort: "for you, for us",

  // ---------------------------------------------------------------------------
  // Landing Page — Hero
  // ---------------------------------------------------------------------------
  heroTitle: "A tiny little thing for someone you love.",
  heroDescription:
    "Create a sweet little experience, fill it with questions only they can answer, and send it their way. 💌",
  createCta: "Create Your Little Thing 💕",
  openLink: "Already have one? Open it",

  // ---------------------------------------------------------------------------
  // Landing Page — How It Works
  // ---------------------------------------------------------------------------
  howItWorksTitle: "How it works",
  howItWorksSubtitle: "it's easy 💕",
  howStep1Title: "Make it",
  howStep1Desc: "Create your Little Thing in seconds.",
  howStep2Title: "Fill it",
  howStep2Desc: "Add questions and cute answers they'll love.",
  howStep3Title: "Send it",
  howStep3Desc: "Share your private link or QR code.",
  howStep4Title: "See their answers",
  howStep4Desc: "Find out what they really think. 💕",

  // ---------------------------------------------------------------------------
  // Landing Page — Final CTA
  // ---------------------------------------------------------------------------
  finalCtaTitle: "Ready to make someone smile?",
  finalCtaSubtitle: "It takes less than a minute. 💕",
  finalCta: "Start Creating 💕",

  // ---------------------------------------------------------------------------
  // Landing Page — Footer
  // ---------------------------------------------------------------------------
  footerMadeWith: "Made with love",
  madeWith: "Made with {brand}",

  // ---------------------------------------------------------------------------
  // Navbar
  // ---------------------------------------------------------------------------
  navBrand: "DearUs",

  // ---------------------------------------------------------------------------
  // Create Page
  // ---------------------------------------------------------------------------
  createPageTitle: "Let's make something little. 💕",
  createPageSubtitle: "Fill in the details below and add your questions.",
  theBasics: "The Basics",
  yourQuestions: "Your Questions",
  saveAndContinue: "Save & Continue 💕",
  saving: "Saving... 💕",

  // ---------------------------------------------------------------------------
  // Basic Info Form
  // ---------------------------------------------------------------------------
  labelRecipient: "Who is this little thing for? 💕",
  placeholderRecipient: "My Love",
  labelCreator: "And who made it? 🫶",
  placeholderCreator: "Your name",
  labelTitle: "Give your little thing a name ✨",
  placeholderTitle: "A Little Something For You 💌",
  labelIntro: "Add a sweet intro message",
  optional: "(optional)",
  placeholderIntro: "I made this just for you. Answer honestly, okay? 🥹",

  // ---------------------------------------------------------------------------
  // Creator Form Validation
  // ---------------------------------------------------------------------------
  errorTitleRequired: "Give your little thing a name ✨",
  errorQuestionEmpty: "What do you want to ask?",
  errorQuestionMinAnswers: "A question needs at least 2 answers. 💕",
  errorQuestionFillAnswers: "Fill in at least 2 answers",

  // ---------------------------------------------------------------------------
  // Question Builder
  // ---------------------------------------------------------------------------
  questionBuilderEmpty: "Your little thing needs a few questions. 💕",
  questionBuilderEmptySub: "Start with something simple...",
  addFirstQuestion: "+ Add Your First Question",
  addAnotherQuestion: "+ Add another question",

  // ---------------------------------------------------------------------------
  // Question Card
  // ---------------------------------------------------------------------------
  questionPlaceholder: "What's your favorite thing about me?",
  answersLabel: "Answers",

  // ---------------------------------------------------------------------------
  // Answer Item
  // ---------------------------------------------------------------------------
  answerPlaceholder: "Answer",
  deleteTooltipMinAnswers: "A question needs at least 2 answers 💕",

  // ---------------------------------------------------------------------------
  // Answer List
  // ---------------------------------------------------------------------------
  addAnswer: "+ Add answer",

  // ---------------------------------------------------------------------------
  // Preview Page
  // ---------------------------------------------------------------------------
  previewTitle: "Your little thing, previewed! 💕",
  previewSubtitle: "This is how it'll look. Happy with it?",
  previewIntroSection: "This is how it starts 👇",
  previewQuestionsSection: "And here are the questions 👇",
  previewQuestionOf: "Question {current} of {total}",
  previewShareCta: "Publish & Share 💕",
  previewPublishing: "Publishing... 💕",
  previewPublished: "Published! 🎉",
  previewBackToEditing: "← Back to editing",

  // ---------------------------------------------------------------------------
  // Share Page
  // ---------------------------------------------------------------------------
  shareReady: "Your little thing is ready to share! 💌",
  shareSubtitle: "Send this link to",
  shareYourLink: "Your link",
  shareQrTitle: "Or scan the QR code",
  shareCopyLink: "Copy Link ✨",
  shareCopied: "Copied! 💕",
  shareOpen: "Open Little Thing ✨",
  shareManage: "Manage 💕",
  shareResponses: "Responses 💌",
  shareAnalytics: "Analytics 📊",
  shareBackToDashboard: "← Back to dashboard",

  // ---------------------------------------------------------------------------
  // Dashboard
  // ---------------------------------------------------------------------------
  dashboardYourThing: "Your little thing 💕",
  dashboardPublished: "Published",
  dashboardDraft: "Draft",
  dashboardPeopleAnswered: "{count} people answered 💌",
  dashboardOneAnswered: "1 person answered 💌",
  dashboardNoAnswers: "No answers yet 💌",
  dashboardPreview: "Preview",
  dashboardShare: "Share",
  dashboardSeeResponses: "See Responses 💌",
  dashboardEdit: "Edit",
  dashboardViewAnalytics: "View Analytics 📊",
  dashboardPrivateLink: "Your private link 🔐",
  dashboardPrivateLinkDesc:
    "Keep this link somewhere safe — it's how you'll come back to see responses.",
  dashboardLinkWarning: "Anyone with this link can view your responses.",
  dashboardCopyLink: "Copy link",
  dashboardCopiedLink: "Copied! 💕",
  dashboardQuickStats: "Quick Stats 📊",

  // ---------------------------------------------------------------------------
  // Edit Page
  // ---------------------------------------------------------------------------
  editTitle: "Edit your little thing. 💕",
  editSubtitle: "Make changes below and save when you're ready.",
  saveChanges: "Save Changes 💕",
  savedSuccess: "Saved! 💕",
  backToDashboard: "← Back to dashboard",
  saveError: "We couldn't save your changes just yet. Please try again. 💕",

  // ---------------------------------------------------------------------------
  // Response List
  // ---------------------------------------------------------------------------
  responseListTitle: "Your little thing 💕",
  responseListFor: "For {name}",
  responseCountZero: "Waiting for the first answer 💌",
  responseCountOne: "1 person answered 💌",
  responseCountMany: "{count} people answered 💌",
  responseSomeoneAnswered: "💌 Someone answered",
  responseQuestionCount: "{count} question answered",
  responseQuestionCountPlural: "{count} questions answered",
  responseEmptyTitle: "Not yet...",
  responseEmptyDesc: "Your little thing is waiting for someone to answer.",
  responseEmptyHint: "Share it with them and come back later. 🥹",
  responseShareAgain: "Share Again 💕",
  backToDashboardLink: "← Back to dashboard",

  // ---------------------------------------------------------------------------
  // Confirm Modal
  // ---------------------------------------------------------------------------
  confirmDeleteTitle: "Delete this response?",
  confirmDeleteMessage:
    "This will permanently remove this response and cannot be undone. 💌",
  confirmDeleteYes: "Yes, delete",
  confirmDeleteKeep: "Keep it",

  // ---------------------------------------------------------------------------
  // Response Detail
  // ---------------------------------------------------------------------------
  responseDetailAnswered: "Someone answered 💕",
  responseDetailAnsweredOn: "Answered on {date}",
  responseDetailDelete: "Delete this response",
  responseDetailDeleting: "Deleting...",
  responseDetailAllResponses: "← All responses",
  responseDetailDashboard: "Dashboard →",

  // ---------------------------------------------------------------------------
  // Analytics Page
  // ---------------------------------------------------------------------------
  analyticsTitle: "Response Analytics 📊",
  analyticsTotalResponses: "Total Responses",
  analyticsTotalQuestions: "Total Questions",
  analyticsFirstResponse: "First Response",
  analyticsLatestResponse: "Latest Response",
  analyticsActivityTitle: "Response Activity",
  analyticsBreakdownTitle: "Answer Breakdown",
  analyticsNoResponses: "No responses yet...",
  analyticsNoResponsesDesc:
    "Share your little thing with someone and come back to see how they answered!",
  analyticsShareNow: "Share Now 💕",
  analyticsMostSelected: "Most loved",
  analyticsEmptyAnalytics: "No responses yet",

  // ---------------------------------------------------------------------------
  // Not Found Pages
  // ---------------------------------------------------------------------------
  notFoundTitle: "Hmm... this page doesn't exist.",
  notFoundDesc: "Maybe the link is a little off. Let's try something else?",
  notFoundHome: "Go Home 💕",
  notFoundCreate: "Create a Little Thing 💕",
  creatorNotFoundTitle: "That private link isn't valid anymore.",
  creatorNotFoundDesc: "It may have been deleted or the link might be wrong.",
  creatorNotFoundCreate: "Create a new one 💕",

  // ---------------------------------------------------------------------------
  // Loading States
  // ---------------------------------------------------------------------------
  loading: "Loading...",
  loadingYourThing: "Loading your little thing...",
  loadingOpening: "Opening your little thing...",
  loadingOpeningSub: "Someone made this just for you 🥹",
  loadingReadingAnswers: "Reading the little answers...",

  // ---------------------------------------------------------------------------
  // Error Pages
  // ---------------------------------------------------------------------------
  errorSomethingWrong: "Something went wrong.",
  errorDontWorry:
    "Don't worry — your little thing is probably still safe. 💕",
  errorTryAgain: "Try Again 💕",
  errorGoHome: "Go Home",
  errorUnexpected: "An unexpected error occurred.",
  errorSomethingWrongCreator: "Hmm... something went wrong.",
  errorCreatorSafe: "Your little thing is probably still safe. Let's try again? 💕",

  // ---------------------------------------------------------------------------
  // Recipient Experience
  // ---------------------------------------------------------------------------
  recipientIntroLine: "Someone made this for you 💕",
  recipientForYou: "For You",
  recipientMadeFor: "{creator} made something for you, {recipient} 💕",
  recipientBegin: "Begin 💕",
  recipientNext: "Next 💕",
  recipientSaving: "Saving your answers... 💕",
  recipientSavingSub: "Your answers are being saved... 💕",
  recipientDone: "That's it! 💕",
  recipientDoneDesc: "{creator} will love seeing your answers.",
  recipientThanks: "Thanks for answering.",
  recipientTryAgain: "Try again 💕",
  recipientSubmitError: "Hmm... something went wrong while saving your answers. Please try again. 💕",
  recipientQuestionOf: "Question {current} of {total}",

  // ---------------------------------------------------------------------------
  // Date formatting (not translation — just labels)
  // ---------------------------------------------------------------------------
  dateToday: "Today",
  dateYesterday: "Yesterday",

  // ---------------------------------------------------------------------------
  // Dashboard extras
  // ---------------------------------------------------------------------------
  dashboardQuickStatsResponses: "responses",
  dashboardFirstToLatest: "First → Latest",
  dashboardStatusPublished: "Published ✨",
  dashboardStatusDraft: "Draft",
  dashboardStatusArchived: "Archived",
  dashboardCreated: "Created",
  dashboardUpdated: "Updated",
  dashboardResponse: "response",
  dashboardResponses: "responses",
  analyticsTimeline: "Timeline",
  analyticsResponseActivity: "{count} response{s}",

  // ---------------------------------------------------------------------------
  // Landing Page — Example/Preview Section
  // ---------------------------------------------------------------------------
  exampleSubtitle: "see it in action ✨",
  exampleTitle: "Make it feel like yours.",
  exampleDesc: "A preview of what your someone special will see.",
  exampleTapHint: "Tap an answer to see it in action ↑",

  // ---------------------------------------------------------------------------
  // Preview Card (landing page example)
  // ---------------------------------------------------------------------------
  previewCardHeader: "A Little Something",
  previewCardForYou: "For You 💌",
  previewCardIntro: "I made this just for you.\nAnswer honestly, okay? 🥹",
  previewCardQuestionOf: "Question {current} of {total}",

  // ---------------------------------------------------------------------------
  // Sticker
  // ---------------------------------------------------------------------------
  stickerLabel: "Cute Sticker",
  stickerNone: "No sticker",
  stickerChoose: "Choose a sticker",
  stickerLove: "Love",
  stickerHappy: "Happy",
  stickerShy: "Shy",
  stickerKiss: "Kiss",
  stickerLaugh: "Laugh",
  stickerSleepy: "Sleepy",

  // ---------------------------------------------------------------------------
  // Share Page — Sticker Preview
  // ---------------------------------------------------------------------------
  shareStickerPreview: "A little peek at your questions 💌",
  shareStickerPreviewHint: "This is what your recipient will see.",

  // ---------------------------------------------------------------------------
  // Landing Page — Sticker Hint
  // ---------------------------------------------------------------------------
  exampleStickerHint: "Decorate questions with cute cat stickers 🐱💕",

  // ---------------------------------------------------------------------------
  // Misc
  // ---------------------------------------------------------------------------
  back: "← Back",
  close: "Close",
  copyLink: "Copy link",
  copiedLink: "Copied! 💕",
};
