export type Component = Record<string, unknown>;

export type ComponentType<T extends Component> = new (...args: never[]) => T;
