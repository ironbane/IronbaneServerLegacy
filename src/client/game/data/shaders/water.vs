// create a shared variable for the
// VS and FS containing the normal
varying vec3 vNormal;

uniform float time;



varying vec2 vUv;

float lengthSq(vec3 a) {
    return a.x * a.x + a.y * a.y + a.z * a.z;
}

void main() {



  vUv = uv;

  // set the vNormal value with
  // the attribute value passed
  // in by Three.js
  vNormal = normal;



  vec3 pos = position;
    float sinarg = (mod(pos.x,10.0) * 0.5) + time*2.0;
    float sinarg2 = (mod(pos.y,10.0) * 0.4) + time*2.0;
    pos.z += sin(sinarg) * 0.05 + cos(sinarg2) * 0.05;

  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(pos, 1.0);


}