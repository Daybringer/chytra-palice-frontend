import Repository from "./Repository";

const resource = "/works";

export default {
  createWork(createWorkDto) {
    return Repository.post(`${resource}`, createWorkDto);
  },
  uploadDocument(file, id) {
    return Repository.post(`${resource}/upload/${id}`, file, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
  },
};
