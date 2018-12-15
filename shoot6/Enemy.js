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
  get MAX_ITEMS() { return 40 }

  // 発生
  born(level) {
    // ある程度のインターバルをおいて発生する。
    this.interval += Math.log(level) * 5
    if (this.interval > 2000) {
      for (let i = 0; i < this.MAX_ITEMS; i++) {
        if (this.items[i].born()) break
      }
      this.interval = 0
    }
  }

  // 消去
  hide() {
    for (let i = 0; i < this.MAX_ITEMS; i++) {
      this.items[i].hide()
    }
  }

  // 移動
  move(px, py) {
    for (let i = 0; i < this.MAX_ITEMS; i++) {
      this.items[i].move(px, py)
    }
  }

  // 弾との当たり判定
  hit_bullets(bullets) {
    let add_score = 0
    for (let i = 0; i < this.MAX_ITEMS; i++) {
      if (this.items[i].is_show) {
        if (bullets.hit_enemy(this.items[i])) {
          this.items[i].hide()
          add_score += 10
        }
      }
    }
    return add_score
  }

  // 自機との当たり判定
  hit_player(player) {
    for (let i = 0; i < this.MAX_ITEMS; i++) {
      if (this.items[i].is_show) {
        if (player.hit_enemy(this.items[i])) {
          return true
        }
      }
    }
    return false
  }
}
