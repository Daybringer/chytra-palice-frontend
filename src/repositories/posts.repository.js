import Repository from "./Repository";

const resource = "/posts";

export default {
  createPost(createPostDto) {
    return Repository.post(`${resource}`, createPostDto);
  },
  uploadImages(images, id) {
    return Repository.post(`${resource}/upload/${id}`, images, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
  },
  getAll() {
    return Repository.get(`${resource}`);
  },
};
