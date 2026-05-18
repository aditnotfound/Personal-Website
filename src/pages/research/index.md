---
layout: ../../layouts/ResearchLayout.astro
title: Research
description: Adit Research Labs — cognitive science and agent-based epistemic contagion work.
---

<h1 class="research-title">Cognitive science, slowly.</h1>

<p class="research-lede">
  Adit Research Labs is an informal program for questions that are too messy for a
  classroom problem set and too early for a grant. We care about belief, contagion,
  and what happens when physical threat and informational threat show up at once.
</p>

<section class="research-project">
  <p class="research-tag">Project 01 · active design</p>
  <h2 class="research-project-title">Epistemic cross-contamination of behavioral &amp; digital immunology</h2>

  <h3>Foundation</h3>
  <p>
    <a href="https://arxiv.org/abs/2506.13783">Infected Smallville</a> (Choi et al., 2025)
    runs 25 LLM agents in Park et al.'s Smallville sandbox, primes half with swine-flu
    news, and shows a behavioral immune system (BIS) signature: less movement, fewer
    third-place visits, ~12.3pp lower conversation-initiation probability, and slower
    spread of <em>true</em> party information. Agents narrate disease-avoidance motives;
    a diabetes control suggests the effect is infection-specific, not generic threat.
  </p>

  <h3>What they did not test</h3>
  <p>
    Physical pathogen threat only. No deceptive peers, no false beliefs, no
    misinformation arms, no epistemic-vigilance measures, no factorial design across
    threat types. Their "information diffusion" metric is benign recall (who knows
    about the Valentine's party)—not epistemic contagion.
  </p>

  <h3>Our hypothesis</h3>
  <p class="research-hypothesis-lead">
    When physical disease threat and informational threat co-occur, does BIS-driven
    social withdrawal act as a <em>secondary shield</em> against false belief spread—or
    does pathogen salience degrade epistemic vigilance and increase uptake of
    authoritative lies?
  </p>
  <ol class="research-hypotheses">
    <li><strong>Shield:</strong> reduced contact → lower IDR for false claims.</li>
    <li><strong>Collapse:</strong> threat load → higher IDR, especially from high-centrality agents.</li>
    <li><strong>Fragmentation:</strong> homophilic clustering under stress isolates "carriers" but also creates sealed misinformation chambers.</li>
  </ol>

  <h3>Design (planned)</h3>
  <ul class="research-design">
    <li><strong>Platform:</strong> Smallville-scale GABM (25 agents) first; gridworld ablation if cost bites.</li>
    <li><strong>IV — threat condition:</strong> none · physical (outbreak news) · digital (deceptive peer agents) · combined.</li>
    <li><strong>DVs:</strong> information diffusion rate (IDR) for seeded false claims; network centrality vs. belief adoption; belief-state Jensen–Shannon divergence <em>D<sub>JS</sub></em> across conditions; rumor vs. disease basic reproduction estimates <em>R₀</em> where transmission rules are explicit.</li>
    <li><strong>Controls we owe:</strong> true-information diffusion arm (replicate their party metric); noninfectious threat; authority-only lies without network spread; human vignette pilot before we overfit prompts.</li>
  </ul>

  <h3>What has to be true for this to matter</h3>
  <ul class="research-rigor">
    <li>Beliefs are extracted on a fixed schedule (structured probes), not inferred from vibes in chat logs.</li>
    <li>Deception is implemented as peer behavior + memory injection, not a global system prompt that screams "misinformation study."</li>
    <li>Simulation pairs are the unit of analysis; we need enough runs that a null combined effect is actually informative.</li>
    <li>If combined ≈ physical alone, we report shielding honestly. If combined ≈ digital alone, BIS is irrelevant theater. If it's worse than either, that's the paper.</li>
  </ul>

  <p class="research-status-line">Status: protocol draft · pre-registration next</p>
</section>

<p class="research-soon">More projects when one of them survives contact with reality.</p>

<p class="research-note">
  This page isn't linked from the main site. If you found it, you were supposed to.
</p>
