/**
 * Fields in a request to create a single TODO item.
 */
export interface CreateTodoRequest {
    userId: string
    name: string
    createdAt: string
    todoId: string
    dueDate: string
    done: boolean
    attachmentUrl?: string
    hasImage: boolean
  }
  