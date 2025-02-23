import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdminTable1739352277140 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO ktq_admins (email, username, password) VALUES 
            ('admin@gmail.com', 'admin', '$2b$10$eF7K4Msw32e5ZC2cU78KgOqxMJygQcPDt5xXZP29inBBIV9KEsoyO');
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM ktq_admins WHERE email = 'admin@gmail.com';
      `);
  }
}
