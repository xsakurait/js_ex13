import { update } from "../../js_modules/update.js";

window.addEventListener(
  "load",
  function () {
    cgStart();
  },
  false
);

function cgStart() {
  // 1.レンダラー(CGの描画)オブジェクト生成
  //（復習）　newはオブジェクト生成のJavaScriptの命令
  let rendererObj = new THREE.WebGLRenderer();

  //レンダラーのプロパティ（色、サイズ）を設定
  rendererObj.setClearColor(new THREE.Color(0x000000)); //背景黒にして宇宙空間を表現
  rendererObj.setSize(window.innerWidth, window.innerHeight); //描画空間サイズ指定 //（１）影を描画するための宣言（影を計算する準備）
  // id=cg-frameのタグをオブジェクト化し、その中に描画オブジェクトを追加 THREE.TrackballControlsの引数で指定！
  document.getElementById("cg-frame").appendChild(rendererObj.domElement);
  // 2.シーン・オブジェクト生成：舞台を作成するイメージ
  //(3次元空間オブジェクトを生成：この中に物体を配置、描画)
  let sceneObj = new THREE.Scene();

  // 軸ヘルパーの表示(赤：x軸、緑：y軸、青：z軸)
  let axesObj = new THREE.AxesHelper(1000);
  axesObj.position.set(0, 0, 0); //座標軸原点中心に配置
  sceneObj.add(axesObj);

  // 光源オブジェクトの設定
  let paraLight = new THREE.DirectionalLight(); //平行光源（方向・強さはどこでも同じ｝
  paraLight.position.set(1, 1, 1); //方向設定、変えてみよ
  sceneObj.add(paraLight);

  // 周囲から全体にあたる弱い光：環境光（球の光が当たらない下側）
  let ambientLight = new THREE.AmbientLight(0x333333); //どの方向も同じ：べた塗り 質感見ながら調整
  sceneObj.add(ambientLight);

  //テクスチャマップ（１）
  // 地球形状作成：球で表現
  let earthGeoObj = new THREE.SphereGeometry(4, 64, 64); //緯度・経度分割６４

  // 表面模様（テクスチャ）に画像を貼り付けて近似する
  let texLoader = new THREE.TextureLoader(); //テクスチャを貼り付ける準備
  let texture = texLoader.load("./img/earth2.png"); //テクスチャ画像をロード

  // 表面状態
  // let earthMat = new THREE.MeshPhongMaterial({
  //   color: 0xffffff,
  //   specular: 0xcccccc,
  //   shininess: 8,
  //   map: texture,
  // }); //　　　鏡面反射の色　光沢の大きさ（最大３０）　（鏡面の度合い）　テクスチャマップ
  // バンプマップの場合（２）
  let earthMat = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0xcccccc,
    shininess: 8,
    map: texture,
    bumpMap: texture,
    bumpScale: 0.05, //凹凸具合を変えてみよ
  }); //鏡面反射の色　光沢の大きさ　（鏡面の度合い）　テクスチャマップ
  let earthObj = new THREE.Mesh(earthGeoObj, earthMat);
  earthObj.position.set(0, 0, 0); //原点に配置
  sceneObj.add(earthObj);

  // カメラ・オブジェクト生成（透視投影カメラ）
  let cameraObj = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // 太陽を定義
  let sunGeoObj = new THREE.SphereGeometry(12, 64, 64);
  // let sun_texLoader = new THREE.TextureLoader();
  let sun_texture = texLoader('./img/sun_paint.png');
  let sunMat=new THREE.MeshPhongMaterial({color:0xffff00,map:texture})
  let sunObj = new THREE.Mesh(sunGeoObj, sunMat);
  sunObj.position.set(50, 50, 50);
  sceneObj.add(sunObj);

  //カメラの位置、視線方向を設定
  cameraObj.position.set(10.0, 8.0, 10.0); //カメラの位置を変えてみよ
  cameraObj.lookAt(sceneObj.position); //sceneObjのpositionはデフォルトで原点
  // =let look = new THREE.Vector3(0.0, 0.0, .0.0);
  // cameraObj.lookAt(look)

  console.log("sceneObj.position:", sceneObj.position);
  //カメラをシーンに追加
  sceneObj.add(cameraObj);

  let trackballControls = new THREE.TrackballControls(
    cameraObj,
    rendererObj.domElement
  );
  trackballControls.rotateSpeed = 5.0;
  trackballControls.zoomSpeed = 1.0;
  trackballControls.panSpeed = 1.0; //回転の感度：調整せよ
  // レンダリング
  let clock = new THREE.Clock();
  let baseTime = +new Date();
  // Date=呼び出した時点の日時を日本標準時刻で取得
  function render() {
    let delta = clock.getDelta();
    trackballControls.update(delta);
    requestAnimationFrame(render);
    earthObj.rotation.y = (0.3 * (+new Date() - baseTime)) / 1000.0;
    rendererObj.render(sceneObj, cameraObj);
    angle_rad = Math.Pi / 3;
    camera_Rot_x = Ampli * Math.cos(angle_rad);
    camera_Rot_y = 1.1;
    camera_Rot_z = Ampli * Math.sin(angle_rad);
  }
  render();
}//end:cgStart
update(); //毎回必要（このファイルの1行目も）
