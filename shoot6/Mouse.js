// マウスイベントクラス
class Mouse {
  constructor() {
    this.on_down = null
    this.on_up = null
    this.on_move = null
    const app = document.getElementById('app')
    if ('ontouchend' in document) {
      // スマホの場合
      this.on_down = ['touchstart',  e => {
        e.preventDefault()
        this.click = true
      }]
      this.on_up = ['touchend', e => {
        this.click = false
      }]
      this.on_move = ['touchmove', e => {
        e.preventDefault()
        this.x = e.changedTouches[0].pageX
        this.y = e.changedTouches[0].pageY
      }]
    } else {
      // PCの場合
      this.on_down = ['mousedown', e => {
        e.preventDefault()
        this.click = true
      }]
      this.on_up = ['mouseup', e => {
        this.click = false
      }]
      this.on_move = ['mousemove', e => {
        e.preventDefault()
        this.x = e.clientX
        this.y = e.clientY
      }]
    }
  }

  // 初期化
  init() {
    this.click = false
    app.addEventListener(this.on_down[0], this.on_down[1])
    app.addEventListener(this.on_up[0], this.on_up[1])
    app.addEventListener(this.on_move[0], this.on_move[1])
  }

  // 終了
  end() {
    this.click = false
    app.removeEventListener(this.on_down[0], this.on_down[1])
    app.removeEventListener(this.on_up[0], this.on_up[1])
    app.removeEventListener(this.on_move[0], this.on_move[1])
  }
}
