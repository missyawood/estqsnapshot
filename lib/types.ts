export type SituationType =
  | 'broken'
  | 'aging'
  | 'gas_to_electric'
  | 'renovation'
  | 'energy_bills'
  | 'exploring';

export type UrgencyType =
  | 'broken_now'
  | 'soon_1_3mo'
  | 'planning_3_6mo'
  | 'researching';

export type SystemKnowledgeType =
  | 'know_details'
  | 'some_basics'
  | 'dont_know'
  | 'no_system';

export type SystemAgeType = '0-5' | '5-10' | '10-15' | '15-20' | '20+';
export type FuelType = 'gas' | 'electric' | 'heat_pump' | 'not_sure';

export type SystemPreferenceType =
  | 'heat_pump'
  | 'same_type'
  | 'explore'
  | 'cost_effective'
  | 'most_efficient';

export type SquareFootageType =
  | 'under_1200'
  | '1200_2000'
  | '2000_3000'
  | 'over_3000';

export type StoriesType = '1' | '2' | '3+';

export type YearBuiltType =
  | 'before_1960'
  | '1960_1990'
  | '1990_2010'
  | 'after_2010';

export type DuctworkType =
  | 'good_shape'
  | 'not_sure_condition'
  | 'needs_repair'
  | 'ductless'
  | 'no_idea';

export type PermitAwarenessType =
  | 'contractor_handles'
  | 'heard_about'
  | 'hadnt_thought'
  | 'not_sure';

export type ElectricalPanelType =
  | '200amp'
  | '100amp_or_less'
  | 'not_sure'
  | 'assessed';

export type BudgetApproachType =
  | 'rough_budget'
  | 'understand_first'
  | 'finance'
  | 'rebates_first';

export type BudgetRangeType =
  | 'under_8k'
  | '8k_15k'
  | '15k_25k'
  | 'over_25k';

export interface Answers {
  address: string;
  situation?: SituationType;
  situationNotes?: string;
  urgency?: UrgencyType;
  systemKnowledge?: SystemKnowledgeType;
  systemAge?: SystemAgeType;
  fuelType?: FuelType;
  systemBrand?: string;
  systemPreference?: SystemPreferenceType;
  squareFootage?: SquareFootageType;
  stories?: StoriesType;
  yearBuilt?: YearBuiltType;
  ductwork?: DuctworkType;
  permitAwareness?: PermitAwarenessType;
  electricalPanel?: ElectricalPanelType;
  budgetApproach?: BudgetApproachType;
  budgetRange?: BudgetRangeType;
}

export type DimensionStatus = 'clear' | 'uncertain' | 'needs_clarification';

export interface DimensionScore {
  dimension: string;
  status: DimensionStatus;
  label: string;
  summary: string;
  why?: string;
  resolution?: string;
}

export type ReadinessLevel = 'ready' | 'mostly_ready' | 'needs_work';

export interface ReadinessResult {
  level: ReadinessLevel;
  dimensions: DimensionScore[];
  clearCount: number;
  uncertainCount: number;
  needsCount: number;
}
