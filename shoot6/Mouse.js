// マウスイベントクラス
class Mouse {
  constructor() {
    this.click = false
    const app = document.getElementById('app')
    document.addEventListener('touchmove', e => {
      e.preventDefault()
      this.x = e.changedTouches[0].pageX
      this.y = e.changedTouches[0].pageY
    })
    app.addEventListener('mousemove', e => {
      this.x = e.clientX
      this.y = e.clientY
    })
    document.addEventListener('touchstart', () => {
      e.preventDefault()
      this.click = true
    })
    document.addEventListener('touchend', () => {
      this.click = false
    })
    app.addEventListener('mousedown', () => this.click = true)
    document.addEventListener('mouseup', () => this.click = false)
  }
}
