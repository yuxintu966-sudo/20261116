const STOP_FRAME_COUNT = 10; // 設定待機精靈圖的影格數量
const STOP_FRAME_WIDTH = 1395 / STOP_FRAME_COUNT; // 計算待機精靈圖每張影格的寬度
const STOP_FRAME_HEIGHT = 196; // 設定待機精靈圖每張影格的高度
const WALK_FRAME_COUNT = 9; // 設定行走精靈圖的影格數量
const WALK_FRAME_WIDTH = 1246 / WALK_FRAME_COUNT; // 計算行走精靈圖每張影格的寬度
const WALK_FRAME_HEIGHT = 198; // 設定行走精靈圖每張影格的高度
const MAGIC_FRAME_COUNT = 4; // 設定施法精靈圖的影格數量
const MAGIC_FRAME_WIDTH = 1039 / MAGIC_FRAME_COUNT; // 計算施法精靈圖每張影格的寬度
const MAGIC_FRAME_HEIGHT = 146; // 設定施法精靈圖每張影格的高度
const EFFECT_FRAME_COUNT = 5; // 設定魔法特效精靈圖的影格數量
const EFFECT_FRAME_WIDTH = 740 / EFFECT_FRAME_COUNT; // 計算魔法特效精靈圖每張影格的寬度
const EFFECT_FRAME_HEIGHT = 19; // 設定魔法特效精靈圖每張影格的高度
const FRAME_DURATION = 100; // 設定每張動畫影格顯示的毫秒數
const MOVE_SPEED = 5; // 設定角色每個畫面移動的像素數
const EFFECT_SPEED = 8; // 設定魔法特效每個畫面移動的像素數
let stopSpriteSheet; // 宣告角色待機精靈圖變數
let walkSpriteSheet; // 宣告角色行走精靈圖變數
let magicSpriteSheet; // 宣告角色施法精靈圖變數
let effectSpriteSheet; // 宣告魔法特效精靈圖變數
let characterX; // 儲存角色目前的水平中心位置
let facingLeft = false; // 記錄角色是否面向左方
let isCasting = false; // 記錄角色是否正在播放施法動畫
let magicFacingLeft = false; // 記錄施法開始時角色的面向
let magicStartTime = 0; // 記錄施法動畫開始的時間
let effectActive = false; // 記錄魔法特效是否正在移動
let effectX = 0; // 儲存魔法特效目前的水平位置
let effectY = 0; // 儲存魔法特效目前的垂直位置
let effectDirection = 1; // 記錄魔法特效的移動方向
let effectStartTime = 0; // 記錄魔法特效動畫開始的時間

function preload() { // 在畫布建立前載入角色與特效圖片
  stopSpriteSheet = loadImage('1/stop/stop.png'); // 載入包含十張影格的待機精靈圖
  walkSpriteSheet = loadImage('1/walk/walk.png'); // 載入包含九張影格的行走精靈圖
  magicSpriteSheet = loadImage('1/magic/magic.png'); // 載入包含四張影格的施法精靈圖
  effectSpriteSheet = loadImage('1/magic effect/magic effet.png'); // 載入資料夾中寬高為740乘19的五格魔法特效圖
} // 結束圖片載入函式

function setup() { // 設定畫布與角色繪圖方式
  createCanvas(windowWidth, windowHeight); // 建立符合視窗尺寸的畫布
  imageMode(CENTER); // 讓角色繪製座標代表圖片中心點
  frameRate(60); // 設定畫面更新頻率
  characterX = width * 2 / 3; // 將角色初始位置放在畫布寬度的三分之二處
} // 結束初始化函式

function draw() { // 每個畫面更新時繪製背景、角色與魔法特效
  background(135, 206, 235); // 使用天空藍清除並填滿畫布背景
  const leftPressed = keyIsDown(LEFT_ARROW); // 檢查目前是否按住左方向鍵
  const rightPressed = keyIsDown(RIGHT_ARROW); // 檢查目前是否按住右方向鍵
  const isWalking = !isCasting && (leftPressed || rightPressed); // 按住方向鍵且未施法時切換到行走動畫
  const normalFrameWidth = isWalking ? WALK_FRAME_WIDTH : STOP_FRAME_WIDTH; // 取得一般狀態精靈圖每張影格的寬度
  const normalFrameHeight = isWalking ? WALK_FRAME_HEIGHT : STOP_FRAME_HEIGHT; // 取得一般狀態精靈圖每張影格的高度
  const normalScale = min(width * 0.4 / normalFrameWidth, height * 0.4 / normalFrameHeight); // 依畫布尺寸計算一般角色縮放比例
  const normalSpriteWidth = normalFrameWidth * normalScale; // 計算一般角色縮放後的寬度
  const normalSpriteHeight = normalFrameHeight * normalScale; // 計算一般角色縮放後的高度
  if (isCasting && millis() - magicStartTime >= MAGIC_FRAME_COUNT * FRAME_DURATION) { // 施法影格播放完畢時啟動魔法特效
    isCasting = false; // 結束施法動畫並恢復一般角色動畫
    effectActive = true; // 開始顯示魔法特效
    effectDirection = magicFacingLeft ? -1 : 1; // 依施法時的角色面向設定特效移動方向
    effectX = characterX + effectDirection * (normalSpriteWidth / 2 + EFFECT_FRAME_WIDTH * normalScale / 2); // 從角色面向的一側發射特效
    effectY = height - normalSpriteHeight / 2; // 將特效放在角色的垂直中心高度
    effectStartTime = millis(); // 記錄特效動畫的起始時間
  } // 結束施法動畫完成判斷
  const spriteSheet = isCasting ? magicSpriteSheet : isWalking ? walkSpriteSheet : stopSpriteSheet; // 依狀態選擇角色精靈圖
  const frameCount = isCasting ? MAGIC_FRAME_COUNT : isWalking ? WALK_FRAME_COUNT : STOP_FRAME_COUNT; // 取得目前角色精靈圖的影格數量
  const frameWidth = isCasting ? MAGIC_FRAME_WIDTH : normalFrameWidth; // 取得目前角色精靈圖每張影格的寬度
  const frameHeight = isCasting ? MAGIC_FRAME_HEIGHT : normalFrameHeight; // 取得目前角色精靈圖每張影格的高度
  const elapsedMagicTime = millis() - magicStartTime; // 計算施法動畫已播放的時間
  const frameIndex = isCasting ? floor(elapsedMagicTime / FRAME_DURATION) : floor(millis() / FRAME_DURATION) % frameCount; // 施法影格只播放一次，其餘動畫循環播放
  const spriteScale = min(width * 0.4 / frameWidth, height * 0.4 / frameHeight); // 依畫布尺寸等比例縮放角色
  const spriteWidth = frameWidth * spriteScale; // 計算角色縮放後的寬度
  const spriteHeight = frameHeight * spriteScale; // 計算角色縮放後的高度
  if (!isCasting && leftPressed !== rightPressed) { // 未施法且只有一個方向鍵被按住時才移動角色
    characterX += (rightPressed ? 1 : -1) * MOVE_SPEED; // 依按鍵方向更新角色水平位置
  } // 結束角色移動判斷
  characterX = constrain(characterX, spriteWidth / 2, width - spriteWidth / 2); // 限制角色邊緣在畫布範圍內
  const spriteY = height - spriteHeight / 2; // 將角色圖片底端對齊畫布底端
  const characterFacingLeft = isCasting ? magicFacingLeft : facingLeft; // 施法時固定使用開始施法時的面向
  push(); // 暫存目前的繪圖狀態
  translate(characterX, spriteY); // 將繪圖原點移至角色中心位置
  if (characterFacingLeft) { // 角色面向左方時執行水平翻轉
    scale(-1, 1); // 水平翻轉精靈圖以改變角色面向
  } // 結束角色翻轉判斷
  image(spriteSheet, 0, 0, spriteWidth, spriteHeight, frameIndex * frameWidth, 0, frameWidth, frameHeight); // 顯示目前角色動畫影格
  pop(); // 還原原本的繪圖狀態
  if (effectActive) { // 魔法特效啟動期間持續移動並繪製特效
    effectX += effectDirection * EFFECT_SPEED; // 依施法方向移動魔法特效
    effectY = height - normalSpriteHeight / 2; // 讓特效在視窗尺寸改變後仍維持在角色高度
    const effectWidth = EFFECT_FRAME_WIDTH * normalScale; // 計算魔法特效縮放後的寬度
    const effectHeight = EFFECT_FRAME_HEIGHT * normalScale; // 計算魔法特效縮放後的高度
    if (effectX - effectWidth / 2 > width || effectX + effectWidth / 2 < 0) { // 特效完全離開畫布時將其移除
      effectActive = false; // 停止顯示已離開畫布的特效
    } else { // 特效仍在畫布範圍內時繼續顯示
      const effectFrameIndex = floor((millis() - effectStartTime) / FRAME_DURATION) % EFFECT_FRAME_COUNT; // 循環播放五張特效影格
      push(); // 暫存目前的繪圖狀態
      translate(effectX, effectY); // 將繪圖原點移至特效目前位置
      if (effectDirection < 0) { // 特效往左移動時執行水平翻轉
        scale(-1, 1); // 水平翻轉特效以符合移動方向
      } // 結束特效翻轉判斷
      image(effectSpriteSheet, 0, 0, effectWidth, effectHeight, effectFrameIndex * EFFECT_FRAME_WIDTH, 0, EFFECT_FRAME_WIDTH, EFFECT_FRAME_HEIGHT); // 顯示目前魔法特效影格
      pop(); // 還原原本的繪圖狀態
    } // 結束特效畫布範圍判斷
  } // 結束魔法特效繪製判斷
} // 結束繪圖函式

function keyPressed() { // 按下方向鍵或空白鍵時更新角色狀態
  if (keyCode === LEFT_ARROW) { // 按下左方向鍵時讓角色面向左方
    facingLeft = true; // 設定角色朝向左方
    return false; // 阻止方向鍵捲動網頁
  } // 結束左方向鍵判斷
  if (keyCode === RIGHT_ARROW) { // 按下右方向鍵時讓角色面向右方
    facingLeft = false; // 設定角色朝向右方
    return false; // 阻止方向鍵捲動網頁
  } // 結束右方向鍵判斷
  if (keyCode === 32) { // 按下空白鍵時啟動一次施法動畫
    if (!isCasting && !effectActive) { // 避免施法或特效尚未結束時重複觸發
      isCasting = true; // 切換角色至施法狀態
      magicFacingLeft = facingLeft; // 記錄施法開始時角色的面向
      magicStartTime = millis(); // 記錄施法動畫開始時間
    } // 結束施法啟動判斷
    return false; // 阻止空白鍵捲動網頁
  } // 結束空白鍵判斷
} // 結束按鍵事件函式

function windowResized() { // 視窗尺寸改變時重新調整畫布
  resizeCanvas(windowWidth, windowHeight); // 讓畫布持續填滿整個視窗
  characterX = constrain(characterX, 0, width); // 保持角色在新畫布的水平範圍內
} // 結束視窗調整函式
