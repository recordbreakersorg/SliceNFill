export default class Editor {
  id: int;
  file: string;
  params: {
    color
  };
  constructor({file, id}:{file: string, id: number}) {
    this.file = file;
    this.id = id;
  }
}
