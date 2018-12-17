// メインクラス
class App {
  constructor() {
    this.background = new Background()
    this.player = new Player()
    this.enemies = new EnemyCollection()
    this.initTitle()
  }

  // タイトル画面の初期化
  initTitle() {
    const title = document.getElementById('title')
    const start = document.getElementById('start-button')
    title.style.display = 'block'
    const listener = () => {
      start.removeEventListener('click', listener)
      title.style.display = 'none'
      this.initMain()
    }
    start.addEventListener('click', listener)
  }

  // メイン画面の初期化
  initMain() {
    this.background.init()
    this.player.init()
    this.score = 0
    this.level = 1
    this.timer = setInterval(() => {
      this.enemies.born(this.level)
      this.level++
      this.background.scroll()
      this.player.move()
      this.enemies.move(this.player.x, this.player.y)
      this.score += this.enemies.hit_bullets(this.player.bullets)
      if (this.enemies.hit_player(this.player)) {
        clearInterval(this.timer)
        this.player.end()
        this.enemies.hide()
        this.background.end()
        this.initOver()
      }
    }, 16)
  }

  // ゲームオーバー画面の初期化
  initOver() {
    const over = document.getElementById('over')
    const retry = document.getElementById('retry-button')
    over.style.display = 'block'
    const score = document.getElementById('score-num')
    score.innerText = this.score
    const listener = () => {
      retry.removeEventListener('click', listener)
      over.style.display = 'none'
      this.initMain()
    }
    retry.addEventListener('click', listener)
  }
}

new App()
