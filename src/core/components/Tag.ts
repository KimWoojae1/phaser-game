export class Tag {
  value: string;
  solid?: boolean;

  constructor(init: { value: string; solid?: boolean }) {
    this.value = init.value;
    this.solid = init.solid;
  }
}
