import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConfigTable1740314786474 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO ktq_configs (key_name, value, type) VALUES
      ('media-not-found', '', 'string'),
      ('contact-email', 'ktqnews@gmail.com', 'string'),
      ('footer-data', '[{"key":"about-data","title":"Về chúng tôi","data":[{"icon":"","title":"Trang chủ","link":"/"},{"icon":"","title":"Bài viết","link":"/posts"},{"icon":"","title":"Về chúng tôi","link":"/about"},{"icon":"","title":"Liên hệ / Góp ý","link":"/contact"}]},{"key":"products-data","title":"Sản phẩm","data":[{"icon":"","title":"Ktq News","link":"/"}]},{"key":"service-data","title":"Dịch vụ","data":[{"icon":"","title":"Thiết kế / xây dựng website","link":""}]},{"key":"contacts-data","title":"Liên hệ","data":[{"icon":"","title":"ktqnews@gmail.com","link":""}]}]', 'json'),
      ('primary-email', 'ktq@gmail.com', 'string'),
      ('description-website', 'KTQ News là trang web chia sẻ kiến thức đa lĩnh vực, nơi bạn có thể khám phá những thông tin bổ ích về công nghệ, đời sống và nhiều chủ đề hấp dẫn khác. Chúng tôi cung cấp nội dung chất lượng, giúp bạn dễ dàng tiếp cận với nguồn thông tin đáng tin cậy.', 'string'),
      ('logo-name', 'KTQ News', 'string'),
      ('sliders-data', '{
        "description": "KTQ News Từ công nghệ, sức khỏe đến tài chính cá nhân. Chúng tôi có tất cả!",
        "images": {
          "slide-image-1": "",
          "slide-image-2": "",
          "slide-image-3": "",
          "about-image-1": "",
          "about-image-2": "",
          "contact-image-1": ""
        }
      }', 'json');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM ktq_configs WHERE key_name IN ('logo-name', 'sliders-data');
    `);
  }
}
