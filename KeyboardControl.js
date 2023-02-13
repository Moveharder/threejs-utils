/**
 * 监听键盘事件
 * w 前 ｜ s 后 ｜ a 左 ｜ d 右 ｜ c 切换视野模式
 * 
 * 使用Demo：
 * this.keyCtrl = new KeyboardControl({
 *    game: this,
 *    onMove: this.joyStickCallback,
 *    onViewChange: this.onViewChangeCallback,
 * });
 */
export class KeyboardControl {
  constructor(props = {}) {
    this.game = props.game;
    this.rotationDamping = props.rotationDamping || 0.06;
    this.moveDamping = props.moveDamping || 0.01;
    this.onMove = props.onMove;
    this.onViewChange = props.onViewChange;
    this.move = { up: 0, right: 0 };
    this.keys = {
      w: false,
      a: false,
      d: false,
      s: false,
      e: false,
      c: false,
      enter: false,
      space: false,
    };
    this.addKeyListener();
  }

  addKeyListener() {
    document.addEventListener("keydown", this.onKeydown.bind(this));
    document.addEventListener("keyup", this.onKeyup.bind(this));
  }

  onKeydown(e) {
    switch (e.key) {
      case "w":
        this.keys.w = true;
        break;
      case "s":
        this.keys.s = true;
        break;
      case "a":
        this.keys.a = true;
        break;
      case "d":
        this.keys.d = true;
        break;
      case "e":
        this.keys.e = true;
        break;
      case "c":
        this.keys.c = true;
        break;
      case "enter":
        this.keys.enter = true;
        break;
      case "space":
        this.keys.space = true;
        break;
    }
  }

  onKeyup(e) {
    switch (e.key) {
      case "w":
        this.keys.w = false;
        this.move.up = 0;
        break;
      case "s":
        this.keys.s = false;
        this.move.up = 0;
        break;
      case "a":
        this.keys.a = false;
        this.move.right = 0;
        break;
      case "d":
        this.keys.d = false;
        this.move.right = 0;
        break;
      case "e":
        this.keys.e = false;
        break;
      case "c":
        this.keys.c = false;
        let isToggle = true;
        this.onViewChange.call(this.game, isToggle);
        break;
      case "enter":
        this.keys.enter = false;
        break;
      case "space":
        this.keys.space = false;
        break;
    }
  }

  /**
   * 调用者需要持续调用
   */
  update() {
    if (this.keys.w) this.move.up += this.moveDamping;
    if (this.keys.s) this.move.up -= this.moveDamping;
    if (this.keys.a) this.move.right += this.rotationDamping;
    if (this.keys.d) this.move.right -= this.rotationDamping;
    if (this.move.up > 0.6) this.move.up = 0.6;
    if (this.move.up < -0.6) this.move.up = -0.6;
    if (this.move.right > 1) this.move.right = 1;
    if (this.move.right < -1) this.move.right = -1;

    // 转弯时减速
    if (Math.abs(this.move.right) == 1 && Math.abs(this.move.up) > 0.3)
      this.move.up *= 0.8;

    const { up, right } = this.move;
    if (this.onMove !== undefined) this.onMove.call(this.game, up, -right);
  }

  destory() {
    document.removeEventListener("keydown", this.onKeydown.bind(this));
    document.removeEventListener("keyup", this.onKeyup.bind(this));
  }
}
