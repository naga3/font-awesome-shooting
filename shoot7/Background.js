// 背景クラス
class Background {
  constructor() {
    const infos = [
      {class: 'fa-building', color: '#bfe7f9', size: 300},
      {class: 'fa-building', color: '#8672b7', size: 240},
      {class: 'fa-mosque', color: '#ccab51', size: 190},
      {class: 'fa-store', color: '#cc6e51', size: 120},
      {class: 'fa-synagogue', color: '#a3a9b1', size: 230},
      {class: 'fa-torii-gate', color: '#e03333', size: 170},
      {class: 'fa-vihara', color: '#df4578', size: 350},
      {class: 'fa-church', color: '#b8e8b8', size: 210},
    ]
    this.items = []
    for (let info of infos) {
      const item = new Character(info.class, info.color, info.size)
      item.$.style.textShadow = '4px 4px 4px black'
      this.items.push(item)
    }
  }
  init() {
    this.count = 0
    const app = document.getElementById('app')
    app.style.background = '#1f739e'
    for (let item of this.items) {
      item.vx = 2 + Math.floor(Math.random() * 5)
      item.hide()
    }
  }
  end() {
    const app = document.getElementById('app')
    app.style.background = null
    for (let item of this.items) {
      item.hide()
    }
  }
  scroll() {
    this.count++
    if (this.count > 30 && Math.random() < 0.1) {
      const item = this.items[Math.floor(Math.random() * this.items.length)]
      if (!item.is_show) {
        item.x = 800 + item.width / 2
        item.y = 400 - item.height / 2
        item.show()
        this.count = 0
      }
    }
    for (let item of this.items) {
      item.x -= item.vx
      if (item.x < -item.width / 2) item.hide()
    }
  }
}
