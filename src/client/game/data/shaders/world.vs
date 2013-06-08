// create a shared variable for the
// VS and FS containing the normal
varying vec3 vNormal;

uniform vec3 camPos;


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

  vec3 alteredPosition = position;
  vec3 alteredCamPos = camPos;
  //alteredCamPos.y = alteredPosition.y;
  float distance = lengthSq(alteredCamPos-(position));

  float factor = distance - 600.0;
  if ( factor > 0.0 ) {
    alteredPosition.y = position.y - factor*factor*0.0000003;
   }


  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(alteredPosition, 1.0);
}