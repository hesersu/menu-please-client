import { cn } from './utils'; // Assuming utils.js is in the same directory

describe('cn utility function', () => {
  it('should concatenate string inputs', () => {
    expect(cn('class-a', 'class-b')).toBe('class-a class-b');
  });

  it('should handle conditional class names (object syntax)', () => {
    expect(cn({ 'class-a': true, 'class-b': false, 'class-c': true })).toBe('class-a class-c');
  });

  it('should handle mixed string and conditional inputs', () => {
    expect(cn('class-prefix', { 'class-a': true, 'class-b': false }, 'class-suffix')).toBe('class-prefix class-a class-suffix');
  });

  it('should ignore falsy values in string inputs', () => {
    expect(cn('class-a', null, 'class-b', undefined, '', 'class-c')).toBe('class-a class-b class-c');
  });
  
  it('should handle empty inputs gracefully', () => {
    expect(cn()).toBe('');
    expect(cn(null, undefined, '')).toBe('');
    expect(cn({})).toBe('');
  });

  it('should handle complex combinations', () => {
    const isActive = true;
    const isDisabled = false;
    expect(cn(
      'base-class',
      isActive && 'active-class',
      isDisabled && 'disabled-class', // This should be ignored
      {
        'conditional-active': isActive,
        'conditional-disabled': isDisabled, // This should be ignored
      },
      undefined,
      'another-string'
    )).toBe('base-class active-class conditional-active another-string');
  });

  it('should correctly merge Tailwind classes (example scenario)', () => {
    // This is more about documenting usage than testing tw-merge itself, 
    // as cn just passes through to clsx and then twMerge.
    expect(cn('p-4', 'p-2')).toBe('p-2'); // twMerge behavior
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500'); // twMerge behavior
  });

  it('should handle various types of falsy values in conditional objects', () => {
    expect(cn({
      'class-a': true,
      'class-b': 0, // Falsy
      'class-c': null, // Falsy
      'class-d': undefined, // Falsy
      'class-e': '', // Falsy
      'class-f': '  ', // Truthy (string with spaces)
    })).toBe('class-a class-f');
  });
});
