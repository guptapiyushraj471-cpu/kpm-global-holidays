let id = 1;
const store = [];
module.exports = {
  list: () => store,
  create: (title) => {
    const item = { id: id++, title, done: false };
    store.push(item);
    return item;
  }
};
