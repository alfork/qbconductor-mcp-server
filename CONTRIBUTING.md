# Contributing to QuickBooks Desktop MCP Server

Thank you for your interest in contributing to the QuickBooks Desktop MCP Server! This document provides guidelines and information for contributors.

> **📦 Public Repository**: This is a public repository that can be freely cloned, forked, and contributed to without authentication. No private information is stored in the codebase.

## 🤝 How to Contribute

### Types of Contributions

We welcome several types of contributions:

- **Bug Reports**: Help us identify and fix issues
- **Feature Requests**: Suggest new functionality or improvements
- **Code Contributions**: Submit bug fixes, new features, or improvements
- **Documentation**: Improve or expand documentation
- **Testing**: Add test cases or improve test coverage

## 🐛 Reporting Bugs

### Before Submitting a Bug Report

1. **Check existing issues** to avoid duplicates
2. **Update to the latest version** to ensure the bug still exists
3. **Test with minimal configuration** to isolate the issue
4. **Gather relevant information** (logs, configuration, environment)

### Bug Report Template

When submitting a bug report, please include:

```markdown
## Bug Description
A clear and concise description of the bug.

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- Node.js version:
- npm version:
- Operating System:
- MCP Client:
- Conductor API version:

## Configuration
```env
# Your configuration (remove sensitive data)
LOG_LEVEL=debug
CACHE_TTL_MINUTES=30
```

## Logs
```
Relevant log entries or error messages
```

## Additional Context
Any other relevant information.
```

## 💡 Suggesting Features

### Feature Request Template

```markdown
## Feature Description
A clear and concise description of the feature.

## Use Case
Describe the problem this feature would solve.

## Proposed Solution
Describe how you envision this feature working.

## Alternatives Considered
Other approaches you've considered.

## Additional Context
Any other relevant information, mockups, or examples.
```

## 🔧 Development Setup

### Prerequisites

- Node.js 18+
- npm 8+
- Git
- Conductor API access for testing

### Setup Steps

1. **Fork and clone the repository**
   ```bash
   git fork https://github.com/alfork/qbconductor-mcp-server.git
   git clone https://github.com/YOUR_USERNAME/qbconductor-mcp-server.git
   cd qbconductor-mcp-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.development
   # Edit .env.development with your test credentials
   ```

4. **Build and test**
   ```bash
   npm run build
   npm test
   ```

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the coding standards (see below)
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run build
   npm test
   npm run lint
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push and create a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Coding Standards

### TypeScript Guidelines

- **Use TypeScript strictly**: Enable all strict mode options
- **Type everything**: Avoid `any` types, use proper interfaces
- **Use meaningful names**: Variables, functions, and classes should be descriptive
- **Follow existing patterns**: Maintain consistency with existing code

### Code Style

- **Formatting**: Use Prettier for consistent formatting
- **Linting**: Follow ESLint rules
- **Imports**: Use absolute imports where possible
- **Error Handling**: Always handle errors appropriately

### Example Code Style

```typescript
// Good
interface CreateBillParams {
  vendorId: string;
  amount: number;
  dueDate: string;
  lineItems: BillLineItem[];
}

export const createBillHandler = withErrorHandling(async (input: unknown) => {
  const params = validateInput(CreateBillSchema, input);
  
  const client = new ConductorClient(params.endUserId);
  const result = await client.post('/quickbooks-desktop/bills', {
    vendor: { id: params.vendorId },
    totalAmount: params.amount.toString(),
    dueDate: params.dueDate,
    lineItems: params.lineItems,
  });

  return formatSuccessResponse(result.data, {
    endUserId: client.getEndUserId(),
    message: `Bill created successfully`,
  });
});

// Bad
export const createBill = async (input: any) => {
  try {
    const client = new ConductorClient();
    const result = await client.post('/quickbooks-desktop/bills', input);
    return result;
  } catch (e) {
    throw e;
  }
};
```

### File Organization

```
src/
├── tools/           # MCP tool implementations
│   ├── accounts.ts  # Account-related tools
│   ├── bills.ts     # Bill-related tools
│   └── ...
├── services/        # External service clients
├── utils/           # Utility functions
├── schemas/         # Type definitions and validation
└── __tests__/       # Test files
```

## 🧪 Testing Guidelines

### Test Structure

- **Unit Tests**: Test individual functions and classes
- **Integration Tests**: Test tool handlers with mocked API calls
- **End-to-End Tests**: Test complete workflows (optional)

### Writing Tests

```typescript
describe('createBillHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a bill successfully', async () => {
    // Arrange
    const mockInput = {
      vendorId: 'vendor_123',
      amount: 100.00,
      dueDate: '2024-01-01',
      lineItems: [{ description: 'Test item', amount: 100.00 }]
    };

    const mockResponse = { id: 'bill_123', status: 'created' };
    jest.spyOn(ConductorClient.prototype, 'post').mockResolvedValue({
      data: mockResponse
    });

    // Act
    const result = await createBillHandler(mockInput);

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockResponse);
  });

  it('should handle validation errors', async () => {
    // Test error cases
  });
});
```

### Test Coverage

- Aim for **80%+ code coverage**
- Focus on **critical paths** and **error handling**
- Test **edge cases** and **boundary conditions**

## 📚 Documentation Guidelines

### Code Documentation

- **JSDoc comments** for public functions and classes
- **Inline comments** for complex logic
- **README updates** for new features
- **API documentation** for new tools

### Documentation Style

```typescript
/**
 * Creates a new bill in QuickBooks Desktop
 * 
 * @param input - Bill creation parameters
 * @param input.vendorId - ID of the vendor
 * @param input.amount - Total bill amount
 * @param input.dueDate - Bill due date in YYYY-MM-DD format
 * @param input.lineItems - Array of bill line items
 * @returns Promise resolving to the created bill data
 * 
 * @example
 * ```typescript
 * const result = await createBillHandler({
 *   vendorId: 'vendor_123',
 *   amount: 100.00,
 *   dueDate: '2024-01-01',
 *   lineItems: [{ description: 'Office supplies', amount: 100.00 }]
 * });
 * ```
 */
```

## 🔄 Pull Request Process

### Before Submitting

1. **Ensure all tests pass**
2. **Update documentation** if needed
3. **Add changelog entry** for significant changes
4. **Rebase on latest main** to avoid merge conflicts

### Pull Request Template

```markdown
## Description
Brief description of the changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added for new functionality
- [ ] All tests pass
- [ ] No breaking changes (or clearly documented)

## Related Issues
Closes #123
```

### Review Process

1. **Automated checks** must pass (tests, linting, build)
2. **Code review** by maintainers
3. **Testing** in development environment
4. **Approval** and merge

## 🏷️ Commit Message Guidelines

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(bills): add support for recurring bills
fix(auth): handle expired authentication tokens
docs(setup): update installation instructions
test(payments): add integration tests for payment processing
```

## 🚀 Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release tag
4. Update documentation
5. Publish release notes

## 🆘 Getting Help

### Communication Channels

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Code Review**: For implementation feedback

### Maintainer Response Times

- **Bug reports**: Within 48 hours
- **Feature requests**: Within 1 week
- **Pull requests**: Within 1 week

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (MIT License).

## 🙏 Recognition

Contributors will be recognized in:
- `CONTRIBUTORS.md` file
- Release notes for significant contributions
- GitHub contributor statistics

Thank you for contributing to the QuickBooks Desktop MCP Server! 🎉
