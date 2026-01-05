import { StageManager } from '../stage/StageManager';

export class GameServices {
  public readonly data = new Map<string, unknown>();
  public readonly dataStore = new Map<string, unknown>();
  public readonly stage = {
    index: 0,
    name: 'prototype',
  };
  public readonly stageManager = new StageManager();
  public readonly time = {
    now: 0,
    frame: 0,
    dt: 0,
  };
  public eventLevel: 'debug' | 'info' | 'warn' | 'error' = 'debug';
  public readonly input = {
    bindings: new Map<string, string>(),
    states: new Map<string, boolean>(),
  };
}
