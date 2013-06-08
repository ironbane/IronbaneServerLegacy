// same name and type as VS
varying vec3 vNormal;
uniform vec2 uvScale;
varying vec2 vUv;


uniform vec3 vSun;

uniform float time;

uniform sampler2D texture1;
uniform sampler2D texture2;

uniform vec3 hue;

void main() {



  // calc the dot product and clamp
  // 0 -> 1 rather than -1 -> 1
  vec3 light = vec3(0.5,0.2,1.0);

  // ensure it's normalized
  light = normalize(light);


    // this is the color for pixels outside the mapped texture
    vec4 texColor = vec4(0.0, 0.0, 0.0, 0.5);



    vec2 scale = vec2(1.0/uvScale.s, 1.0/uvScale.t);
    vec2 mappedUv = vUv*scale + vec2(0.5,0.5)*(vec2(1.0,1.0)-scale);

    mappedUv.x += cos(time*0.08);
    mappedUv.y += sin(time*0.06);
    //mappedUv.y = time * scrollSpeed.y;

    // if the mapped uv is inside the texture area, read from texture

        vec4 texColor1 = texture2D(texture1, mappedUv);
        vec4 texColor2 = texture2D(texture2, mappedUv);


        //texColor.rgb += texColor1

        float test = 0.5+(cos(time)/2.0);
        float test2 = 0.5+(sin(time)/2.0);

        //test = 0.9;


        //texColor.rgb = texColor1.rgb * 1.0 + texColor2.rgb * 0.5;
        texColor.rgb = mix(texColor1.rgb, texColor2.rgb, test);




        //if ( texColor.a < ALPHATEST ) discard;
        //if ( texColor2.a < ALPHATEST ) discard;

        float al = clamp(vSun.y, 0.0, 1.0);
        texColor.rgb *= 0.2 + (0.8 * al);


  // feed into our frag colour
  gl_FragColor = texColor;

}