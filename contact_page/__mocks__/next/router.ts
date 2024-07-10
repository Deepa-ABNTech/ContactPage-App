// __mocks__/next/router.ts

export const useRouter = jest.fn().mockReturnValue({
    basePath: '',
    pathname: '/',
    route: '/',
    asPath: '',
    query: {},
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    isFallback: false,
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  });
  