const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres');
const CommentLikeRepository = require('../../../Domains/likes/CommentLikeRepository');

describe('CommentLikeRepositoryPostgres', () => {
  beforeAll(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await CommentLikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike function', () => {
    it('should persist add like', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      const fakeIdGenerator = () => '123';
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentLikeRepositoryPostgres.addLike('comment-123', 'user-123');

      // Assert
      const likes = await CommentLikesTableTestHelper.findLikeById('like-123');
      expect(likes).toHaveLength(1);
    });
  });

  describe('deleteLike function', () => {
    it('should delete like from database', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      await CommentLikesTableTestHelper.addLike({ id: 'like-123', commentId: 'comment-123', owner: 'user-123' });
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action
      await commentLikeRepositoryPostgres.deleteLike('comment-123', 'user-123');

      // Assert
      const likes = await CommentLikesTableTestHelper.findLikeById('like-123');
      expect(likes).toHaveLength(0);
    });
  });

  describe('checkLikeStatus function', () => {
    it('should return true if like exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      await CommentLikesTableTestHelper.addLike({ commentId: 'comment-123', owner: 'user-123' });
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action
      const isLiked = await commentLikeRepositoryPostgres.checkLikeStatus('comment-123', 'user-123');

      // Assert
      expect(isLiked).toBe(true);
    });

    it('should return false if like does not exist', async () => {
      // Arrange
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action
      const isLiked = await commentLikeRepositoryPostgres.checkLikeStatus('comment-123', 'user-123');

      // Assert
      expect(isLiked).toBe(false);
    });
  });

  describe('getLikeCountByCommentId function', () => {
    it('should return correct like count', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-1', username: 'user1' });
      await UsersTableTestHelper.addUser({ id: 'user-2', username: 'user2' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-1' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-1' });
      await CommentLikesTableTestHelper.addLike({ id: 'like-1', commentId: 'comment-123', owner: 'user-1' });
      await CommentLikesTableTestHelper.addLike({ id: 'like-2', commentId: 'comment-123', owner: 'user-2' });
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      // Action
      const likeCount = await commentLikeRepositoryPostgres.getLikeCountByCommentId('comment-123');

      // Assert
      expect(likeCount).toBe(2);
    });
  });
});
