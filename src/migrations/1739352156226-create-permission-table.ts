import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePermissionTable1739352156226 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO ktq_permissions (name, description) VALUES 
            ('GET', 'Read data from the API'),
            ('POST', 'Create new records'),
            ('PUT', 'Update existing records'),
            ('DELETE', 'Remove records');
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE ktq_permissions;`);
  }
}
