import { ViewEntity, ViewColumn } from 'typeorm';
import KtqCategory from '../ktq-category.entity';

@ViewEntity({
  expression: `
    SELECT  c.id, c.name,c.slug, COUNT(p.id) AS post_count FROM ktq_categories c
    JOIN ktq_posts p ON p.categoryId = c.id
    GROUP BY c.id, c.name, c.slug
    ORDER BY post_count DESC
    LIMIT 20
  `,
})
export class KtqViewCommonCategoriesTopic {
  @ViewColumn()
  id: KtqCategory['id'];

  @ViewColumn()
  name: KtqCategory['name'];

  @ViewColumn()
  slug: KtqCategory['slug'];

  @ViewColumn()
  post_count: number;
}
