// same name and type as VS
varying vec3 vNormal;
uniform vec2 uvScale;
varying vec2 vUv;
uniform float opacity;

uniform sampler2D texture1;

void main() {

    vec2 scale = vec2(1.0/uvScale.s, 1.0/uvScale.t);
    vec2 mappedUv = vUv*scale + vec2(0.5,0.5)*(vec2(1.0,1.0)-scale);


    vec4 texColor = texture2D(texture1, mappedUv);

    if ( texColor.a < ALPHATEST ) discard;

    texColor.a = opacity;

    gl_FragColor = texColor;

}