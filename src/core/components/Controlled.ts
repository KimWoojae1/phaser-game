export class Controlled {
  enabled: boolean;

  constructor(init?: { enabled?: boolean }) {
    this.enabled = init?.enabled ?? true;
  }
}
