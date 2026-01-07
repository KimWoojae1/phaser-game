import Phaser from 'phaser';
import { Entity } from '../core/ECS/Entity';
import { World } from '../core/ECS/World';
import { Render } from '../core/components/Render';
import { Tag } from '../core/components/Tag';
import {
  createItem,
  createNpc,
  createTrigger,
  createWall,
} from '../entities/factories';
import { Enemy } from '../entities/Enemy';
import { Player } from '../entities/Player';
import { entityDefaults } from '../data/entityDefaults';
import { GameServices } from '../core/GameServices';
import { CollisionSystem } from '../systems/CollisionSystem';
import { CollisionResponseSystem } from '../systems/CollisionResponseSystem';
import { CameraSystem } from '../systems/CameraSystem';
import { DebugSystem } from '../systems/DebugSystem';
import { DepthSortSystem } from '../systems/DepthSortSystem';
import { InputSystem } from '../systems/InputSystem';
import { PlayerControlSystem } from '../systems/PlayerControlSystem';
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
    services.scene = this;
    this.world =
      (this.registry.get('world') as World | undefined) ??
      new World({ services });
    const inputSystem = new InputSystem(this);
    if (this.input.keyboard) {
      inputSystem.bind(
        'fire',
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
      );
      inputSystem.bind(
        'dash',
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
      );
    }
    this.world.addSystem(inputSystem);
    this.world.addSystem(new PlayerControlSystem());
    this.world.addSystem(new MovementSystem());
    this.world.addSystem(new SyncColliderSystem());
    const collisionSystem = new CollisionSystem();
    collisionSystem.setBroadphase(new GridBroadphase(64));
    this.world.addSystem(collisionSystem);
    this.world.addSystem(new CollisionResponseSystem());
    this.world.addSystem(new CameraSystem());
    this.world.addSystem(new DebugSystem());
    this.world.addSystem(new DepthSortSystem());

    if (!this.textures.exists('player')) {
      const graphics = this.add.graphics();
      graphics.fillStyle(0x22aa88, 1);
      graphics.fillRect(0, 0, 32, 32);
      graphics.generateTexture('player', 32, 32);
      graphics.destroy();
    }

    const stage = services.stageManager.getCurrent();
    for (const entity of stage.entities) {
      if (entity.type === 'player') {
        const defaults = entityDefaults.player;
        const renderType = entity.render ?? defaults.render;
        const renderKey =
          entity.key ??
          (renderType === 'spine'
            ? entity.spineKey ?? defaults.key
            : entity.spriteKey ?? defaults.key);
        const collider =
          entity.collider ??
          this.resolveDefaultCollider(renderType, renderKey, entity.size ?? 32);
        const player = new Player({
          x: entity.x,
          y: entity.y,
          size: entity.size ?? 32,
          scale: entity.scale,
          render: renderType,
          key: renderKey,
          animation: entity.animation ?? defaults.animation,
          loop: true,
          atlasKey: entity.spineAtlasKey,
          origin: entity.origin,
          collider,
          controlled: entity.controlled,
          spineScale: entity.spineScale,
          spineOffsetX: entity.spineOffsetX,
          spineOffsetY: entity.spineOffsetY,
        });
        const playerTag = player.get(Tag);
        if (playerTag && entity.tag) {
          playerTag.value = entity.tag;
        }
        if (playerTag && entity.collidesWith) {
          playerTag.collidesWith = entity.collidesWith;
        }
        this.world.addEntity(player);
      }
      if (entity.type === 'enemy') {
        const defaults = entityDefaults.enemy;
        const renderType = entity.render ?? defaults.render;
        const renderKey =
          entity.key ??
          (renderType === 'spine'
            ? entity.spineKey ?? defaults.key
            : entity.spriteKey ?? defaults.key);
        const collider =
          entity.collider ??
          this.resolveDefaultCollider(renderType, renderKey, entity.size ?? 32);
        const enemy = new Enemy({
          x: entity.x,
          y: entity.y,
          size: entity.size ?? 32,
          scale: entity.scale,
          render: renderType,
          key: renderKey,
          animation: entity.animation ?? defaults.animation,
          loop: true,
          atlasKey: entity.spineAtlasKey,
          origin: entity.origin,
          collider,
          spineScale: entity.spineScale,
          spineOffsetX: entity.spineOffsetX,
          spineOffsetY: entity.spineOffsetY,
        });
        const enemyTag = enemy.get(Tag);
        if (enemyTag && entity.tag) {
          enemyTag.value = entity.tag;
        }
        if (enemyTag && entity.collidesWith) {
          enemyTag.collidesWith = entity.collidesWith;
        }
        this.world.addEntity(enemy);
      }
      if (entity.type === 'wall') {
        const wall = createWall(
          this,
          entity.x,
          entity.y,
          entity.size ?? 48,
          entity.color ?? 0x555555,
          entity.wallType !== 'sensor'
        );
        this.world.addEntity(wall);
      }
      if (entity.type === 'npc') {
        const npc = createNpc(
          this,
          entity.x,
          entity.y,
          entity.size ?? 32,
          entity.color ?? 0x3366aa
        );
        this.world.addEntity(npc);
      }
      if (entity.type === 'item') {
        const item = createItem(
          this,
          entity.x,
          entity.y,
          entity.size ?? 24,
          entity.color ?? 0xffcc33
        );
        this.world.addEntity(item);
      }
      if (entity.type === 'trigger') {
        const trigger = createTrigger(
          this,
          entity.x,
          entity.y,
          entity.size ?? 40,
          entity.color ?? 0xaa33aa
        );
        this.world.addEntity(trigger);
      }
    }
    const tintOn = (entity: Entity) => {
      const render = entity.get(Render);
      if (!render) {
        return;
      }
      const object = render.object;
      if (object instanceof Phaser.GameObjects.Rectangle) {
        object.fillColor = 0xaa2233;
      } else if (object instanceof Phaser.GameObjects.Sprite) {
        object.setTint(0xaa2233);
      }
    };
    const tintOff = (entity: Entity) => {
      const render = entity.get(Render);
      if (!render) {
        return;
      }
      const object = render.object;
      if (object instanceof Phaser.GameObjects.Rectangle) {
        object.fillColor = 0x555555;
      } else if (object instanceof Phaser.GameObjects.Sprite) {
        object.clearTint();
      }
    };
    const onStart = this.world.getEvents().on(
      'collisionStart',
      (event) => {
        tintOn(event.a);
        tintOn(event.b);
      },
      { level: 'debug' }
    );
    const onEnd = this.world.getEvents().on(
      'collisionEnd',
      (event) => {
        tintOff(event.a);
        tintOff(event.b);
      },
      { level: 'debug' }
    );
    this.unsubscribeCollision = () => {
      onStart();
      onEnd();
    };
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

  private resolveDefaultCollider(
    renderType: 'sprite' | 'spine',
    key: string,
    fallbackSize: number
  ): { width: number; height: number } {
    if (renderType === 'spine') {
      return { width: 100, height: 100 };
    }
    const texture = this.textures.get(key);
    const source = texture?.getSourceImage() as
      | { width: number; height: number }
      | undefined;
    if (source?.width && source?.height) {
      return { width: source.width, height: source.height };
    }
    return { width: fallbackSize, height: fallbackSize };
  }
}
