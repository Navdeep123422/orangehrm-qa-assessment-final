/** Test-data helpers kept separate from browser interaction code. */
export function uniqueUsername(prefix = 'qa_user'): string {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10_000)}`;
}

export const adminCredentials = {
  username: process.env.ORANGEHRM_USERNAME ?? 'Admin',
  password: process.env.ORANGEHRM_PASSWORD ?? 'admin123'
};
