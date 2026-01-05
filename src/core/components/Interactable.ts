export class Interactable {
  action: string;

  constructor(init: { action: string }) {
    this.action = init.action;
  }
}
