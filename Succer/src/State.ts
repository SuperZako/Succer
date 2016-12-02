
abstract class State<EntityType> {
    public init(_e: EntityType) { }
    public draw(_e: EntityType) { }
    public update(_e: EntityType) { }
    public ai(_e: ControllingPlayer) { }
    public start(_e: EntityType) { }
    public input(_e: ControllingPlayer) { }
}