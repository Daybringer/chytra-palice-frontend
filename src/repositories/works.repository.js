import Repository from "./Repository";

const resource = "/works";

export default {
  createWork(createWorkDto) {
    return Repository.post(`${resource}`, createWorkDto);
  },
  uploadDocument(document, id) {
    return Repository.post(`${resource}/upload/${id}`, document, {
      headers: {
        "content-Type": "multipart/form-data",
      },
    });
  },
};
