// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import { jest } from '@jest/globals';

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
};

const mockPathname = jest.fn(() => '/');
const mockSearchParams = jest.fn(() => new URLSearchParams());
const mockParams = jest.fn(() => ({}));

globalThis.mockRouter = mockRouter;
globalThis.mockPathname = mockPathname;
globalThis.mockSearchParams = mockSearchParams;
globalThis.mockParams = mockParams;

jest.mock('next/navigation', () => ({
  useRouter() {
    return mockRouter;
  },
  usePathname() {
    return mockPathname();
  },
  useSearchParams() {
    return mockSearchParams();
  },
  useParams() {
    return mockParams();
  },
}));

globalThis.resetRouterMocks = () => {
  for (const mockFn of Object.values(mockRouter)) {
    mockFn.mockClear();
  }
  mockPathname.mockClear();
  mockSearchParams.mockClear();
  mockParams.mockClear();
};

globalThis.setMockPathname = (pathname) => {
  mockPathname.mockReturnValue(pathname);
};

globalThis.setMockSearchParams = (params) => {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    searchParams.set(key, value);
  }
  mockSearchParams.mockReturnValue(searchParams);
};

globalThis.setMockParams = (params) => {
  mockParams.mockReturnValue(params);
};

// Mock next/image since it's not available in test environment
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    const { fill: _fill, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...rest} />;
  },
}));

// Mock the fallback image import
jest.mock('@/app/assets/image-not-found.png', () => ({
  __esModule: true,
  default: {
    src: '/mocked-fallback.png',
    height: 100,
    width: 100,
  },
}));
