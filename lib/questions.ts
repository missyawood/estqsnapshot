export const SITUATION_OPTIONS = [
  { value: 'broken', label: 'My system broke down or isn\'t working' },
  { value: 'aging', label: 'My system is old and I want to replace it before it fails' },
  { value: 'gas_to_electric', label: 'I want to switch from gas to electric / heat pump' },
  { value: 'renovation', label: 'I\'m renovating and need to update HVAC' },
  { value: 'energy_bills', label: 'My energy bills are too high' },
  { value: 'exploring', label: 'I\'m not sure yet, just exploring' },
];

export const URGENCY_OPTIONS = [
  { value: 'broken_now', label: 'My system is broken — I need something now' },
  { value: 'soon_1_3mo', label: 'Still working but I want to replace it soon (1–3 months)' },
  { value: 'planning_3_6mo', label: 'Planning ahead (3–6 months)' },
  { value: 'researching', label: 'Just researching, no timeline yet' },
];

export const SYSTEM_KNOWLEDGE_OPTIONS = [
  { value: 'know_details', label: 'I know the brand, age, and type' },
  { value: 'some_basics', label: 'I know some basics (fuel type, approximate age)' },
  { value: 'dont_know', label: 'I don\'t know much about it' },
  { value: 'no_system', label: 'No existing system (new construction or addition)' },
];

export const SYSTEM_AGE_OPTIONS = [
  { value: '0-5', label: '0–5 years' },
  { value: '5-10', label: '5–10 years' },
  { value: '10-15', label: '10–15 years' },
  { value: '15-20', label: '15–20 years' },
  { value: '20+', label: '20+ years' },
];

export const FUEL_TYPE_OPTIONS = [
  { value: 'gas', label: 'Gas' },
  { value: 'electric', label: 'Electric' },
  { value: 'heat_pump', label: 'Heat pump' },
  { value: 'not_sure', label: 'Not sure' },
];

export const SYSTEM_PREFERENCE_OPTIONS = [
  { value: 'heat_pump', label: 'I want a heat pump (all-electric)' },
  { value: 'same_type', label: 'Replace with the same type I have now' },
  { value: 'explore', label: 'I want to explore my options' },
  { value: 'cost_effective', label: 'Whatever is most cost-effective' },
  { value: 'most_efficient', label: 'The most energy-efficient option available' },
];

export const SQUARE_FOOTAGE_OPTIONS = [
  { value: 'under_1200', label: 'Under 1,200 sq ft' },
  { value: '1200_2000', label: '1,200–2,000 sq ft' },
  { value: '2000_3000', label: '2,000–3,000 sq ft' },
  { value: 'over_3000', label: 'Over 3,000 sq ft' },
];

export const STORIES_OPTIONS = [
  { value: '1', label: '1 story' },
  { value: '2', label: '2 stories' },
  { value: '3+', label: '3+ stories' },
];

export const YEAR_BUILT_OPTIONS = [
  { value: 'before_1960', label: 'Before 1960' },
  { value: '1960_1990', label: '1960–1990' },
  { value: '1990_2010', label: '1990–2010' },
  { value: 'after_2010', label: 'After 2010' },
];

export const DUCTWORK_OPTIONS = [
  { value: 'good_shape', label: 'Existing ductwork, good shape' },
  { value: 'not_sure_condition', label: 'Have ductwork, not sure about condition' },
  { value: 'needs_repair', label: 'Ductwork needs repair or replacement' },
  { value: 'ductless', label: 'No ductwork / want ductless' },
  { value: 'no_idea', label: 'No idea' },
];

export const PERMIT_AWARENESS_OPTIONS = [
  { value: 'contractor_handles', label: 'Yes, I expect the contractor to handle permits' },
  { value: 'heard_about', label: 'I\'ve heard about it but don\'t know the details' },
  { value: 'hadnt_thought', label: 'I hadn\'t thought about permits' },
  { value: 'not_sure', label: 'Not sure if my project needs one' },
];

export const ELECTRICAL_PANEL_OPTIONS = [
  { value: '200amp', label: '200 amp service' },
  { value: '100amp_or_less', label: '100 amp service or less' },
  { value: 'not_sure', label: 'Not sure' },
  { value: 'assessed', label: 'Already had an electrician assess it' },
];

export const BUDGET_APPROACH_OPTIONS = [
  { value: 'rough_budget', label: 'I have a rough budget in mind' },
  { value: 'understand_first', label: 'I want to understand costs before setting a budget' },
  { value: 'finance', label: 'I plan to finance the project' },
  { value: 'rebates_first', label: 'I want to know about rebates and incentives first' },
];

export const BUDGET_RANGE_OPTIONS = [
  { value: 'under_8k', label: 'Under $8,000' },
  { value: '8k_15k', label: '$8,000–$15,000' },
  { value: '15k_25k', label: '$15,000–$25,000' },
  { value: 'over_25k', label: 'Over $25,000' },
];

export const TOTAL_QUESTIONS = 8;
