const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentLikeRepository = require('../../../Domains/likes/CommentLikeRepository');
const ToggleLikeCommentUseCase = require('../ToggleLikeCommentUseCase');

describe('ToggleLikeCommentUseCase', () => {
  it('should orchestrate the add like action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    /** mocking needed function */
    mockThreadRepository.checkThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.checkLikeStatus = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockCommentLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    await toggleLikeCommentUseCase.execute(userId, threadId, commentId);

    // Assert
    expect(mockThreadRepository.checkThreadAvailability).toBeCalledWith(threadId);
    expect(mockCommentRepository.checkCommentAvailability).toBeCalledWith(commentId);
    expect(mockCommentLikeRepository.checkLikeStatus).toBeCalledWith(commentId, userId);
    expect(mockCommentLikeRepository.addLike).toBeCalledWith(commentId, userId);
  });

  it('should orchestrate the delete like action correctly', async () => {
    // Arrange
    const userId = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    /** mocking needed function */
    mockThreadRepository.checkThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentLikeRepository.checkLikeStatus = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockCommentLikeRepository.deleteLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    // Action
    await toggleLikeCommentUseCase.execute(userId, threadId, commentId);

    // Assert
    expect(mockThreadRepository.checkThreadAvailability).toBeCalledWith(threadId);
    expect(mockCommentRepository.checkCommentAvailability).toBeCalledWith(commentId);
    expect(mockCommentLikeRepository.checkLikeStatus).toBeCalledWith(commentId, userId);
    expect(mockCommentLikeRepository.deleteLike).toBeCalledWith(commentId, userId);
  });
});
