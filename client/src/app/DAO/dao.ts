export interface DAO {
    add(newElement: Object): Promise<string>;
    update(element: Object): Promise<string>;
    getAll(): Promise<string[]>;
    get(id: string): Promise<Object>;
    delete(id: string): Promise<string>;
}
