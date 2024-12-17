export interface IRepositoryMapper<TEntity, TDBSchema> {
  mapToEntity(schema: TDBSchema): TEntity;
  mapToDBSchema(entity: TEntity): TDBSchema;
}
