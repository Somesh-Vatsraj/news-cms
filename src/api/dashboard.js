import { ok } from '../utils/response.js';
import { requireAdmin } from '../middleware/auth.js';

export async function stats(request, env) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;

  const [
    newsTotal, pub, drafts, sched, users, comments, views,
    recentNews, recentLogs, mostViewed
  ] = await Promise.all([
    env.DB.prepare(`SELECT COUNT(*) AS c FROM news`).first(),
    env.DB.prepare(`SELECT COUNT(*) AS c FROM news WHERE status='published'`).first(),
    env.DB.prepare(`SELECT COUNT(*) AS c FROM news WHERE status='draft'`).first(),
    env.DB.prepare(`SELECT COUNT(*) AS c FROM news WHERE status='scheduled'`).first(),
    env.DB.prepare(`SELECT COUNT(*) AS c FROM users`).first(),
    env.DB.prepare(`SELECT COUNT(*) AS c FROM comments WHERE status='pending'`).first(),
    env.DB.prepare(`SELECT COALESCE(SUM(views),0) AS c FROM news`).first(),
    env.DB.prepare(
      `SELECT n.id, n.title, n.status, n.views, n.created_at, c.name AS category_name, a.name AS author_name, n.featured_image
       FROM news n LEFT JOIN categories c ON c.id=n.category_id LEFT JOIN authors a ON a.id=n.author_id
       ORDER BY n.created_at DESC LIMIT 8`
    ).all(),
    env.DB.prepare(
      `SELECT al.*, u.name AS user_name FROM activity_logs al
       LEFT JOIN users u ON u.id = al.user_id ORDER BY al.created_at DESC LIMIT 10`
    ).all(),
    env.DB.prepare(
      `SELECT id, title, slug, views FROM news WHERE status='published' ORDER BY views DESC LIMIT 5`
    ).all()
  ]);

  // weekly views approximation from newest 7 days article views
  const weekViews = await env.DB.prepare(
    `SELECT COALESCE(SUM(views),0) AS c FROM news WHERE created_at >= datetime('now','-7 days')`
  ).first();

  return ok({
    stats: {
      total: newsTotal.c, published: pub.c, drafts: drafts.c, scheduled: sched.c,
      users: users.c, pendingComments: comments.c, views: views.c, weekViews: weekViews.c
    },
    recentNews: recentNews.results,
    recentLogs: recentLogs.results,
    mostViewed: mostViewed.results
  });
}

export async function logs(request, env) {
  const auth = await requireAdmin(request, env);
  if (auth.error) return auth.error;
  const rows = await env.DB.prepare(
    `SELECT al.*, u.name AS user_name FROM activity_logs al
     LEFT JOIN users u ON u.id = al.user_id ORDER BY al.created_at DESC LIMIT 200`
  ).all();
  return ok({ items: rows.results });
}
