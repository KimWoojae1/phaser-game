import type Phaser from 'phaser';
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
  public scene: Phaser.Scene | null = null;
  public eventLevel: 'debug' | 'info' | 'warn' | 'error' = 'debug';
  public readonly input = {
    bindings: new Map<string, string>(),
    states: new Map<string, boolean>(),
  };
  public readonly movement = {
    accel: 800,
    decel: 900,
    maxSpeed: 140,
    dashMultiplier: 2,
    dashDurationMs: 120,
    dashCooldownMs: 400,
  };
  public readonly world = {
    width: 800,
    height: 600,
    zoom: 1,
  };
  public readonly debug = {
    showColliders: true,
    showCenters: false,
  };
}
