/// <reference path="./math/Vector3.ts" />


abstract class BaseGameEntity {
    public position = new Vector3();

    public abstract draw(): void;
    public abstract drawshadow(): void;
}