const CommentLikeRepository = require('../../Domains/likes/CommentLikeRepository');

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(commentId, userId) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3)',
      values: [id, commentId, userId],
    };

    await this._pool.query(query);
  }

  async deleteLike(commentId, userId) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, userId],
    };

    await this._pool.query(query);
  }

  async checkLikeStatus(commentId, userId) {
    const query = {
      text: 'SELECT id FROM comment_likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);

    return result.rowCount > 0;
  }

  async getLikeCountByCommentId(commentId) {
    const query = {
      text: 'SELECT id FROM comment_likes WHERE comment_id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rowCount;
  }
}

module.exports = CommentLikeRepositoryPostgres;
