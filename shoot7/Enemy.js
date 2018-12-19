// 敵クラス（鳥）
class EnemyBird extends Character {
  constructor() {
    super('fa-dove', null, 50)
    this.hide()
  }

  // 発生
  born() {
    if (this.is_show) return false
    this.x = 800 + this.width / 2
    this.y = Math.random() * 400
    this.damage = 0
    this.vy = 0
    this.$.style.color = '#88eeee'
    this.show()
    return true
  }

  // 移動
  // Y軸方向に自機を追いかけてくる。
  move(px, py) {
    if (this.is_show) {
      this.x -= 4
      this.vy += 0.0002 * (py - this.y)
      if (this.vy > 4) this.vy = 4
      if (this.vy < -4) this.vy = -4
      this.y += this.vy
      this.$.style.transform = `scaleX(-1) rotate(${this.vy * 10 + 20}deg)`
      if (this.x < -this.width / 2
        || this.y < -this.height / 2
        || this.y > 400 + this.height / 2) this.hide()
    }
  }
}

// 敵クラス（カバ）
class EnemyHippo extends Character {
  constructor() {
    super('fa-hippo', null, 100)
    this.hide()
  }

  // 発生
  born() {
    if (this.is_show) return false
    this.x = 800 + this.width / 2
    this.y = 400 - this.height / 2
    this.vy = 0
    this.is_jump = false
    this.damage = 0
    this.$.style.color = '#dddddd'
    this.$.style.transform = 'scaleX(-1)'
    this.show()
    return true
  }

  // 移動
  // たまにジャンプする。
  move() {
    if (this.is_show) {
      this.x -= 4
      if (this.is_jump) {
        this.vy++
        let deg = -10
        if (this.vy > 0) deg = 10
        this.y += this.vy
        if (this.y > 400 - this.height / 2) {
          this.is_jump = false
          this.y = 400 - this.height / 2
          deg = 0
        }
        this.$.style.transform = `scaleX(-1) rotate(${deg}deg)`
      } else {
        if (Math.random() < 0.01) {
          this.is_jump = true
          this.vy = -22
        }
      }
      if (this.x < -this.width / 2) this.hide()
    }
  }
}

// 敵クラス（ダイス）
class EnemyDice extends Character {
  constructor() {
    super('fa-dice-d20 fa-spin', null, 60)
    this.hide()
  }

  // 発生
  born() {
    if (this.is_show) return false
    this.x = 800 + this.width / 2
    this.y = Math.random() * 400
    this.damage = 0
    this.vx = 0
    this.vy = 0
    this.$.style.color = '#89f3aa'
    this.show()
    return true
  }

  // 移動
  // 自機を執拗に追いかけてくる
  move(px, py) {
    if (this.is_show) {
      this.vx += 0.001 * (px - this.x)
      this.vy += 0.001 * (py - this.y)
      if (this.vx > 4) this.vx = 4
      if (this.vx < -4) this.vx = -4
      if (this.vy > 4) this.vy = 4
      if (this.vy < -4) this.vy = -4
      this.x += this.vx
      this.y += this.vy
    }
  }
}

// 敵コレクションクラス
class EnemyCollection {
  constructor() {
    this.items = []
    this.interval = 0
    const enemy_classes = [
      EnemyBird, EnemyHippo, EnemyDice, EnemyBird, EnemyBird
    ]
    for (let i = 0; i < this.MAX_ITEMS; i++) {
      const item = new enemy_classes[i % enemy_classes.length]()
      this.items.push(item)
    }
  }

  // 敵の最大数
  get MAX_ITEMS() { return 20 }

  // 発生
  born(level) {
    // ある程度のインターバルをおいて発生する。
    this.interval += Math.log(level) * 5
    if (this.interval > 1000) {
      for (let item of this.items) {
        if (item.born()) break
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
  move(px, py) {
    for (let item of this.items) {
      item.move(px, py)
    }
  }

  // 弾との当たり判定
  hit_bullets(bullets) {
    let add_score = 0
    for (let item of this.items) {
      if (item.is_show) {
        if (bullets.hit_enemy(item)) {
          item.damage++
          if (item.damage > 5) {
            item.hide()
            add_score += 10
          }
        }
      }
    }
    return add_score
  }

  // 自機との当たり判定
  hit_player(player) {
    for (let item of this.items) {
      if (item.is_show) {
        if (player.hit_enemy(item)) {
          return true
        }
      }
    }
    return false
  }
}
