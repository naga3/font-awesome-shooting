
// 自機クラス

class Player extends Character {
  constructor() {
    super('fa-fighter-jet fa-3x', 'lightskyblue')
    this.mouse = new Mouse()
    this.bullets = new BulletCollection()
  }

  // 移動
  move() {
    this.x = this.mouse.x
    this.y = this.mouse.y
    if (this.mouse.click) {
      this.bullets.born(this.mouse.x, this.mouse.y)
    }
    this.bullets.move()
  }
}
