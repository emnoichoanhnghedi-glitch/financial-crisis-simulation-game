/* =========================
   FREE FALL — COMPLETE CORRECTED APP.JS
   Updated to match the user's latest content.

   What this version does:
   - Uses the correct MARKET DATA table in the right panel.
   - Uses corrected Phase 1–6 content for News, Internet/Social, Gmail, Chat, Files, Decision.
   - News shows TOP STORIES, not Top signals.
   - News articles are slightly expanded with phase-specific market data so they feel more realistic.
   - News images use: asset/p1-n1.jpg ... asset/p6-n3.jpg
   - Files use: asset/p1-f1.pdf ... asset/p6-f2.pdf
   - Decision has ONE prompt and four options per phase.
   - Keeps the existing HTML and CSS structure.
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
  broadEquity: "Broad Equity",
  financial: "Financial",
  structured: "Structured",
  bonds: "IG Bonds",
  cash: "Cash/T-bills"
};

const ASSET_KEYWORDS = [
  ["Broad Equity", "broadEquity"],
  ["Financial", "financial"],
  ["Structured", "structured"],
  ["IG Bonds", "bonds"],
  ["Cash/T-bills", "cash"],
  ["Cash / Treasury Bills", "cash"]
];

const returnTable = {
  broadEquity: [0, 0.048, 0.071, 0.094, 0.052, -0.038, -0.225],
  financial: [0, 0.072, 0.104, 0.128, 0.026, -0.145, -0.380],
  structured: [0, 0.065, 0.084, 0.091, 0.018, -0.120, -0.320],
  bonds: [0, 0.016, 0.020, 0.024, 0.031, 0.048, 0.065],
  cash: [0, 0.007, 0.010, 0.012, 0.015, 0.019, 0.024]
};

const toxicAssets = ["financial", "structured"];

/* =========================
   RAW PHASE DATA
========================= */

const RAW_PHASES = [
  {
    title: "Phase 1: Normal Market",
    timeline: "Phase 1 — Normal Market",
    marketData: [
      { label: "Broad Equity Index", value: "+4.8% YTD", note: "" },
      { label: "Financial Sector Basket", value: "+7.2% YTD", note: "" },
      { label: "Structured Income Products", value: "+6.5% YTD", note: "" },
      { label: "Investment-Grade Bonds", value: "+1.6% YTD", note: "" },
      { label: "Cash / Treasury Bills", value: "+0.7% YTD", note: "" }
    ],
    news: [
      `Markets Extend Rally as Credit Conditions Remain Loose
Subtitle: Investors continue to favor financial firms and structured income products as returns outpace safer assets.
Markets continued higher as strong earnings, low borrowing costs, and active credit creation supported confidence. The Broad Equity Index is up +4.8% YTD, while the Financial Sector Basket has gained +7.2% YTD and Structured Income Products have returned +6.5% YTD.
Financial firms led gains and structured income products attracted new inflows from pension funds, insurance portfolios, and asset managers. By contrast, investment-grade bonds returned only +1.6% YTD and Cash/Treasury Bills gained just +0.7% YTD, making defensive allocations harder to defend.
Ratings stayed stable and liquidity looked strong, while borrower-quality concerns remained early and low attention.
Top signals: Financial-sector earnings: Strong; Investor demand for structured products: High; Credit ratings: Stable; Market liquidity: Strong; Borrower-quality concerns: Early / low attention.`,

      `Financial Firms Lead Market Gains on Strong Lending Revenue
Subtitle: Banks report strong fee income and active loan growth, reinforcing confidence in the credit cycle.
Financial firms outperformed broader equities as lending revenue, securitization fees, and balance-sheet growth supported earnings expectations. The Financial Sector Basket is now up +7.2% YTD, ahead of the Broad Equity Index at +4.8% YTD.
Analysts noted that banks are benefiting from active credit demand and investor appetite for income products. Structured Income Products also remained attractive at +6.5% YTD, compared with +1.6% for investment-grade bonds.
A few reports mentioned looser underwriting standards in fast-growing segments, but these concerns remained secondary to profitability and return-on-equity momentum.
Top signals: Bank earnings: Strong; Loan growth: Active; Securitization fees: High; Underwriting concerns: Mentioned but low priority; Investor mood: Confident.`,

      `Is Cash Becoming a Drag? Fund Managers Face Pressure to Take More Risk
Subtitle: Clients ask why portfolios are holding low-yielding liquid assets while competitors report higher returns.
Cash and Treasury bills continued to protect liquidity, but their low returns created performance pressure. Cash/Treasury Bills have gained only +0.7% YTD, far below the +4.8% return of broad equities and the +6.5% return of structured income products.
Consultants said some conservative funds may need to explain why they are avoiding high-income credit products that remain well-rated and widely held. Risk managers argued that liquidity has option value, although that argument has been difficult to defend while markets continue rising.
Investment-grade bonds returned +1.6% YTD, offering more stability but still lagging the credit-linked products favored by return-seeking clients.
Top signals: Cash return: Low; Client pressure: Rising; Well-rated credit products: Still respected; Liquidity argument: Hard to sell; Performance anxiety: High.`
    ],
    topStories: [
      ["Financial firms lead another weekly rally", "Pension funds add structured income exposure", "Cash-heavy portfolios trail peer benchmarks"],
      ["Bank fee income rises with securitization activity", "Loan growth supports financial-sector earnings", "Underwriting standards draw quiet scrutiny"],
      ["Consultants question high cash allocations", "Credit products continue to beat Treasury bills", "Risk teams defend liquidity buffers"]
    ],
    posts: [
      `YieldHunter88: Structured income still paying way above boring bonds and people are STILL hiding in cash? Could not be me lol.
Comments: Cash is where returns go to die. / If ratings are stable, what is the drama? / Clients remember performance, not footnotes.`,
      `MacroNerd: Everyone is acting like credit risk disappeared because defaults are low. Maybe that is right, but the economy has not tested these structures under real refinancing stress.
Comments: Not bearish, just curious. / Low default data is not the same as all-weather evidence.`,
      `FinanceBroLeo: Financials are carrying this market. If your fund missed the trade, you now need a very good explanation for clients.
Comments: Being early conservative looks exactly like being wrong. / Committees hate underperformance more than theoretical risk.`
    ],
    emails: [
      `Subject: Client question - why are we underweight financials?
From: Maya Collins <maya.collins@harborpoint.com>
Time: 08:42 AM
NorthLake Pension noticed peer funds increased exposure to financials and structured income products. Please prepare a recommendation before the allocation meeting: maintain, moderately increase, or aggressively increase exposure. Client perception matters, especially while our cash position is dragging relative returns.`,
      `Subject: Baseline model note — stress history is limited
From: Risk System <risk.system@harborpoint.com>
Time: 09:03 AM
Baseline portfolio risk remains within normal limits based on available history. Please note that the dataset contains limited observations for a simultaneous housing slowdown, wider funding haircuts, and reduced dealer balance-sheet capacity. This is not a breach, but sensitivity ranges should be interpreted cautiously.`
    ],
    inboxPreview: `Sender: Maya Collins — Client question - why are we underweight financials?
Sender: Risk System — Baseline model note — stress history is limited
Unread: 2
Priority flags: Client performance pressure; model sensitivity note`,
    chats: [
      `Risk Review
Lena: Structured income products are becoming a much larger part of peer portfolios.
You: Is that a risk issue yet?
Lena: Not by current limits. The uncomfortable part is that the trade looks safe because recent history has been calm.
You: So we are not saying avoid it?
Lena: I am saying do not treat stable marks as proof that exits will always be easy.`,
      `Market Desk
Jon: Dealers are bidding normally. Liquidity looks fine.
You: Any concern about structured income?
Jon: Not in senior pieces. There is demand everywhere.
You: Any weak spots?
Jon: Maybe some lower-quality originators, but that is not what most clients own.
You: So adding exposure is executable?
Jon: Yes, today it is.`,
      `Client Relations
Maya: NorthLake is comparing us to peer funds.
You: Are they asking for a change?
Maya: Not directly, but the message is clear. They want to know why we are carrying so much liquidity when the market is rewarding credit exposure.
You: Can we defend staying conservative?
Maya: Yes, but only if the explanation sounds disciplined, not scared.`
    ],
    files: [
      `market_note.pdf
Preview: Research note · 6 pages. Explains demand, rating stability, low realized defaults, and why structured income has become attractive relative to cash and investment-grade bonds. Includes base-case performance tables and peer allocation examples.`,
      `risk_appendix.pdf
Preview: Technical appendix · 10 pages. Contains model calibration notes, stress boundaries, collateral classifications, and assumptions used to estimate volatility, liquidity, and senior protection under normal conditions.`
    ],
    decisionPrompt: `NorthLake Pension is asking why the fund is not taking more exposure to financials and structured income products while peer funds are outperforming. Market conditions still look supportive: financial firms are strong, ratings are stable, liquidity appears normal, and cash is visibly dragging returns. Your recommendation must balance performance pressure against the possibility that today’s calm conditions may not reveal how these assets behave under stress.`,
    options: [
      `A. Increase financial sector and structured income exposure.
Allocation change: Broad Equity -5%; Financial +10%; Structured +10%; IG Bonds -5%; Cash/T-bills -10%.`,
      `B. Moderately increase financial-sector and structured income exposure.
Allocation change: Broad Equity 0%; Financial +5%; Structured +5%; IG Bonds -5%; Cash/T-bills -5%.`,
      `C. Maintain balanced allocation and continue monitoring.
Allocation change: Broad Equity 0%; Financial 0%; Structured 0%; IG Bonds 0%; Cash/T-bills 0%.`,
      `D. Reduce financial and structured exposure and raise cash.
Allocation change: Broad Equity 0%; Financial -5%; Structured -5%; IG Bonds +5%; Cash/T-bills +5%.`
    ]
  },
  {
    title: "Phase 2: New Opportunity",
    timeline: "Phase 2 — New Opportunity",
    marketData: [
      { label: "Broad Equity Index", value: "+7.1% YTD", note: "" },
      { label: "Financial Sector Basket", value: "+10.4% YTD", note: "" },
      { label: "Structured Income Products", value: "+8.4% YTD", note: "" },
      { label: "Investment-Grade Bonds", value: "+2.0% YTD", note: "" },
      { label: "Cash / Treasury Bills", value: "+1.0% YTD", note: "" }
    ],
    news: [
      `Markets Extend Rally as Credit Conditions Remain Loose
Subtitle: Investors continue to favor financial firms and structured income products as returns outpace safer assets.
Markets continued higher as strong earnings, low borrowing costs, and active credit creation supported confidence. By this phase, the Broad Equity Index has risen +7.1% YTD, while the Financial Sector Basket is up +10.4% YTD and Structured Income Products have gained +8.4% YTD.
Financial firms led gains and structured income products attracted new inflows from pension funds, insurance portfolios, and asset managers. Defensive assets continued to lag, with Investment-Grade Bonds returning only +2.0% YTD and Cash/Treasury Bills up +1.0% YTD.
Ratings stayed stable and liquidity looked strong, while borrower-quality concerns remained early and low attention.
Top signals: Financial-sector earnings: Strong; Investor demand for structured products: High; Credit ratings: Stable; Market liquidity: Strong; Borrower-quality concerns: Early / low attention.`,
      `Peer Funds Outperform After Adding Credit Exposure
Subtitle: Conservative portfolios face questions as competitors report smoother income and better quarterly returns.
Peer funds that increased structured income and financial-sector exposure reported stronger relative performance. Structured Income Products are now up +8.4% YTD, far ahead of Cash/Treasury Bills at +1.0% and Investment-Grade Bonds at +2.0%.
Consultants described the trade as a controlled way to improve yield without moving heavily into equities. Conservative managers now face harder client conversations, especially where cash and government-bond allocations are dragging returns.
Risk teams continue to request more sensitivity analysis, but investment committees remain focused on opportunity cost.
Top signals: Peer performance: Strong; Client comparison pressure: Rising; Conservative allocation drag: Visible; Risk-team requests: More frequent; Committee focus: Opportunity cost.`,
      `Rating Agencies Maintain Stable Outlook on Senior Credit Products
Subtitle: Agencies say senior structures remain protected under base-case assumptions, though model sensitivity varies by collateral quality.
Rating agencies maintained stable outlooks on many senior structured income products, citing credit enhancement, diversification, and continued investor demand. Market participants took comfort from the updates, especially because realized losses remained limited.
The positive rating tone helped support demand for senior products, even as the broader performance gap widened: financials gained +10.4% YTD, structured income gained +8.4% YTD, and cash remained at only +1.0% YTD.
The reports also noted that outcomes depend on refinancing conditions and correlation assumptions, but those caveats received less attention than the headline stability.
Top signals: Senior ratings: Stable; Realized losses: Limited; Credit enhancement: Emphasized; Caveats: Present but technical; Market interpretation: Reassuring.`
    ],
    topStories: [
      ["Financial-sector gains widen the gap with defensive portfolios", "Structured income inflows continue as bond yields stay low", "Cash and Treasury-bill returns lag risk-linked products"],
      ["Peer funds report smoother income after adding credit exposure", "Consultants question conservative allocation policies", "Risk teams request more sensitivity analysis before new buying"],
      ["Rating agencies keep senior structured products stable", "Credit enhancement remains central to product marketing", "Technical caveats receive less attention than headline ratings"]
    ],
    posts: [
      `YieldHunter88: Senior credit carry keeps landing every month. At some point “waiting for a better entry” is just another way to miss the trade.
Comments: Consultants love smooth returns. / Nobody gets paid for holding cash forever. / Model caveats exist in every product.`,
      `MacroNerd: Stable rating does not mean zero sensitivity. It means the base case still works. The question is how much housing weakness and liquidity withdrawal the base case can absorb.
Comments: Caveats are boring until they matter. / Senior structure helps, but assumptions still matter.`,
      `FinanceBroLeo: Imagine telling a pension client you avoided senior-rated income because of a hypothetical stress scenario nobody can observe. Good luck with that meeting.
Comments: Peer tables are brutal. / Risk teams always find a caveat. / Returns are not hypothetical.`
    ],
    emails: [
      `Subject: Allocation meeting — structured income exposure
From: Maya Collins <maya.collins@harborpoint.com>
Time: 09:15 AM
Tomorrow’s committee will ask whether we are being too slow. Peer funds are showing better quarterly income after adding senior structured exposure. We need a recommendation that acknowledges the opportunity cost of staying conservative, not just the risk case. Please include what we would say to NorthLake if we keep cash levels unchanged.`,
      `Subject: Model sensitivity note — liquidity not fully observed
From: Risk System <risk.system@harborpoint.com>
Time: 08:58 AM
Current structured income exposure remains inside approved limits. However, the liquidity score is based mainly on recent dealer indications and normal-market settlement conditions. The model does not fully observe how much size can be executed if multiple funds sell similar positions at the same time.`
    ],
    inboxPreview: `Sender: Maya Collins — Allocation meeting — structured income exposure
Sender: Risk System — Model sensitivity note — liquidity not fully observed
Unread: 2
Priority flags: Peer pressure; liquidity evidence based on normal-market indications`,
    chats: [
      `Risk Review
Lena: The issue is not that these products are losing money. They are not.
You: Then why is Risk pushing back?
Lena: Because the model sees income and rating stability better than it sees crowding.
You: Is that enough to block an allocation?
Lena: No. But it is enough to size it carefully and keep liquidity real.`,
      `Market Desk
Jon: Senior-rated structured products are getting strong bids again this week.
You: Any change in tone?
Jon: Dealers like clean collateral. They ask more questions on the weaker pools, but the main market still works.
You: What about size?
Jon: Reasonable size is fine. Huge blocks would need a conversation.`,
      `Committee Prep
Maya: Tomorrow’s committee will ask: are we missing yield because we are too cautious?
You: What answer do they expect?
Maya: They want a balanced recommendation. If we say no increase, we need to explain the opportunity cost. If we say increase, we need to show liquidity control.
You: So no easy optics.
Maya: Exactly.`
    ],
    files: [
      `structured_income_market_note.pdf
Preview: Research note · 6 pages. Explains product structure, senior protection features, rating rationale, and recent peer adoption. Includes yield comparison versus IG bonds and cash/T-bills, plus a short section on normal-market liquidity.`,
      `liquidity_assumption_appendix.pdf
Preview: Technical appendix · 10 pages. Contains dealer-indication methodology, trade-size assumptions, normal-market settlement assumptions, and sensitivity notes for different collateral pools.`
    ],
    decisionPrompt: `Structured income products are becoming one of the most popular trades in the market. Peer funds are reporting smoother income and better relative returns, while rating agencies remain stable on senior products. The committee wants to know whether the fund should increase exposure, but the risk team notes that liquidity evidence is mostly based on normal-market dealer indications. Your decision must be defensible both to clients and to the risk committee.`,
    options: [
      `A. Aggressively increase structured income exposure.
Allocation change: Broad Equity -5%; Financial +5%; Structured +15%; IG Bonds -5%; Cash/T-bills -10%.`,
      `B. Moderately increase structured income exposure while keeping a liquidity reserve.
Allocation change: Broad Equity 0%; Financial 0%; Structured +7%; IG Bonds -3%; Cash/T-bills -4%.`,
      `C. Maintain current allocation and open a technical review.
Allocation change: Broad Equity 0%; Financial 0%; Structured 0%; IG Bonds 0%; Cash/T-bills 0%.`,
      `D. Reduce structured exposure and raise cash.
Allocation change: Broad Equity 0%; Financial 0%; Structured -10%; IG Bonds +5%; Cash/T-bills +5%.`
    ]
  },
  {
    title: "Phase 3: Boom & FOMO",
    timeline: "Phase 3 — Boom & FOMO",
    marketData: [
      { label: "Broad Equity Index", value: "+9.4% YTD", note: "" },
      { label: "Financial Sector Basket", value: "+12.8% YTD", note: "" },
      { label: "Structured Income Products", value: "+9.1% YTD", note: "" },
      { label: "Investment-Grade Bonds", value: "+2.4% YTD", note: "" },
      { label: "Cash / Treasury Bills", value: "+1.2% YTD", note: "" }
    ],
    news: [
      `Credit Products Stay Popular as Investors Search for “Low-Volatility” Returns
Subtitle: Senior-rated structures continue to post positive carry even as weaker borrower pools receive more attention.
Credit products remained attractive to investors seeking income with limited day-to-day price movement. Senior-rated structures continued to trade close to model values, and several desks reported normal demand for cleaner collateral pools.
By this phase, the Broad Equity Index has risen +9.4% YTD, while the Financial Sector Basket has gained +12.8% YTD and Structured Income Products remain positive at +9.1% YTD. Defensive assets continue to lag, with Investment-Grade Bonds at +2.4% YTD and Cash/Treasury Bills at +1.2% YTD.
At the same time, a few smaller lenders and lower-quality pools showed weaker payment trends, raising debate over whether recent problems are isolated or the start of broader deterioration.
Top signals: Senior product performance: Still positive; Weak-pool stress: More visible; Dealer tone: Constructive but selective; Investor demand: Still present; Systemic interpretation: Disputed`,
      `Smaller Credit Firms Face Questions as Late Payments Edge Higher
Subtitle: The market debates whether weaker borrower performance is contained or an early warning for structured portfolios.
A group of smaller credit firms faced questions after late payments increased in lower-quality borrower pools. Larger institutions argued that senior-rated securities remain protected by structural subordination and diversified collateral.
The broader market has not yet moved into panic. Financial-sector assets remain up +12.8% YTD, and structured income products are still up +9.1% YTD, suggesting investors continue to separate isolated borrower weakness from systemic risk.
Skeptics countered that pool-level deterioration can matter if refinancing conditions tighten. For now, broad market pricing still implies containment rather than systemic stress.
Top signals: Late payments: Higher in weak pools; Senior protection: Still cited; Refinancing concern: Emerging; Broad pricing: Still contained; Market disagreement: Increasing`,
      `When Everyone Owns the Same “Safe” Trade, Who Buys First in a Sell-Off?
Subtitle: Crowding concerns rise, but investors remain divided on whether liquidity risk matters without clear credit losses.
Structured income has become a crowded trade among yield-seeking investors. Some strategists warned that liquidity can disappear even before credit losses become obvious, especially if many portfolios hold similar assets.
The trade still looks profitable: Structured Income Products have returned +9.1% YTD, outperforming Investment-Grade Bonds at +2.4% YTD and Cash/Treasury Bills at +1.2% YTD. That performance gap makes reducing exposure difficult for managers under client scrutiny.
Others dismissed the concern, arguing that senior cash flows remain strong and that temporary price moves should not force long-term investors to sell. The result is a market that looks profitable but harder to exit.
Top signals: Trade crowding: High; Exit-liquidity concern: Rising; Senior-cash-flow confidence: Still high; Investor disagreement: Strong; Observable losses: Still limited`
    ],
    topStories: [
      ["Senior structured products continue to post positive carry", "Weak borrower pools draw more analyst attention", "Dealers remain constructive but more selective"],
      ["Late payments rise in lower-quality borrower segments", "Senior protection remains the central defense for credit products", "Market pricing still points to contained stress"],
      ["Crowded positioning raises exit-liquidity questions", "Investors debate whether senior cash flows are enough", "Cash and bonds continue to lag the credit trade"]
    ],
    posts: [
      `YieldHunter88: Structured income still green, financials still leading, and people are calling the top again. Maybe weak lenders are just weak lenders?
Comments: Senior pieces are not junior trash. / Every cycle has noise. / If you sell every headline, you own only T-bills.`,
      `MacroNerd: The first cracks never look systemic. They look like “just a few weak pools.” The real question is whether everyone is using the same exit assumption.
Comments: Maybe contained, maybe not. / Liquidity is always abundant until every holder needs it together.`,
      `DeskRumors: Hearing junior pieces are getting marked wider, but senior stuff still has buyers if the collateral is clean. Nobody wants the messy pools though.
Comments: Selectivity is back. / Not a market freeze, but not the old easy bid either.`
    ],
    emails: [
      `Subject: Committee follow-up — do we stay with the trade?
From: Maya Collins <maya.collins@harborpoint.com>
Time: 10:05 AM
NorthLake’s consultant sent another peer comparison. They understand there are weak borrower pools, but they are asking why senior-rated exposure should be reduced when returns are still positive and realized losses remain limited. We need a view that can defend either staying invested or reducing exposure without sounding reactive.`,
      `Subject: Watchlist update — borrower pool performance
From: Risk System <risk.system@harborpoint.com>
Time: 09:27 AM
Lower-quality borrower pools show weaker payment trends than last quarter. Senior-rated exposures remain within modeled protection levels under base-case assumptions, but correlation between weak pools has increased. Recommend reviewing concentration by collateral type and expected exit route before adding exposure.`
    ],
    inboxPreview: `Sender: Maya Collins — Committee follow-up — do we stay with the trade?
Sender: Risk System — Watchlist update — borrower pool performance
Unread: 2
Priority flags: Peer comparison; senior protection still modeled; weak-pool trend deteriorating`,
    chats: [
      `Risk Review
Lena: The data is getting less clean. Weak pools are no longer one-off headlines.
You: Are senior positions still protected?
Lena: Under the base case, yes. But protection depends on assumptions about correlation, refinancing, and exit timing.
You: So the problem is uncertainty?
Lena: Exactly. Not proof of disaster, but less room for confidence.`,
      `Market Desk
Jon: We’re seeing more pushback on junior pieces, but senior names still trade.
You: Are buyers stepping away?
Jon: Not broadly. They are just more selective.
You: Does selectivity mean risk is rising?
Jon: It means the easy bid is not universal anymore. That is different from a freeze.`,
      `Client Relations
Maya: NorthLake’s consultant sent another peer table. They are underlining the funds with higher structured income returns.
You: Are they ignoring the weaker pools?
Maya: They see them, but they think senior exposure is different.
You: What worries you?
Maya: If we cut too early and peers keep winning, we look defensive for no reason.`
    ],
    files: [
      `credit_pool_performance_note.pdf
Preview: Research note · 6 pages. Summarizes recent borrower-pool performance, rating-agency updates, and senior-tranche protection logic. Includes a contained-stress interpretation and an alternative watchlist interpretation.`,
      `exit_liquidity_stress_appendix.pdf
Preview: Technical appendix · 10 pages. Contains scenario tables for exit timing, trade-size discounts, correlation assumptions, and peer-selling conditions across senior and junior structured exposures.`
    ],
    decisionPrompt: `Structured income products are still profitable, and senior-rated products continue to look resilient. However, weaker borrower pools are no longer isolated headlines, and crowding is making exit assumptions harder to evaluate. The committee needs a decision before the next client update. Your choice should address whether to keep harvesting carry, slow the trade, reduce selected exposures, or derisk more decisively.`,
    options: [
      `A. Continue increasing structured income and financial-sector exposure.
Allocation change: Broad Equity -5%; Financial +5%; Structured +10%; IG Bonds -5%; Cash/T-bills -5%.`,
      `B. Maintain current structured exposure, stop new buying, and keep the liquidity buffer intact.
Allocation change: Broad Equity 0%; Financial 0%; Structured 0%; IG Bonds 0%; Cash/T-bills 0%.`,
      `C. Reduce the most liquidity-sensitive structured exposure while keeping senior, cleaner positions.
Allocation change: Broad Equity 0%; Financial -3%; Structured -7%; IG Bonds +5%; Cash/T-bills +5%.`,
      `D. Cut structured and financial exposure materially before broader market stress becomes visible.
Allocation change: Broad Equity 0%; Financial -10%; Structured -15%; IG Bonds +10%; Cash/T-bills +15%.`
    ]
  },
  {
    title: "Phase 4: Mixed Signals",
    timeline: "Phase 4 — Mixed Signals",
    marketData: [
      { label: "Broad Equity Index", value: "+5.2% YTD", note: "" },
      { label: "Financial Sector Basket", value: "+2.6% YTD", note: "" },
      { label: "Structured Income Products", value: "+1.8% YTD", note: "" },
      { label: "Investment-Grade Bonds", value: "+3.1% YTD", note: "" },
      { label: "Cash / Treasury Bills", value: "+1.5% YTD", note: "" }
    ],
    news: [
      `Credit Markets Remain Open, but Pricing Confidence Begins to Fray
Subtitle: Dealers still quote many products, yet managers report wider differences between model marks and executable bids.
Credit markets remained open after recent volatility, and some structured products recovered part of their earlier spread widening. Supporters argued that senior cash flows remain protected and that patient investors may benefit from temporary discounts.
Even so, the market tone has changed. Broad Equity gains have cooled to +5.2% YTD, the Financial Sector Basket is up only +2.6% YTD, and Structured Income Products have slowed to +1.8% YTD. Defensive assets have become more competitive, with Investment-Grade Bonds up +3.1% YTD and Cash/Treasury Bills up +1.5% YTD.
However, several portfolio managers said marks now depend more heavily on dealer assumptions, collateral type, and trade size, making reported prices harder to compare across funds.
Top signals: Market access: Open but thinner; Senior cash-flow confidence: Mostly intact; Quote dispersion: Rising; Trade-size sensitivity: Higher; Recovery narrative: Plausible but fragile`,
      `Analysts Split Over Whether Recent Credit Weakness Is a Buying Opportunity
Subtitle: Some desks see oversold credit, while others warn that liquidity is becoming more dependent on dealer balance sheets.
Analysts were divided after recent credit volatility. Several desks argued that spread widening has created attractive entry points in senior and higher-quality structured products, particularly for investors not reliant on leverage.
At the same time, performance momentum has weakened: Structured Income Products are now only +1.8% YTD, and financial-sector returns have fallen to +2.6% YTD. That leaves little cushion against further repricing, especially compared with Investment-Grade Bonds at +3.1% YTD.
Others warned that liquidity is becoming less automatic, with bids varying by dealer, collateral pool, and trade size. The disagreement has made allocation decisions harder to justify either way.
Top signals: Buying-opportunity view: Present; Liquidity caution: Rising; Dealer-dependence: Higher; Senior-quality preference: Strong; Decision ambiguity: High`,
      `Fund Managers Face Harder Trade-Off as Performance Pressure Meets Risk Control
Subtitle: Cutting exposure may look prudent later, but premature derisking could damage returns and client confidence now.
Fund managers are divided over whether to reduce structured credit exposure after recent volatility. Some committees want to preserve performance because several products continue to pay income and have not suffered realized losses.
But the performance gap that supported risk-taking has narrowed. Structured Income Products are up +1.8% YTD, only slightly ahead of Cash/Treasury Bills at +1.5% YTD and behind Investment-Grade Bonds at +3.1% YTD. The argument for holding risk is therefore less obvious than in earlier phases.
Others want to raise liquidity before market depth is tested further. The challenge is timing: derisk too early and the fund may underperform; wait too long and exits may become expensive.
Top signals: Performance pressure: Still present; Realized losses: Limited; Liquidity planning: More urgent; Timing risk: High; Committee disagreement: Likely`
    ],
    topStories: [
      ["Dealer quote dispersion widens across structured products", "Senior cash-flow confidence remains mostly intact", "Reported marks become harder to compare across funds"],
      ["Desks debate whether spread widening is a buying opportunity", "Dealer balance sheets become more important to liquidity", "Higher-quality senior collateral attracts selective interest"],
      ["Committees weigh performance protection against liquidity planning", "Cash and investment-grade bonds regain relevance", "Managers face reputational risk whichever action they choose"]
    ],
    posts: [
      `YieldHunter88: Spreads widened, then tightened a bit. Feels like people panicked and now want back in quietly.
Comments: Patient money wins. / If you can hold to maturity, why sell? / Liquidity risk matters only if you need to exit today.`,
      `MacroNerd: A model mark is a useful estimate, not a promise from a buyer. If dealers quote different levels for the same thing, the range is information too.
Comments: Not every cheap asset is mispriced. / Trade size matters more than people admit.`,
      `CreditDeskGuy: Not a crash, not clean either. Some accounts are bidding, but they want smaller size, better collateral, and a discount for uncertainty.
Comments: Price discovery is getting weird. / Screen quotes look calmer than actual conversations.`
    ],
    emails: [
      `Subject: Committee follow-up — do recent spread moves change our allocation view?
From: Maya Collins <maya.collins@harborpoint.com>
Time: 09:48 AM
The committee is split. Some members think the recent rebound proves that last week’s widening was an overreaction. Others want to raise liquidity before exits become more difficult. Please prepare a recommendation that explains the trade-off between protecting performance and preserving optionality.`,
      `Subject: Risk flag — quote dispersion and valuation confidence
From: Risk System <risk.system@harborpoint.com>
Time: 08:44 AM
No formal risk breach. However, quote dispersion has increased across several structured holdings, particularly where collateral data is less transparent. Reported NAV may remain defensible, but executable price confidence is lower for larger trade sizes. Recommend separating mark-to-model confidence from liquidation confidence.`
    ],
    inboxPreview: `Sender: Maya Collins — Committee follow-up — do recent spread moves change our allocation view?
Sender: Risk System — Risk flag — quote dispersion and valuation confidence
Unread: 2
Priority flags: Committee split; rebound narrative; executable-price uncertainty`,
    chats: [
      `Risk Review
Lena: I am less worried about headline return than confidence around the marks.
You: We still have quotes though.
Lena: Yes, but quote quality varies. Small size, clean collateral, patient seller — fine. Large size, messy collateral, urgent seller — different market.
You: So we need separate performance from liquidity.
Lena: That is the decision.`,
      `Market Desk
Jon: Some structured names are cheaper today. Buyers with nerves are asking for lists.
You: Real bids or fishing?
Jon: Both. Clean senior paper has interest. Messy pools get lowball bids.
You: Could we sell if we had to?
Jon: Yes, but price depends heavily on urgency and size.`,
      `Committee Prep
Maya: We need a recommendation we can defend if the market stabilizes next week and if it gets worse next month.
You: That is two different worlds.
Maya: Exactly. Selling now may look smart later or embarrassing immediately. Holding may preserve returns or trap us.
You: So the language matters.
Maya: The logic matters more.`
    ],
    files: [
      `structured_credit_watchlist.pdf
Preview: Research note · 7 pages. Explains recent spread moves, dealer commentary, and differences between clean senior collateral and weaker pools. Includes arguments for both selective adding and cautious liquidity building.`,
      `valuation_liquidity_appendix.pdf
Preview: Technical appendix · 10 pages. Contains mark-to-model inputs, dealer quote ranges, collateral transparency scores, and liquidation-confidence bands under alternative market-depth assumptions.`
    ],
    decisionPrompt: `The market has partially stabilized after recent volatility, so cutting risk now could look premature if spreads continue to recover. At the same time, quote dispersion and trade-size sensitivity suggest that liquidity may be worse than headline marks imply. The committee is split between protecting performance and preserving optionality. Your recommendation must explain what risk you are willing to accept.`,
    options: [
      `A. Add selectively to spread-widened structured exposure.
Allocation change: Broad Equity -5%; Financial 0%; Structured +10%; IG Bonds -5%; Cash/T-bills 0%.`,
      `B. Keep current allocation unchanged and intensify monitoring of spreads, dealer quotes, and redemption risk.
Allocation change: Broad Equity 0%; Financial 0%; Structured 0%; IG Bonds 0%; Cash/T-bills 0%.`,
      `C. Keep some structured exposure, but reduce weaker risk positions and build cash gradually.
Allocation change: Broad Equity -5%; Financial -5%; Structured -10%; IG Bonds +5%; Cash/T-bills +15%.`,
      `D. Exit a large share of structured income exposure now and rotate into liquid assets.
Allocation change: Broad Equity -5%; Financial -10%; Structured -20%; IG Bonds +10%; Cash/T-bills +25%.`
    ]
  },
  {
    title: "Phase 5: Market Stress",
    timeline: "Phase 5 — Market Stress",
    marketData: [
      { label: "Broad Equity Index", value: "-3.8% YTD", note: "" },
      { label: "Financial Sector Basket", value: "-14.5% YTD", note: "" },
      { label: "Structured Income Products", value: "-12.0% YTD", note: "" },
      { label: "Investment-Grade Bonds", value: "+4.8% YTD", note: "" },
      { label: "Cash / Treasury Bills", value: "+1.9% YTD", note: "" }
    ],
    news: [
      `Credit Funds Face Redemption Pressure as Liquidity Conditions Tighten
Subtitle: Funds with complex holdings face harder choices as clients ask for cash and lenders demand more collateral.
Several credit-oriented funds faced redemption requests and higher collateral requirements as lenders reviewed exposures to structured products. Managers stressed that some assets may be fundamentally money-good if held to maturity, but near-term liquidity has become more important than model value.
Market performance now reflects the pressure. The Broad Equity Index has slipped to -3.8% YTD, the Financial Sector Basket is down -14.5% YTD, and Structured Income Products have fallen -12.0% YTD. In contrast, Investment-Grade Bonds are up +4.8% YTD and Cash/Treasury Bills are up +1.9% YTD.
Defensive funds with cash reserves reported new interest from clients, while yield-focused funds argued that forced selling could destroy long-term value.
Top signals: Redemption requests: Rising; Collateral calls: Increasing; Hold-to-maturity argument: Still used; Cash demand: Stronger; Forced-sale risk: High`,
      `Short-Term Funding Costs Jump as Lenders Demand More Collateral
Subtitle: Haircuts rise for complex collateral, but some managers say the pressure is technical rather than fundamental.
Short-term funding costs rose as lenders demanded additional collateral against structured holdings and financial-sector exposures. Funds with liquid assets met calls more easily, while leveraged portfolios faced difficult choices.
Losses have become visible: Financial-sector assets are down -14.5% YTD and Structured Income Products are down -12.0% YTD. Those declines increase collateral pressure and make it harder to separate temporary funding stress from solvency concerns.
Some managers argued that higher haircuts reflect temporary balance-sheet caution, not permanent credit impairment. Others warned that temporary funding pressure can become permanent if forced sales push marks lower.
Top signals: Funding cost: Higher; Haircuts: Rising; Liquid-asset advantage: Clear; Technical-pressure argument: Still credible; Feedback-loop risk: Increasing`,
      `“Liquidity Is the Position”: Defensive Funds Gain New Relevance
Subtitle: Cash-rich portfolios regain credibility, but aggressive derisking may still look costly if markets stabilize.
Funds with larger cash and government-bond allocations regained attention as liquidity became scarce. Some clients now value immediate cash access more than reported yield, especially where redemption needs are uncertain.
Defensive assets are now leading: Investment-Grade Bonds are up +4.8% YTD and Cash/Treasury Bills are up +1.9% YTD, while Broad Equity is down -3.8% YTD and credit-linked risk assets have declined sharply.
Yet aggressive derisking remains controversial because selling into stressed markets can lock in losses, reduce future income, and make a fund look as if it is reacting late.
Top signals: Cash value: Rising; Client priorities: Shifting; Selling cost: Material; Future income loss: Concern; Stabilization risk: Still possible`
    ],
    topStories: [
      ["Credit funds face rising redemption requests", "Collateral calls increase pressure on complex holdings", "Defensive funds attract clients seeking cash access"],
      ["Haircuts rise on structured-credit collateral", "Leveraged portfolios face tougher financing terms", "Funding pressure risks becoming a forced-sale loop"],
      ["Cash-rich funds regain credibility during stress", "Investment-grade bonds outperform risky credit assets", "Managers debate whether selling now locks in losses"]
    ],
    posts: [
      `YieldHunter88: This drawdown is ugly, but dumping senior paper at fire-sale levels feels like giving free money to stronger hands.
Comments: Forced sellers create bargains. / Unless redemptions hit, I would rather wait. / The hard part is knowing who has to sell.`,
      `MacroNerd: Funding stress can turn a valuation debate into a cash problem. The asset can be fine long-term and still be impossible to finance short-term.
Comments: This is where leverage changes the story. / “Hold to maturity” needs cash to hold.`,
      `CreditDeskGuy: Dealer quote is not the same as executable price. If you need real size today, the bid changes. If you can wait, maybe the mark is not crazy.
Comments: Liquidity depends on urgency. / Everyone says they are long-term until clients ask for cash.`
    ],
    emails: [
      `Subject: URGENT — liquidity plan before market close
From: Maya Collins <maya.collins@harborpoint.com>
Time: 11:12 AM
We have redemption questions from two clients and a collateral request from one financing counterparty. The board wants to know how much cash we can raise without looking like forced sellers. Please prepare a plan that balances client confidence, realized losses, and liquidity coverage over the next two weeks.`,
      `Subject: Margin and liquidity warning — structured holdings
From: Risk System <risk.system@harborpoint.com>
Time: 10:31 AM
Margin requirements increased on structured holdings and financial-sector collateral. Current liquidity coverage is adequate only if redemptions remain near expected levels and liquid assets can be sold without major discount. A forced sale of complex holdings would likely occur below current marks.`
    ],
    inboxPreview: `Sender: Maya Collins — URGENT — liquidity plan before market close
Sender: Risk System — Margin and liquidity warning — structured holdings
Unread: 2
Priority flags: Redemption questions; collateral call; forced-sale discount risk`,
    chats: [
      `Risk Review
Lena: The problem is no longer just valuation confidence. It is cash timing.
You: Could selling now overreact?
Lena: Absolutely. But if redemptions and margin calls arrive together, not selling can also become a decision.
You: What is the least bad path?
Lena: Raise enough liquidity without advertising distress or destroying the whole portfolio.`,
      `Market Desk
Jon: Bids are still there for cleaner senior names. Lower-quality and complex stuff is much harder.
You: If we need cash today, what sells?
Jon: Government bonds, broad equities, maybe clean senior paper. The problem is that selling liquid assets leaves the hard stuff behind.
You: So liquidity quality matters.
Jon: Exactly.`,
      `Committee Prep
Maya: I need language for the committee. Are we protecting capital or admitting we were late?
You: Both interpretations are possible.
Maya: Clients hate forced selling, but they also hate hearing that cash was not available when needed.
You: So we need liquidity without panic.
Maya: And a story that survives tomorrow’s questions.`
    ],
    files: [
      `funding_stress_brief.pdf
Preview: Research note · 6 pages. Explains funding pressure, margin mechanics, redemption timing, and the difference between hold-to-maturity value and near-term cash needs. Includes liquidity coverage scenarios.`,
      `forced_selling_scenario.pdf
Preview: Technical appendix · 9 pages. Contains cash-waterfall scenarios, margin-call timing, estimated execution discounts, and sequencing options for liquid assets versus complex structured positions.`
    ],
    decisionPrompt: `Liquidity stress is now affecting the fund. Redemptions and collateral calls may require cash before complex holdings can be sold at reasonable levels. Some assets may still have long-term value, but holding them requires enough liquidity to survive near-term pressure. Your decision must balance cash generation, realized losses, client confidence, and the risk of leaving the portfolio with only hard-to-sell positions.`,
    options: [
      `A. Preserve long-term value and avoid forced liquidation of assets trading below model value.
Allocation change: Broad Equity -5%; Financial 0%; Structured 0%; IG Bonds -5%; Cash/T-bills +10%.`,
      `B. Raise cash by selling broad equities and high-quality bonds while avoiding structured sales.
Allocation change: Broad Equity -10%; Financial 0%; Structured 0%; IG Bonds -10%; Cash/T-bills +20%.`,
      `C. Sell a controlled amount of structured exposure and financial-sector risk, then rebuild liquidity.
Allocation change: Broad Equity -5%; Financial -10%; Structured -15%; IG Bonds +5%; Cash/T-bills +25%.`,
      `D. Reduce structured exposure aggressively and move into cash/T-bills and investment-grade bonds.
Allocation change: Broad Equity -5%; Financial -15%; Structured -25%; IG Bonds +15%; Cash/T-bills +30%.`
    ]
  },
  {
    title: "Phase 6: Crash & Reveal",
    timeline: "Phase 6 — Crash & Reveal",
    marketData: [
      { label: "Broad Equity Index", value: "-22.5% YTD", note: "" },
      { label: "Financial Sector Basket", value: "-38.0% YTD", note: "" },
      { label: "Structured Income Products", value: "-32.0% YTD", note: "" },
      { label: "Investment-Grade Bonds", value: "+6.5% YTD", note: "" },
      { label: "Cash / Treasury Bills", value: "+2.4% YTD", note: "" }
    ],
    news: [
      `Large Market Intermediary Fails to Secure Rescue Deal as Credit Markets Seize Up
Subtitle: Confidence breaks after a year of rolling interventions, failed rescues, and recurring funding stress.
A major market intermediary failed to secure support, triggering a sharp reassessment of counterparty risk across credit markets. Dealers reduced balance-sheet commitments, funding lines were reviewed, and complex assets became difficult to sell except at distressed levels.
Market losses are now severe. The Broad Equity Index is down -22.5% YTD, the Financial Sector Basket has fallen -38.0% YTD, and Structured Income Products are down -32.0% YTD. Defensive assets are the rare positive segment, with Investment-Grade Bonds up +6.5% YTD and Cash/Treasury Bills up +2.4% YTD.
Authorities discussed emergency liquidity measures, but investors remained unsure whether support would reach private portfolios in time to meet margin calls and client withdrawals.
Top signals: Counterparty confidence: Broken; Dealer balance sheet: Constrained; Emergency support: Possible but uncertain; Private portfolio liquidity: Weak; Forced-sale risk: Severe`,
      `Forced Selling Accelerates as Margin Calls Hit Leveraged Credit Portfolios
Subtitle: Funds sell what they can, not necessarily what they want, as cash becomes more valuable than model marks.
Forced selling accelerated across leveraged credit portfolios as margin calls and investor withdrawals collided. Managers attempted to preserve senior and higher-quality assets, but liquid positions were often sold first because buyers were still available there.
The sell-off has moved far beyond isolated credit weakness. Financial-sector assets are down -38.0% YTD and Structured Income Products have fallen -32.0% YTD, while broad equities have dropped -22.5% YTD. The demand for cash and government securities has intensified.
This created a difficult trade-off: selling safe assets raises cash quickly, while selling complex assets may crystallize deep discounts and signal distress to clients.
Top signals: Margin calls: Severe; Liquid-asset sales: Common; Distress signaling: Important; Complex-asset bids: Weak; Portfolio trade-off: Extreme`,
      `Authorities Prepare Emergency Liquidity Measures as Market Confidence Breaks
Subtitle: Policy support may calm markets eventually, but fund-level survival still depends on immediate cash and counterparty access.
Authorities prepared emergency liquidity measures as confidence deteriorated across funding and credit markets. Investors debated whether policy support would stabilize prices or merely slow the adjustment.
The policy discussion comes as risky assets face deep losses: broad equities are down -22.5% YTD, financials are down -38.0% YTD, and structured products are down -32.0% YTD. Cash and Treasury bills have become a survival asset, not merely a low-return allocation.
For portfolio managers, the immediate question was more practical: whether they had enough cash, acceptable collateral, and client communication to survive before broader rescue measures could take effect.
Top signals: Policy support: Likely but uncertain; Market confidence: Broken; Fund-level cash need: Immediate; Counterparty access: Critical; Timing gap: Dangerous`
    ],
    topStories: [
      ["Major intermediary failure breaks counterparty confidence", "Dealers reduce balance-sheet commitments across credit markets", "Investors rush toward cash and government securities"],
      ["Margin calls force funds to sell liquid assets first", "Complex credit bids weaken as urgency rises", "Portfolio managers weigh cash needs against distress signaling"],
      ["Emergency liquidity measures move into policy discussion", "Fund-level survival still depends on immediate cash access", "Client communication becomes part of crisis management"]
    ],
    posts: [
      `YieldHunter88: Okay this is not normal anymore. Even good names are getting questioned. Still, selling everything today might be the worst possible execution.
Comments: Cash is king but panic has a price. / Need to survive first. / Hard to know what “fair value” even means now.`,
      `MacroNerd: This was never just one bad asset class. It is leverage, opacity, marks, funding, and confidence hitting each other at once.
Comments: Policy can help markets, but not every portfolio. / Liquidity is a survival variable now.`,
      `CreditDeskGuy: Real talk: a quote is not liquidity, a model price is not cash, and a policy headline is not a buyer for your exact position.
Comments: Treasury bills have a real bid. / Complex credit has a conversation. / Survival beats elegance today.`
    ],
    emails: [
      `Subject: URGENT — liquidity plan needed before client call
From: Maya Collins <maya.collins@harborpoint.com>
Time: 07:35 AM
NorthLake wants a call before noon. They are worried about counterparty exposure, redemption timing, and whether our marks reflect executable prices. The board needs a survival plan: immediate cash sources, what we will not sell at distressed levels, and how we communicate without creating panic.`,
      `Subject: Critical risk breach — liquidity and counterparty exposure
From: Risk System <risk.system@harborpoint.com>
Time: 06:58 AM
Critical breach triggered. Counterparty limits, liquidity coverage, and quote reliability have deteriorated simultaneously. Current marks should not be treated as executable prices for large trades. Immediate actions required: preserve cash, confirm funding lines, reduce weakest exposures where bids exist, and document client communication.`
    ],
    inboxPreview: `Sender: Maya Collins — URGENT — liquidity plan needed before client call
Sender: Risk System — Critical risk breach — liquidity and counterparty exposure
Unread: 2
Priority flags: Client call; counterparty limits; survival plan required`,
    chats: [
      `Risk Review
Lena: The issue is no longer early warning. The stress is here.
You: Is there any clean answer?
Lena: No. Sell too much and we lock in panic prices. Sell too little and we may fail liquidity needs.
You: What matters first?
Lena: Survival, documentation, client trust, and knowing which positions still have real bids.`,
      `Market Desk
Jon: Treasury bills are bid like crazy. Anything complex is being negotiated one call at a time.
You: Can we sell structured assets?
Jon: Some, but not at yesterday’s marks and not in unlimited size.
You: What about financial-sector positions?
Jon: Liquid names trade, but prices are moving violently. Execution risk is huge.`,
      `Committee Prep
Maya: We need a decision the board can defend tomorrow morning.
You: Defensive action may look like panic.
Maya: Inaction may look worse if redemptions accelerate.
You: What do clients need to hear?
Maya: That we know what can be sold, what should not be dumped, and how long our cash lasts.`
    ],
    files: [
      `emergency_liquidity_report.pdf
Preview: Crisis note · 6 pages. Estimates cash needs under redemption, margin, and counterparty stress. Separates liquid assets, saleable risk assets, and complex positions that may require negotiated exits.`,
      `systemic_exposure_appendix.pdf
Preview: Technical appendix · 11 pages. Contains counterparty map, funding-line status, liquidity runway estimates, quote-reliability classifications, and emergency-action thresholds.`
    ],
    decisionPrompt: `The market has moved from stress to systemic crisis after a major intermediary failed to secure support. The fund needs a survival decision under extreme uncertainty. Selling everything may raise cash but lock in distressed prices and alarm clients. Holding complex assets may preserve future value but risks a liquidity failure. Your decision must prioritize survival while remaining explainable to the board and clients.`,
    options: [
      `A. Sell structured income and financial-sector exposure aggressively to raise immediate cash.
Allocation change: Broad Equity 0%; Financial -15%; Structured -25%; IG Bonds +10%; Cash/T-bills +30%.`,
      `B. Raise liquidity using the most liquid assets first, reduce weakest structured exposure only where real bids exist.
Allocation change: Broad Equity -10%; Financial -5%; Structured -10%; IG Bonds +5%; Cash/T-bills +20%.`,
      `C. Preserve distressed structured positions, suspend discretionary risk-taking, and negotiate funding lines.
Allocation change: Broad Equity -5%; Financial -5%; Structured 0%; IG Bonds 0%; Cash/T-bills +10%.`,
      `D. Raise cash, freeze new risk-taking, communicate transparently with clients, and seek backup liquidity lines.
Allocation change: Broad Equity -10%; Financial -10%; Structured -15%; IG Bonds +5%; Cash/T-bills +30%.`
    ]
  }
];

/* =========================
   STATE
========================= */

let gameState = {};
let selectedDecision = null;
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
    documentsRead: [],
    emailReplies: {},
    socialReplies: {},
    chatReplies: {},
    decisionLog: [],
    lastOutcomeText: "",
    allocation: {
      broadEquity: 0.40,
      financial: 0.10,
      structured: 0.05,
      bonds: 0.25,
      cash: 0.20
    }
  };
}

/* =========================
   DATA PARSERS
========================= */

function parseNewsCell(text, phaseIndex, newsIndex, customTopStories = null) {
  const lines = String(text || "").split(/\n+/).map(x => x.trim()).filter(Boolean);
  const headline = lines[0] || `News ${newsIndex}`;
  let subtitle = "";
  const body = [];
  let stories = [];

  lines.slice(1).forEach(line => {
    if (/^Subtitle:/i.test(line)) {
      subtitle = line.replace(/^Subtitle:\s*/i, "");
    } else if (/^Top stories:/i.test(line)) {
      const raw = line.replace(/^Top stories:\s*/i, "");
      stories = raw.split(/;|\|/).map(x => x.trim()).filter(Boolean);
    } else if (/^Top signals:/i.test(line)) {
      // Hidden design cue only. Do not display in the news UI.
    } else {
      body.push(line);
    }
  });

  if (customTopStories && customTopStories.length) stories = customTopStories;

  return {
    brand: newsIndex === 1 ? "MARKET WATCH" : newsIndex === 2 ? "CREDIT DAILY" : "FINANCIAL TIMES",
    url: `https://freefall.local/p${phaseIndex}/news-${newsIndex}`,
    headline,
    subtitle,
    date: `Phase ${phaseIndex} update`,
    body,
    stories: stories.length ? stories : ["Market conditions remain uncertain", "Investors review liquidity risk", "Committees debate allocation strategy"],
    image: `asset/p${phaseIndex}-n${newsIndex}.jpg`
  };
}

function parsePostCell(text, index) {
  const source = String(text || "").trim();
  const lines = source.split(/\n+/).map(x => x.trim()).filter(Boolean);
  const firstLine = lines.shift() || `MarketUser${index}: Market update.`;
  const colon = firstLine.indexOf(":");
  const name = colon > -1 ? firstLine.slice(0, colon).trim() : `MarketUser${index}`;
  const message = colon > -1 ? firstLine.slice(colon + 1).trim() : firstLine;
  const commentsLine = lines.find(line => /^Comments:/i.test(line)) || "";
  const comments = commentsLine
    ? commentsLine.replace(/^Comments:\s*/i, "").split("/").map(x => x.trim()).filter(Boolean)
    : ["This is what the market is debating.", "Not everyone agrees."];

  return {
    name,
    handle: `@${name.replace(/[^a-zA-Z0-9]/g, "") || "market"}`,
    text: message,
    comments,
    stats: `${80 + index * 45} replies · ${300 + index * 210} reposts · ${1200 + index * 900} likes`
  };
}

function parseEmailCell(text) {
  const lines = String(text || "").split(/\n+/).map(x => x.trim()).filter(Boolean);
  let subject = "Inbox update";
  let sender = "Unknown Sender";
  let email = "unknown@freefall.local";
  let time = "09:00 AM";
  const body = [];

  lines.forEach(line => {
    if (/^Subject:/i.test(line)) {
      subject = line.replace(/^Subject:\s*/i, "");
    } else if (/^From:/i.test(line)) {
      const raw = line.replace(/^From:\s*/i, "");
      const match = raw.match(/^(.*?)\s*<([^>]+)>/);
      if (match) {
        sender = match[1].trim();
        email = match[2].trim();
      } else {
        sender = raw;
      }
    } else if (/^Time:/i.test(line)) {
      time = line.replace(/^Time:\s*/i, "");
    } else {
      body.push(line);
    }
  });

  const joined = body.join(" ");
  return {
    sender,
    email,
    subject,
    preview: joined.length > 120 ? joined.slice(0, 120) + "…" : joined,
    time,
    body
  };
}

function parseChatCell(text) {
  const lines = String(text || "").split(/\n+/).map(x => x.trim()).filter(Boolean);
  const contact = lines.shift() || "Chat";
  const messages = lines.map(line => {
    const colon = line.indexOf(":");
    if (colon > -1) return { from: line.slice(0, colon).trim(), text: line.slice(colon + 1).trim() };
    return { from: "System", text: line };
  });
  return { contact, messages };
}

function parseFileCell(text, phaseIndex, fileIndex) {
  const lines = String(text || "").split(/\n+/).map(x => x.trim()).filter(Boolean);
  const originalName = lines[0] || `p${phaseIndex}-f${fileIndex}.pdf`;
  const preview = lines.slice(1).join(" ").replace(/^Preview:\s*/i, "") || "Phase document.";
  const fileName = `p${phaseIndex}-f${fileIndex}.pdf`;
  const prettyTitle = originalName.replace(/\.pdf$/i, "").replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  return {
    id: `p${phaseIndex}-f${fileIndex}`,
    title: prettyTitle,
    fileName,
    originalName,
    meta: fileIndex === 1 ? "Research note" : "Technical appendix",
    summary: preview,
    sections: [
      { heading: "Preview", text: preview },
      { heading: "Original file label", text: originalName }
    ],
    data: [],
    pdfPath: `asset/${fileName}`
  };
}

function parseDecisionOption(text, optionIndex) {
  const source = String(text || "").trim();
  const lines = source.split(/\n+/).map(x => x.trim()).filter(Boolean);
  const first = lines[0] || `Option ${optionIndex}`;
  const textOnly = first.replace(/^[A-D]\.\s*/i, "");
  const allocationLine = lines.find(line => /^Allocation change:/i.test(line)) || "";
  const rationaleLine = lines.find(line => /^Rationale:/i.test(line)) || "";
  const costLine = lines.find(line => /^Cost:/i.test(line)) || "";
  const allocationDelta = parseAllocationDelta(allocationLine);
  const riskScore = estimateRiskScore(allocationDelta, source);

  return {
    id: `option-${optionIndex}`,
    text: textOnly,
    note: [allocationLine, rationaleLine, costLine].filter(Boolean).join("\n"),
    allocationDelta,
    txsDelta: riskScore.txsDelta,
    lqsDelta: riskScore.lqsDelta
  };
}

function parseAllocationDelta(line) {
  const delta = {};
  ASSET_KEYWORDS.forEach(([label, key]) => {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`${escaped}\\s*([+-]?\\d+(?:\\.\\d+)?)%`, "i");
    const match = line.match(regex);
    if (match) delta[key] = Number(match[1]) / 100;
  });
  return delta;
}

function estimateRiskScore(delta, source) {
  const risky = (delta.financial || 0) + (delta.structured || 0);
  const defensive = (delta.cash || 0) + (delta.bonds || 0);
  let txsDelta = Math.round(risky * 140 - defensive * 60);
  let lqsDelta = Math.round(defensive * 90 - risky * 80);

  if (/aggressively|continue increasing|add selectively|increase exposure/i.test(source)) txsDelta += 6;
  if (/reduce|raise cash|freeze|liquidity|communicate transparently|sell structured|derisk/i.test(source)) {
    txsDelta -= 6;
    lqsDelta += 8;
  }

  return {
    txsDelta: clamp(txsDelta, -25, 35),
    lqsDelta: clamp(lqsDelta, -30, 30)
  };
}

function buildPhases() {
  return RAW_PHASES.map((raw, idx) => {
    const phaseIndex = idx + 1;
    return {
      title: raw.title,
      timeline: raw.timeline,
      decisionPrompt: raw.decisionPrompt,
      tasks: {
        news: "Read 3 news updates",
        social: "Check 3 internet posts",
        email: "Open Gmail updates",
        chat: "Read team chats",
        file: "Review 2 files",
        decision: "Make 1 portfolio decision"
      },
      marketData: raw.marketData,
      content: {
        news: raw.news.map((cell, newsIdx) => parseNewsCell(cell, phaseIndex, newsIdx + 1, raw.topStories ? raw.topStories[newsIdx] : null)),
        social: {
          trends: ["#FreeFall", "#CreditRisk", "#Liquidity", "#MarketSignals"],
          posts: raw.posts.map((cell, postIdx) => parsePostCell(cell, postIdx + 1))
        },
        email: raw.emails.map(parseEmailCell),
        chat: raw.chats.map(parseChatCell)
      },
      documents: raw.files.map((cell, fileIdx) => parseFileCell(cell, phaseIndex, fileIdx + 1)),
      decisions: raw.options.map((cell, optIdx) => parseDecisionOption(cell, optIdx + 1)),
      transition: phaseIndex === 6 ? "The crisis map ends. Hidden variables are revealed." : `Phase ${phaseIndex + 1} information is now arriving.`
    };
  });
}

const phases = buildPhases();

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
  if (pages[pageName]) pages[pageName].classList.add("active");
}

function setActiveSidebar(tab) {
  currentTab = tab;
  sideButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.tab === tab));
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
  try { return new URL(url).hostname; } catch { return "market.local"; }
}

function getBrandShortName(brand) {
  return brand.replace("THE ", "").replace("MAGAZINE", "Mag").replace("JOURNAL", "Journal").replace("NETWORK", "Network").replace("TIMES", "Times");
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
  return toxicAssets.includes(asset);
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
  selectedDecision = null;
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
      if (currentTab === tab) renderContent(tab);
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
  if (!arrivalCard) return;
  arrivalCard.textContent = `${CHANNEL_LABELS[tab]} update received`;
  arrivalCard.classList.add("show");
  setTimeout(() => arrivalCard.classList.remove("show"), 2200);
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
  renderAllocation();

  if (lastOutcome) {
    if (gameState.lastOutcomeText) {
      lastOutcome.classList.add("show");
      lastOutcome.textContent = gameState.lastOutcomeText;
    } else {
      lastOutcome.classList.remove("show");
      lastOutcome.textContent = "";
    }
  }
}

function renderMarketData() {
  const phase = getPhase();
  if (!marketDataGrid) return;
  marketDataGrid.innerHTML = phase.marketData.map(item => `
    <div class="market-card">
      <small>${item.label}</small>
      <strong>${item.value}</strong>
      <span>${item.note || "YTD performance"}</span>
    </div>
  `).join("");
}

function renderAllocation() {
  if (!allocationList) return;
  allocationList.innerHTML = "";

  Object.entries(gameState.allocation).forEach(([asset, weight]) => {
    if (weight <= 0.005) return;
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
    const done = key === "decision" ? Boolean(selectedDecision) : Boolean(viewedChannels[key]);
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

  if (!selectedDecision) {
    nextPhaseBtn.textContent = "Select 1 action";
    nextPhaseBtn.disabled = false;
    return;
  }

  nextPhaseBtn.textContent = gameState.phase === phases.length ? "Finish Simulation" : "Confirm & Continue";
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
        <p>Information arrives automatically over time. Wait for the next notification or return to the current channel.</p>
        <button class="primary-btn" id="go-current-channel">Go to current channel</button>
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
            ${article.image ? `<img class="news-image" src="${article.image}" alt="${escapeHTML(article.headline)}">` : `<div class="news-image-placeholder"></div>`}
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
      if (!gameState.socialReplies[gameState.phase]) gameState.socialReplies[gameState.phase] = {};
      if (!gameState.socialReplies[gameState.phase][index]) gameState.socialReplies[gameState.phase][index] = [];
      gameState.socialReplies[gameState.phase][index].push(input.value.trim());
      input.value = "";
      renderSocial(getPhase().content.social);
    });
  });
}

function renderPost(postItem, index) {
  const replies = gameState.socialReplies[gameState.phase] && gameState.socialReplies[gameState.phase][index]
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
      <div class="post-actions"><span>💬</span><span>↻</span><span>♡</span><span>${postItem.stats}</span></div>
      <div class="comment-box">
        <strong>Comments</strong>
        ${postItem.comments.map(comment => `<div class="comment-item">${comment}</div>`).join("")}
        ${replies.map(reply => `<div class="comment-item user-comment">You: ${escapeHTML(reply)}</div>`).join("")}
        <div class="reply-row">
          <input class="post-reply-input" data-post-index="${index}" placeholder="Reply to this post..." />
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
          <div><strong>${email.sender} &lt;${email.email}&gt;</strong><br><small>to me · ${email.time}</small></div>
        </div>
        <div class="email-body">${email.body.map(paragraph => `<p>${paragraph}</p>`).join("")}</div>
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
    if (!gameState.emailReplies[gameState.phase]) gameState.emailReplies[gameState.phase] = {};
    gameState.emailReplies[gameState.phase][activeEmailIndex] = text;
    const status = document.getElementById("reply-status");
    status.textContent = "Draft saved";
    setTimeout(() => { status.textContent = ""; }, 1600);
  });
}

function getEmailDraft(index) {
  return gameState.emailReplies[gameState.phase] && gameState.emailReplies[gameState.phase][index]
    ? gameState.emailReplies[gameState.phase][index]
    : "";
}

/* =========================
   CHAT
========================= */

function renderChat(conversations) {
  const current = conversations[activeChatIndex];
  const replies = gameState.chatReplies[gameState.phase] && gameState.chatReplies[gameState.phase][activeChatIndex]
    ? gameState.chatReplies[gameState.phase][activeChatIndex]
    : [];

  contentBox.innerHTML = `
    <div class="app-window chat-app">
      <aside class="chat-list">
        ${conversations.map((item, index) => `
          <div class="chat-contact ${index === activeChatIndex ? "active" : ""}" data-chat-index="${index}">
            <strong>${item.contact}</strong>
            <p>${item.messages[item.messages.length - 1]?.text || ""}</p>
          </div>
        `).join("")}
      </aside>
      <main class="chat-window">
        <div class="chat-header">${current.contact}</div>
        <div class="chat-messages">
          ${current.messages.map(message => `
            <div class="message ${message.from === "You" ? "outgoing" : "incoming"}">
              <strong>${message.from}</strong><br>${message.text}
            </div>
          `).join("")}
          ${replies.map(reply => `<div class="message outgoing"><strong>You</strong><br>${escapeHTML(reply)}</div>`).join("")}
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
    if (!gameState.chatReplies[gameState.phase]) gameState.chatReplies[gameState.phase] = {};
    if (!gameState.chatReplies[gameState.phase][activeChatIndex]) gameState.chatReplies[gameState.phase][activeChatIndex] = [];
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
          <div class="file-meta">Click a document to open its PDF preview. These documents contain deeper signals that ordinary headlines may miss.</div>
        </div>
        <div class="document-list">${documents.map(docItem => renderDocCard(docItem)).join("")}</div>
      </main>
    </div>
  `;

  document.querySelectorAll(".doc-card").forEach(card => {
    card.addEventListener("click", () => readDocument(card.dataset.docId));
  });
}

function renderDocCard(docItem) {
  const read = gameState.documentsRead.includes(docItem.id);
  return `
    <div class="doc-card ${read ? "read" : ""}" data-doc-id="${docItem.id}">
      <h3>${read ? "✓ " : ""}${docItem.title}</h3>
      <p>${docItem.summary}</p>
      <div class="doc-meta"><span>${docItem.fileName}</span><span>${docItem.meta}</span></div>
    </div>
  `;
}

function readDocument(docId) {
  const phase = getPhase();
  const docItem = phase.documents.find(item => item.id === docId);
  if (!docItem) return;
  if (!gameState.documentsRead.includes(docItem.id)) gameState.documentsRead.push(docItem.id);
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
      ${docItem.sections.map(section => `<p><strong>${section.heading}:</strong> ${section.text}</p>`).join("")}
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
   DECISION — ONE PROMPT ONLY
========================= */

function renderDecision(phase) {
  contentBox.innerHTML = `
    <div class="decision-screen">
      <div class="phase-context">
        <strong>${phase.title}</strong><br>
        ${phase.decisionPrompt}
      </div>
      <h2>Decision Point</h2>
      <div class="decision-block">
        <h3>Your portfolio decision</h3>
        <p>Choose one action for this phase.</p>
        <div class="choice-list">${phase.decisions.map((decision, index) => renderChoiceButton(decision, index)).join("")}</div>
      </div>
      <div class="decision-help">
        Choose only one action. The allocation effect is applied after you confirm. TXS and LQS are accumulated across phases and revealed in the final result.
      </div>
    </div>
  `;

  document.querySelectorAll(".choice-btn").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      selectedDecision = phase.decisions[index];
      document.querySelectorAll(".choice-btn").forEach(btn => btn.classList.remove("selected"));
      button.classList.add("selected");
      renderTasks();
      updateNextButtonState();
    });
  });
}

function renderChoiceButton(decision, index) {
  const noteHtml = escapeHTML(decision.note || "").replace(/\n/g, "<br>");
  return `
    <button class="choice-btn" data-index="${index}">
      ${String.fromCharCode(65 + index)}. ${decision.text}
      <span class="choice-note">${noteHtml}</span>
    </button>
  `;
}

/* =========================
   SCORING ENGINE
========================= */

function applyAllocationDelta(delta) {
  if (!delta) return;
  const next = { ...gameState.allocation };
  Object.entries(delta).forEach(([asset, change]) => {
    next[asset] = clamp((next[asset] || 0) + change, 0, 1);
  });
  const total = Object.values(next).reduce((sum, value) => sum + value, 0);
  if (total <= 0) return;
  Object.keys(next).forEach(asset => { next[asset] = next[asset] / total; });
  gameState.allocation = next;
}

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

  return totalReturn;
}

function applyDecisionAndAdvance() {
  if (!unlockedChannels.decision) {
    alert("Wait until the decision window opens. Information is still arriving.");
    return;
  }

  if (!selectedDecision) {
    alert("Please choose one decision.");
    setActiveSidebar("decision");
    renderContent("decision");
    return;
  }

  const phase = getPhase();
  const oldPV = gameState.pv;

  applyAllocationDelta(selectedDecision.allocationDelta);

  gameState.txs = clamp(gameState.txs + (selectedDecision.txsDelta || 0), 0, 100);
  gameState.lqs = clamp(gameState.lqs + (selectedDecision.lqsDelta || 0), 0, 100);

  const phaseReturn = calculatePhaseReturn();
  gameState.pv = gameState.pv * (1 + phaseReturn);
  gameState.peakPV = Math.max(gameState.peakPV, gameState.pv);

  gameState.decisionLog.push({
    phase: gameState.phase,
    phaseTitle: phase.title,
    decision: selectedDecision.text,
    pvBefore: oldPV,
    pvAfter: gameState.pv,
    txs: gameState.txs,
    lqs: gameState.lqs
  });

  const change = gameState.pv - oldPV;
  const sign = change >= 0 ? "+" : "";

  gameState.lastOutcomeText =
    `Outcome: ${sign}${formatMoney(change).replace("$", "")}. ` +
    `Liquidity score: ${gameState.lqs}/100. ` +
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
  const disciplined = gameState.decisionLog.filter(log => /cash|liquidity|reduce|freeze|communicate|raise|cut|sell/i.test(log.decision)).length;
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

  return { infoDepth, riskDiscipline, readiness: clamp(readiness, 0, 100) };
}

function determineTier(scores) {
  if (gameState.pv >= 105000 && gameState.txs <= 25 && gameState.lqs >= 70 && scores.infoDepth >= 60) {
    return { title: "Crisis-Ready Strategist", description: "You recognized hidden fragility early, preserved liquidity, and avoided being dragged fully into the boom. You did not maximize every short-term gain, but you survived with enough flexibility to act after the crash." };
  }
  if (gameState.lqs >= 70 && gameState.pv >= 65000) {
    return { title: "Liquidity Survivor", description: "Your return was not perfect, but you preserved liquidity. In a 2008-style crisis, survival capacity matters more than looking brilliant during the boom." };
  }
  if (gameState.pv >= 80000 && gameState.txs <= 55) {
    return { title: "Disciplined Survivor", description: "You absorbed losses but avoided the worst outcome. You were influenced by market pressure at times, yet adjusted before the portfolio became completely fragile." };
  }
  if (gameState.txs > 80 || gameState.pv < 35000 || gameState.lqs < 20) {
    return { title: "Total Exposure", description: "Your portfolio became trapped in toxic exposure, weak liquidity, and delayed risk recognition. The crisis revealed that early gains were compensation for hidden fragility." };
  }
  if (scores.infoDepth < 35 && gameState.txs > 55) {
    return { title: "Model Believer", description: "Your choices looked reasonable on paper, but they relied too heavily on ratings, model prices, and normal-market liquidity. When assumptions failed together, the portfolio lost resilience." };
  }
  return { title: "Caught in the Wave", description: "You saw some signals but reacted too late or too cautiously. This is the typical crisis outcome: not reckless enough to fail immediately, but not prepared enough to avoid heavy damage." };
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
        Decision: ${log.decision}<br>
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

if (startBtn) startBtn.addEventListener("click", () => showPage("case"));
if (caseCard) caseCard.addEventListener("click", () => startGame());
if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    clearPhaseTimers();
    gameState = initialState();
    showPage("landing");
  });
}
if (nextPhaseBtn) nextPhaseBtn.addEventListener("click", () => applyDecisionAndAdvance());

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

if (pdfModalClose) pdfModalClose.addEventListener("click", closePdfModal);
if (pdfModal) {
  pdfModal.addEventListener("click", event => {
    if (event.target === pdfModal) closePdfModal();
  });
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closePdfModal();
});
