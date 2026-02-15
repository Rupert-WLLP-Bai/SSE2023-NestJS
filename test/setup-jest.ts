// Global test setup
export {};
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-12345',
}));
