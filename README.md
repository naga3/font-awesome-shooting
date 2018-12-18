![shoot.gif](https://qiita-image-store.s3.amazonaws.com/0/32030/ff77545d-237c-41aa-6a4e-4702b49df7be.gif)

完成バージョンをやってみる: https://naga3.github.io/font-awesome-shooting/shoot6/

1000点行けたらスゴいです:santa:

# はじめに

[Font Awesome](https://fontawesome.com/)のサイトを眺めてたらゲームで使えそうなキャラクターがいっぱいあるなあと思ったので、シューティングゲームを作ることにしました。

面倒だったので最初は慣れているjQueryを使っていますが、後ほどバニラなJavaScriptに書き換えます。

GitHubリポジトリ: https://github.com/naga3/font-awesome-shooting

## アジェンダ

- ベタ書きでとりあえず作る
- クラスを使って整理する
- jQueryの使用をやめる
- モジュール分割・弾の連射・敵の複数表示
- シーン切り替え・スコア・レベル
- 背景スクロール・敵の種類・スマホ対応など

# ベタ書きで作ってみる

https://naga3.github.io/font-awesome-shooting/shoot1.html

以下にソースコードを示します。ブラウザでHTMLを開くとゲームができます。

```html:shoot1.html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <style>
      body {
        margin: 0;
        padding: 0;
      }
      #app {
        width: 800px;
        height: 400px;
        background: black;
        position: relative;
        overflow: hidden;
        left: 0;
        top: 0;
        cursor: none;
      }
      #player {
        position: absolute;
        color: lightskyblue;
      }
      #bullet {
        position: absolute;
        color: gold;
        left: 800px;
      }
      #enemy {
        position: absolute;
        color: coral;
        left: -100px;
      }
    </style>
    <title>Font Awesome shooting game!</title>
  </head>
  <body>
    <div id="app">
        <i id="bullet" class="fas fa-toggle-on"></i>
        <i id="player" class="fas fa-fighter-jet fa-3x"></i>
        <i id="enemy" class="fas fa-helicopter fa-flip-horizontal fa-3x"></i>
    </div>
    <script src="https://use.fontawesome.com/releases/v5.5.0/js/all.js"></script>
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script>
      let showBullet = false
      setInterval(() => {
        $('#enemy').css('left', $('#enemy').offset().left - 6)
        if ($('#enemy').offset().left < -100) {
          $('#enemy').offset({
            left: 800,
            top: Math.random() * (400 - $('#enemy').height())
          })
        }
        if (showBullet) {
          $('#bullet').css('left', $('#bullet').offset().left + 12)
          if ($('#bullet').offset().left > 800) showBullet = false
          if (
            $('#bullet').offset().left + $('#bullet').width() >= $('#enemy').offset().left &&
            $('#bullet').offset().left < $('#enemy').offset().left + $('#enemy').width() &&
            $('#bullet').offset().top + $('#bullet').height() >= $('#enemy').offset().top &&
            $('#bullet').offset().top < $('#enemy').offset().top + $('#enemy').height()
          ) {
            showBullet = false
            $('#bullet').css('left', 800)
            $('#enemy').css('left', -100)
          }
        }
      }, 16)
      $('#app').mousemove(e => {
        $('#player').offset({
          left: e.clientX - $('#player').width() / 2,
          top: e.clientY - $('#player').height() / 2
        })
      })
      $('#app').click(e => {
        if (showBullet) return
        showBullet = true
        $('#bullet').offset({
          left: e.clientX - $('#bullet').width() / 2,
          top: e.clientY - $('#bullet').height() / 2
        })
      })
    </script>
  </body>
</html>
```

## ソースの解説

HTML内ののid:`player`に自機、id:`enemy`に敵、id:`bullet`に弾の要素が入っています。
Font Awesomeではclass名に`fa-3x`を指定すると、フォントの大きさが通常の三倍になります。便利ですね。

id:`app`の要素がゲームフィールドで、横800px × 縦400pxの大きさです。

`setInterval`を使って、16msに一回ゲームが更新されるようにしています。16msというはだいたい1/60秒です。歴史的な事情でこのタイミングで更新されるゲームが多いので、意味はありませんがなんとなくこの値にしています。

あとは、当たり判定が若干分かりにくいと思います。

```javascript
$('#bullet').offset().left + $('#bullet').width() >= $('#enemy').offset().left &&
$('#bullet').offset().left < $('#enemy').offset().left + $('#enemy').width() &&
$('#bullet').offset().top + $('#bullet').height() >= $('#enemy').offset().top &&
$('#bullet').offset().top < $('#enemy').offset().top + $('#enemy').height()
```

この部分です。弾を囲む矩形と敵を囲む矩形の座標をチェックして、矩形同士が少しでも重なっていたら当たっていると見なしています。

# クラスを使ってみる

https://naga3.github.io/font-awesome-shooting/shoot2.html

`shoot1.html`のソースコードは短いのですが、いくつか問題点があります。

- jQueryの機能にベッタリなので、違うライブラリを使うのが大変になる。
- キャラクターをDOM要素のidで管理しているので、キャラクターが増えると管理が大変。
- 当たり判定が増える（自機と敵など）と都度当たり判定のコードを書く必要がある。

などなど。

そこで最近のJavaScript（いわゆるモダンJSというやつですね）で追加されたクラスを使って、`shoot1.html`を書き換えてみましょう。

```html:shoot2.html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <style>
      body {
        margin: 0;
        padding: 0;
      }
      #app {
        width: 800px;
        height: 400px;
        background: black;
        position: relative;
        overflow: hidden;
        left: 0;
        top: 0;
        cursor: none;
      }
    </style>
    <title>Font Awesome shooting game! - with class</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="https://use.fontawesome.com/releases/v5.5.0/js/all.js"></script>
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script>

      // マウスイベントクラス
      class Mouse {
        constructor() {
          this.click = false
          $('#app').mousemove(e => {
            this.x = e.clientX
            this.y = e.clientY
          })
          $('#app').mousedown(() => this.click = true)
          $('#app').mouseup(() => this.click = false)
        }
      }

      // キャラクタークラス
      let character_no = 1
      class Character {
        constructor(class_name, color) {
          this.id_name = `character${character_no}`
          this.is_show = true
          character_no++
          $('#app').append(`<i id="${this.id_name}" class="fas ${class_name}"></i>`)
          this.$.css({
            position: 'absolute',
            color: color
          })
        }
        get $() { return $('#' + this.id_name) }
        get x() { return this.$.offset().left }
        get y() { return this.$.offset().top }
        get width() { return this.$.width() }
        get height() { return this.$.height() }
        set x(x) {
          this.$.offset({ left: x, top: this.y })
        }
        set y(y) {
          this.$.offset({ left: this.x, top: y })
        }
        show() {
          this.$.css({visibility: 'visible'})
          this.is_show = true
        }
        hide() {
          this.$.css({visibility: 'hidden'})
          this.is_show = false
        }
        hit(target) {
          if (this.x + this.width >= target.x && this.x < target.x + target.width
            && this.y + this.height >= target.y && this.y < target.y + target.height)
            return true
          return false
        }
      }

      // 弾クラス
      class Bullet extends Character {
        move() {
          if (this.is_show) {
            this.x += 12
            if (this.x > 800) this.hide()
          }
        }
      }

      // 自機クラス
      class Player extends Character {
        constructor(class_name, color) {
          super(class_name, color)
          this.mouse = new Mouse()
          this.bullet = new Bullet('fa-toggle-on', 'gold')
          this.bullet.hide()
        }
        move() {
          this.x = this.mouse.x - this.width / 2
          this.y = this.mouse.y - this.height / 2
          if (this.mouse.click && !this.bullet.is_show) {
            this.bullet.x = this.mouse.x - this.bullet.width / 2
            this.bullet.y = this.mouse.y - this.bullet.height / 2
            this.bullet.show()
            this.mouse.click = false
          }
          this.bullet.move()
        }
      }

      // 敵クラス
      class Enemy extends Character {
        move() {
          this.x -= 6
          if (this.x < -100) {
            this.x = 800
            this.y = Math.random() * (400 - this.height)
          }
        }
      }

      // メインループ
      $(() => {
        const player = new Player('fa-fighter-jet fa-3x', 'lightskyblue')
        const enemy = new Enemy('fa-helicopter fa-flip-horizontal fa-3x', 'coral')
        enemy.x = -100
        setInterval(() => {
          player.move()
          enemy.move()
          if (player.bullet.hit(enemy)) {
            player.bullet.hide()
            enemy.x = -100
          }
        }, 16)
      })
    </script>
  </body>
</html>
```

## ソースの解説

`Character`クラスは自機や敵や弾の共通の性質をまとめたクラスです。DOM要素の生成、CSSの設定、キャラクターの表示、消去、座標の取得と設定、大きさの取得、当たり判定などの機能があります。

`Character`クラスを派生して`Player`, `Bullet`, `Enemy`クラスを定義し、それぞれ独自の性質を追加しています。

`Mouse`クラスにはマウスイベントを集約しています。

`shoot1.html`に比べて、大変すっきりしましたね。また、jQueryに依存している部分が`Mouse`クラスと`Character`クラスしかないので、他のライブラリに簡単に置き換えることができるようになりました。

# jQueryの使用をやめる

https://naga3.github.io/font-awesome-shooting/shoot3.html

jQueryを見ると蕁麻疹が出る方のために、バニラなJavaScriptで書き換えたソースコードを示します。`shoot2.html`でjQuery部分を分離したので楽です。

```html:shoot3.html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <style>
      body {
        margin: 0;
        padding: 0;
      }
      #app {
        width: 800px;
        height: 400px;
        background: black;
        position: relative;
        overflow: hidden;
        left: 0;
        top: 0;
        cursor: none;
      }
    </style>
    <title>Font Awesome shooting game! - vanilla JavaScript</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="https://use.fontawesome.com/releases/v5.5.0/js/all.js"></script>
    <script>

      // マウスイベントクラス
      class Mouse {
        constructor() {
          this.click = false
          const app = document.getElementById('app')
          app.addEventListener('mousemove', e => {
            this.x = e.clientX
            this.y = e.clientY
          })
          app.addEventListener('mousedown', () => this.click = true)
          app.addEventListener('mouseup', () => this.click = false)
        }
      }

      // キャラクタークラス
      let character_no = 1
      class Character {
        constructor(class_name, color) {
          this.id_name = `character${character_no}`
          this.is_show = true
          this._x = 0
          this._y = 0
          character_no++
          const app = document.getElementById('app')
          app.insertAdjacentHTML('beforeend', `<i id="${this.id_name}" class="fas ${class_name}"></i>`)
          this.$.style.position = 'absolute'
          this.$.style.color = color
        }
        get $() { return document.getElementById(this.id_name) }
        get x() { return this._x }
        get y() { return this._y }
        get width() { return this.$.clientWidth }
        get height() { return this.$.clientHeight }
        set x(x) {
          this._x = x
          this.$.style.left = x + 'px'
        }
        set y(y) {
          this._y = y
          this.$.style.top = y + 'px'
        }
        show() {
          this.$.style.visibility = 'visible'
          this.is_show = true
        }
        hide() {
          this.$.style.visibility = 'hidden'
          this.is_show = false
        }
        hit(target) {
          if (this.x + this.width >= target.x && this.x < target.x + target.width
            && this.y + this.height >= target.y && this.y < target.y + target.height)
            return true
          return false
        }
      }

      // 弾クラス
      class Bullet extends Character {
        move() {
          if (this.is_show) {
            this.x += 12
            if (this.x > 800) this.hide()
          }
        }
      }

      // 自機クラス
      class Player extends Character {
        constructor(class_name, color) {
          super(class_name, color)
          this.mouse = new Mouse()
          this.bullet = new Bullet('fa-toggle-on', 'gold')
          this.bullet.hide()
        }
        move() {
          this.x = this.mouse.x - this.width / 2
          this.y = this.mouse.y - this.height / 2
          if (this.mouse.click && !this.bullet.is_show) {
            this.bullet.x = this.mouse.x - this.bullet.width / 2
            this.bullet.y = this.mouse.y - this.bullet.height / 2
            this.bullet.show()
            this.mouse.click = false
          }
          this.bullet.move()
        }
      }

      // 敵クラス
      class Enemy extends Character {
        move() {
          this.x -= 6
          if (this.x < -100) {
            this.x = 800
            this.y = Math.random() * (400 - this.height)
          }
        }
      }

      // メインループ
      window.onload = () => {
        const player = new Player('fa-fighter-jet fa-3x', 'lightskyblue')
        const enemy = new Enemy('fa-helicopter fa-flip-horizontal fa-3x', 'coral')
        enemy.x = -100
        setInterval(() => {
          player.move()
          enemy.move()
          if (player.bullet.hit(enemy)) {
            player.bullet.hide()
            enemy.x = -100
          }
        }, 16)
      }
    </script>
  </body>
</html>
```

https://github.com/nefe/You-Dont-Need-jQuery 当たりを参照すれば、簡単に書き換えられるのではないかと思います。

`Mouse`クラスと`Character`クラスと、`$.ready`のみ書き換えています。`$.ready`と`window.load`は厳密に言えば若干違いますが、お気になさらず。

# モジュール分割・弾の連射・敵の複数表示

https://naga3.github.io/font-awesome-shooting/shoot4

![shoot4.png](https://qiita-image-store.s3.amazonaws.com/0/32030/21c2b90f-e751-9879-2086-f52131e851aa.png)

弾と敵がひとつずつなのは寂しいので、複数表示できるようにしてみました。
また、ソースコードが長くなりそうなので、モジュールに分割しました。

ソースコードはこちら: https://github.com/naga3/font-awesome-shooting/tree/master/shoot4

## モジュール分割

モジュール分割でよく使われているのが、[webpack](https://webpack.js.org/)などでモジュールを統合することですが、多少前準備が必要になるので、使っていません。また、最近のJavaScriptには[モジュール分割する機構](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/import)がありますが、CORSに引っかかってローカルで気軽に試せなくなるので、今回は使っていません。昔ながらのscriptタグでの分割をしています。

```html
<script src="Mouse.js"></script>
<script src="Character.js"></script>
<script src="Bullet.js"></script>
<script src="Enemy.js"></script>
<script src="Player.js"></script>
<script src="main.js"></script>
```

クラス毎に分割しています。

## 弾の連射

一画面に弾を複数表示するには、各弾の生存管理をしなければなりません。

`Bullet.js`の`BulletCollection`が弾の管理をするクラスです。

```javascript
// 弾コレクションクラス
class BulletCollection {
  constructor() {
    this.items = []
  }

  //・・・・・・
}
```

配列`this.items`に各弾`Bullet`のインスタンスが入ります。まずコンストラクタで最大数`MAX_ITEMS`まで`Bullet`インスタンスを生成し、各弾の生存管理は表示・非表示`is_show`で管理しています。

弾を打つたびに`Bullet`インスタンスを生成したほうがシンプルな構造にになりますが、DOMの追加は非常に重い処理なので、最初にまとめてやっています。

マウスのボタンを押すと、`Player`インスタンスから`BulletCollection.born`メソッドがトリガーされ、弾が発生します。弾の配列を先頭から走査して、生存していない弾（`is_show`が`False`）を`Bullet.born`メソッドで発生させる処理をやっています。

## コレクションのアルゴリズムについて

実際は、複数キャラクターの生存管理は、[連結リスト](https://ja.wikipedia.org/wiki/%E9%80%A3%E7%B5%90%E3%83%AA%E3%82%B9%E3%83%88)を使うのが良いと思います。
また、配列を使う場合でも、今回のようなフラグでの生存管理ではなく、`splice`などによって配列自体のサイズ変更をしたほうがシンプルに実装できる場合があります。
ただ今回は、DOMを最初に全て生成しておくという関係上、配列サイズは固定にして、フラグによる生存管理方法を採っています。

## 敵の複数表示

こちらもやっていることは弾の連射と同じです。`Enemy.js`の`EnemyCollection`が敵の生存管理をするクラスです。

弾の場合はマウスクリックがトリガーとなって発生しますが、敵の場合は`main.js`の中で毎フレーム`EnemyCollection.born`メソッドが呼ばれます。毎フレーム敵が発生するとワチャワチャしてしまうので、`interval`変数で発生頻度を抑えています。

## 敵が自機を追跡する

`Enemy.vy`変数を追加していますが、これは敵の上下方法の速度です。`Enemy.move`メソッドに自機の座標を渡し、自機を追いかけてくるようなロジックにしています。

```javascript
this.vy += 0.0002 * (py - this.y)
if (this.vy > 4) this.vy = 4
if (this.vy < -4) this.vy = -4
this.y += this.vy
```

自機と敵の座標の差分を速度にしていますが、そのままでは速すぎるので、ある程度のしきい値を設けています。

## 敵と弾との当たり判定

敵が複数で、弾も複数なので、複数×複数の当たり判定が必要になります。シンプルに二重ループでも良いのですが、今回は`BulletCollection.hit_enemy`（すべての弾と敵1体の当たり判定）を`EnemyCollection.hit_bullets`内からすべての敵に対して呼び出すことによって、当たり判定を行っています。

# シーン切り替え・スコア・レベル

https://naga3.github.io/font-awesome-shooting/shoot5

タイトル画面とゲームオーバー画面を追加し、自機が敵に当たったらゲームオーバー画面に移行するようにします。ゲームオーバー画面ではスコアを表示します。

さらに、レベルを追加し、敵の攻撃がだんだん激しくなるようにしています。

ソースコードはこちら: https://github.com/naga3/font-awesome-shooting/tree/master/shoot5

## シーン切り替え

メイン画面に加え、タイトル画面・ゲームオーバー画面を追加しました。

タイトル画面：
![title.png](https://qiita-image-store.s3.amazonaws.com/0/32030/82d5ea54-ec6f-b939-695c-cf3292d5c65b.png)
ゲームオーバー画面：
![over.png](https://qiita-image-store.s3.amazonaws.com/0/32030/da63c34d-5aa9-b99a-b48e-a630b14f89d5.png)

文字はGoogle Fontsの [Fredoka One](https://fonts.google.com/specimen/Fredoka+One) を使っています。HTMLに以下の一文を書き、CSSでフォントの指定をするだけで使えます。便利な時代になったものです。

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Fredoka+One">
```

```css
body {
  font-family: 'Fredoka One', cursive;
}
```

シーン切り替えを実装する場合は、シーンが始まるときにオブジェクトやイベントリスナの初期化を正しく行い、次のシーンに切り替わるときに正しく後始末をするのが重要になります。

`main.js`内でクラスとしてシーンを分割し、その中で初期化と後始末の責務を果たしています。`initTitle`がタイトル画面、`initMain`がメイン画面、`initOver`がゲームオーバー画面のシーンの初期化をしていますになっています。

## 自機と敵との当たり判定

シーンを作らないとゲームオーバーに移行できないので、自機と敵の当たり判定をここでやっと実装しました。

`Player.hit_enemy`メソッドで当たり判定を行っていますが、弾と敵との当たり判定とは若干処理が違います。

```javascript
if (this.x >= enemy.x - enemy.width / 2
  && this.x < enemy.x + enemy.width / 2
  && this.y >= enemy.y - enemy.height / 2
  && this.y < enemy.y + enemy.height / 2) return true
return false
```

自機の中心の1ピクセルのみ、当たり判定があります。弾と敵との当たり判定はなるべく大きく、自機と敵との当たり判定はなるべく小さくすることによって、ゲーム中のストレスを少なくする狙いがあります。

## レベル

毎フレームにレベルをカウントアップして行き、敵の出現間隔を少しずつ狭めています。`EnemyCollection.born`を参照してみてください。

```javascript
this.interval += Math.log(level) * 5
if (this.interval > 2000) {
  // born
```

レベルをそのまま出現間隔にすると勢いがつきすぎるのでlog関数で緩やかにしています。

# 背景スクロール・敵の種類・スマホ対応など

https://naga3.github.io/font-awesome-shooting/shoot6

![shoot6.png](https://qiita-image-store.s3.amazonaws.com/0/32030/25c180cc-396d-0653-dac5-87cfff4034f2.png)

背景スクロールや、自機や敵に少しスタイリングして、完成度を上げました。

ソースコードはこちら: https://github.com/naga3/font-awesome-shooting/tree/master/shoot6

## 背景スクロール

もちろん背景もFont Awesomeのアイコンを使います。

`Background`クラスに背景に使うアイコン・色・サイズの配列を入れておき、毎フレーム`Background.scroll`メソッドを呼びスクロールしています。

## 敵の種類

今回は3種類の敵を作りました。

- `EnemyBird`は今までと同じ、Y軸方向を合わせて自機に向かってくる敵です。CSSのroatateで自機の方向に首を傾けるようにしています。
- `EnemyHippo`はたまにジャンプする敵です。最初にマイナスの速度を設定し、毎フレーム一定の値をプラスすることによって放物線のような効果を出しています。CSSのrotateを使って、ジャンプするときは首を上げ、落ちるときは首を下げるようにして、多少自然な動きになるようにしています。
- `EnemyDice`はX軸方向もY軸方向も執拗に自機を追いかけてくる敵です。Font Awesomeの機能で、classに`fa-spin`を追加すると、くるくる回るようになります。

3クラスとも共通で`born`メソッドと`move`メソッドを持つことによって、独自の動きを演出可能で、さらに`EnemyCollection`側からはインスタンスがどのクラスかを知る必要がありません。C++などではポリモーフィックな設定をしっかりしなければいけませんが、JavaScriptでは何も考えずただ呼べるので楽です（その分、バグも混入しやすくなりますが）。

## スマホ対応

`Mouse`クラスを拡張してタッチイベントを取るようにしたので、ある程度スマホでも動くようになったと思います。スマホの場合は、タッチした場所に自機を移動させると指でキャラクターが隠れてしまうので、タッチした場所からの増分で自機を動かすようにしました。

```javascript
const mx = e.changedTouches[0].pageX
const my = e.changedTouches[0].pageY
this.x += mx - this.tx
this.y += my - this.ty
this.tx = mx
this.ty = my
```

TouchEvent.changedTouchesにはタッチした場所の情報が入ります。スマホはマルチタッチ可能なので配列になっています。`this.tx`, `this.ty`には直前のフレームでタッチした場所を保存しておきます。プレイヤーの座標に、(現在タッチした場所 - 直前でタッチした場所)を足すことによって、タッチした場所からの増分でプレイヤーを動かすようにしています。

# 終わりに

最初はFont Awesomeはゲームが作れるくらいキャラクターが揃っているなーという適当な思いつきでしたが、結構ちゃんとしたゲームになったのではないでしょうか。

あとは、面の概念やパワーアップなどを実装すると、シューティングゲームとしての完成度が上がると思います。
