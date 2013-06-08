// same name and type as VS
varying vec3 vNormal;

uniform vec3 vSun;

varying vec3 vPixelPosition;

varying vec2 vUv;

void main() {

    float size = 1000.0;

    vec3 color = vec3(0.0, 0.0, 0.0);

    color.r += (1.0-(abs(vPixelPosition.y)/size))*0.15;
    color.g += (1.0-(abs(vPixelPosition.y)/size))*0.1;
    color.b += (1.0-(abs(vPixelPosition.y)/size))*0.2;



    gl_FragColor = vec4(color, 1.0);

}