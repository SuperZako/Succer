
interface IVector3 {
    x: number;
    y: number;
    z: number;
}
class Vector3 implements IVector3 {
    constructor(public x = 0, public y = 0, public z = 0) { }

    // Returns a Vector2 with all of its components set to zero.
    public static get Zero() {
        return new Vector3();
    }

    //overload the + operator
    public static add(lhs: IVector3, rhs: IVector3) {
        let x = lhs.x + rhs.x;
        let y = lhs.y + rhs.y;
        let z = lhs.z + rhs.z;
        return new Vector3(x, y, z);
    }


    //overload the - operator
    public static subtract(lhs: IVector3, rhs: IVector3) {
        let x = lhs.x - rhs.x;
        let y = lhs.y - rhs.y;
        let z = lhs.z - rhs.z;
        return new Vector3(x, y, z);
    }

    public static multiply(lhs: number, rhs: IVector3) {
        return new Vector3(lhs * rhs.x, lhs * rhs.y, lhs * rhs.z);
    }


    public static distance(vector1: IVector3, vector2: IVector3) {
        return Math.sqrt(Vector2.distanceSquared(vector1, vector2));
    }

    public static distanceSquared(vector1: IVector3, vector2: IVector3) {
        let x = vector1.x - vector2.x;
        let y = vector1.y - vector2.y;
        let z = vector1.z - vector2.z;
        return x * x + y * y + z * z;
    }

    public set(v: IVector3) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }

    //we need some overloaded operators
    public add(rhs: IVector3) {
        this.x += rhs.x;
        this.y += rhs.y;
        this.z += rhs.z;

        return this;
    }

    public multiply(rhs: number) {
        this.x *= rhs;
        this.y *= rhs;
        this.z *= rhs;

        return this;
    }

    /**
     *   returns the length of a 2D vector
     */
    public length() {
        let x = this.x;
        let y = this.y;
        let z = this.z;
        return Math.sqrt(x * x + y * y + z * z);
    }

    public clamp(max: number) {
        let length = this.length();
        if (length > max) {
            let factor = max / length;
            this.multiply(factor);
        }
    }

    public toVector2() {
        return new Vector2(this.x, this.y);
    }

    public clone() {
        return new Vector3(this.x, this.y, this.z);
    }
}