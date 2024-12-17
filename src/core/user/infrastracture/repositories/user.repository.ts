import { IRepository } from 'src/common/interfaces/repository.interface';
import { UserEntity } from '../../domain/user.entity';
import { UserRepositoryMapper } from '../mappers/user-repository.mapper';
import { PrismaService } from 'src/database/prisma.service';

export class UserRepository implements IRepository<UserEntity> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mapper: UserRepositoryMapper,
  ) {}

  async findById(id: string): Promise<UserEntity | null> {
    const res = await this.prismaService.user.findFirst({
      where: {
        id,
      },
    });

    if (!res) {
      return null;
    }

    return this.mapper.mapToEntity(res);
  }

  async findByTelegramId(telegramId: string): Promise<UserEntity | null> {
    const res = await this.prismaService.user.findFirst({
      where: {
        telegramUserId: telegramId,
      },
    });

    if (!res) {
      return null;
    }

    return this.mapper.mapToEntity(res);
  }

  findAll(): Promise<UserEntity[]> {
    throw new Error('Method not implemented.');
  }
  async create(entity: UserEntity): Promise<void> {
    await this.prismaService.user.create({
      data: {
        ...this.mapper.mapToDBSchema(entity),
      },
    });
  }
  update(entity: UserEntity): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
