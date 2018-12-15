// マウスイベントクラス
class Mouse {
  constructor() {
    this.click = false
    const app = document.getElementById('app')
    app.addEventListener('mousemove', e => {
      this.x = e.clientX
      this.y = e.clientY
    })

    // app外でもマウスの押下を取得するためにdocumentのイベントを取る。
    document.addEventListener('mousedown', () => this.click = true)
    document.addEventListener('mouseup', () => this.click = false)
  }
}
