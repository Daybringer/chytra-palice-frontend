import Repository from "./Repository";

const resource = "/comments";

export default {
  getAllCommentsByWorkID(workID) {
    return Repository.get(`${resource}/${workID}`);
  },
  createComment(createCommentDto) {
    return Repository.post(`${resource}`, createCommentDto);
  },
  deleteComment(id) {
    return Repository.delete(`${resource}/${id}`);
  },
};
