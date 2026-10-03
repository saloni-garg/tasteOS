# FindWise: 2 minute 20 second keynote

Open `FindWise-Animated-Keynote.html` in a browser and click Fullscreen. Use arrow keys or Space to advance. Slide 8 has an interactive slider. The PowerPoint contains editable text, cards, radar charts, and speaker notes. Animation lives in the HTML version.

## Rehearsal script

1. **0:00–0:10:** Start with the prepared backpack query on your device. “FindWise helps you decide. And your preferences stay with you.”
2. **0:10–0:20:** “Every category asks us to start again. Different filters, same person.”
3. **0:20–0:35:** “Likes give us clues. We turn them into an editable taste profile. It travels with you.”
4. **0:35–0:50:** “FindWise creates the signals for this decision. Some come from my request, some from my remembered taste. I stay in control.”
5. **0:50–1:00:** “The experts examine different tradeoffs. BAND passes their contributions to later reviewers, so the final advice uses the discussion.”
6. **1:00–1:10:** “The match score explains the tradeoffs. I can see what helped the winner and what it gave up.”
7. **1:10–1:35:** Switch to the prepared hotel flow. “Now I change the category. The profile stays. New criteria fit the new decision. I do not start over.” Pause.
8. **1:35–1:50:** Move a priority slider. “This recomputes in the browser using the same score matrix. No new model call.”
9. **1:50–2:05:** “Moss recalls context, ZooWork runs the reasoning, Tavily gathers evidence, BAND coordinates the council.”
10. **2:05–2:20:** “Search engines help you find what is available. FindWise helps you choose what is right for you.” Stop talking.

## Stage preparation

Sign in to the owner-private app on your own device. Preload likes, taste inference, backpack and hotel decisions. Run live research and the council before the presentation because those workflows can take minutes. Keep this deck ready as your network fallback.

Say once: “The slide examples are illustrative. The live integrations run in our prototype.” The brand scores, radar charts, profile bars, and expert dialogue are presentation examples, not verified product comparisons. Slide 8's HTML slider is a presentation interaction. The app has the actual weighted recalculation.

The animated presentation is standalone and works offline. It contains no credentials and does not call sponsor APIs. It does not modify the website.

## Judge answers

**What is different?** Persistent preference memory, generated decision criteria, and transparent scoring work together across categories.

**Is cross-domain transfer proven?** The mechanism works in the prototype. Recommendation quality still needs user evaluation against a query-only baseline.

**Can preferences be wrong?** Yes. Likes are weak evidence, profiles are editable, and explicit requests override memory.

**Are all experts simultaneous?** No. The real workflow uses six managed experts and routed review. Later reviewers read earlier contributions.

**Did you implement LORE?** No. We use interpretable preferences and Moss retrieval.

**What comes next?** Test usefulness, decision time, and correction rate with users, and improve live workflow latency.
