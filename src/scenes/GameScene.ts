import Phaser from 'phaser';
import { World } from '../core/ECS/World';
import { Render } from '../core/components/Render';
import { createTestPlayer, createWall } from '../entities/factories';
import { GameServices } from '../core/GameServices';
import { CollisionSystem } from '../systems/CollisionSystem';
import { CollisionResponseSystem } from '../systems/CollisionResponseSystem';
import { InputSystem } from '../systems/InputSystem';
import { MovementSystem } from '../systems/MovementSystem';
import { RenderSystem } from '../systems/RenderSystem';
import { SyncColliderSystem } from '../systems/SyncColliderSystem';
import { GridBroadphase } from '../core/physics/GridBroadphase';

export class GameScene extends Phaser.Scene {
  private world!: World;
  private unsubscribeCollision: (() => void) | null = null;

  constructor() {
    super('Game');
  }

  override shutdown(): void {
    if (this.unsubscribeCollision) {
      this.unsubscribeCollision();
      this.unsubscribeCollision = null;
    }
  }

  create(): void {
    const services =
      (this.registry.get('services') as GameServices | undefined) ??
      new GameServices();
    this.world =
      (this.registry.get('world') as World | undefined) ??
      new World({ services });
    const inputSystem = new InputSystem(this);
    if (this.input.keyboard) {
      inputSystem.bind(
        'fire',
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
      );
    }
    this.world.addSystem(inputSystem);
    this.world.addSystem(new MovementSystem());
    this.world.addSystem(new CollisionResponseSystem());

    const stage = services.stageManager.getCurrent();
    let render: Render | undefined;
    for (const entity of stage.entities) {
      if (entity.type === 'player') {
        const player = createTestPlayer(this, entity.x, entity.y);
        render = player.get(Render);
        this.world.addEntity(player);
      }
      if (entity.type === 'wall') {
        const wall = createWall(this, entity.x, entity.y);
        this.world.addEntity(wall);
      }
    }
    if (render) {
      this.unsubscribeCollision = this.world.getEvents().on(
        'collision',
        () => {
          const object = render?.object;
          if (object instanceof Phaser.GameObjects.Rectangle) {
            object.fillColor = 0xaa2233;
          }
        },
        { level: 'debug' }
      );
    }
    const collisionSystem = new CollisionSystem();
    collisionSystem.setBroadphase(new GridBroadphase(64));
    this.world.addSystem(collisionSystem);
    this.world.addSystem(new SyncColliderSystem());
    this.world.addSystem(new RenderSystem());
    this.scene.launch('UI');
  }

  update(_: number, delta: number): void {
    const dt = delta / 1000;
    const services = this.world.getServices();
    services.time.now = this.time.now;
    services.time.frame = this.game.getFrame();
    services.time.dt = dt;
    this.world.update(dt);
  }

}
