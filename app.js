/* =========================
   FREE FALL — UPDATED APP.JS
   Case 1: The Hollow Boom / GFC-inspired crisis map
========================= */

/* =========================
   DOM
========================= */

const pages = {
  landing: document.getElementById("landing-page"),
  case: document.getElementById("case-page"),
  game: document.getElementById("game-page"),
  result: document.getElementById("result-page")
};

const startBtn = document.getElementById("start-btn");
const caseCard = document.querySelector(".case-card.playable");
const sideButtons = document.querySelectorAll(".side-btn");
const contentBox = document.getElementById("content-box");
const taskList = document.getElementById("task-list");
const nextPhaseBtn = document.getElementById("next-phase-btn");

const phaseLabel = document.getElementById("phase-label");
const progressPercent = document.getElementById("progress-percent");
const progressFill = document.getElementById("progress-fill");
const portfolioValue = document.getElementById("portfolio-value");
const marketDataGrid = document.getElementById("market-data-grid");
const arrivalCard = document.getElementById("arrival-card");
const lastOutcome = document.getElementById("last-outcome");
const allocationList = document.getElementById("allocation-list");

const finalPortfolio = document.getElementById("final-portfolio");
const finalRisk = document.getElementById("final-risk");
const finalScore = document.getElementById("final-score");
const finalLiquidity = document.getElementById("final-liquidity");
const finalInfoDepth = document.getElementById("final-info-depth");
const finalIndependence = document.getElementById("final-independence");
const resultTitle = document.getElementById("result-title");
const resultDescription = document.getElementById("result-description");
const decisionReplay = document.getElementById("decision-replay");
const restartBtn = document.getElementById("restart-btn");

const pdfModal = document.getElementById("pdf-modal");
const pdfModalBody = document.getElementById("pdf-modal-body");
const pdfModalTitle = document.getElementById("pdf-modal-title");
const pdfModalClose = document.getElementById("pdf-modal-close");

/* =========================
   CONSTANTS
========================= */

const CHANNEL_ORDER = ["news", "social", "email", "chat", "file", "decision"];
const ARRIVAL_DELAY_MS = 4200;

const CHANNEL_LABELS = {
  news: "News",
  social: "Internet",
  email: "Gmail",
  chat: "Messenger",
  file: "Files",
  decision: "Decision"
};

const ASSET_LABELS = {
  blueChip: "Blue-chip",
  bonds: "Bonds",
  gold: "Gold",
  cash: "Cash",
  financials: "Financials",
  hlx: "HLX",
  syn: "SYN",
  hedge: "Hedge"
};

const TOXIC_ASSETS = ["financials", "hlx", "syn"];

const returnTable = {
  blueChip: [0, 0.06, 0.08, 0.10, -0.12, -0.22, -0.35],
  bonds: [0, 0.02, 0.02, 0.01, 0.04, 0.08, 0.12],
  gold: [0, 0.00, 0.01, 0.00, 0.08, 0.12, 0.15],
  cash: [0, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01],
  financials: [0, 0.18, 0.28, 0.42, -0.30, -0.75, -0.95],
  hlx: [0, 0.15, 0.25, 0.45, -0.20, -0.65, -0.80],
  syn: [0, 0.00, 0.10, 0.14, -0.08, -0.50, -0.85],
  hedge: [0, -0.03, -0.03, -0.04, 0.15, 0.80, 3.00]
};

/* =========================
   STATE
========================= */

let gameState = {};
let selectedAllocation = null;
let selectedInfo = null;

let unlockedChannels = {};
let unreadChannels = {};
let viewedChannels = {};

let currentTab = "news";
let activeNewsIndex = 0;
let activeEmailIndex = 0;
let activeChatIndex = 0;
let phaseTimers = [];

function initialState() {
  return {
    phase: 1,
    pv: 100000,
    peakPV: 100000,
    txs: 0,
    lqs: 70,
    ap: 0,
    leverageActive: false,
    hedgeActive: false,
    documentsRead: [],
    emailReplies: {},
    socialReplies: {},
    chatReplies: {},
    decisionLog: [],
    marginCallTriggered: false,
    lastOutcomeText: "",
    allocation: {
      blueChip: 0.35,
      bonds: 0.25,
      gold: 0.05,
      cash: 0.15,
      financials: 0.15,
      hlx: 0.05,
      syn: 0,
      hedge: 0
    }
  };
}

/* =========================
   DATA HELPERS
========================= */

function article(brand, url, headline, subtitle, date, body, stories) {
  return { brand, url, headline, subtitle, date, body, stories };
}

function post(name, handle, text, comments, stats) {
  return { name, handle, text, comments, stats };
}

function mail(sender, email, subject, preview, time, body) {
  return { sender, email, subject, preview, time, body };
}

function convo(contact, messages) {
  return { contact, messages };
}

function doc(id, title, fileName, meta, summary, sections, data, pdfPath = `asset/pdfs/${fileName}`) {
  return { id, title, fileName, meta, summary, sections, data, pdfPath };
}

function choice(id, text, note, allocation, txsDelta, lqsDelta, extra = {}) {
  return { id, text, note, allocation, txsDelta, lqsDelta, ...extra };
}

function taskSet(news, social, email, chat, file, decision) {
  return {
    news: `Read ${news}`,
    social: `Check ${social}`,
    email: `Open ${email}`,
    chat: `Read ${chat}`,
    file: `Review ${file}`,
    decision: `Make ${decision}`
  };
}

/* =========================
   PHASE DATA
========================= */

const phases = [
  {
    title: "Phase 1: Normalized Optimism",
    timeline: "2006. Rates are low, credit is easy, home prices are rising, and financial firms look extremely profitable.",
    tasks: taskSet(
      "market headlines",
      "investor internet",
      "advisor/client mail",
      "internal messages",
      "early market files",
      "initial investment decision"
    ),
    marketData: [
      { label: "Housing Index", value: "+11.4% YoY", note: "prices rising fast" },
      { label: "Financials", value: "+8.2% YTD", note: "sector leader" },
      { label: "10Y Yield", value: "4.7%", note: "stable funding" },
      { label: "Mortgage Delinq.", value: "2.1%", note: "still contained" }
    ],
    content: {
      news: [
        article(
          "FINANCIAL DAILY COLUMBIA",
          "https://fdc.example/markets/golden-roof",
          "Housing Prices Hit New High as Credit Expansion Continues",
          "Analysts say fundamentals remain strong, though affordability indicators are weakening.",
          "12 March 2006 | 09:15",
          [
            "Home prices in Columbia reached another record high, supported by low interest rates, strong consumer demand, and flexible mortgage products.",
            "Banks and investment firms reported strong profits from housing-linked products, while investors continued to seek returns above government bonds.",
            "Most strategists described the market as stable. A few analysts noted that home prices were rising faster than household income in several regions.",
            "Lenders also expanded low-down-payment and adjustable-rate mortgage products. Buyers expected refinancing to remain easy as long as prices kept rising."
          ],
          [
            "Financial stocks lead the market higher",
            "Flexible mortgage products attract new buyers",
            "Rating firms maintain positive housing outlook"
          ]
        ),
        article(
          "CEDAR STREET JOURNAL",
          "https://csj.example/markets/credit-profit-cycle",
          "Financial Stocks Rally as Credit Products Boost Earnings",
          "Cedar Street firms report strong revenue from mortgage origination and structured finance desks.",
          "17 April 2006 | 13:40",
          [
            "Financial-sector stocks outperformed the broader market again this week after several banks posted better-than-expected earnings.",
            "Executives credited higher mortgage activity, trading revenue, and investor demand for housing-linked products.",
            "Several analysts raised price targets, arguing that credit risk is now more widely distributed across the market than in previous cycles.",
            "A small group of critics warned that risk distribution may not equal risk elimination, especially if many investors rely on the same assumptions."
          ],
          [
            "Bank CEOs call outlook constructive",
            "Structured finance hiring accelerates",
            "Housing-linked ETF sees record inflows"
          ]
        ),
        article(
          "HOME & WEALTH MAGAZINE",
          "https://homewealth.example/lifestyle/first-buyers-boom",
          "Young Buyers Rush Into Housing: ‘If I Wait, I’ll Never Afford It’",
          "Fear of missing out spreads from trading desks to households.",
          "02 May 2006 | 11:05",
          [
            "A new wave of first-time buyers is entering the housing market with low down payments and flexible-rate loans.",
            "Several buyers said they felt pressure to purchase before prices moved further out of reach.",
            "Mortgage brokers reported that refinancing is often presented as a future solution when payments reset.",
            "Consumer advocates cautioned that this strategy only works if credit remains available and home prices do not fall."
          ],
          [
            "Open-house bidding wars return",
            "Flexible-rate mortgages gain popularity",
            "Household debt climbs quietly"
          ]
        )
      ],
      social: {
        trends: ["#GoldenRoof", "#HousingBoom", "#LowRates", "#FinancialsWin"],
        posts: [
          post(
            "YieldHunter88",
            "@YieldHunter88",
            "Housing is the safest growth story right now. People always need homes. I’m increasing financials and housing-linked ETFs.",
            ["Exactly. Land doesn't multiply.", "This is why cash is dead."],
            "240 replies · 1.8K reposts · 6.2K likes"
          ),
          post(
            "MacroNerd",
            "@MacroNerd",
            "Home prices rising faster than income for this long is not normal. Not saying crash, but the risk is being ignored.",
            ["You’ve been bearish for two years.", "Do you have actual delinquency data?"],
            "66 replies · 310 reposts · 1.1K likes"
          ),
          post(
            "FinanceBroLeo",
            "@FinanceBroLeo",
            "Everyone keeps warning about risk while financial stocks keep printing money. Sometimes the simple answer is: buy the winners.",
            ["Finally someone said it.", "Momentum is the thesis."],
            "180 replies · 900 reposts · 3.5K likes"
          )
        ]
      },
      email: [
        mail(
          "Maya Collins",
          "maya.collins@harborpoint.com",
          "Client question — why are we underweight financials?",
          "NorthLake Pension is asking why we are not more exposed to the strongest-performing sector.",
          "08:42 AM",
          [
            "Hi,",
            "NorthLake Pension noticed that several peer funds increased exposure to financials and housing-linked products. They want to know why our positioning is more balanced.",
            "Please prepare a recommendation. We can maintain, moderately increase, or aggressively increase exposure.",
            "Remember: client perception matters. Nobody likes underperforming a boom.",
            "Maya"
          ]
        ),
        mail(
          "Risk System",
          "risk-dashboard@harborpoint.com",
          "Weekly risk dashboard — Housing-linked products",
          "Model confidence remains high, but national home-price decline is not included in baseline.",
          "09:02 AM",
          [
            "Automated summary:",
            "HBS senior tranche volatility: Low. Rating migration: Stable. Flexible-rate delinquency: Slight increase.",
            "Important limitation: current model does not include a national housing-price decline in the baseline dashboard.",
            "This is an automated notice."
          ]
        ),
        mail(
          "Client Relations",
          "clientdesk@harborpoint.com",
          "NorthLake benchmark pressure",
          "Client notes that peer funds are outperforming using financial-sector tilts.",
          "10:20 AM",
          [
            "Team,",
            "NorthLake wants language explaining why HarborPoint has not followed the same sector tilt as peer funds.",
            "They are not demanding a change yet, but the tone is impatient.",
            "Please coordinate before sending any view."
          ]
        )
      ],
      chat: [
        convo("Risk Review", [
          { from: "Lena", text: "I’m not saying panic, but housing-linked products are becoming a larger part of the market." },
          { from: "You", text: "Is the risk visible in current performance?" },
          { from: "Lena", text: "Not yet. That’s the point. Visible numbers look good. Hidden assumptions worry me." },
          { from: "Jon", text: "Clients don’t pay us to sit in cash during a rally." }
        ]),
        convo("Market Desk", [
          { from: "Ethan", text: "Flows are strong. Pension funds keep buying housing-linked exposure." },
          { from: "You", text: "Any liquidity issue?" },
          { from: "Ethan", text: "Not now. Dealers are bidding normally." }
        ])
      ]
    },
    documents: [
      doc(
        "p1-bank",
        "Bank Earnings Summary",
        "bank_earnings_summary.pdf",
        "Free document · 4 pages",
        "Surface-level summary of bank profits and credit growth.",
        [
          { heading: "Market Overview", text: "Bank profits are rising quickly due to mortgage origination, trading revenue, and strong housing-linked demand." },
          { heading: "Warning Signal", text: "Revenue growth is increasingly tied to housing-linked activity rather than traditional lending." }
        ],
        [
          { label: "Bank profit growth", value: "+22%" },
          { label: "Mortgage activity", value: "High" },
          { label: "Visible risk", value: "Low" }
        ]
      ),
      doc(
        "p1-housing",
        "Housing Market Overview",
        "housing_market_overview.pdf",
        "Research note · 8 pages",
        "Shows rising prices, weaker affordability, and increased flexible-rate loans.",
        [
          { heading: "Price Growth", text: "Home prices have increased for several consecutive years and now exceed income growth in several regions." },
          { heading: "Loan Quality", text: "Flexible-rate mortgage share is rising, while down payments are declining." },
          { heading: "Small Footnote", text: "Most risk models assume national home price declines are unlikely." }
        ],
        [
          { label: "Home price growth", value: "+11.4%" },
          { label: "Flexible-rate loans", value: "34%" },
          { label: "Down payment", value: "7%" }
        ]
      )
    ],
    decisionsA: [
      choice("p1-balanced", "Maintain balanced allocation", "Stay diversified and avoid over-tilting too early.", { blueChip: 0.35, bonds: 0.25, gold: 0.05, cash: 0.15, financials: 0.15, hlx: 0.05, syn: 0, hedge: 0 }, 2, 4),
      choice("p1-tilt", "Tilt moderately toward financials and housing", "Chase early upside, but hidden fragility increases.", { blueChip: 0.25, bonds: 0.15, gold: 0.03, cash: 0.07, financials: 0.35, hlx: 0.15, syn: 0, hedge: 0 }, 18, -10),
      choice("p1-defensive", "Start defensively with more cash, bonds and gold", "Lower upside, stronger liquidity.", { blueChip: 0.20, bonds: 0.35, gold: 0.15, cash: 0.20, financials: 0.08, hlx: 0.02, syn: 0, hedge: 0 }, -2, 15),
      choice("p1-riskon", "Go aggressive and overweight financials", "High early upside, high fragility.", { blueChip: 0.25, bonds: 0.05, gold: 0, cash: 0.05, financials: 0.50, hlx: 0.15, syn: 0, hedge: 0 }, 25, -18)
    ],
    decisionsB: [
      choice("p1-cap", "Set a 15% cash floor and cap housing-linked exposure", "A simple risk discipline from the start.", null, -4, 8),
      choice("p1-hedge", "Buy a small hedge against a housing shock", "Costs a bit now, protects later.", null, -6, 4, { hedge: true }),
      choice("p1-leverage", "Use modest leverage while volatility is low", "Boosts gains in the boom, hurts badly later.", null, 12, -10, { leverage: true }),
      choice("p1-none", "No extra controls — let the rally run", "Maximum freedom, minimum protection.", null, 6, -4)
    ],
    transition: "A new structured yield product begins appearing in client portfolios."
  },

  {
    title: "Phase 2: The Yield Opportunity",
    timeline: "2007. Structured Yield Notes promise higher returns than bonds while being described as highly rated and diversified.",
    tasks: taskSet(
      "product news",
      "yield discussion",
      "yield offer email",
      "desk messages",
      "product documents",
      "structured product decision"
    ),
    marketData: [
      { label: "SYN Yield", value: "8.5%", note: "headline attraction" },
      { label: "Housing Index", value: "+10.1% YoY", note: "still accelerating" },
      { label: "Funding Spread", value: "22 bps", note: "calm conditions" },
      { label: "Subprime Share", value: "19%", note: "quietly rising" }
    ],
    content: {
      news: [
        article(
          "CAPITAL INSIGHT",
          "https://capitalinsight.example/products/structured-yield",
          "Structured Yield Notes Gain Traction Among Institutional Investors",
          "Alternative income products offer higher yields in a low-rate environment.",
          "18 January 2007 | 10:30",
          [
            "Structured Yield Notes are attracting institutional investors seeking returns above traditional bonds.",
            "Distributors describe the products as diversified, highly rated, and engineered to absorb expected credit losses.",
            "Rating firms defend their models, arguing that risk is spread across many borrowers and regions.",
            "A small number of independent analysts warn that these instruments may be more sensitive to housing stress than investors realize."
          ],
          [
            "Pension funds increase structured product allocation",
            "Apex Global expands credit desk",
            "Low volatility encourages yield-seeking behavior"
          ]
        ),
        article(
          "YIELD DESK DAILY",
          "https://yielddesk.example/apex/syn-allocation",
          "Apex Global Markets Opens New Income Product to Select Clients",
          "The product targets 8.5% annual yield while carrying a high-grade rating.",
          "25 January 2007 | 12:10",
          [
            "Apex Global Markets has opened a structured income product to institutional clients.",
            "Marketing materials emphasize diversification and senior protection layers.",
            "Demand has been strong because many investors are frustrated with low bond yields.",
            "The product document contains a technical appendix describing sensitivity to correlated defaults."
          ],
          [
            "AAA-equivalent products sell quickly",
            "Income investors search for alternatives",
            "Technical appendix receives little attention"
          ]
        ),
        article(
          "THE COLUMBIA ECONOMIST",
          "https://economist.example/analysis/credit-engineering",
          "Has Credit Risk Really Become Safer?",
          "Modern credit engineering may distribute risk, but it may also make risk harder to see.",
          "02 February 2007 | 08:25",
          [
            "Credit engineering has changed how investors hold exposure to housing and consumer debt.",
            "Supporters argue that risk is no longer concentrated in one institution.",
            "Critics argue that the system may become more fragile if many investors rely on the same pricing models.",
            "The central concern is correlation: assets that appear diversified in normal times may fail together under stress."
          ],
          [
            "Correlation risk enters debate",
            "Investors trust ratings",
            "Complexity grows faster than understanding"
          ]
        )
      ],
      social: {
        trends: ["#StructuredYield", "#AAAIncome", "#YieldHunters", "#DontMissOut"],
        posts: [
          post(
            "SafeReturn",
            "@SafeReturn",
            "AAA-equivalent yield above bonds? This is exactly what income portfolios need.",
            ["Looks like free yield.", "The rating is the key."],
            "310 replies · 2.1K reposts · 7.4K likes"
          ),
          post(
            "RiskIntern",
            "@RiskIntern",
            "Question: if everyone packages risk and sells it onward, where does the risk finally sit?",
            ["Probably with whoever doesn't read the appendix.", "Underrated question."],
            "45 replies · 220 reposts · 890 likes"
          ),
          post(
            "ConfusedButIn",
            "@ConfusedButIn",
            "I don’t fully understand the structure, but if banks and pension funds buy it, surely someone checked it.",
            ["That’s my logic too.", "Famous last words?"],
            "120 replies · 620 reposts · 2.7K likes"
          )
        ]
      },
      email: [
        mail(
          "Daniel Harrington",
          "daniel.harrington@hwm.com",
          "New Yield Opportunity — Limited Allocation Available",
          "Structured Yield Notes issued by Apex Global Markets.",
          "09:18 AM",
          [
            "Hello,",
            "Apex Global Markets is offering Structured Yield Notes targeting 8.5% annual yield. The product is rated AAA-equivalent by Northbridge Ratings.",
            "This may be suitable for clients seeking income above traditional bonds while maintaining a high-quality rating profile.",
            "Allocations are limited. Please indicate if HarborPoint wants to participate.",
            "Daniel"
          ]
        ),
        mail(
          "Apex Global Markets",
          "distribution@apexglobal.com",
          "SYN Allocation Window",
          "Institutional allocation available for approved clients only.",
          "10:02 AM",
          [
            "Dear investor,",
            "Demand for Structured Yield Notes remains strong.",
            "This allocation window may close early depending on subscription levels.",
            "Please refer to the prospectus and technical appendix for full risk factors."
          ]
        ),
        mail(
          "Risk Analytics",
          "risk.analytics@harborpoint.com",
          "Quick note on structured yield exposure",
          "Model assumptions depend heavily on low default correlation.",
          "11:15 AM",
          [
            "Team,",
            "We do not object to limited exposure, but the product is more model-dependent than the headline rating suggests.",
            "Key assumption: defaults remain weakly correlated across regions.",
            "If this assumption fails, losses may move through protection layers faster than expected."
          ]
        )
      ],
      chat: [
        convo("Market Desk", [
          { from: "Ethan", text: "Demand for SYN is strong. Dealer says allocation may close quickly." },
          { from: "You", text: "Do we know the underlying pool?" },
          { from: "Ethan", text: "Only from the prospectus. Summary looks clean, appendix is more technical." },
          { from: "Lena", text: "Read the appendix. The rating depends heavily on low default correlation." }
        ]),
        convo("Client Desk", [
          { from: "Client Relations", text: "NorthLake heard other funds are getting Apex allocation." },
          { from: "You", text: "Are they asking to buy?" },
          { from: "Client Relations", text: "Not directly, but they clearly don’t want to be left behind." }
        ])
      ]
    },
    documents: [
      doc(
        "p2-prospectus",
        "Structured Yield Notes Prospectus",
        "apex_syn_prospectus.pdf",
        "Product document · 42 pages",
        "Explains the note structure and dependence on low default correlation.",
        [
          { heading: "Product Summary", text: "The notes target an 8.5% yield and are backed by pooled housing-linked credit assets." },
          { heading: "Underlying Asset Pool", text: "Lower-quality loans appear in the asset pool, although the summary emphasizes diversification." },
          { heading: "Model Assumption", text: "Protection layers depend on the assumption that defaults remain weakly correlated across regions." }
        ],
        [
          { label: "Target yield", value: "8.5%" },
          { label: "Rating", value: "AAA-equivalent" },
          { label: "Low-quality loans", value: "18–22%" }
        ]
      ),
      doc(
        "p2-stress",
        "Housing Downturn Stress Addendum",
        "housing_downturn_stress.pdf",
        "Risk addendum · Internal",
        "Shows that SYN losses become severe if refinancing slows and defaults become correlated.",
        [
          { heading: "Stress Scenario", text: "A modest national home-price decline combined with weaker refinancing may pressure flexible-rate borrowers." },
          { heading: "Main Result", text: "Senior securities appear manageable, but mezzanine and structured notes become highly sensitive to correlation." },
          { heading: "Limitation", text: "The model does not fully include counterparty contagion or forced selling." }
        ],
        [
          { label: "Stress home price", value: "-5%" },
          { label: "Delinquency", value: "7.2%" },
          { label: "Liquidity discount", value: "7%" }
        ]
      )
    ],
    decisionsA: [
      choice("p2-large-syn", "Buy a 20% SYN position", "Big yield pickup, big structured-credit risk.", { blueChip: 0.25, bonds: 0.15, gold: 0.03, cash: 0.07, financials: 0.25, hlx: 0.05, syn: 0.20, hedge: 0 }, 25, -20),
      choice("p2-small-syn", "Buy only a 5% trial position", "Participate, but keep it controlled.", { blueChip: 0.30, bonds: 0.22, gold: 0.05, cash: 0.13, financials: 0.20, hlx: 0.05, syn: 0.05, hedge: 0 }, 6, -5),
      choice("p2-no-syn", "Do not buy it yet", "If you do not fully understand it, stay out.", { blueChip: 0.32, bonds: 0.28, gold: 0.06, cash: 0.16, financials: 0.13, hlx: 0.05, syn: 0, hedge: 0 }, -2, 8),
      choice("p2-hedge", "Buy protection instead of the product", "Lower short-term return, stronger crisis insurance.", { blueChip: 0.28, bonds: 0.25, gold: 0.07, cash: 0.15, financials: 0.15, hlx: 0.05, syn: 0, hedge: 0.05 }, -15, 8, { hedge: true })
    ],
    decisionsB: [
      choice("p2-limit", "Limit any new structured product to max 5%", "Size discipline matters.", null, -5, 4),
      choice("p2-fund", "Fund the trade by cutting cash and bonds", "Raises yield, weakens flexibility.", null, 8, -8),
      choice("p2-stress", "Require a stress test before adding exposure", "Slower, but smarter.", null, -6, 6),
      choice("p2-none", "No extra control — rely on rating and yield", "Simple, but complacent.", null, 5, -3)
    ],
    transition: "Structured products deliver strong early returns. Clients begin asking why they are not allocated more."
  },

  {
    title: "Phase 3: Boom and FOMO",
    timeline: "Mid 2007. Markets are high, volatility is low, and investors who bought structured products are outperforming.",
    tasks: taskSet(
      "boom headlines",
      "FOMO sentiment",
      "urgent allocation mail",
      "peer-pressure chat",
      "risk papers",
      "FOMO decision"
    ),
    marketData: [
      { label: "Financials", value: "+18.6% YTD", note: "peer pressure rising" },
      { label: "Implied Vol.", value: "11.2", note: "market feels too calm" },
      { label: "Credit Spread", value: "245 bps", note: "compressed" },
      { label: "Street Leverage", value: "27x", note: "hidden fragility" }
    ],
    content: {
      news: [
        article(
          "GLOBAL FINANCE NETWORK",
          "https://gfn.example/markets/record-rally",
          "Financial Sector Leads Market to New Record",
          "Structured credit funds report record returns as demand accelerates.",
          "10 June 2007 | 14:05",
          [
            "The broad equity market reached a new high today, led by financial firms and housing-linked products.",
            "Structured credit funds reported strong twelve-month returns, drawing capital from pension funds and private investors.",
            "Several strategists argued that modern credit engineering has made the system more resilient.",
            "A few analysts warned that low volatility may be encouraging concentration and leverage at exactly the wrong time."
          ],
          [
            "Apex Tranche B closes in 48 hours",
            "Low volatility fuels risk appetite",
            "Credit models face quiet criticism"
          ]
        ),
        article(
          "CEDAR BUSINESS TV",
          "https://cbtv.example/interview/silverman-liquidity",
          "Silverman CEO: ‘Liquidity Is Strong and Risk Is Contained’",
          "Major financial executives push back against concerns over structured credit.",
          "18 June 2007 | 16:00",
          [
            "The CEO of Silverman & Co. said the firm remains well capitalized and strongly positioned.",
            "He described concerns over structured credit as exaggerated and said risk has been widely distributed.",
            "Investors initially responded positively to the comments.",
            "Skeptics noted that public confidence statements often become more frequent when markets are nervous."
          ],
          [
            "Silverman shares rise after interview",
            "Banks defend risk controls",
            "Short sellers criticized"
          ]
        ),
        article(
          "THE COLUMBIA ECONOMIST",
          "https://economist.example/markets/low-volatility-risk",
          "The Danger of a Market That Feels Too Safe",
          "Low volatility can encourage leverage, concentration, and false confidence.",
          "22 June 2007 | 07:50",
          [
            "Markets often appear safest before stress becomes visible.",
            "Low volatility reduces the apparent cost of leverage and makes concentrated positions look rational.",
            "The danger is not that every investor is reckless. It is that many individually reasonable decisions point in the same direction.",
            "If the same assumptions fail together, liquidity can disappear faster than models expect."
          ],
          [
            "Volatility reaches unusual lows",
            "Investors chase yield",
            "Stress scenarios ignored"
          ]
        )
      ],
      social: {
        trends: ["#ApexTrancheB", "#AllIn", "#RecordReturns", "#CashIsTrash"],
        posts: [
          post(
            "AllInMode",
            "@AllInMode",
            "Apex Tranche B targets 12%. I’m increasing allocation. Sitting in cash is self-sabotage.",
            ["This is the energy.", "I’m late but entering now."],
            "540 replies · 4.8K reposts · 16.2K likes"
          ),
          post(
            "LateToTheParty",
            "@LateToTheParty",
            "Everyone I know is making money in structured credit. Is it too late to enter?",
            ["Never too late in a real boom.", "That question is the warning."],
            "260 replies · 1.4K reposts · 5.8K likes"
          ),
          post(
            "RiskNerd",
            "@RiskNerd",
            "The more complex the product becomes, the cleaner the rating looks. That feels backwards.",
            ["You’re overthinking.", "No, this is actually important."],
            "35 replies · 90 reposts · 410 likes"
          )
        ]
      },
      email: [
        mail(
          "Maya Collins",
          "maya.collins@harborpoint.com",
          "Performance pressure — urgent view needed",
          "Our portfolio is lagging peer funds that increased structured credit exposure.",
          "07:52 PM",
          [
            "Hi,",
            "NorthLake is asking why we are lagging peer funds this quarter. Apex Tranche B closes in 48 hours.",
            "We need a clear recommendation: increase exposure, hold current allocation, or reduce risk.",
            "This is not only a market decision. It is also a client management decision.",
            "Maya"
          ]
        ),
        mail(
          "Daniel Harrington",
          "daniel.harrington@hwm.com",
          "48-hour allocation window",
          "Apex Tranche B is closing soon.",
          "08:05 PM",
          [
            "Hello,",
            "Apex Tranche B has seen strong institutional demand.",
            "Given the rating profile and target yield, this may be an appropriate addition for investors willing to accept structured credit exposure.",
            "Please respond before the allocation window closes."
          ]
        ),
        mail(
          "Risk Analytics",
          "risk.analytics@harborpoint.com",
          "Correlation risk paper attached",
          "Please read before expanding structured exposure.",
          "08:40 PM",
          [
            "Team,",
            "Attached is a short independent paper on correlation risk in tranched credit.",
            "The risk is not obvious in normal market data because the product performs well until correlation assumptions fail.",
            "This is a classic hidden-fragility issue."
          ]
        )
      ],
      chat: [
        convo("Peer Desk", [
          { from: "Jon", text: "Peer funds are crushing us because they bought more SYN." },
          { from: "You", text: "But the risk paper says correlation could break the structure." },
          { from: "Jon", text: "Maybe. But being right too early still gets you fired." },
          { from: "Lena", text: "That is exactly why bubbles are hard to resist." }
        ]),
        convo("Client Desk", [
          { from: "Client Relations", text: "NorthLake is asking for an answer tonight." },
          { from: "You", text: "Do they want more return or more safety?" },
          { from: "Client Relations", text: "They say safety, but they are comparing returns." }
        ])
      ]
    },
    documents: [
      doc(
        "p3-risk-paper",
        "Correlation Risk in Tranched Credit",
        "correlation_risk_tranched_credit.pdf",
        "Independent analyst paper · Low circulation",
        "Explains why low default correlation is the key weakness of the structure.",
        [
          { heading: "Core Argument", text: "Tranched credit appears safe when defaults are independent, but losses accelerate when defaults move together." },
          { heading: "Behavioral Risk", text: "Low volatility can create an illusion of safety and lead investors to use leverage or concentrate exposure." },
          { heading: "Warning", text: "The hardest risk to manage is the one that looks profitable for several phases before it fails." }
        ],
        [
          { label: "Volatility", value: "Very low" },
          { label: "FOMO level", value: "High" },
          { label: "Correlation risk", value: "Rising" }
        ]
      ),
      doc(
        "p3-counterparty",
        "Counterparty Exposure Snapshot",
        "counterparty_exposure_snapshot.pdf",
        "Internal risk memo · 7 pages",
        "Shows indirect exposure through dealers, market makers, and protection sellers.",
        [
          { heading: "Direct vs Indirect Exposure", text: "Direct holdings may be limited, but indirect exposure through dealers and protection sellers is larger." },
          { heading: "Silverman Node", text: "Silverman & Co. is a key liquidity provider and market maker for structured credit." },
          { heading: "Atlas Guarantee", text: "Several protection contracts rely on Atlas Guarantee remaining solvent during stress." }
        ],
        [
          { label: "Direct exposure", value: "Medium" },
          { label: "Indirect exposure", value: "High" },
          { label: "Liquidity node", value: "Silverman" }
        ]
      )
    ],
    decisionsA: [
      choice("p3-trancheb", "Buy Apex Tranche B to catch up", "Classic FOMO move.", { blueChip: 0.22, bonds: 0.10, gold: 0.03, cash: 0.05, financials: 0.30, hlx: 0.10, syn: 0.20, hedge: 0 }, 28, -22),
      choice("p3-winners", "Increase financials and HLX", "Ride the winners harder.", { blueChip: 0.20, bonds: 0.12, gold: 0.03, cash: 0.05, financials: 0.45, hlx: 0.15, syn: 0, hedge: 0 }, 22, -15),
      choice("p3-maintain", "Maintain current allocation", "Accept underperformance instead of chasing.", null, -2, 3),
      choice("p3-hedge", "Buy downside protection", "Pay now to survive later.", { blueChip: 0.25, bonds: 0.22, gold: 0.08, cash: 0.15, financials: 0.15, hlx: 0.05, syn: 0.02, hedge: 0.08 }, -15, 10, { hedge: true })
    ],
    decisionsB: [
      choice("p3-review", "Keep a weekly exposure review and preserve cash", "Stay disciplined even when peers outperform.", null, -4, 6),
      choice("p3-budget", "Raise the risk budget to keep up with peers", "Career pressure over risk control.", null, 10, -8),
      choice("p3-leverage", "Borrow short-term to scale the winners", "Looks smart in a boom, disastrous in stress.", null, 14, -12, { leverage: true }),
      choice("p3-none", "Do nothing extra", "Let momentum drive the decision.", null, 4, -2)
    ],
    transition: "A small credit fund suspends withdrawals. Market commentators call it isolated."
  },

  {
    title: "Phase 4: Mixed Signals",
    timeline: "Late 2007 to early 2008. Some funds freeze withdrawals. Dealer quotes weaken. The market is no longer clearly calm.",
    tasks: taskSet(
      "fund-freeze news",
      "divided sentiment",
      "advisor update",
      "risk desk chat",
      "liquidity documents",
      "stress response"
    ),
    marketData: [
      { label: "Funding Spread", value: "146 bps", note: "stress rising" },
      { label: "ABX Proxy", value: "-12% MTD", note: "housing risk repriced" },
      { label: "Repo Haircut", value: "8%", note: "collateral tighter" },
      { label: "VIX Proxy", value: "28", note: "uncertainty back" }
    ],
    content: {
      news: [
        article(
          "REUTERS GLOBAL",
          "https://reutersglobal.example/credit/fund-freeze",
          "Credit Funds Suspend Withdrawals Amid Valuation Concerns",
          "Officials call the issue contained, but funding markets show signs of strain.",
          "9 August 2007 | 16:40",
          [
            "Several credit funds suspended withdrawals after reporting difficulty valuing structured assets.",
            "Market indices declined following the announcement, although some strategists described the event as an isolated liquidity problem.",
            "Dealer quotes for housing-linked products became wider and less reliable.",
            "The key uncertainty is no longer just credit loss. It is whether investors can sell assets at all when many holders try to exit together."
          ],
          [
            "Central bank signals readiness to support liquidity",
            "Dealer balance sheets tighten",
            "Investors debate whether this is a dip or a warning"
          ]
        ),
        article(
          "MONEY DESK BRIEF",
          "https://moneydesk.example/funding/short-term-stress",
          "Short-Term Funding Markets Show Signs of Stress",
          "Banks become less willing to lend to each other against structured collateral.",
          "21 November 2007 | 07:30",
          [
            "Funding spreads widened this week as institutions demanded more collateral in short-term lending markets.",
            "Several dealers reduced their willingness to make markets in complex structured products.",
            "Portfolio managers said the problem is not simply lower prices, but the absence of reliable bids.",
            "Liquidity that seemed normal in the boom now appears conditional on confidence."
          ],
          [
            "Repo haircuts rise",
            "Dealer quotes become indicative",
            "Cash demand increases"
          ]
        ),
        article(
          "CEDAR STREET JOURNAL",
          "https://csj.example/silverman/rumors",
          "Silverman & Co. Denies Liquidity Rumors",
          "Executives say the firm has a strong liquidity position despite market speculation.",
          "28 January 2008 | 15:20",
          [
            "Silverman & Co. denied rumors that counterparties were requesting additional collateral.",
            "The firm said its liquidity position remains strong and diversified.",
            "Shares recovered slightly after the statement, but credit spreads remained elevated.",
            "Some analysts warned that confidence can change faster than reported balance-sheet numbers."
          ],
          [
            "Silverman calls rumors irresponsible",
            "Credit spreads remain wide",
            "Counterparties reassess exposure"
          ]
        )
      ],
      social: {
        trends: ["#BuyTheDip", "#Liquidity", "#CreditFreeze", "#Correction"],
        posts: [
          post(
            "BuyTheDip",
            "@BuyTheDip",
            "Every correction gets called a crisis. I’m buying more financials here.",
            ["This is how money is made.", "Or how drawdowns begin."],
            "390 replies · 2.3K reposts · 8.1K likes"
          ),
          post(
            "SpreadWatcher",
            "@SpreadWatcher",
            "Funding spreads are widening fast. This is not just a price move. It is institutions losing trust.",
            ["This is the best warning signal.", "Most people won’t look at spreads."],
            "40 replies · 210 reposts · 900 likes"
          ),
          post(
            "NervousInvestor",
            "@NervousInvestor",
            "Advisor says stay calm, but why are funds stopping withdrawals if everything is fine?",
            ["Exactly.", "Because panic makes things worse."],
            "110 replies · 560 reposts · 1.8K likes"
          )
        ]
      },
      email: [
        mail(
          "Daniel Harrington",
          "daniel.harrington@hwm.com",
          "Market Update — Technical Correction",
          "We recommend staying committed to the long-term strategy.",
          "11:25 AM",
          [
            "Hello,",
            "The market is experiencing a technical correction. Our view is that long-term fundamentals remain intact.",
            "We recommend staying committed to the strategy. Lower prices may create attractive entry points.",
            "That said, liquidity is thinner than usual. Please avoid assuming immediate execution in structured products.",
            "Daniel"
          ]
        ),
        mail(
          "NorthLake Pension",
          "committee@northlakepension.com",
          "Liquidity clarification",
          "Can you confirm what percentage of the portfolio can be liquidated quickly?",
          "12:10 PM",
          [
            "Dear HarborPoint,",
            "Given recent market developments, we would like clarification on the liquidity profile of our portfolio.",
            "What percentage can be liquidated within one business day? Are any holdings relying on model-based pricing?",
            "Please respond before our committee call."
          ]
        ),
        mail(
          "CFO Office",
          "cfo.office@harborpoint.com",
          "Internal only — liquidity management",
          "Review stale pricing and assets dependent on dealer quotes.",
          "12:45 PM",
          [
            "Internal only.",
            "Please review all client portfolios for stale pricing, assets dependent on Silverman market-making, redemption mismatch, and collateral requirements under stress.",
            "Do not circulate externally."
          ]
        )
      ],
      chat: [
        convo("Urgent Risk", [
          { from: "Lena", text: "Dealer marks for SYN are getting ugly. Some quotes are indicative only." },
          { from: "Ethan", text: "I asked three dealers for a bid. One quoted low, two did not quote." },
          { from: "You", text: "So is it a loss problem or a liquidity problem?" },
          { from: "Lena", text: "Both. But liquidity is what turns losses into forced decisions." }
        ]),
        convo("Portfolio Room", [
          { from: "Maya", text: "Selling now means realizing losses and explaining why we waited." },
          { from: "You", text: "Waiting means we may not be able to sell later." },
          { from: "Maya", text: "That’s the dilemma. Give me a recommendation, not a lecture." }
        ])
      ]
    },
    documents: [
      doc(
        "p4-funding",
        "Funding Stress Indicator Report",
        "funding_stress_indicator_report.pdf",
        "Technical market report · 12 pages",
        "Shows that institutions are becoming less willing to lend to each other.",
        [
          { heading: "Funding Spread", text: "Funding spreads have widened, suggesting banks are becoming less willing to lend to each other." },
          { heading: "Dealer Quotes", text: "Structured products increasingly rely on indicative quotes rather than observable transactions." },
          { heading: "Systemic Interpretation", text: "If liquidity stress spreads, a normal correction can become a forced-selling spiral." }
        ],
        [
          { label: "Funding spread", value: "Widening" },
          { label: "Dealer quotes", value: "Weak" },
          { label: "Liquidity", value: "Stretched" }
        ]
      ),
      doc(
        "p4-liquidity",
        "Liquidity Ladder Review",
        "liquidity_ladder_review.pdf",
        "Internal risk review · Preliminary",
        "Shows that assets classified as liquid may become hard to sell under stress.",
        [
          { heading: "Normal Conditions", text: "Large-cap equities and bonds can usually be sold quickly. Structured notes take longer." },
          { heading: "Stress Conditions", text: "SYN and housing-linked assets may have unknown liquidation timing under stress." },
          { heading: "Important Note", text: "Money-like instruments are assumed stable, but this assumption has not been stress-tested." }
        ],
        [
          { label: "SYN liquidity", value: "Unknown" },
          { label: "Cash", value: "Immediate" },
          { label: "Stress readiness", value: "Weak" }
        ]
      )
    ],
    decisionsA: [
      choice("p4-buy-dip", "Buy the dip", "Could work if stress fades, dangerous if liquidity breaks.", { blueChip: 0.20, bonds: 0.08, gold: 0.02, cash: 0.05, financials: 0.40, hlx: 0.10, syn: 0.15, hedge: 0 }, 30, -25),
      choice("p4-hold", "Hold and wait for clearer signals", "Avoids panic, but may be too slow.", null, 5, -5),
      choice("p4-reduce", "Reduce 20–30% risky assets and raise cash", "Moderate de-risking.", { blueChip: 0.28, bonds: 0.28, gold: 0.10, cash: 0.20, financials: 0.08, hlx: 0.03, syn: 0.01, hedge: 0.02 }, -10, 18),
      choice("p4-cut", "Cut 50%+ toxic exposure", "Painful politically, but strong survival move.", { blueChip: 0.22, bonds: 0.35, gold: 0.12, cash: 0.25, financials: 0.03, hlx: 0.01, syn: 0, hedge: 0.02 }, -18, 25)
    ],
    decisionsB: [
      choice("p4-liq", "Move to a 20% liquidity target", "Prepare for a worse phase.", null, -5, 8),
      choice("p4-review", "Run a redemption / funding stress test now", "Practical crisis prep.", null, -6, 7),
      choice("p4-collateral", "Use more collateral to avoid selling now", "Buys time, weakens liquidity.", null, 8, -6),
      choice("p4-wait", "Rely on dealer marks and wait another phase", "Hope over control.", null, 7, -8)
    ],
    transition: "Silverman & Co. denies liquidity rumors. Credit markets remain tense."
  },

  {
    title: "Phase 5: Systemic Stress",
    timeline: "September 2008. A major institution fails to find a buyer. The question becomes survival, not return.",
    tasks: taskSet(
      "emergency news",
      "panic internet",
      "client request",
      "crisis-room messages",
      "emergency documents",
      "crisis response"
    ),
    marketData: [
      { label: "Funding Spread", value: "364 bps", note: "systemic stress" },
      { label: "Financials", value: "-31% YTD", note: "crash mode" },
      { label: "MMF Redemptions", value: "18%", note: "cash-like assets hit" },
      { label: "48h Cash Raise", value: "5–10%", note: "realistic range" }
    ],
    content: {
      news: [
        article(
          "CEDAR STREET JOURNAL",
          "https://csj.example/breaking/silverman-bankruptcy",
          "Silverman & Co. Files for Bankruptcy After Rescue Talks Fail",
          "Markets enter panic as confidence in financial counterparties collapses.",
          "15 September 2008 | 08:00",
          [
            "Silverman & Co. filed for bankruptcy after failing to secure a buyer before markets opened.",
            "The collapse triggered a severe reassessment of counterparty exposure across the financial system.",
            "Housing-linked products and structured notes became extremely difficult to price. Some dealers refused to quote.",
            "Investors were no longer asking only what assets were worth. They were asking who could still pay, who could still trade, and who could still raise cash."
          ],
          [
            "Atlas Guarantee receives emergency support",
            "Money market funds face withdrawal pressure",
            "Credit markets freeze as counterparties pull back"
          ]
        ),
        article(
          "MONEY MARKET ALERT",
          "https://mma.example/prime-reserve/breaks-one-crown",
          "Prime Reserve Fund Breaks Below 1 Crown",
          "Investors rush to withdraw from products previously treated as cash-like.",
          "16 September 2008 | 11:10",
          [
            "Prime Reserve Fund reported that its net asset value fell below 1 Crown after exposure to Silverman commercial paper.",
            "The announcement shocked investors who treated money market funds as cash equivalents.",
            "Redemption requests surged across similar funds.",
            "The crisis had moved from risky assets into the plumbing of short-term finance."
          ],
          [
            "Cash-like products questioned",
            "Commercial paper market freezes",
            "Corporate treasurers seek safety"
          ]
        ),
        article(
          "COLUMBIA BUSINESS TV",
          "https://cbtv.example/atlas/rescue-package",
          "Atlas Guarantee Receives Emergency Support",
          "The protection seller faces collateral calls after structured credit losses accelerate.",
          "16 September 2008 | 15:25",
          [
            "Atlas Guarantee received emergency support after collateral calls overwhelmed its liquidity position.",
            "The firm had sold large volumes of credit protection on housing-linked and structured credit products.",
            "If Atlas failed, many investors would lose the protection layer they believed reduced risk.",
            "The rescue reinforced the fear that risk had not disappeared; it had concentrated in hidden nodes."
          ],
          [
            "Protection seller rescued",
            "Collateral calls surge",
            "Derivative exposure questioned"
          ]
        )
      ],
      social: {
        trends: ["#Silverman", "#MarketCrash", "#CashIsKing", "#TooBigToFail"],
        posts: [
          post(
            "FinanceBroLeo",
            "@FinanceBroLeo",
            "I thought the government would never let this happen. I was wrong.",
            ["Same. I was too confident.", "This changed everything."],
            "1.2K replies · 7.9K reposts · 24K likes"
          ),
          post(
            "LiquidityGhost",
            "@LiquidityGhost",
            "This is a bank run, but through markets instead of bank branches.",
            ["Perfect description.", "A run on confidence."],
            "540 replies · 4.1K reposts · 18K likes"
          ),
          post(
            "SafeReturn",
            "@SafeReturn",
            "My money market fund delayed redemption. I thought that was cash.",
            ["Nothing is cash except cash.", "This is terrifying."],
            "760 replies · 5.5K reposts · 20K likes"
          )
        ]
      },
      email: [
        mail(
          "NorthLake Pension",
          "committee@northlakepension.com",
          "URGENT — Immediate portfolio status",
          "We need clarification before our emergency committee meeting.",
          "07:42 AM",
          [
            "Dear HarborPoint,",
            "Given Silverman's bankruptcy and money market stress, we need immediate clarification.",
            "Can we raise 20% cash within 48 hours? Are any assets relying on model-based pricing? Do we have direct or indirect Silverman exposure?",
            "Please provide a recommendation before our emergency committee meeting.",
            "NorthLake Investment Committee"
          ]
        ),
        mail(
          "HarborPoint CEO",
          "ceo.office@harborpoint.com",
          "Firm-wide instruction",
          "Do not send unapproved client communication.",
          "08:05 AM",
          [
            "All teams,",
            "Do not send unapproved client communication.",
            "Submit liquidity status, Silverman exposure, Atlas exposure, money market exposure, and recommended action by 10:00 AM.",
            "This is a firm-level crisis response."
          ]
        ),
        mail(
          "Risk Analytics",
          "risk.analytics@harborpoint.com",
          "Model failure notice — SYN",
          "Model prices for Structured Yield Notes should be treated with caution.",
          "08:18 AM",
          [
            "Due to market dislocation, model prices for SYN should be treated with caution.",
            "Issues: no reliable dealer quotes, correlation assumptions no longer valid, protection value uncertain pending Atlas stabilization.",
            "Recommendation: classify as hard-to-value until market liquidity returns."
          ]
        )
      ],
      chat: [
        convo("Crisis Room", [
          { from: "Maya", text: "Priority one: liquidity. Priority two: client communication. Priority three: counterparty exposure." },
          { from: "Ethan", text: "SYN has no real bid. Senior housing-linked products are quoted at deep discounts." },
          { from: "Operations", text: "Some cash-equivalent sleeves may face delayed redemption." },
          { from: "Lena", text: "Do not promise same-day liquidity unless we can prove it." }
        ]),
        convo("NorthBank Notice", [
          { from: "NorthBank", text: "Due to market conditions, your available credit line will be reduced by 40%." },
          { from: "You", text: "Effective when?" },
          { from: "NorthBank", text: "Immediately. This is part of a system-wide risk management adjustment." }
        ])
      ]
    },
    documents: [
      doc(
        "p5-emergency",
        "Emergency Client Briefing Pack",
        "emergency_client_briefing_pack.pdf",
        "Emergency pack · Free",
        "Summarizes portfolio exposure, liquidity limits, and client communication language.",
        [
          { heading: "Situation Overview", text: "Silverman failed, Atlas is receiving support, and structured-product liquidity is severely impaired." },
          { heading: "Liquidity Estimate", text: "Raising 5–10% cash is possible. Raising 20% within 48 hours may require selling at severe discounts." },
          { heading: "Client Language", text: "Avoid promising guaranteed liquidity. Explain that normally liquid assets may behave differently under stress." }
        ],
        [
          { label: "Raise 5% cash", value: "Possible" },
          { label: "Raise 20% cash", value: "Difficult" },
          { label: "SYN pricing", value: "Hard-to-value" }
        ]
      ),
      doc(
        "p5-model",
        "Model Failure Notice",
        "model_failure_notice.pdf",
        "Risk analytics memo",
        "Warns that model prices for structured products are unreliable during market dislocation.",
        [
          { heading: "Issue", text: "No reliable dealer quotes are available for several structured notes." },
          { heading: "Assumption Failure", text: "Correlation assumptions and liquidity assumptions are no longer valid." },
          { heading: "Recommendation", text: "Treat SYN as hard-to-value until market liquidity returns." }
        ],
        [
          { label: "Dealer quotes", value: "Unavailable" },
          { label: "Correlation", value: "Failed" },
          { label: "Classification", value: "Level 3" }
        ]
      )
    ],
    decisionsA: [
      choice("p5-sell-good", "Sell liquid assets first to raise cash fast", "Quick liquidity, but leaves the book more toxic.", { blueChip: 0.10, bonds: 0.10, gold: 0.05, cash: 0.35, financials: 0.20, hlx: 0.08, syn: 0.10, hedge: 0.02 }, 8, 10),
      choice("p5-sell-toxic", "Sell toxic assets even at a deep discount", "Painful now, cleaner later.", { blueChip: 0.22, bonds: 0.30, gold: 0.12, cash: 0.28, financials: 0.04, hlx: 0.02, syn: 0, hedge: 0.02 }, -20, 20),
      choice("p5-gate", "Recommend temporary redemption limits", "Protects fairness, risks client anger.", null, -8, 18),
      choice("p5-wait", "Wait for a rescue before acting", "Could save you — or trap you.", null, 12, -15)
    ],
    decisionsB: [
      choice("p5-cash", "Raise emergency cash immediately", "Survival before return.", null, -3, 10),
      choice("p5-freeze", "Freeze new risk positions and focus on liquidity", "Strong crisis discipline.", null, -4, 8, { removeLeverage: true }),
      choice("p5-credit", "Use the remaining credit line to avoid forced sales", "Can backfire badly if stress deepens.", null, 9, -10, { leverage: true }),
      choice("p5-calm", "Communicate 'business as usual' and wait", "May calm people briefly, but is risky.", null, 6, -8)
    ],
    transition: "Policy support arrives, but recovery depends on who still has liquidity."
  },

  {
    title: "Phase 6: Aftermath and Recovery",
    timeline: "2009. Panic has peaked. Policy support begins. The best opportunities now belong to those who still have cash and trust.",
    tasks: taskSet(
      "aftermath news",
      "post-crisis internet",
      "review email",
      "post-mortem chat",
      "investigation file",
      "recovery decision"
    ),
    marketData: [
      { label: "Policy Rate", value: "0.25%", note: "emergency support" },
      { label: "Distressed Basket", value: "+22% from lows", note: "recovery starting" },
      { label: "Credit Spread", value: "680 bps", note: "still elevated" },
      { label: "Cash on Hand", value: "18%", note: "dry powder matters" }
    ],
    content: {
      news: [
        article(
          "COLUMBIA FINANCIAL TIMES",
          "https://cft.example/policy/recovery-program",
          "Government Launches Emergency Stabilization Program",
          "Markets remain fragile, but policy support begins to slow the panic.",
          "03 March 2009 | 09:30",
          [
            "The government launched a stabilization program aimed at recapitalizing financial institutions and restoring credit flows.",
            "Market sentiment remains fragile. Many investors are still selling risky assets.",
            "Cash-rich funds are preparing to buy distressed assets.",
            "For surviving portfolios, the recovery phase presents a new question: whether fear will prevent action just as greed prevented caution earlier."
          ],
          [
            "Cash-rich investors prepare recovery baskets",
            "Clients demand post-crisis transparency",
            "Risk models face regulatory scrutiny"
          ]
        ),
        article(
          "THE COLUMBIA ECONOMIST",
          "https://economist.example/lessons/golden-roof",
          "Golden Roof Lessons: The Crisis Started Before It Was Called a Crisis",
          "Signals were present, but fragmented across documents, prices, and behavior.",
          "12 March 2009 | 10:10",
          [
            "Looking back, warning signals appeared long before the bankruptcy.",
            "Housing prices outran income, underwriting weakened, products became complex, and liquidity was assumed rather than tested.",
            "The failure was not one bad asset. It was a system that mistook risk transfer for risk disappearance.",
            "Many investors learned that a product can be safe-looking, rated highly, and still impossible to sell when needed."
          ],
          [
            "Liquidity matters more than labels",
            "Ratings lose credibility",
            "Stress tests redesigned"
          ]
        ),
        article(
          "MARKET RECOVERY WIRE",
          "https://mrw.example/recovery/distressed-basket",
          "Distressed Assets Rally From Panic Lows",
          "Recovery begins unevenly as surviving investors step back into risk.",
          "28 April 2009 | 14:00",
          [
            "Several distressed assets rallied from panic lows as policy programs stabilized markets.",
            "Investors with cash reserves were able to buy at discounts.",
            "Those forced to liquidate earlier had little capacity to participate.",
            "The recovery highlighted a final crisis lesson: opportunity belongs to those who survive with liquidity."
          ],
          [
            "Recovery basket rises",
            "Defensive funds rotate gradually",
            "Cash discipline rewarded"
          ]
        )
      ],
      social: {
        trends: ["#AfterTheCrash", "#CashIsKing", "#Recovery", "#NeverAgain"],
        posts: [
          post(
            "BackInTheGame",
            "@BackInTheGame",
            "If you still have cash, this may be the opportunity of a decade. But buying now feels terrifying.",
            ["DCA only for me.", "The fear is real."],
            "760 replies · 4.5K reposts · 15.9K likes"
          ),
          post(
            "RiskIntern",
            "@RiskIntern",
            "Risk did not disappear when it was packaged. It just moved to places people stopped looking.",
            ["This should be on the final exam.", "Painful truth."],
            "410 replies · 3.2K reposts · 14.1K likes"
          ),
          post(
            "LostEverything",
            "@LostEverything",
            "I bought products called safe income. Now I understand that safe and liquid are not the same thing.",
            ["Sorry man.", "This sentence hurts."],
            "1.4K replies · 8.8K reposts · 30.1K likes"
          )
        ]
      },
      email: [
        mail(
          "Maya Collins",
          "maya.collins@harborpoint.com",
          "Post-crisis review",
          "We need an honest review of what we saw, missed, and did.",
          "09:00 AM",
          [
            "Team,",
            "We need a post-crisis review for the Investment Committee.",
            "Please explain which signals we identified early, which signals we underestimated, and which decisions helped or damaged portfolio resilience.",
            "This is not a blame exercise. But it must be honest.",
            "Maya"
          ]
        ),
        mail(
          "NorthLake Pension",
          "committee@northlakepension.com",
          "Follow-up review meeting",
          "Please explain liquidity management decisions and lessons learned.",
          "11:30 AM",
          [
            "Dear HarborPoint,",
            "We appreciate the communication during the crisis period.",
            "We would like a review covering losses, liquidity management decisions, hard-to-value products, and proposed risk process changes.",
            "We will need a clear explanation of why some risks were not reduced earlier."
          ]
        ),
        mail(
          "System Reveal",
          "reveal@freefall.system",
          "Hidden variables unlocked",
          "TXS and LQS will be revealed after the final decision.",
          "11:59 PM",
          [
            "The crisis was not caused by one isolated event.",
            "It emerged from leverage, complex products, rating model weakness, liquidity failure, and overconfidence.",
            "Your outcome will now be evaluated by portfolio value, toxic exposure, information use, liquidity discipline, and FOMO exposure."
          ]
        )
      ],
      chat: [
        convo("Post-Mortem", [
          { from: "System", text: "The crisis is now fully revealed." },
          { from: "System", text: "Earlier signals existed, but they were fragmented across news, documents, social pressure, and advisor messages." },
          { from: "System", text: "Your final choice depends on what remains: capital, liquidity, and trust." }
        ]),
        convo("Maya", [
          { from: "Maya", text: "No one had perfect information." },
          { from: "You", text: "But some warnings were there." },
          { from: "Maya", text: "Yes. The review is about whether we converted warning into action." }
        ])
      ]
    },
    documents: [
      doc(
        "p6-report",
        "Post-Crisis Investigation Report",
        "post_crisis_investigation_report.pdf",
        "Reveal document · Free",
        "Explains how leverage, model assumptions, liquidity failure, and overconfidence interacted.",
        [
          { heading: "Main Finding", text: "The crisis did not begin when Silverman failed. It began when investors believed the same assumptions could not fail." },
          { heading: "Hidden Fragility", text: "Strong early returns encouraged concentration, leverage, and trust in products whose liquidity depended on calm markets." },
          { heading: "Lesson", text: "The most valuable crisis asset was not prediction. It was survival capacity: cash, liquidity, transparency, and the ability to act after fear peaked." }
        ],
        [
          { label: "Root problem", value: "Fragility" },
          { label: "Hidden risk", value: "TXS" },
          { label: "Survival factor", value: "Liquidity" }
        ]
      )
    ],
    decisionsA: [
      choice("p6-all", "Go all-in on the recovery", "Highest rebound potential, highest timing risk.", null, 10, -10, { recovery: "allIn" }),
      choice("p6-dca", "Buy back gradually over several months", "Balanced recovery move.", null, 2, -3, { recovery: "dca" }),
      choice("p6-cash", "Stay in cash for now", "Safe, but may miss recovery.", null, -2, 5, { recovery: "cash" }),
      choice("p6-def", "Remain defensive with gold, bonds and cash", "Protection first, upside second.", null, -2, 8, { recovery: "defensive" })
    ],
    decisionsB: [
      choice("p6-quality", "Re-enter only through high-quality assets", "Careful and selective.", null, -3, 4),
      choice("p6-rules", "Rebuild with strict liquidity and model-risk rules", "The most institutionally sound approach.", null, -5, 8, { removeLeverage: true }),
      choice("p6-avoid", "Avoid risky assets entirely for now", "Emotionally understandable, but maybe too cautious.", null, -2, 4),
      choice("p6-leverage", "Use leverage to recover losses faster", "Tempting, but risky.", null, 10, -10, { leverage: true })
    ],
    transition: "The crisis map ends. Hidden variables are revealed."
  }
];

/* =========================
   BASIC HELPERS
========================= */

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatMoney(value) {
  return `$${Math.round(value).toLocaleString()}`;
}

function getPhase() {
  return phases[gameState.phase - 1];
}

function showPage(pageName) {
  Object.values(pages).forEach(page => {
    if (page) page.classList.remove("active");
  });

  if (pages[pageName]) {
    pages[pageName].classList.add("active");
  }
}

function setActiveSidebar(tab) {
  currentTab = tab;

  sideButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });
}

function escapeHTML(str) {
  return String(str).replace(/[&<>'"]/g, tag => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  }[tag]));
}

function short(text, len) {
  return text.length > len ? text.slice(0, len - 1) + "…" : text;
}

function getHost(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return "market.local";
  }
}

function getBrandShortName(brand) {
  return brand
    .replace("THE ", "")
    .replace("MAGAZINE", "Mag")
    .replace("JOURNAL", "Journal")
    .replace("NETWORK", "Network")
    .replace("TIMES", "Times");
}

function getNewsTheme(brand) {
  if (/MAGAZINE/i.test(brand)) return "theme-magazine";
  if (/JOURNAL|TIMES|ECONOMIST/i.test(brand)) return "theme-journal";
  if (/NETWORK|TV|WIRE|REUTERS|ALERT/i.test(brand)) return "theme-wire";
  return "theme-paper";
}

function calculateCrashMultiplier() {
  return 1 + (gameState.txs / 100) * 1.5;
}

function isToxicAsset(asset) {
  return TOXIC_ASSETS.includes(asset);
}

/* =========================
   AUTO REVEAL
========================= */

function clearPhaseTimers() {
  phaseTimers.forEach(timer => clearTimeout(timer));
  phaseTimers = [];
}

function initializeAutoReveal() {
  clearPhaseTimers();

  selectedAllocation = null;
  selectedInfo = null;

  activeNewsIndex = 0;
  activeEmailIndex = 0;
  activeChatIndex = 0;

  unlockedChannels = {};
  unreadChannels = {};
  viewedChannels = {};

  CHANNEL_ORDER.forEach(tab => {
    unlockedChannels[tab] = false;
    unreadChannels[tab] = false;
    viewedChannels[tab] = false;
  });

  unlockChannel("news", true);

  CHANNEL_ORDER.slice(1).forEach((tab, index) => {
    const timer = setTimeout(() => {
      unlockChannel(tab, true);
      showArrival(tab);

      if (currentTab === tab) {
        renderContent(tab);
      }

      updateStatus();
      renderTasks();
      renderNotificationDots();
      updateNextButtonState();
    }, ARRIVAL_DELAY_MS * (index + 1));

    phaseTimers.push(timer);
  });

  setActiveSidebar("news");
}

function unlockChannel(tab, makeUnread) {
  unlockedChannels[tab] = true;
  if (makeUnread) unreadChannels[tab] = true;
}

function showArrival(tab) {
  const text = `${CHANNEL_LABELS[tab]} update received`;

  if (arrivalCard) {
    arrivalCard.textContent = text;
    arrivalCard.classList.add("show");

    setTimeout(() => {
      arrivalCard.classList.remove("show");
    }, 2200);
  }
}

function renderNotificationDots() {
  sideButtons.forEach(btn => {
    const tab = btn.dataset.tab;

    btn.classList.toggle("has-new", Boolean(unreadChannels[tab]));
    btn.classList.toggle("locked-channel", !unlockedChannels[tab]);
  });
}

function markViewed(tab) {
  viewedChannels[tab] = true;
  unreadChannels[tab] = false;
  renderNotificationDots();
  renderTasks();
}

/* =========================
   STATUS RENDER
========================= */

function updateStatus() {
  const phaseNumber = gameState.phase;
  const totalPhases = phases.length;
  const percent = Math.round((phaseNumber / totalPhases) * 100);

  if (phaseLabel) phaseLabel.textContent = `Phase ${phaseNumber}/${totalPhases}`;
  if (progressPercent) progressPercent.textContent = `${percent}%`;
  if (progressFill) progressFill.style.width = `${percent}%`;
  if (portfolioValue) portfolioValue.textContent = formatMoney(gameState.pv);

  renderMarketData();

  if (lastOutcome) {
    if (gameState.lastOutcomeText) {
      lastOutcome.classList.add("show");
      lastOutcome.textContent = gameState.lastOutcomeText;
    } else {
      lastOutcome.classList.remove("show");
      lastOutcome.textContent = "";
    }
  }

  renderAllocation();
}

function renderMarketData() {
  const phase = getPhase();
  if (!marketDataGrid) return;

  const data = phase.marketData || [];

  marketDataGrid.innerHTML = data.map(item => `
    <div class="market-card">
      <small>${item.label}</small>
      <strong>${item.value}</strong>
      <span>${item.note}</span>
    </div>
  `).join("");
}

function renderAllocation() {
  if (!allocationList) return;

  allocationList.innerHTML = "";

  Object.entries(gameState.allocation).forEach(([asset, weight]) => {
    if (weight <= 0) return;

    const row = document.createElement("div");
    row.className = "allocation-row";

    row.innerHTML = `
      <span>${ASSET_LABELS[asset]}</span>
      <div class="allocation-bar">
        <div class="allocation-fill" style="width:${Math.round(weight * 100)}%"></div>
      </div>
      <strong>${Math.round(weight * 100)}%</strong>
    `;

    allocationList.appendChild(row);
  });
}

function renderTasks() {
  if (!taskList) return;

  const phase = getPhase();
  taskList.innerHTML = "";

  Object.entries(phase.tasks).forEach(([key, label]) => {
    const done =
      key === "decision"
        ? Boolean(selectedAllocation && selectedInfo)
        : Boolean(viewedChannels[key]);

    const unlocked = Boolean(unlockedChannels[key]);

    const li = document.createElement("li");
    li.className = `${done ? "done" : ""} ${!unlocked ? "task-locked" : ""}`.trim();

    let icon = "○";

    if (done) icon = "✓";
    else if (!unlocked) icon = "🔒";
    else if (unreadChannels[key]) icon = "●";

    li.textContent = `${icon} ${label}`;
    taskList.appendChild(li);
  });
}

function updateNextButtonState() {
  if (!nextPhaseBtn) return;

  if (!unlockedChannels.decision) {
    nextPhaseBtn.textContent = "Waiting for information...";
    nextPhaseBtn.disabled = true;
    return;
  }

  if (!selectedAllocation || !selectedInfo) {
    nextPhaseBtn.textContent = "Select 2 actions";
    nextPhaseBtn.disabled = false;
    return;
  }

  nextPhaseBtn.textContent = gameState.phase === phases.length
    ? "Finish Simulation"
    : "Confirm & Continue";
  nextPhaseBtn.disabled = false;
}

/* =========================
   CHANNEL RENDER
========================= */

function renderContent(tab) {
  const phase = getPhase();

  if (!unlockedChannels[tab]) {
    renderLockedChannel(tab);
    return;
  }

  markViewed(tab);

  if (tab === "news") renderNews(phase.content.news);
  if (tab === "social") renderSocial(phase.content.social);
  if (tab === "email") renderEmail(phase.content.email);
  if (tab === "chat") renderChat(phase.content.chat);
  if (tab === "file") renderFiles(phase.documents);
  if (tab === "decision") renderDecision(phase);

  updateNextButtonState();
}

function renderLockedChannel(tab) {
  const current = CHANNEL_ORDER.find(ch => unlockedChannels[ch]) || "news";

  contentBox.innerHTML = `
    <div class="locked-screen">
      <div class="locked-card-big">
        <div class="locked-icon">🔒</div>
        <h2>${CHANNEL_LABELS[tab]} is not available yet</h2>
        <p>
          Information arrives automatically over time.
          Wait for the next notification or return to the current channel.
        </p>
        <button class="primary-btn" id="go-current-channel">
          Go to current channel
        </button>
      </div>
    </div>
  `;

  document.getElementById("go-current-channel").addEventListener("click", () => {
    setActiveSidebar(current);
    renderContent(current);
  });
}

/* =========================
   NEWS
========================= */

function renderNews(articles) {
  const article = articles[activeNewsIndex];
  const themeClass = getNewsTheme(article.brand);

  contentBox.innerHTML = `
    <div class="app-window news-app ${themeClass}">
      <div class="browser-tabs">
        ${articles.map((item, index) => `
          <button class="browser-tab ${index === activeNewsIndex ? "active" : ""}" data-news-index="${index}">
            <span>${short(getBrandShortName(item.brand), 24)}</span>
            <small>${getHost(item.url)}</small>
          </button>
        `).join("")}
      </div>

      <div class="news-browser-top">
        <span class="browser-dot"></span>
        <span class="browser-dot"></span>
        <span class="browser-dot"></span>
        <div class="browser-url">${article.url}</div>
      </div>

      <div class="news-page">
        <div class="news-brand">${article.brand}</div>

        <div class="news-grid">
          <article class="news-article">
            <h1>${article.headline}</h1>
            <div class="news-subtitle">${article.subtitle}</div>
            <div class="news-meta">${article.date}</div>
            <div class="news-image-placeholder"></div>
            ${article.body.map(paragraph => `<p>${paragraph}</p>`).join("")}
          </article>

          <aside class="top-stories">
            <h3>Top stories</h3>
            ${article.stories.map(story => `<div class="story-card">${story}</div>`).join("")}
          </aside>
        </div>
      </div>
    </div>
  `;

  document.querySelectorAll(".browser-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      activeNewsIndex = Number(btn.dataset.newsIndex);
      renderNews(articles);
    });
  });
}

/* =========================
   SOCIAL
========================= */

function renderSocial(data) {
  contentBox.innerHTML = `
    <div class="app-window social-app">
      <aside class="social-left">
        <div class="social-logo">𝕏</div>
        <div class="social-menu">
          <div class="active">Home</div>
          <div>Search</div>
          <div>Notifications</div>
          <div>Messages</div>
        </div>
      </aside>

      <main class="social-feed">
        <div class="compose-box">What's going on?</div>
        ${data.posts.map((postItem, index) => renderPost(postItem, index)).join("")}
      </main>

      <aside class="trends">
        <div class="trend-box">
          <h3>What's happening</h3>
          ${data.trends.map(trend => `<div>${trend}</div>`).join("")}
        </div>
      </aside>
    </div>
  `;

  document.querySelectorAll(".reply-post-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.postIndex;
      const input = document.querySelector(`.post-reply-input[data-post-index="${index}"]`);

      if (!input || !input.value.trim()) return;

      if (!gameState.socialReplies[gameState.phase]) {
        gameState.socialReplies[gameState.phase] = {};
      }

      if (!gameState.socialReplies[gameState.phase][index]) {
        gameState.socialReplies[gameState.phase][index] = [];
      }

      gameState.socialReplies[gameState.phase][index].push(input.value.trim());
      input.value = "";
      renderSocial(getPhase().content.social);
    });
  });
}

function renderPost(postItem, index) {
  const replies =
    gameState.socialReplies[gameState.phase] &&
    gameState.socialReplies[gameState.phase][index]
      ? gameState.socialReplies[gameState.phase][index]
      : [];

  return `
    <div class="post-card">
      <div class="post-header">
        <div class="post-avatar"></div>
        <div class="post-name">
          <strong>${postItem.name}</strong>
          <small>${postItem.handle} · now</small>
        </div>
      </div>

      <p>${postItem.text}</p>

      <div class="post-actions">
        <span>💬</span>
        <span>↻</span>
        <span>♡</span>
        <span>${postItem.stats}</span>
      </div>

      <div class="comment-box">
        <strong>Comments</strong>

        ${postItem.comments.map(comment => `
          <div class="comment-item">${comment}</div>
        `).join("")}

        ${replies.map(reply => `
          <div class="comment-item user-comment">You: ${escapeHTML(reply)}</div>
        `).join("")}

        <div class="reply-row">
          <input
            class="post-reply-input"
            data-post-index="${index}"
            placeholder="Reply to this post..."
          />
          <button class="reply-post-btn" data-post-index="${index}">Reply</button>
        </div>
      </div>
    </div>
  `;
}

/* =========================
   EMAIL
========================= */

function renderEmail(emails) {
  const email = emails[activeEmailIndex];

  contentBox.innerHTML = `
    <div class="app-window email-app">
      <div class="email-list">
        <div class="email-search">Search mail</div>

        ${emails.map((item, index) => `
          <div class="email-item ${index === activeEmailIndex ? "active" : ""}" data-email-index="${index}">
            <strong>${item.sender}</strong>
            <div>${item.preview}</div>
            <span class="email-time">${item.time}</span>
          </div>
        `).join("")}
      </div>

      <div class="email-read">
        <div class="email-toolbar">← Archive · Report · More</div>

        <h1 class="email-subject">${email.subject}</h1>

        <div class="email-sender">
          <div class="avatar">${email.sender.charAt(0)}</div>
          <div>
            <strong>${email.sender} &lt;${email.email}&gt;</strong><br>
            <small>to me · ${email.time}</small>
          </div>
        </div>

        <div class="email-body">
          ${email.body.map(paragraph => `<p>${paragraph}</p>`).join("")}
        </div>

        <div class="gmail-reply-box">
          <h3>Reply</h3>
          <textarea id="gmail-reply-text" placeholder="Write a reply...">${getEmailDraft(activeEmailIndex)}</textarea>
          <button id="save-email-reply">Save Draft</button>
          <span id="reply-status"></span>
        </div>
      </div>
    </div>
  `;

  document.querySelectorAll(".email-item").forEach(item => {
    item.addEventListener("click", () => {
      activeEmailIndex = Number(item.dataset.emailIndex);
      renderEmail(emails);
    });
  });

  document.getElementById("save-email-reply").addEventListener("click", () => {
    const text = document.getElementById("gmail-reply-text").value;

    if (!gameState.emailReplies[gameState.phase]) {
      gameState.emailReplies[gameState.phase] = {};
    }

    gameState.emailReplies[gameState.phase][activeEmailIndex] = text;

    const status = document.getElementById("reply-status");
    status.textContent = "Draft saved";

    setTimeout(() => {
      status.textContent = "";
    }, 1600);
  });
}

function getEmailDraft(index) {
  return (
    gameState.emailReplies[gameState.phase] &&
    gameState.emailReplies[gameState.phase][index]
  )
    ? gameState.emailReplies[gameState.phase][index]
    : "";
}

/* =========================
   CHAT
========================= */

function renderChat(conversations) {
  const current = conversations[activeChatIndex];
  const replies =
    gameState.chatReplies[gameState.phase] &&
    gameState.chatReplies[gameState.phase][activeChatIndex]
      ? gameState.chatReplies[gameState.phase][activeChatIndex]
      : [];

  contentBox.innerHTML = `
    <div class="app-window chat-app">
      <aside class="chat-list">
        ${conversations.map((item, index) => `
          <div class="chat-contact ${index === activeChatIndex ? "active" : ""}" data-chat-index="${index}">
            <strong>${item.contact}</strong>
            <p>${item.messages[item.messages.length - 1].text}</p>
          </div>
        `).join("")}
      </aside>

      <main class="chat-window">
        <div class="chat-header">${current.contact}</div>

        <div class="chat-messages">
          ${current.messages.map(message => `
            <div class="message ${message.from === "You" ? "outgoing" : "incoming"}">
              <strong>${message.from}</strong><br>
              ${message.text}
            </div>
          `).join("")}

          ${replies.map(reply => `
            <div class="message outgoing">
              <strong>You</strong><br>
              ${escapeHTML(reply)}
            </div>
          `).join("")}
        </div>

        <div class="chat-input">
          <input id="chat-reply-text" placeholder="Type a message..." />
          <button id="send-chat-reply">Send</button>
        </div>
      </main>
    </div>
  `;

  document.querySelectorAll(".chat-contact").forEach(item => {
    item.addEventListener("click", () => {
      activeChatIndex = Number(item.dataset.chatIndex);
      renderChat(conversations);
    });
  });

  document.getElementById("send-chat-reply").addEventListener("click", () => {
    const input = document.getElementById("chat-reply-text");
    const text = input.value.trim();

    if (!text) return;

    if (!gameState.chatReplies[gameState.phase]) {
      gameState.chatReplies[gameState.phase] = {};
    }

    if (!gameState.chatReplies[gameState.phase][activeChatIndex]) {
      gameState.chatReplies[gameState.phase][activeChatIndex] = [];
    }

    gameState.chatReplies[gameState.phase][activeChatIndex].push(text);
    input.value = "";
    renderChat(conversations);
  });
}

/* =========================
   FILES + PDF MODAL
========================= */

function renderFiles(documents) {
  contentBox.innerHTML = `
    <div class="app-window file-app">
      <aside class="file-sidebar">
        <div class="drive-title">Drive</div>
        <div class="file-folder active">📄 Current Phase</div>
        <div class="file-folder">📁 Market Reports</div>
        <div class="file-folder">📁 Advisor Notes</div>
        <div class="file-folder">📁 Technical Appendix</div>
      </aside>

      <main class="file-preview">
        <div class="file-header">
          <h1>Optional Documents</h1>
          <div class="file-meta">
            Click a document to open its PDF preview. These documents contain deeper signals that ordinary headlines may miss.
          </div>
        </div>

        <div class="document-list">
          ${documents.map(docItem => renderDocCard(docItem)).join("")}
        </div>
      </main>
    </div>
  `;

  document.querySelectorAll(".doc-card").forEach(card => {
    card.addEventListener("click", () => {
      const docId = card.dataset.docId;
      readDocument(docId);
    });
  });
}

function renderDocCard(docItem) {
  const read = gameState.documentsRead.includes(docItem.id);

  return `
    <div class="doc-card ${read ? "read" : ""}" data-doc-id="${docItem.id}">
      <h3>${read ? "✓ " : ""}${docItem.title}</h3>
      <p>${docItem.summary}</p>
      <div class="doc-meta">
        <span>${docItem.fileName}</span>
        <span>${docItem.meta}</span>
      </div>
    </div>
  `;
}

function readDocument(docId) {
  const phase = getPhase();
  const docItem = phase.documents.find(item => item.id === docId);

  if (!docItem) return;

  if (!gameState.documentsRead.includes(docItem.id)) {
    gameState.documentsRead.push(docItem.id);
    gameState.ap += 1;
  }

  openPdfModal(docItem);
  renderFiles(phase.documents);
  updateStatus();
  renderTasks();
}

function openPdfModal(docItem) {
  if (!pdfModal || !pdfModalBody || !pdfModalTitle) {
    alert(`PDF path: ${docItem.pdfPath}`);
    return;
  }

  pdfModalTitle.textContent = docItem.title;

  pdfModalBody.innerHTML = `
    <iframe src="${docItem.pdfPath}" title="${docItem.title}"></iframe>

    <div class="pdf-fallback">
      <p><strong>If the PDF does not load:</strong></p>
      <p>Check that the file exists at <code>${docItem.pdfPath}</code>.</p>
      <p><strong>Summary:</strong> ${docItem.summary}</p>

      ${docItem.sections.map(section => `
        <p><strong>${section.heading}:</strong> ${section.text}</p>
      `).join("")}
    </div>
  `;

  pdfModal.classList.add("show");
}

function closePdfModal() {
  if (!pdfModal || !pdfModalBody) return;

  pdfModal.classList.remove("show");
  pdfModalBody.innerHTML = "";
}

/* =========================
   DECISION
========================= */

function renderDecision(phase) {
  contentBox.innerHTML = `
    <div class="decision-screen">
      <div class="phase-context">
        <strong>${phase.title}</strong><br>
        ${phase.timeline}
      </div>

      <h2>Decision Point</h2>

      <div class="decision-columns">
        <div class="decision-block">
          <h3>Decision 1 — Portfolio Move</h3>
          <p>Choose the main investment action for this phase.</p>

          <div class="choice-list">
            ${phase.decisionsA.map((decision, index) => renderChoiceButton(decision, index, "allocation")).join("")}
          </div>
        </div>

        <div class="decision-block">
          <h3>Decision 2 — Risk / Liquidity Move</h3>
          <p>Choose one practical control action to go with your main move.</p>

          <div class="choice-list">
            ${phase.decisionsB.map((decision, index) => renderChoiceButton(decision, index, "info")).join("")}
          </div>
        </div>
      </div>

      <div class="decision-help">
        Keep it practical: one market move and one risk / liquidity move. 
        Hidden TXS is revealed only at the end.
      </div>
    </div>
  `;

  document.querySelectorAll(".choice-btn").forEach(button => {
    button.addEventListener("click", () => {
      const type = button.dataset.type;
      const index = Number(button.dataset.index);

      const decision =
        type === "allocation"
          ? phase.decisionsA[index]
          : phase.decisionsB[index];

      if (type === "allocation") {
        selectedAllocation = decision;
      } else {
        selectedInfo = decision;
      }

      document.querySelectorAll(`.choice-btn[data-type="${type}"]`).forEach(btn => {
        btn.classList.remove("selected");
      });

      button.classList.add("selected");
      renderTasks();
      updateNextButtonState();
    });
  });
}

function renderChoiceButton(decision, index, type) {
  return `
    <button class="choice-btn" data-index="${index}" data-type="${type}">
      ${String.fromCharCode(65 + index)}. ${decision.text}
      <span class="choice-note">${decision.note || ""}</span>
    </button>
  `;
}

/* =========================
   SCORING ENGINE
========================= */

function calculatePhaseReturn() {
  const phase = gameState.phase;
  const crashMultiplier = calculateCrashMultiplier();

  let totalReturn = 0;

  Object.entries(gameState.allocation).forEach(([asset, weight]) => {
    if (!returnTable[asset]) return;

    let assetReturn = returnTable[asset][phase];

    if ((phase === 5 || phase === 6) && isToxicAsset(asset)) {
      assetReturn = assetReturn * crashMultiplier;
    }

    totalReturn += weight * assetReturn;
  });

  if (gameState.leverageActive) {
    totalReturn = totalReturn * 1.8;
  }

  return totalReturn;
}

function checkMarginCallAndApplyPenalty() {
  if (!gameState.leverageActive) return false;

  const drawdown = (gameState.peakPV - gameState.pv) / gameState.peakPV;

  if ((gameState.phase >= 4 && drawdown >= 0.2) || gameState.lqs < 35) {
    gameState.marginCallTriggered = true;

    const penalty = (gameState.allocation.syn || 0) > 0.2 ? 0.18 : 0.10;

    gameState.pv *= 1 - penalty;
    gameState.lqs = clamp(gameState.lqs - 10, 0, 100);

    return true;
  }

  return false;
}

function applyRecoveryIfPhaseSix(decision) {
  if (gameState.phase !== 6) return;

  let multiplier = 1;

  if (decision.recovery === "allIn") {
    multiplier = gameState.allocation.cash >= 0.30 ? 1.6 : 1.15;
  }

  if (decision.recovery === "dca") {
    multiplier = gameState.allocation.cash >= 0.15 ? 1.35 : 1.12;
  }

  if (decision.recovery === "cash") {
    multiplier = 1.02;
  }

  if (decision.recovery === "defensive") {
    multiplier = gameState.hedgeActive ? 1.10 : 1.06;
  }

  if (gameState.lqs < 20) {
    multiplier = 0.90;
  }

  gameState.pv *= multiplier;
}

function applyDecisionAndAdvance() {
  if (!unlockedChannels.decision) {
    alert("Wait until the decision window opens. Information is still arriving.");
    return;
  }

  if (!selectedAllocation || !selectedInfo) {
    alert("Please choose both decisions.");
    setActiveSidebar("decision");
    renderContent("decision");
    return;
  }

  const phase = getPhase();
  const oldPV = gameState.pv;

  if (selectedAllocation.allocation) {
    gameState.allocation = { ...selectedAllocation.allocation };
  }

  if (selectedAllocation.hedge || selectedInfo.hedge) {
    gameState.hedgeActive = true;
  }

  if (selectedInfo.leverage) {
    gameState.leverageActive = true;
  }

  if (selectedInfo.removeLeverage) {
    gameState.leverageActive = false;
  }

  gameState.txs = clamp(
    gameState.txs + selectedAllocation.txsDelta + selectedInfo.txsDelta,
    0,
    100
  );

  gameState.lqs = clamp(
    gameState.lqs + selectedAllocation.lqsDelta + selectedInfo.lqsDelta,
    0,
    100
  );

  const phaseReturn = calculatePhaseReturn();

  gameState.pv = gameState.pv * (1 + phaseReturn);
  gameState.peakPV = Math.max(gameState.peakPV, gameState.pv);

  const marginPenalty = checkMarginCallAndApplyPenalty();

  applyRecoveryIfPhaseSix(selectedAllocation);

  gameState.decisionLog.push({
    phase: gameState.phase,
    phaseTitle: phase.title,
    allocation: selectedAllocation.text,
    info: selectedInfo.text,
    pvBefore: oldPV,
    pvAfter: gameState.pv,
    txs: gameState.txs,
    lqs: gameState.lqs,
    marginPenalty
  });

  const change = gameState.pv - oldPV;
  const sign = change >= 0 ? "+" : "";

  gameState.lastOutcomeText =
    `Outcome: ${sign}${formatMoney(change).replace("$", "")}. ` +
    `Liquidity score: ${gameState.lqs}/100. ` +
    `${marginPenalty ? "Margin stress forced additional losses. " : ""}` +
    `${phase.transition}`;

  if (gameState.phase >= phases.length) {
    showResult();
    return;
  }

  gameState.phase += 1;
  loadPhase();
}

/* =========================
   RESULT
========================= */

function calculateFinalScores() {
  const totalDocs = phases.reduce((sum, phase) => sum + phase.documents.length, 0);
  const infoDepth = Math.round((gameState.documentsRead.length / totalDocs) * 100);

  const disciplined = gameState.decisionLog.filter(log => {
    return /cash|hedge|stress|reduce|cut|defensive|sell toxic|quality|rules|liquidity|trial/i.test(
      `${log.allocation} ${log.info}`
    );
  }).length;

  const riskDiscipline = Math.round((disciplined / phases.length) * 100);

  let readiness = 50;

  if (gameState.pv >= 105000) readiness += 20;
  if (gameState.pv >= 130000) readiness += 10;
  if (gameState.pv < 80000) readiness -= 15;
  if (gameState.pv < 50000) readiness -= 25;

  if (gameState.txs <= 25) readiness += 15;
  if (gameState.txs > 55) readiness -= 15;
  if (gameState.txs > 80) readiness -= 25;

  if (gameState.lqs >= 70) readiness += 15;
  if (gameState.lqs < 40) readiness -= 15;
  if (gameState.lqs < 20) readiness -= 25;

  if (infoDepth >= 60) readiness += 10;
  if (riskDiscipline >= 60) readiness += 10;

  return {
    infoDepth,
    riskDiscipline,
    readiness: clamp(readiness, 0, 100)
  };
}

function determineTier(scores) {
  if (
    gameState.pv >= 105000 &&
    gameState.txs <= 25 &&
    gameState.lqs >= 70 &&
    scores.infoDepth >= 60
  ) {
    return {
      title: "Crisis-Ready Strategist",
      description:
        "You recognized hidden fragility early, preserved liquidity, and avoided being dragged fully into the boom. You did not maximize every short-term gain, but you survived with enough flexibility to act after the crash."
    };
  }

  if (gameState.lqs >= 70 && gameState.pv >= 65000) {
    return {
      title: "Liquidity Survivor",
      description:
        "Your return was not perfect, but you preserved liquidity. In a 2008-style crisis, survival capacity matters more than looking brilliant during the boom."
    };
  }

  if (gameState.pv >= 80000 && gameState.txs <= 55) {
    return {
      title: "Disciplined Survivor",
      description:
        "You absorbed losses but avoided the worst outcome. You were influenced by market pressure at times, yet adjusted before the portfolio became completely fragile."
    };
  }

  if (gameState.txs > 80 || gameState.pv < 35000 || gameState.lqs < 20) {
    return {
      title: "Total Exposure",
      description:
        "Your portfolio became trapped in toxic exposure, weak liquidity, and delayed risk recognition. The crisis revealed that early gains were compensation for hidden fragility."
    };
  }

  if (scores.infoDepth < 35 && gameState.txs > 55) {
    return {
      title: "Model Believer",
      description:
        "Your choices looked reasonable on paper, but they relied too heavily on ratings, model prices, and normal-market liquidity. When assumptions failed together, the portfolio lost resilience."
    };
  }

  return {
    title: "Caught in the Wave",
    description:
      "You saw some signals but reacted too late or too cautiously. This is the typical crisis outcome: not reckless enough to fail immediately, but not prepared enough to avoid heavy damage."
  };
}

function showResult() {
  clearPhaseTimers();
  showPage("result");

  const scores = calculateFinalScores();
  const tier = determineTier(scores);

  resultTitle.textContent = tier.title;
  resultDescription.textContent = tier.description;

  finalPortfolio.textContent = formatMoney(gameState.pv);
  finalRisk.textContent = `${gameState.txs}/100`;
  finalScore.textContent = `${scores.readiness}/100`;
  finalLiquidity.textContent = `${gameState.lqs}/100`;
  finalInfoDepth.textContent = `${scores.infoDepth}%`;
  finalIndependence.textContent = `${scores.riskDiscipline}%`;

  decisionReplay.innerHTML = `
    <h3>Decision Replay</h3>
    ${gameState.decisionLog.map(log => `
      <div class="replay-item">
        <strong>${log.phaseTitle}</strong><br>
        Portfolio move: ${log.allocation}<br>
        Risk / liquidity move: ${log.info}<br>
        PV: ${formatMoney(log.pvBefore)} → ${formatMoney(log.pvAfter)}<br>
        Hidden TXS after decision: ${log.txs}/100 · LQS: ${log.lqs}/100
      </div>
    `).join("")}
  `;
}

/* =========================
   LOAD / EVENTS
========================= */

function loadPhase() {
  initializeAutoReveal();
  updateStatus();
  renderTasks();
  renderNotificationDots();
  renderContent("news");
  updateNextButtonState();
}

function startGame() {
  gameState = initialState();
  showPage("game");
  loadPhase();
}

if (startBtn) {
  startBtn.addEventListener("click", () => {
    showPage("case");
  });
}

if (caseCard) {
  caseCard.addEventListener("click", () => {
    startGame();
  });
}

if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    clearPhaseTimers();
    gameState = initialState();
    showPage("landing");
  });
}

if (nextPhaseBtn) {
  nextPhaseBtn.addEventListener("click", () => {
    applyDecisionAndAdvance();
  });
}

sideButtons.forEach(button => {
  button.addEventListener("click", () => {
    const tab = button.dataset.tab;

    if (!unlockedChannels[tab]) {
      setActiveSidebar(tab);
      renderLockedChannel(tab);
      renderNotificationDots();
      return;
    }

    setActiveSidebar(tab);
    renderContent(tab);
    updateNextButtonState();
  });
});

if (pdfModalClose) {
  pdfModalClose.addEventListener("click", closePdfModal);
}

if (pdfModal) {
  pdfModal.addEventListener("click", event => {
    if (event.target === pdfModal) {
      closePdfModal();
    }
  });
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closePdfModal();
  }
});

