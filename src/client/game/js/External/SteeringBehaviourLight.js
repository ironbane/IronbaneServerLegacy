var Deceleration = {
    SLOW: 3,
    NORMAL: 2,
    FAST: 1
}, SteeringBehaviour = Class.extend({
    Init: function (a) {
        this.unit = a;
        this.targetUnit = null;
        this.steeringForce = new THREE.Vector3;
        this.wanderRadius = 1.2;
        this.wanderDistance = 2;
        this.wanderJitter = 180;
        this.wanderTarget = new THREE.Vector3
    },
    Seek: function (a) {
        return a.clone().sub(this.unit.position).normalize().multiplyScalar(this.unit.maxSpeed).sub(this.unit.velocity)
    },
    Arrive: function (a, b) {
        var c = a.clone().sub(this.unit.position),
            d = c.length();
        if (0 < d) {
            var e;
            e = Math.min(d / (b / 0.3), this.unit.maxSpeed);
            return c.multiplyScalar(e / d).sub(this.unit.velocity)
        }
        return new THREE.Vector3
    },
    Pursuit: function (a) {
        var b = a.position.clone().sub(this.unit.position),
            c = this.unit.heading.dot(a.heading);
        if (0 < b.dot(this.unit.heading) && -0.95 > c) return this.Seek(a.position);
        b = b.length() / (this.unit.maxSpeed + a.velocity.length());
        a = a.position.clone().add(a.velocity.clone().multiplyScalar(b));
        return this.Seek(a)
    },
    TurnaroundTime: function (a, b) {
        var c = b.clone().sub(a.position);
        return -0.5 * (a.heading.dot(c) - 1)
    },
    Interpose: function (a, b) {
        var c = a.position.clone().add(b.position).multiplyScalar(0.5),
            d = this.unit.position.clone().sub(c).length() / this.unit.maxSpeed,
            c = a.position.clone().add(a.velocity.clone.multiplyScalar(d)),
            d = b.position.clone().add(b.velocity.clone.multiplyScalar(d)),
            c = c.add(d).multiplyScalar(0.5);
        return Arrive(c, Deceleration.FAST)
    }
});