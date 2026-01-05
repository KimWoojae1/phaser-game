import { stages, type StageData } from '../data/stages';

export class StageManager {
  private index = 0;

  getCurrent(): StageData {
    return stages[this.index];
  }

  reset(): void {
    this.index = 0;
  }

  next(): StageData {
    this.index = Math.min(this.index + 1, stages.length - 1);
    return this.getCurrent();
  }
}
