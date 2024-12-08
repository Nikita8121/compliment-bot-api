export interface Repository<TEntity> {
  findById(id: string): Promise<TEntity>;
  findAll(): Promise<TEntity[]>;
  create(entity: TEntity): Promise<void>;
  update(entity: TEntity): Promise<void>;
}
