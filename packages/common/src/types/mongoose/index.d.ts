
type Paginator<T> = (
  filter: object
) => Promise<{ data: T[]; total: number; page: number }>;

type Deleter = () => Promise<void>;

declare module 'mongoose' {
  interface Model<T> {
    paginate: Paginator<T>;
    delete: Deleter;
  }

  interface Models {
    // todo
    
  }
}
