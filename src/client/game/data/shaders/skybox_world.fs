
// same name and type as VS
varying vec3 vNormal;

uniform vec3 vSun;

varying vec3 vPixelPosition;

varying vec2 vUv;

void main() {

    float size = 1000.0;

    vec3 color = vec3(0.23, 0.51, 0.81);

    color.r += (1.0-(abs(vPixelPosition.y)/size))*0.5;
    color.g += (1.0-(abs(vPixelPosition.y)/size))*0.35;
    color.b += (1.0-(abs(vPixelPosition.y)/size))*0.2;

    //color.b = color.g = color.r;

    float al = vSun.y;

    if ( al > 0.0 ) al *= 3.0;

    al = clamp(al, -0.5, 1.0);

    color.r *= 0.2 + (al * 0.8);
    color.g *= 0.3 + (al * 0.7);
    color.b *= 0.4  + (al * 0.6);

    vec3 sunVecNormalized = normalize(vSun);

    vec3 sunSideVec = cross(sunVecNormalized, vec3(0.0, 1.0, 0.0));
    vec3 sunUpVec = cross(sunVecNormalized, sunSideVec);


    float sunAngle = dot(sunVecNormalized, sunUpVec);



    vec3 pixVecNormalized = normalize(vPixelPosition);
    float pixAngle = dot(pixVecNormalized, sunUpVec);

    float daynessMultiplier = 1.0;

    if ( sunVecNormalized.y > 0.0 ) {

      float sunYReference = clamp(sunVecNormalized.y*2.0, 0.0, 1.0);
      if ( sunYReference > 0.0 ) sunYReference *= 2.0;

      daynessMultiplier = (1.0-clamp(sunYReference, 0.0, 1.0));


    }

    float wrongSideMultiplier = 1.5-clamp(distance(pixVecNormalized, sunVecNormalized), 0.0, 1.5);

    float sunsetMultiplier = 1.0;

    float dist = distance(sunAngle, pixAngle);
    if ( dist < 0.2 ) {
      color.r += ((0.2-dist)*4.0)*daynessMultiplier*wrongSideMultiplier*sunsetMultiplier;
      if ( sunVecNormalized.x > 0.0 ) {
        color.g += (((0.2-dist)*4.0)*daynessMultiplier*wrongSideMultiplier*sunsetMultiplier)*0.4;
      }
      else {
        color.g += (((0.2-dist)*4.0)*daynessMultiplier*wrongSideMultiplier*sunsetMultiplier)*0.2;
      }
      //color.b -= (((0.2-dist)*4.0)*daynessMultiplier*wrongSideMultiplier)*0.2;
    }


    gl_FragColor = vec4(color, 1.0);

}
