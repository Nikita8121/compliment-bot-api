export interface IRepository<TEntity> {
  findById(id: string): Promise<TEntity | null>;
  findAll(): Promise<TEntity[]>;
  create(entity: TEntity): Promise<void>;
  update(entity: TEntity): Promise<void>;
  delete(id: string): Promise<void>;
}
