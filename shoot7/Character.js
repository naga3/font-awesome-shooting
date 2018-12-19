// キャラクタークラス
class Character {
  constructor(class_name, color, size) {
    this.id_name = `character${Character.character_no}`
    this._show = true
    this._x = 0
    this._y = 0
    Character.character_no++
    const app = document.getElementById('app')
    app.insertAdjacentHTML('beforeend', `<i id="${this.id_name}" class="fas ${class_name}"></i>`)
    this.$.style.position = 'absolute'
    this.$.style.color = color || 'white'
    this.$.style.textShadow ="2px 2px 2px black"
    if (size) this.$.style.fontSize = size + 'px'
    this.hide()
  }
  get $() { return document.getElementById(this.id_name) }
  get x() { return this._x }
  get y() { return this._y }
  get width() { return this.$.clientWidth }
  get height() { return this.$.clientHeight }
  get is_show() { return this._show }
  set x(x) {
    this._x = x
    this.$.style.left = x - this.width / 2 + 'px'
  }
  set y(y) {
    this._y = y
    this.$.style.top = y - this.height / 2 + 'px'
  }
  show() {
    this.$.style.visibility = 'visible'
    this._show = true
  }
  hide() {
    this.$.style.visibility = 'hidden'
    this._show = false
  }
  hit(target) {
    if (this.x + this.width / 2 >= target.x - target.width / 2
      && this.x - this.width / 2 < target.x + target.width / 2
      && this.y + this.height / 2 >= target.y - target.height / 2
      && this.y - this.height / 2 < target.y + target.height / 2)
      return true
    return false
  }
}
Character.character_no = 1
