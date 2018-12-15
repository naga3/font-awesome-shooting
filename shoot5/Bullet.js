// 弾クラス
class Bullet extends Character {
  constructor() {
    super('fa-list fa-2x', 'gray')
  }

  // 発生
  born(x, y) {
    if (this.is_show) return false
    this.x = x
    this.y = y
    this.show()
    return true
  }

  // 移動
  move() {
    if (this.is_show) {
      this.x += 16
      if (this.x > 800 + this.width / 2) this.hide()
    }
  }
}

// 弾コレクションクラス
class BulletCollection {
  constructor() {
    this.items = []
    this.interval = 0
    for (let i = 0; i < this.MAX_ITEMS; i++) {
      const item = new Bullet()
      this.items.push(item)
    }
  }

  // 弾の最大数
  get MAX_ITEMS() { return 10 }

  // 発生
  born(x, y) {
    // 連射しすぎないようにある程度のインターバルをおく。
    this.interval++
    if (this.interval > 5) {
      for (let item of this.items) {
        if (item.born(x, y)) break
      }
      this.interval = 0
    }
  }

  // 消去
  hide() {
    for (let item of this.items) {
      item.hide()
    }
  }


  // 移動
  move() {
    for (let item of this.items) {
      item.move()
    }
  }

  // 敵との当たり判定
  hit_enemy(enemy) {
    for (let item of this.items) {
      if (item.is_show && item.hit(enemy)) {
        item.hide()
        return true
      }
    }
    return false
  }
}
