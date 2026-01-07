import { stages, type StageData } from '../data/stages';

export class StageManager {
  private index = 0;
  private runtimeStage: StageData | null = null;

  getCurrent(): StageData {
    return this.runtimeStage ?? stages[this.index];
  }

  reset(): void {
    this.index = 0;
    this.runtimeStage = null;
  }

  next(): StageData {
    this.index = Math.min(this.index + 1, stages.length - 1);
    return this.getCurrent();
  }

  setRuntimeStage(stage: StageData): void {
    this.runtimeStage = stage;
  }
}
