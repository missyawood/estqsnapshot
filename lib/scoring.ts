import { Answers, DimensionScore, DimensionStatus, ReadinessLevel, ReadinessResult } from './types';

function scoreTimeline(answers: Answers): DimensionScore {
  const labels: Record<string, string> = {
    broken_now: 'Your system is broken and needs immediate replacement',
    soon_1_3mo: 'You\'re planning to replace within 1–3 months',
    planning_3_6mo: 'You\'re planning ahead over the next 3–6 months',
    researching: 'You\'re in early research mode, no firm timeline',
  };
  return {
    dimension: 'timeline',
    status: 'clear',
    label: 'Timeline',
    summary: labels[answers.urgency || ''] || 'Timeline captured',
    why: 'Knowing your timeline helps contractors prioritize and sequence the work.',
  };
}

function scoreCurrentSystem(answers: Answers): DimensionScore {
  const k = answers.systemKnowledge;
  if (k === 'no_system') {
    return {
      dimension: 'current_system',
      status: 'clear',
      label: 'Current system',
      summary: 'No existing system — new construction or addition',
      why: 'This clarifies the scope: no removal or compatibility constraints.',
    };
  }
  if (k === 'know_details') {
    const parts = [
      answers.systemAge ? `age: ${answers.systemAge} years` : null,
      answers.fuelType ? `fuel: ${answers.fuelType}` : null,
      answers.systemBrand ? `brand: ${answers.systemBrand}` : null,
    ].filter(Boolean);
    return {
      dimension: 'current_system',
      status: 'clear',
      label: 'Current system',
      summary: `You know your system well${parts.length ? ` (${parts.join(', ')})` : ''}`,
      why: 'Detailed system knowledge helps contractors quote accurately and identify compatibility needs.',
    };
  }
  if (k === 'some_basics') {
    const parts = [
      answers.systemAge ? `age: ${answers.systemAge} years` : null,
      answers.fuelType ? `fuel: ${answers.fuelType}` : null,
    ].filter(Boolean);
    return {
      dimension: 'current_system',
      status: 'uncertain',
      label: 'Current system',
      summary: `You know the basics${parts.length ? ` (${parts.join(', ')})` : ''}`,
      why: 'Partial system info is useful, but a contractor will want to confirm specifics on-site.',
      resolution: 'If possible, locate the equipment nameplate — it has the model number, age, and specs.',
    };
  }
  return {
    dimension: 'current_system',
    status: 'needs_clarification',
    label: 'Current system',
    summary: 'You don\'t have details about your current system',
    why: 'Without system details, contractors can\'t quote replacement vs. repair costs accurately.',
    resolution: 'A quick site visit or photo of the equipment nameplate will clarify this.',
  };
}

function scoreSystemPreference(answers: Answers): DimensionScore {
  const p = answers.systemPreference;
  if (p === 'heat_pump' || p === 'same_type') {
    const labels: Record<string, string> = {
      heat_pump: 'You want a heat pump (all-electric)',
      same_type: 'You want to replace with the same system type',
    };
    return {
      dimension: 'system_preference',
      status: 'clear',
      label: 'System preference',
      summary: labels[p],
      why: 'A clear preference narrows the equipment options and gives contractors a defined starting point.',
    };
  }
  if (p === 'cost_effective' || p === 'most_efficient') {
    const labels: Record<string, string> = {
      cost_effective: 'You want the most cost-effective option',
      most_efficient: 'You want the most energy-efficient option',
    };
    return {
      dimension: 'system_preference',
      status: 'uncertain',
      label: 'System preference',
      summary: labels[p],
      why: 'This is a valid approach, but contractors will likely present multiple options to compare.',
      resolution: 'Asking contractors to quote both heat pump and conventional options side-by-side works well here.',
    };
  }
  return {
    dimension: 'system_preference',
    status: 'needs_clarification',
    label: 'System preference',
    summary: 'You\'re open to exploring system types',
    why: 'Without a direction, quotes may not be comparable across contractors.',
    resolution: 'Spend time researching heat pump vs. conventional options for your climate — it narrows the conversation significantly.',
  };
}

function scoreHomeInfo(answers: Answers): DimensionScore {
  const fields = [answers.squareFootage, answers.stories, answers.yearBuilt].filter(Boolean);
  const count = fields.length;

  const sqftLabels: Record<string, string> = {
    under_1200: 'under 1,200 sq ft',
    '1200_2000': '1,200–2,000 sq ft',
    '2000_3000': '2,000–3,000 sq ft',
    over_3000: 'over 3,000 sq ft',
  };
  const parts = [
    answers.squareFootage ? sqftLabels[answers.squareFootage] : null,
    answers.stories ? `${answers.stories}-story` : null,
    answers.yearBuilt ? `built ${answers.yearBuilt.replace('_', ' ')}` : null,
  ].filter(Boolean);

  if (count === 3) {
    return {
      dimension: 'home_info',
      status: 'clear',
      label: 'Home characteristics',
      summary: parts.join(', '),
      why: 'Complete home info lets contractors size the system correctly from the start.',
    };
  }
  if (count >= 1) {
    return {
      dimension: 'home_info',
      status: 'uncertain',
      label: 'Home characteristics',
      summary: parts.length ? parts.join(', ') : 'Partial home info provided',
      why: 'Incomplete home details may lead to under- or over-sized equipment estimates.',
      resolution: 'Square footage, stories, and year built are all on your property tax record if you\'re unsure.',
    };
  }
  return {
    dimension: 'home_info',
    status: 'needs_clarification',
    label: 'Home characteristics',
    summary: 'No home details provided',
    why: 'Contractors need basic home info to size equipment — without it, quotes are rough guesses.',
    resolution: 'Your home\'s square footage, number of stories, and year built are the minimum needed.',
  };
}

function scoreDuctwork(answers: Answers): DimensionScore {
  const d = answers.ductwork;
  if (d === 'good_shape' || d === 'ductless') {
    const labels: Record<string, string> = {
      good_shape: 'Your ductwork is in good condition',
      ductless: 'No ductwork — you\'re interested in ductless / mini-split',
    };
    return {
      dimension: 'ductwork',
      status: 'clear',
      label: 'Ductwork',
      summary: labels[d],
      why: 'Ductwork status is one of the biggest variables in HVAC pricing — knowing it upfront is valuable.',
    };
  }
  if (d === 'not_sure_condition' || d === 'needs_repair') {
    const labels: Record<string, string> = {
      not_sure_condition: 'You have ductwork but aren\'t sure about its condition',
      needs_repair: 'You know your ductwork needs repair or replacement',
    };
    return {
      dimension: 'ductwork',
      status: 'uncertain',
      label: 'Ductwork',
      summary: labels[d],
      why: 'Ductwork condition is one of the biggest hidden variables in HVAC pricing. A contractor site visit will clarify whether existing ducts can be reused.',
      resolution: 'This alone could shift project cost significantly — plan for a duct inspection as part of the quote process.',
    };
  }
  return {
    dimension: 'ductwork',
    status: 'needs_clarification',
    label: 'Ductwork',
    summary: 'You\'re not sure about your ductwork situation',
    why: 'Without ductwork info, cost estimates can vary widely.',
    resolution: 'A visual inspection of your basement, attic, or crawlspace often reveals whether ductwork exists and its general condition.',
  };
}

function scorePermits(answers: Answers): DimensionScore {
  const p = answers.permitAwareness;
  if (p === 'contractor_handles') {
    return {
      dimension: 'permits',
      status: 'clear',
      label: 'Permits',
      summary: 'You\'re aware permits are typically required and expect the contractor to manage them',
      why: 'This is the right expectation — permitted work protects you legally and ensures inspections.',
    };
  }
  if (p === 'heard_about') {
    return {
      dimension: 'permits',
      status: 'uncertain',
      label: 'Permits',
      summary: 'You\'ve heard permits are involved but don\'t know the details',
      why: 'Permit requirements and costs vary by municipality. It\'s worth confirming who handles this before signing a contract.',
      resolution: 'Ask each contractor to explicitly state whether permits are included in their quote.',
    };
  }
  return {
    dimension: 'permits',
    status: 'needs_clarification',
    label: 'Permits',
    summary: p === 'hadnt_thought' ? 'Permits hadn\'t come to mind yet' : 'You\'re not sure if your project requires permits',
    why: 'Most HVAC replacement work requires permits. Unpermitted work can affect insurance and home resale.',
    resolution: 'Ask any contractor you speak with: "Is a permit required for this work, and is that included in your quote?"',
  };
}

function scoreElectrical(answers: Answers): DimensionScore | null {
  if (answers.systemPreference !== 'heat_pump') return null;
  const e = answers.electricalPanel;
  if (e === '200amp' || e === 'assessed') {
    return {
      dimension: 'electrical',
      status: 'clear',
      label: 'Electrical panel',
      summary: e === '200amp' ? '200 amp service — adequate for heat pump installation' : 'Already assessed by an electrician',
      why: 'Heat pumps require sufficient electrical capacity. Knowing this upfront prevents surprises.',
    };
  }
  if (e === '100amp_or_less') {
    return {
      dimension: 'electrical',
      status: 'uncertain',
      label: 'Electrical panel',
      summary: '100 amp service or less — may need panel upgrade for a heat pump',
      why: 'Heat pumps often require 200 amp service. A panel upgrade adds cost and lead time.',
      resolution: 'An electrician can assess your panel during or before the HVAC quote process.',
    };
  }
  return {
    dimension: 'electrical',
    status: 'needs_clarification',
    label: 'Electrical panel',
    summary: 'Electrical panel capacity is unknown',
    why: 'Heat pumps have specific electrical requirements. Without knowing panel capacity, contractors can\'t give a complete quote.',
    resolution: 'Check your breaker panel — the main breaker amperage is usually printed on it. An electrician can confirm if needed.',
  };
}

function scoreBudget(answers: Answers): DimensionScore {
  const b = answers.budgetApproach;
  if (b === 'understand_first' || b === 'finance') {
    const labels: Record<string, string> = {
      understand_first: 'You want to understand typical costs before setting a budget',
      finance: 'You plan to finance the project',
    };
    return {
      dimension: 'budget',
      status: 'clear',
      label: 'Budget approach',
      summary: labels[b],
      why: 'This is a thoughtful approach — understanding the cost landscape first leads to better decisions.',
    };
  }
  if (b === 'rough_budget') {
    const rangeLabels: Record<string, string> = {
      under_8k: 'under $8,000',
      '8k_15k': '$8,000–$15,000',
      '15k_25k': '$15,000–$25,000',
      over_25k: 'over $25,000',
    };
    const range = answers.budgetRange ? rangeLabels[answers.budgetRange] : 'a range in mind';
    return {
      dimension: 'budget',
      status: 'uncertain',
      label: 'Budget approach',
      summary: `You have a rough budget of ${range}`,
      why: 'A budget anchor is useful, but be open to revising once you have contractor quotes — system type and home specifics affect cost significantly.',
      resolution: 'Consider whether your budget accounts for permits, electrical work, and ductwork if needed.',
    };
  }
  return {
    dimension: 'budget',
    status: 'clear',
    label: 'Budget approach',
    summary: 'You want to explore rebates and incentives before setting a budget',
    why: 'Incentives (like federal tax credits and utility rebates) can significantly offset heat pump costs — smart to factor in early.',
  };
}

export function scoreReadiness(answers: Answers): ReadinessResult {
  const dimensions: DimensionScore[] = [
    scoreTimeline(answers),
    scoreCurrentSystem(answers),
    scoreSystemPreference(answers),
    scoreHomeInfo(answers),
    scoreDuctwork(answers),
    scorePermits(answers),
    scoreBudget(answers),
  ];

  const electrical = scoreElectrical(answers);
  if (electrical) dimensions.push(electrical);

  const clearCount = dimensions.filter(d => d.status === 'clear').length;
  const needsCount = dimensions.filter(d => d.status === 'needs_clarification').length;

  let level: ReadinessLevel;
  if (clearCount >= 6 && needsCount === 0) {
    level = 'ready';
  } else if (clearCount >= 4 && needsCount <= 1) {
    level = 'mostly_ready';
  } else {
    level = 'needs_work';
  }

  return {
    level,
    dimensions,
    clearCount,
    uncertainCount: dimensions.filter(d => d.status === 'uncertain').length,
    needsCount,
  };
}
