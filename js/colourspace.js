(function(document, Reveal){

  var w = Reveal.getConfig().width,
      h = Reveal.getConfig().height;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 15, w / h, 0.1, 30 );
  // var camera = new THREE.OrthographicCamera( w / - 2, w / 2, h / 2, h / - 2, 1, 1000 );

  var renderer = new THREE.WebGLRenderer({antialias:true});
  // renderer.setSize( window.innerWidth, window.innerHeight );
  // renderer.setClearColor(0xdddddd);
  // document.body.appendChild( renderer.domElement );



  var group = new THREE.Object3D();


  camera.position.z = 10;
  camera.lookAt({x:0,y:0,z:0})
  // camera.position.y = -0.5



  function ball(color){
    var r = (color & 0xff0000) >> 16,
        g = (color & 0x00ff00) >> 8,
        b = (color & 0x0000ff);


    var geometry2 = new THREE.SphereGeometry(.05,10,10)
    var material = new THREE.MeshBasicMaterial( { wireframe: false, color: color, opacity: 0.2} );
    var sphere = new THREE.Mesh( geometry2, material );
    sphere.position.x = (r / 255) - 0.5;
    sphere.position.y = (g / 255) - 0.5;
    sphere.position.z = (b / 255) - 0.5;
    group.add( sphere );
  }


  ball(0x000000);

  ball(0x0000ff);
  ball(0x00ff00);
  ball(0xff0000);

  function interpolate(color1, color2, num){

    var r1 = (color1 & 0xff0000) >> 16,
        g1 = (color1 & 0x00ff00) >> 8,
        b1 = (color1 & 0x0000ff),
        r2 = (color2 & 0xff0000) >> 16,
        g2 = (color2 & 0x00ff00) >> 8,
        b2 = (color2 & 0x0000ff);

    var colours = [], r, g ,b;
    for(var i = 0; i < num+1; i++){
      r = (r1 + ((r2 - r1)*(i/num)));
      g = (g1 + ((g2 - g1)*(i/num)));
      b = (b1 + ((b2 - b1)*(i/num)));
      colours.push((r << 16) + (g << 8) + b)
    }
    return colours;
  }





  scene.add(group)


  group.rotation.x = 0.3;
  group.rotation.y = -0.5;


  var material = new THREE.LineBasicMaterial({
      color: 0x555555,
      linewidth: 3
  });

  var geometry = new THREE.Geometry();

  geometry.vertices.push(new THREE.Vector3(-.5,-.5,-.5));
  geometry.vertices.push(new THREE.Vector3(-.5,1,-.5));
  geometry.vertices.push(new THREE.Vector3(-.5,-.5,-.5));
  geometry.vertices.push(new THREE.Vector3(-.5,-.5,1));
  geometry.vertices.push(new THREE.Vector3(-.5,-.5,-.5));
  geometry.vertices.push(new THREE.Vector3(1,-.5,-.5));
  geometry.vertices.push(new THREE.Vector3(-.5,-.5,-.5));



   var line = new THREE.Line(geometry, material);
   scene.add(line);


  line.rotation.x = 0.3;
  line.rotation.y = -0.5;

  renderer.render(scene, camera);

  var stop = false, rotateby = 0.003;

  function render() {
    if(!stop) requestAnimationFrame(render);
    renderer.render(scene, camera);

    group.rotation.y += rotateby;
    line.rotation.y = group.rotation.y
    TWEEN.update();

  }
  // render();


  var cube;

  function draw_white(){
    ball(0xffffff);

    var geometry = new THREE.CubeGeometry(1,1,1,3,3,3);
    var material = new THREE.MeshBasicMaterial( { wireframe: false, color: 0x000000, opacity: 0.1} );
    material.transparent = true;
    cube = new THREE.Mesh( geometry, material );
    group.add( cube );
  }

  function draw_cyk(){

    ball(0x00ffff);
    ball(0xffff00);
    ball(0xff00ff);

  }

  function draw_bluegrad(){
    interpolate(0x2E2380,0x877BD6 ,6).forEach(ball);
  }



  function draw_cylinder(){

    var hsl = new THREE.CylinderGeometry(Math.sqrt(3)/2, Math.sqrt(3)/2, Math.sqrt(3), 40, 3, false);

    var material = new THREE.MeshBasicMaterial( { wireframe: true, color: 0x000000, opacity: 0.1} );
    material.transparent = true;
    var cylinder = new THREE.Mesh( hsl, material );

    cylinder.rotation.x = Math.PI/4
    cylinder.rotation.z = 2.55;

    group.add( cylinder );

    cube.visible = false

    // rotateby = 0.005;

  }






  function draw_rotate(){
    rotateby = 0;

    var position = { x: group.rotation.x % (Math.PI*2), y: group.rotation.y % (Math.PI*2) };
    var target = { x: -Math.PI/4 + 0.2, y: (-Math.PI/4) };
    var tween = new TWEEN.Tween(position).to(target, 1000);
    tween.easing(TWEEN.Easing.Quartic.InOut)
    tween.onUpdate(function(){
      line.rotation.x = group.rotation.x = position.x
      line.rotation.y = group.rotation.y = position.y

    });
    tween.start()
  }


  function draw_by_hue(){
    var hue_position = { x: group.rotation.x };
    var hue_target = { x: 0.62 };
    var tween = new TWEEN.Tween(hue_position).to(hue_target, 1000);
    tween.easing(TWEEN.Easing.Quartic.InOut)
    tween.onUpdate(function(){
      line.rotation.x = group.rotation.x = hue_position.x
    });
    tween.start();
  }


  // ------------------- connect to presentation

  this.colourspace = function(){
    var section = document.querySelector('[data-colour-cubes]');

    section.style.padding='0'


    renderer.setSize( w, h );

    renderer.setClearColor(0xdddddd);
    section.appendChild( renderer.domElement );

    renderer.render(scene, camera);

    var slide = new DynamicSlide(section);

    // start the render loop
    slide.addEventListener('shown', function(){
      render();
      draw_white()
      draw_cyk()
    });

    // halt the render loop
    slide.addEventListener('hidden', function(){ stop = true; })

    slide.fragments([
        draw_bluegrad,
        draw_rotate,
        draw_cylinder,
        draw_by_hue,
    ]);

  }
}).call(this, document, Reveal)