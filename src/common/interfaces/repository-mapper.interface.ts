export interface RepositoryMapper<TEntity, TDBSchema> {
  mapToEntity(schema: TDBSchema): TEntity;
  mapToDBSchema(entity: TEntity): TDBSchema;
}
