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
  getNewestWork() {
    return Repository.get(`${resource}/newest`);
  },
  getPopularWork() {
    return Repository.get(`${resource}/popular`);
  },
  getWorkByID(id) {
    return Repository.get(`${resource}/${id}`);
  },
  getAllWorks(filterOptions) {
    return Repository.get(`${resource}`, { params: filterOptions });
  },
  rejectWork({ id, guarantorMessage }) {
    return Repository.post(`${resource}/reject/${id}`, {
      guarantorMessage,
    });
  },
  approveWork(id) {
    return Repository.post(`${resource}/approve/${id}`);
  },
  getAllKeywords() {
    return Repository.get(`${resource}/keywords`);
  },
};
