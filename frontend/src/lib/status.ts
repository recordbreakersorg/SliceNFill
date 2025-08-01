import { ReactNode } from "react";
import Ruse from "./ruses";

export type StatusMessage = {
  id: number;
  content: ReactNode;
  type?: "info" | "warning" | "error";
  align?: "left" | "right";
  duration?: number;
  messageClass?: string;
};

export default class StatusManager extends Ruse<StatusMessage[]> {
  constructor() {
    super([]);
  }
  addMessage(message: Omit<StatusMessage, "id">): number {
    const id = Date.now();
    const newMessage: StatusMessage = {
      id,
      align: "left",
      ...message,
    };
    this._set([...this._get(), newMessage]);
    this.notify();

    if (newMessage.duration) {
      setTimeout(() => {
        this.removeMessage(id);
      }, newMessage.duration);
    }
    return id;
  }

  removeMessage(id: number) {
    this._set(this._get().filter((message) => message.id !== id));
    this.notify();
  }

  clearMessages() {
    this._set([]);
    this.notify();
  }

  clearMessagesByClass(messageClass: string) {
    this._set(this._get().filter((m) => m.messageClass !== messageClass));
    this.notify();
  }
}
