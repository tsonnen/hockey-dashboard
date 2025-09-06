import { fireEvent, render, screen } from '@testing-library/react';

import { ImageWithFallback } from '@/app/components/image-with-fallback/image-with-fallback';
import { describe, it, expect } from '@jest/globals';

describe('ImageWithFallback', () => {
  const defaultProps = {
    src: '/test-image.jpg',
    alt: 'Test image',
    width: 100,
    height: 100,
  };

  it('renders image with provided src initially', () => {
    render(<ImageWithFallback {...defaultProps} />);

    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
  });

  it('renders with custom className when provided', () => {
    render(<ImageWithFallback {...defaultProps} className="custom-class" />);

    const image = screen.getByAltText('Test image');
    expect(image).toHaveClass('custom-class');
  });

  it('applies width and height attributes', () => {
    render(<ImageWithFallback {...defaultProps} height={150} width={200} />);

    const image = screen.getByAltText('Test image');
    expect(image).toHaveAttribute('width', '200');
    expect(image).toHaveAttribute('height', '150');
  });

  it('applies quality attribute when provided', () => {
    render(<ImageWithFallback {...defaultProps} quality={90} />);

    const image = screen.getByAltText('Test image');
    expect(image).toHaveAttribute('quality', '90');
  });

  it('switches to fallback image on error', () => {
    render(<ImageWithFallback {...defaultProps} />);

    const image = screen.getByAltText('Test image');
    expect(image).toHaveAttribute('src', '/test-image.jpg');

    // Simulate image load error
    fireEvent.error(image);

    // Should now show the default fallback image
    expect(image).toHaveAttribute('src', '/mocked-fallback.png');
  });

  it('uses custom fallback image when provided', () => {
    const customFallback = '/custom-fallback.png';
    render(<ImageWithFallback {...defaultProps} fallBackSrc={customFallback} />);

    const image = screen.getByAltText('Test image');

    // Simulate image load error
    fireEvent.error(image);

    // Should now show the custom fallback image
    expect(image).toHaveAttribute('src', customFallback);
  });

  it('only switches to fallback once per component instance', () => {
    render(<ImageWithFallback {...defaultProps} />);

    const image = screen.getByAltText('Test image');

    // Simulate first error - should switch to fallback
    fireEvent.error(image);
    expect(image).toHaveAttribute('src', '/mocked-fallback.png');

    // Simulate second error - should still show fallback (not switch back)
    fireEvent.error(image);
    expect(image).toHaveAttribute('src', '/mocked-fallback.png');
  });

  it('renders image within a div wrapper', () => {
    const { container } = render(<ImageWithFallback {...defaultProps} />);

    expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
    expect(container.querySelector('img')).toBeInTheDocument();
  });
});
