export type ScenarioId = '1' | '2' | '3' | '4' | '5';

export type Step = {
  action: string;
  target?: string;
  value?: string;
  assertion?: string;
};

export type Plan = {
  scenario: ScenarioId;
  title: string;
  steps: Step[];
};
