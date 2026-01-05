import type { Component, ComponentType } from './Component';

export class Entity {
  public id: number | null = null;
  private components = new Map<Function, Component>();
  public active = true;

  add<T extends Component>(Type: ComponentType<T>, component: T): this {
    this.components.set(Type, component);
    return this;
  }

  remove<T extends Component>(Type: ComponentType<T>): this {
    this.components.delete(Type);
    return this;
  }

  get<T extends Component>(Type: ComponentType<T>): T | undefined {
    return this.components.get(Type) as T | undefined;
  }

  has<T extends Component>(Type: ComponentType<T>): boolean {
    return this.components.has(Type);
  }
}
