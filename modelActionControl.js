import { AnimationMixer } from "three";

/**
 * 提取模型的动作动画组，并控制播放。
 * Created By Believer.
 * 
 * Usage:
 *  playerMesh; //玩家模型
    playerMixer = null; //玩家模型动画控制器
    playerActions = {
    lastAction: "Idle",
    }; //玩家模型动画动作组

    // 实例化
    this.ActCtrl = new ModelActionControl(this);

    // 加载模型，并收集模型的动画，动画控制
    loadPlayer() {
        this.gltfLoader.load(
            "Robot.glb",
            (gltf) => {
                this.playerMesh = gltf.scene;
                this.playerMesh.position.set(0, 0, 0);
                this.playerMesh.scale.set(0.3, 0.3, 0.3);

                // 收集动作动画组
                const { mixer, actions } = this.ActCtrl.createModelActions("robot", gltf);
                this.playerMixer = mixer;
                this.playerActions = actions;

                // 播放某个动画
                this.playerActions = this.ActCtrl.toggleModelAction(
                    this.playerActions,
                    "wave"
                );

                this.scene.add(gltf.scene);
            },
            (progress) => {},
            (error) => {console.error}
        );
    }

    // 更新动画播放状态
    update(elapsedTime, deltaTime) {
        if (this.playerMixer) {
        this.playerMixer.update(deltaTime * 1.5);
        }
    }
 */
export class ModelActionControl {
  constructor(game) {
    this.game = game;
    this.modelActionsMap = {}; // {name:actions}=>{'player1':{idle:clipAction, jump:clipAction,}}
  }

  /**
   * 提取目标模型的动画组
   * @param {*} gltf
   * @returns {mixer, actions}
   */
  createModelActions(name, gltf) {
    let mixer = new AnimationMixer(gltf.scene); // 动画更新播放控制器
    let actions = { lastAction: "" }; // 所包含的动画组对象
    gltf.animations.map((item) => {
      if (item.name) {
        actions[item.name.toLowerCase()] = mixer.clipAction(item); //存储动作播放函数
      }
    });

    this.modelActionsMap[name] = actions;
    return { mixer, actions };
  }

  /**
   * 切换动画：从当前动画到新的动画，并返回modelActions
   * @param {*} modelActions 模型的动画组，初始值为 { lastAction: "" }
   * @param {*} toAct 要切换到的动画动作名称
   * @returns
   */
  toggleModelAction(modelActions = { lastAction: "" }, toAct) {
    const { lastAction } = modelActions;
    if (toAct != lastAction) {
      lastAction && modelActions[lastAction].fadeOut(0.3); //淡出
      modelActions[toAct].reset(); //重置播放位置
      modelActions[toAct].setEffectiveWeight(1); //设置动画权重
      modelActions[toAct].play();
      modelActions[toAct].fadeIn(0.3); //淡入

      modelActions.lastAction = toAct;
    }
    return modelActions;
  }

  /**
   * 获取某个模型的动作动画组
   * @param {*} name 模型名称，与createModelActions传递的一致
   * @returns Actions
   */
  getActions(name) {
    return this.modelActionsMap[name];
  }

  destroy() {
    this.modelActionsMap = {};
  }
}
