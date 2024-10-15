export interface MenuOption {
  [key: number]: string;
}

export interface Step {
  prompt: string;
  options: MenuOption;
  nextStep?: { [key: number]: number };
  isFinalStep?: boolean;
}

export interface DynamicFlow {
  [stepId: number]: Step;
}

export interface Session {
  step: number;
  previousStep?: number | null;
  selectedOptions?: { [stepId: number]: number };
}
