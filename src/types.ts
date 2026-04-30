export type Step = 'upload' | 'crop' | 'confirm' | 'processing' | 'results';

export interface AnalysisResults {
  confidence: number;
  summary: string;
  metrics: {
    toothColor: string;
    gumVisibility: string;
    alignment: string;
    cleanliness: string;
  };
  recommendations: string[];
}
