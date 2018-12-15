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

  // 敵との当たり判定
  hit_enemy(enemy) {
    // 自機の中央1点のみで当たり判定する。
    if (this.x >= enemy.x - enemy.width / 2
      && this.x < enemy.x + enemy.width / 2
      && this.y >= enemy.y - enemy.height / 2
      && this.y < enemy.y + enemy.height / 2) return true
    return false
  }
}
