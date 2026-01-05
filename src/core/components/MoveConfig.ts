export class MoveConfig {
  accel: number;
  decel: number;
  maxSpeed: number;
  dashMultiplier: number;
  dashDurationMs: number;
  dashCooldownMs: number;

  constructor(init: {
    accel: number;
    decel: number;
    maxSpeed: number;
    dashMultiplier: number;
    dashDurationMs: number;
    dashCooldownMs: number;
  }) {
    this.accel = init.accel;
    this.decel = init.decel;
    this.maxSpeed = init.maxSpeed;
    this.dashMultiplier = init.dashMultiplier;
    this.dashDurationMs = init.dashDurationMs;
    this.dashCooldownMs = init.dashCooldownMs;
  }
}
