export type Component = object;

export type ComponentType<T extends Component> = new (...args: any[]) => T;
