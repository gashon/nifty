const TYPES = {
  UserService: "UserService",
  UserRepository: "UserRepository",
  UserController: "UserController"
};

export type SearchKey = ({ email: string } | { id: number } | { email: string; id: number });

export { TYPES };