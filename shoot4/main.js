
// メインループ
window.onload = () => {
  const player = new Player()
  const enemies = new EnemyCollection()
  setInterval(() => {
    enemies.born()
    player.move()
    enemies.move(player.x, player.y)
    enemies.hit_bullets(player.bullets)
  }, 16)
}
