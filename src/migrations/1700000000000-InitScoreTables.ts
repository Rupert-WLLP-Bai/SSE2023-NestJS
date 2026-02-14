import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitScoreTables1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 创建 audit_log 表
    await queryRunner.createTable(
      new Table({
        name: 'audit_log',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'user_name',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'operator',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'target_type',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'target_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'action',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'old_value',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'new_value',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'ip_address',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'user_agent',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('audit_log');
  }
}
