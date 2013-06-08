// same name and type as VS
varying vec3 vNormal;
uniform vec2 uvScale;
varying vec2 vUv;

uniform vec3 vSun;

uniform sampler2D texture1;

uniform vec3 hue;

void main() {



  // calc the dot product and clamp
  // 0 -> 1 rather than -1 -> 1
  vec3 light = vec3(0.5,0.2,1.0);

  // ensure it's normalized
  light = normalize(light);


    // this is the color for pixels outside the mapped texture
    vec4 texColor = vec4(0.0, 0.0, 0.0, 1.0);


    vec2 scale = vec2(1.0/uvScale.s, 1.0/uvScale.t);
    vec2 mappedUv = vUv*scale + vec2(0.5,0.5)*(vec2(1.0,1.0)-scale);



    // if the mapped uv is inside the texture area, read from texture

        texColor = texture2D(texture1, mappedUv);

        if ( texColor.a < ALPHATEST ) discard;

        texColor.r *= hue.r;
        texColor.g *= hue.g;
        texColor.b *= hue.b;


        float al = clamp(vSun.y, 0.0, 1.0);
        texColor.rgb *= 0.6 + (0.4 * al);



  // feed into our frag colour
  gl_FragColor = texColor;

}