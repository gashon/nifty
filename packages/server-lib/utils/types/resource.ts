export default interface Resource {
  /** @ignore */
  _id: string; // monkey patch for queries on list endpoints
  id: string;
  object: string;
  created_at: Date;
  updated_at: Date;
  test: boolean;
}
