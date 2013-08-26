// based on psuedo code from: http://freespace.virgin.net/hugo.elias/models/m_perlin.htm
// wrapped in commonjs format for node
(function(exports) {

    function Noise( x, y, seedIndex )
    {
        // Spread the entropy from the input args throughout the seed value. Allow
        // up to 14 bits each for x and y, and 4 for seedIndex.
        var seed = (x << 18) | (y << 4) | seedIndex;
        // Robert Jenkins' 32 bit integer hash function.
        // See http://www.concentric.net/~ttwang/tech/inthash.htm (original)
        // and http://stackoverflow.com/questions/3428136/javascript-integer-math-incorrect-results/3428186#3428186 (JavaScript version)
        seed = ((seed + 0x7ed55d16) + (seed << 12))  & 0xffffffff;
        seed = ((seed ^ 0xc761c23c) ^ (seed >>> 19)) & 0xffffffff;
        seed = ((seed + 0x165667b1) + (seed << 5))   & 0xffffffff;
        seed = ((seed + 0xd3a2646c) ^ (seed << 9))   & 0xffffffff;
        seed = ((seed + 0xfd7046c5) + (seed << 3))   & 0xffffffff;
        seed = ((seed ^ 0xb55a4f09) ^ (seed >>> 16)) & 0xffffffff;
        return (seed & 0xfffffff) / 0x10000000;
    }

    function SmoothedNoise( x, y, seedIndex )
    {
        var corners = ( Noise( x - 1, y - 1, seedIndex ) + Noise( x + 1, y - 1, seedIndex ) + Noise( x - 1, y + 1, seedIndex ) + Noise( x + 1, y + 1, seedIndex ) ) / 16;
        var sides   = ( Noise( x - 1, y, seedIndex ) + Noise( x + 1, y, seedIndex ) + Noise( x, y - 1, seedIndex ) + Noise( x, y + 1, seedIndex ) ) /  8;
        var center  = Noise( x, y, seedIndex ) / 4;
        return corners + sides + center;
    }

    function Interpolate( a, b, x )
    {
        var ft = x * Math.PI;
        var f = ( 1.0 - Math.cos( ft ) ) * 0.5;

        return ( a * ( 1.0 - f ) ) + ( b * f );
    }

    function InterpolatedNoise( x, y, seedIndex )
    {
        var x_int = Math.floor( x );
        var x_fractional = x - x_int;

        var y_int = Math.floor( y );
        var y_fractional = y - y_int;

        var v1 = SmoothedNoise( x_int, y_int, seedIndex );
        var v2 = SmoothedNoise( x_int + 1, y_int, seedIndex );
        var v3 = SmoothedNoise( x_int, y_int + 1, seedIndex );
        var v4 = SmoothedNoise( x_int + 1, y_int + 1, seedIndex );

        var i1 = Interpolate( v1, v2, x_fractional );
        var i2 = Interpolate( v3, v4, x_fractional );

        return Interpolate( i1, i2, y_fractional );
    }

    function Noise2D( x, y, octaves, persistence )
    {
        var total = 0;

        for ( var octave = 0; octave < octaves; ++octave )
        {
            var frequency = Math.pow( 2, octave );
            var amplitude = Math.pow( persistence, octave + 1 );

            total += InterpolatedNoise( x * frequency, y * frequency, octave ) * amplitude;
        }

        return total;
    }

    // http://mrl.nyu.edu/~perlin/noise/
    var ImprovedNoise = function() {

        var p = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10,
        23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87,
        174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211,
        133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208,
        89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5,
        202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119,
        248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232,
        178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249,
        14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205,
        93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];

        for (var i = 0; i < 256; i++) {
            p[256 + i] = p[i];
        }

        function fade(t) {
            return t * t * t * (t * (t * 6 - 15) + 10);
        }

        function lerp(t, a, b) {
            return a + t * (b - a);
        }

        function grad(hash, x, y, z) {
            var h = hash & 15;
            var u = h < 8 ? x : y,
                v = h < 4 ? y : h === 12 || h === 14 ? x : z;
            return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
        }

        return {
            noise: function(x, y, z) {
                var floorX = ~~x,
                    floorY = ~~y,
                    floorZ = ~~z;
                var X = floorX & 255,
                    Y = floorY & 255,
                    Z = floorZ & 255;

                x -= floorX;
                y -= floorY;
                z -= floorZ;

                var xMinus1 = x - 1,
                    yMinus1 = y - 1,
                    zMinus1 = z - 1;
                var u = fade(x),
                    v = fade(y),
                    w = fade(z);
                var A = p[X] + Y,
                    AA = p[A] + Z,
                    AB = p[A + 1] + Z,
                    B = p[X + 1] + Y,
                    BA = p[B] + Z,
                    BB = p[B + 1] + Z;

                return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z),
                grad(p[BA], xMinus1, y, z)),
                lerp(u, grad(p[AB], x, yMinus1, z),
                grad(p[BB], xMinus1, yMinus1, z))),
                lerp(v, lerp(u, grad(p[AA + 1], x, y, zMinus1),
                grad(p[BA + 1], xMinus1, y, z - 1)),
                lerp(u, grad(p[AB + 1], x, yMinus1, zMinus1),
                grad(p[BB + 1], xMinus1, yMinus1, zMinus1))));
            }
        };
    };

    exports.Perlin = {
        Noise: Noise,
        Noise2D: Noise2D,
        SmoothedNoise: SmoothedNoise,
        Interpolate: Interpolate,
        InterpolatedNoise: InterpolatedNoise,
        ImprovedNoise: ImprovedNoise
    };

})(this);
