// メインクラス
class App {
  constructor() {
    this.player = new Player()
    this.enemies = new EnemyCollection()
    this.initTitle()
  }

  // タイトル画面の初期化
  initTitle() {
    const title = document.getElementById('title')
    title.style.display = 'block'
    const listener = () => {
      title.removeEventListener('click', listener)
      title.style.display = 'none'
      this.initMain()
    }
    title.addEventListener('click', listener)
  }

  // メイン画面の初期化
  initMain() {
    this.player.show()
    this.score = 0
    this.level = 1
    this.timer = setInterval(() => {
      this.enemies.born(this.level)
      this.level++
      this.player.move()
      this.enemies.move(this.player.x, this.player.y)
      this.score += this.enemies.hit_bullets(this.player.bullets)
      if (this.enemies.hit_player(this.player)) {
        clearInterval(this.timer)
        this.player.bullets.hide()
        this.player.hide()
        this.enemies.hide()
        this.initOver()
      }
    }, 16)
  }

  // ゲームオーバー画面の初期化
  initOver() {
    const over = document.getElementById('over')
    over.style.display = 'block'
    const score = document.getElementById('score-num')
    score.innerText = this.score
    const listener = () => {
      over.removeEventListener('click', listener)
      over.style.display = 'none'
      this.initMain()
    }
    over.addEventListener('click', listener)
  }
}

new App()
