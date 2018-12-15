// 敵クラス
class Enemy extends Character {
  constructor() {
    super('fa-helicopter fa-flip-horizontal fa-3x', 'coral')
    this.hide()
  }

  // 消去
  hide() {
    super.hide()
    this.vy = 0
  }

  // 発生
  born() {
    if (this.is_show) return false
    this.x = 800 + this.width / 2
    this.y = Math.random() * 400
    this.show()
    return true
  }

  // 移動
  // ある程度自機を追いかけてくる
  move(px, py) {
    if (this.is_show) {
      this.x -= 4
      this.vy += 0.0002 * (py - this.y)
      if (this.vy > 4) this.vy = 4
      if (this.vy < -4) this.vy = -4
      this.y += this.vy

      // 画面上・左・下にはみ出したら消す。
      if (this.x < -this.width / 2
        || this.y < -this.height / 2
        || this.y > 400 + this.height / 2) this.hide()
    }
  }
}

// 敵コレクションクラス
class EnemyCollection {
  constructor() {
    this.items = []
    this.interval = 0
    for (let i = 0; i < this.MAX_ITEMS; i++) {
      const item = new Enemy()
      this.items.push(item)
    }
  }

  // 敵の最大数
  get MAX_ITEMS() { return 20 }

  // 発生
  born() {
    // ある程度のインターバルをおいて発生する。
    this.interval++
    if (this.interval > 24) {
      for (let item of this.items) {
        if (item.born()) break
      }
      this.interval = 0
    }
  }

  // 移動
  move(px, py) {
    for (let item of this.items) {
      item.move(px, py)
    }
  }

  // 弾との当たり判定
  hit_bullets(bullets) {
    for (let item of this.items) {
      if (item.is_show) {
        if (bullets.hit_enemy(item)) {
          item.hide()
        }
      }
    }
  }
}
