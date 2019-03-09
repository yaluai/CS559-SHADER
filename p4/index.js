
var m4 = twgl.m4;
var v3 = twgl.v3;
var gl = document.querySelector("#c").getContext("webgl");
var programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);

var fov = 30 * Math.PI / 180;
var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
var zNear = 0.5;
var zFar = 500;
var projection = m4.perspective(fov, aspect, zNear, zFar);
var eye = [10, 10, -50];
var target = [0, 0, 0];
var up = [0, 1, 0];

var camera = m4.lookAt(eye, target, up);
var view = m4.inverse(camera);
var viewProjection = m4.multiply(projection, view);
var world = m4.rotationY(0);

var cubeArrays = {
  position: [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1],
  normal:   [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1],
  texcoord: [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
  indices:  [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23],
};

var cubeBufferInfo = twgl.createBufferInfoFromArrays(gl, cubeArrays)

var tex = twgl.createTexture(gl, {
  min: gl.NEAREST,
  mag: gl.NEAREST,
  src: [
    255, 255, 255, 255,
    195, 195, 195, 255,
    195, 195, 195, 255,
    255, 255, 255, 255,
  ],
});

var cubeUniforms = [
  {
    u_lightWorldPos: [1, 8, -10],
    u_lightColor: [1, 0.8, 0.8, 1],
    u_ambient: [0, 0, 0, 1],
    u_specular: [1, 1, 1, 1],
    u_shininess: 50,
    u_specularFactor: 1,
    u_diffuse: tex,
    u_viewInverse: camera,
    u_world: world,
    u_worldInverseTranspose: m4.transpose(m4.inverse(world)),
    u_worldViewProjection: m4.multiply(viewProjection, world)
  },
  {
    u_lightWorldPos: [1, 8, -10],
    u_lightColor: [1, 0.8, 0.8, 1],
    u_ambient: [0, 0, 0, 1],
    u_specular: [1, 1, 1, 1],
    u_shininess: 50,
    u_specularFactor: 1,
    u_diffuse: tex,
    u_viewInverse: camera,
    u_world: world,
    u_worldInverseTranspose: m4.transpose(m4.inverse(world)),
    u_worldViewProjection: m4.multiply(viewProjection, world)
  },
  {
    u_lightWorldPos: [1, 8, -10],
    u_lightColor: [1, 0.8, 0.8, 1],
    u_ambient: [0, 0, 0, 1],
    u_specular: [1, 1, 1, 1],
    u_shininess: 50,
    u_specularFactor: 1,
    u_diffuse: tex,
    u_viewInverse: camera,
    u_world: world,
    u_worldInverseTranspose: m4.transpose(m4.inverse(world)),
    u_worldViewProjection: m4.multiply(viewProjection, world)
  }
];

var objectsToDraw = [
  {
    programInfo: programInfo,
    bufferInfo: cubeBufferInfo,
    uniforms: cubeUniforms[0],
  },
  {
    programInfo: programInfo,
    bufferInfo: cubeBufferInfo,
    uniforms: cubeUniforms[1],
  },
  {
    programInfo: programInfo,
    bufferInfo: cubeBufferInfo,
    uniforms: cubeUniforms[2],
  },
]

var radius = 5
var x = 5
var y = 0
var z = 0
var direction = true


function render(time) {
  time *= 0.001;

  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var world0 = m4.rotationY(time)
  world0 = m4.rotateX(world0, time)

  var world1 = m4.translation(v3.mulScalar(v3.create(-0.2, -0.2, 1), 20))
  world1 = m4.scale(world1,v3.mulScalar(v3.create(1, 1, 1), 3))

  var world2 = m4.translation(v3.mulScalar(v3.create(x, y, 0), 1))
  world2 = m4.rotateX(world2, time)
  world2 = m4.rotateZ(world2, time)

  objectsToDraw[0].uniforms.u_world = world0
  objectsToDraw[0].uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(world0));
  objectsToDraw[0].uniforms.u_worldViewProjection = m4.multiply(viewProjection, world0);
  
  objectsToDraw[1].uniforms.u_world = world1
  objectsToDraw[1].uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(world1));
  objectsToDraw[1].uniforms.u_worldViewProjection = m4.multiply(viewProjection, world1);

  objectsToDraw[2].uniforms.u_world = world2
  objectsToDraw[2].uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(world2));
  objectsToDraw[2].uniforms.u_worldViewProjection = m4.multiply(viewProjection, world2);

  objectsToDraw.forEach(function(object) {
    var programInfo = object.programInfo;
    var bufferInfo = object.bufferInfo;

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, cubeBufferInfo);
    twgl.setUniforms(programInfo, object.uniforms);
    gl.drawElements(gl.TRIANGLES, cubeBufferInfo.numElements, gl.UNSIGNED_SHORT, 0);
  })

  console.log(x);
  if (x >= radius) {
    direction = false
  } else if (x <= -radius ) {
    direction = true
  }

  if (direction) {
    x += 0.1
    y = -Math.sqrt(radius * radius - x * x)
  } else {
    x -= 0.1
    y = Math.sqrt(radius * radius - x * x)
  }

  requestAnimationFrame(render);
}
requestAnimationFrame(render);

  