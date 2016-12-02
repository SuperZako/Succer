interface IVector2 {
    x: number;
    y: number;
}

class Vector2 implements IVector2 {
    constructor(public x = 0, public y = 0) { }

    // Returns a Vector2 with all of its components set to zero.
    public static get Zero() {
        return new Vector2();
    }

    //overload the + operator
    public static add(lhs: Vector2, rhs: Vector2) {
        let x = lhs.x + rhs.x;
        let y = lhs.y + rhs.y;
        return new Vector2(x, y);
    }

    //overload the - operator
    public static subtract(lhs: IVector2, rhs: IVector2) {
        let x = lhs.x - rhs.x;
        let y = lhs.y - rhs.y;
        return new Vector2(x, y);
    }

    public static multiply(lhs: number, rhs: IVector2) {
        return new Vector2(lhs * rhs.x, lhs * rhs.y);
    }

    public static dot(lhs: IVector2, rhs: IVector2) {
        return lhs.x * rhs.x + lhs.y * rhs.y;
    }

    /**
     *   returns the length of a 2D vector
    */
    public static length(vector: IVector2) {
        let x = vector.x;
        let y = vector.y;
        return Math.sqrt(x * x + y * y);
    }


    /**
     *   normalizes a 2D Vector
     */
    public static normalize(vector: Vector2) {
        //let _length = Vector2.length(vector);
        let x = vector.x;
        let y = vector.y;
        let length = Math.sqrt(x * x + y * y);

        if (length > 1e-6/*MathHelper.EpsilonDouble*/) {
            vector.x /= length;
            vector.y /= length;
        }
        return vector;
    }

    public static distance(vector1: IVector2, vector2: IVector2) {
        return Math.sqrt(Vector2.distanceSquared(vector1, vector2));
    }

    public static distanceSquared(vector1: IVector2, vector2: IVector2) {
        let x = vector1.x - vector2.x;
        let y = vector1.y - vector2.y;
        return x * x + y * y;
    }




    /**
    * calculates the dot product
    * @param v2
    * @return  dot product
    */
    public dot(vector: Vector2) {
        return this.x * vector.x + this.y * vector.y;
    }

    //we need some overloaded operators
    public add(rhs: IVector2) {
        this.x += rhs.x;
        this.y += rhs.y;

        return this;
    }



    public multiply(rhs: number) {
        this.x *= rhs;
        this.y *= rhs;

        return this;
    }

    public length() {
        let x = this.x;
        let y = this.y;
        return Math.sqrt(x * x + y * y);
    }

    public clamp(max: number) {
        let length = this.length();
        if (length > max) {
            let factor = max / length;
            this.multiply(factor);
        }
    }

    public clone() {
        return new Vector2(this.x, this.y);
    }

    public toVector3() {
        return new Vector3(this.x, this.y);
    }
}