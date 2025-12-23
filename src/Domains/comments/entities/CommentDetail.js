class CommentDetail {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.username = payload.username;
    this.date = payload.date;
    this.content = payload.content;
    this.replies = payload.replies;
    this.likeCount = payload.likeCount;
  }

  _verifyPayload({
    id, username, date, content, replies, likeCount,
  }) {
    if (!id || !username || !date || !content || !replies || likeCount === undefined) {
      throw new Error('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string' || !Array.isArray(replies) || typeof likeCount !== 'number') {
      throw new Error('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CommentDetail;
