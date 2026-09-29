import { mockStore } from '@/services/mockDataStore';

// Safe mock supabase client for storage and channels
class MockChannel {
  private name: string;
  constructor(name: string) {
    this.name = name;
  }
  on(_type: string, _filter: any, callback: () => void) {
    mockStore.subscribe(callback);
    return this;
  }
  subscribe() {
    return this;
  }
  unsubscribe() {
    return this;
  }
}

export const supabase: any = {
  auth: {
    getSession: async () => ({
      data: {
        session: mockStore.getCurrentUser() ? { user: mockStore.getCurrentUser() } : null
      }
    }),
    onAuthStateChange: (callback: any) => {
      const unsub = mockStore.subscribe(() => {
        const u = mockStore.getCurrentUser();
        callback('SIGNED_IN', u ? { user: u } : null);
      });
      return { data: { subscription: { unsubscribe: unsub } } };
    },
    signInWithPassword: async ({ email, password }: any) => {
      const res = await mockStore.signIn(email, password);
      if (res.error) return { data: null, error: res.error };
      return { data: { user: res.user, session: { user: res.user } }, error: null };
    },
    signUp: async ({ email, password, options }: any) => {
      const fullName = options?.data?.full_name || 'User';
      const res = await mockStore.signUp(email, password, fullName);
      if (res.error) return { data: null, error: res.error };
      return { data: { user: { email, id: `usr-${Date.now()}` } }, error: null };
    },
    signOut: async () => {
      await mockStore.signOut();
      return { error: null };
    }
  },
  channel: (name: string) => new MockChannel(name),
  removeChannel: (_ch: any) => {},
  storage: {
    from: (_bucket: string) => ({
      upload: async (path: string, file: File) => {
        return { data: { path: `${path}/${file.name}` }, error: null };
      },
      getPublicUrl: (path: string) => {
        return { data: { publicUrl: `https://example.com/mock-files/${path}` } };
      },
      download: async (_path: string) => {
        return { data: new Blob(['Mock document content'], { type: 'application/pdf' }), error: null };
      },
      list: async () => {
        return { data: [], error: null };
      }
    })
  },
  from: (_table: string) => ({
    select: () => ({
      order: () => Promise.resolve({ data: [], error: null }),
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
        order: () => Promise.resolve({ data: [], error: null })
      }),
      single: () => Promise.resolve({ data: null, error: null })
    }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => ({
      eq: () => Promise.resolve({ data: null, error: null })
    }),
    delete: () => ({
      eq: () => Promise.resolve({ data: null, error: null })
    })
  })
};