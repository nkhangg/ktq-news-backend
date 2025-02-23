import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
    SELECT 
      (SELECT COUNT(*) FROM ktq_posts) AS post_count,
      (SELECT COUNT(*) FROM ktq_categories) AS category_count
  `,
})
export class KtqViewCommonSliders {
  @ViewColumn()
  post_count: number = 0;

  @ViewColumn()
  category_count: number = 0;
}
