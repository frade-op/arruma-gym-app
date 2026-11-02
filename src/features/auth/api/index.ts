import { createMockAuthApi } from "./mockAuthApi";

// Troque por uma implementação HTTP quando o backend existir.
export const authApi = createMockAuthApi();
export { AuthError, type AuthApi } from "./authApi";
