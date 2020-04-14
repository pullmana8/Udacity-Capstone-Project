import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { getUserId } from '../auth/utils';

const todoAccess = new TodoAccess()

export async function getAllTodos(): Promise<TodoItem[]> {
    return todoAccess.getAllTodos()
}

export async function createTodoItem(
    createTodoRequest: CreateTodoRequest,
    jwtToken: string
): Promise<TodoItem> {

    const todoId = uuid.v4()
    const userId = getUserId(jwtToken)

    return ({
        userId: userId,
        todoId: todoId,
        createdAt: createTodoRequest.createdAt,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: createTodoRequest.done,
        attachmentUrl: createTodoRequest.attachmentUrl,
        hasImage: createTodoRequest.hasImage
    })
}