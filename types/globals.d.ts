export {};

declare global {
  interface CustomJwtSessionClaims {
    private_metadata: {
      currentEmployee?: {
        employeeId: string | null;
        isAdmin: boolean;
      };
    };
  }
}
