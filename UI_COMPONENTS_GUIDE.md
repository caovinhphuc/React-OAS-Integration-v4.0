# 🎨 UI Components Library - Hướng Dẫn Sử Dụng

## 📦 Tổng Quan

Thư viện UI Components hiện đại, accessible và có thể tái sử dụng cho React OAS Integration v4.0.

## 🚀 Components Đã Triển Khai

### 1. **Card Component** 📇

Component Card linh hoạt với nhiều variants và hiệu ứng hover.

#### Cách Sử Dụng Cơ Bản

```jsx
import { Card } from './components/ui';

// Card đơn giản
<Card>
  <Card.Title>Tiêu đề Card</Card.Title>
  <Card.Body>Nội dung card</Card.Body>
</Card>

// Card với variants
<Card variant="primary" hoverable shadow="lg">
  <Card.Header>
    <Card.Title>Card Header</Card.Title>
  </Card.Header>
  <Card.Body>Nội dung</Card.Body>
  <Card.Footer>Footer content</Card.Footer>
</Card>

// Card với loading state
<Card loading>
  <Card.Body>Sẽ hiển thị skeleton loader</Card.Body>
</Card>

// Card với Meta (avatar + info)
<Card>
  <Card.Meta
    avatar={<img src="avatar.jpg" />}
    title="Phúc Cao"
    description="Software Developer"
  />
</Card>
```

#### Props

- `variant`: `default` | `primary` | `success` | `warning` | `error` | `glass`
- `hoverable`: `boolean` - Hiệu ứng hover
- `bordered`: `boolean` - Viền card
- `shadow`: `none` | `sm` | `md` | `lg` | `xl`
- `padding`: `none` | `sm` | `md` | `lg` | `xl`
- `loading`: `boolean` - Hiển thị skeleton
- `onClick`: `function` - Click handler

---

### 2. **Skeleton Component** 💀

Loading placeholders đẹp mắt cho content đang tải.

#### Cách Sử Dụng

```jsx
import { Skeleton } from './components/ui';

// Skeleton cơ bản
<Skeleton variant="text" count={3} />

// Skeleton Avatar
<Skeleton.Avatar size={48} />

// Skeleton Button
<Skeleton.Button width={120} height={40} />

// Skeleton Input
<Skeleton.Input />

// Skeleton Image
<Skeleton.Image height={200} />

// Skeleton Card (preset)
<Skeleton.Card />

// Skeleton List (preset)
<Skeleton.List rows={5} />

// Skeleton Table (preset)
<Skeleton.Table rows={5} columns={4} />
```

#### Props

- `variant`: `text` | `title` | `avatar` | `button` | `input` | `image`
- `width`: `string | number` - Chiều rộng
- `height`: `string | number` - Chiều cao
- `circle`: `boolean` - Hình tròn
- `animation`: `wave` | `pulse` | `none`
- `count`: `number` - Số lượng skeleton

---

### 3. **Toast Notification System** 🔔

Hệ thống thông báo hiện đại với nhiều variants.

#### Setup

```jsx
import { ToastProvider } from './components/ui';

// Wrap app với ToastProvider
function App() {
  return (
    <ToastProvider position="top-right" maxToasts={5}>
      {/* Your app */}
    </ToastProvider>
  );
}
```

#### Cách Sử Dụng

```jsx
import { useToast } from './components/ui';

function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success('Thành công!', {
      duration: 3000,
      closable: true,
    });
  };

  const handleError = () => {
    toast.error('Có lỗi xảy ra!');
  };

  const handleWarning = () => {
    toast.warning('Cảnh báo!');
  };

  const handleInfo = () => {
    toast.info('Thông tin');
  };

  const handleWithAction = () => {
    toast.success('File đã lưu', {
      action: {
        label: 'Xem',
        onClick: () => console.log('View file'),
      },
    });
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </div>
  );
}
```

#### Toast Options

- `type`: `success` | `error` | `warning` | `info`
- `duration`: `number` - Thời gian hiển thị (ms), 0 = không tự động đóng
- `closable`: `boolean` - Hiển thị nút đóng
- `icon`: `ReactNode` - Custom icon
- `action`: `{ label: string, onClick: function }` - Action button

#### Toast Provider Props

- `position`: `top-left` | `top-center` | `top-right` | `bottom-left` | `bottom-center` | `bottom-right`
- `maxToasts`: `number` - Số toast tối đa hiển thị

---

### 4. **Button Component** 🔘

Button component hiện đại với nhiều variants và states.

#### Cách Sử Dụng

```jsx
import { Button } from './components/ui';

// Button cơ bản
<Button variant="primary">Click me</Button>

// Button với icon
<Button
  variant="success"
  icon={<CheckIcon />}
  iconPosition="left"
>
  Save
</Button>

// Button loading
<Button loading>Loading...</Button>

// Button disabled
<Button disabled>Disabled</Button>

// Button full width
<Button fullWidth>Full Width</Button>

// Button chỉ icon
<Button icon={<SearchIcon />} />

// Button Group
<Button.Group spacing="sm">
  <Button variant="primary">Left</Button>
  <Button variant="secondary">Middle</Button>
  <Button variant="secondary">Right</Button>
</Button.Group>
```

#### Props

- `variant`: `primary` | `secondary` | `success` | `warning` | `error` | `outline` | `ghost` | `link` | `text`
- `size`: `xs` | `sm` | `md` | `lg` | `xl`
- `icon`: `ReactNode` - Icon element
- `iconPosition`: `left` | `right`
- `loading`: `boolean` - Loading state
- `disabled`: `boolean` - Disabled state
- `fullWidth`: `boolean` - Full width
- `onClick`: `function` - Click handler
- `type`: `button` | `submit` | `reset`

---

### 5. **Loading Component** ⏳

Nhiều loại loading indicators cho các contexts khác nhau.

#### Cách Sử Dụng

```jsx
import { Loading } from './components/ui';

// Loading spinner
<Loading variant="spinner" size="md" color="primary" />

// Loading với text
<Loading variant="spinner" text="Đang tải..." />

// Loading dots
<Loading variant="dots" />

// Loading bars
<Loading variant="bars" />

// Loading pulse
<Loading variant="pulse" />

// Loading ring
<Loading variant="ring" />

// Loading wave
<Loading variant="wave" />

// Full screen loading
<Loading fullScreen text="Đang xử lý..." />

// Loading Overlay (cho cards, sections)
<Loading.Overlay visible={isLoading}>
  <YourContent />
</Loading.Overlay>

// Inline loading (cho buttons)
<button>
  <Loading.Inline size="sm" color="white" />
  Loading...
</button>
```

#### Props

- `variant`: `spinner` | `dots` | `bars` | `pulse` | `ring` | `wave`
- `size`: `xs` | `sm` | `md` | `lg`
- `color`: `primary` | `success` | `warning` | `error` | `gray`
- `text`: `string` - Loading text
- `fullScreen`: `boolean` - Full screen overlay

---

### 6. **Empty Component** 📭

Empty states đẹp mắt với illustrations.

#### Cách Sử Dụng

```jsx
import { Empty, Button } from './components/ui';

// Empty state cơ bản
<Empty
  title="Không có dữ liệu"
  description="Chưa có dữ liệu nào được tạo"
/>

// Empty state với variants
<Empty
  variant="search"
  title="Không tìm thấy kết quả"
  description="Thử tìm kiếm với từ khóa khác"
/>

// Empty state với action
<Empty
  variant="folder"
  title="Thư mục trống"
  description="Chưa có file nào trong thư mục này"
  action={
    <Button variant="primary">
      Tải file lên
    </Button>
  }
/>

// Empty state với custom image
<Empty
  title="Custom Empty"
  image={<img src="custom-empty.svg" />}
/>
```

#### Props

- `variant`: `default` | `search` | `error` | `success` | `folder` | `inbox`
- `title`: `string` - Tiêu đề
- `description`: `string` - Mô tả
- `image`: `ReactNode` - Custom image
- `action`: `ReactNode` - Action button/element

---

## 🎨 Design Tokens

Tất cả components sử dụng Design Tokens từ `src/styles/design-tokens.css`:

### Colors

```css
var(--color-primary-500)
var(--color-success-500)
var(--color-warning-500)
var(--color-error-500)
var(--color-gray-500)
```

### Spacing

```css
var(--spacing-xs)   /* 4px */
var(--spacing-sm)   /* 8px */
var(--spacing-md)   /* 16px */
var(--spacing-lg)   /* 24px */
var(--spacing-xl)   /* 32px */
```

### Typography

```css
var(--text-xs)      /* 12px */
var(--text-sm)      /* 14px */
var(--text-base)    /* 16px */
var(--text-lg)      /* 18px */
var(--text-xl)      /* 20px */
```

### Shadows

```css
var(--shadow-sm)
var(--shadow-md)
var(--shadow-lg)
var(--shadow-xl)
```

### Border Radius

```css
var(--radius-sm)    /* 4px */
var(--radius-md)    /* 8px */
var(--radius-lg)    /* 12px */
var(--radius-xl)    /* 16px */
var(--radius-full)  /* 9999px */
```

---

## 🎬 Animations

Sử dụng animations từ `src/styles/animations.css`:

### CSS Classes

```jsx
// Fade animations
<div className="animate-fade-in">...</div>
<div className="animate-fade-out">...</div>

// Slide animations
<div className="animate-slide-in-up">...</div>
<div className="animate-slide-in-down">...</div>
<div className="animate-slide-in-left">...</div>
<div className="animate-slide-in-right">...</div>

// Scale animations
<div className="animate-scale-in">...</div>
<div className="animate-scale-out">...</div>

// Hover effects
<div className="hover-lift">...</div>
<div className="hover-scale">...</div>
<div className="hover-glow">...</div>

// Loading states
<div className="loading-shimmer">...</div>
<div className="loading-spin">...</div>
<div className="loading-pulse">...</div>
```

---

## 📱 Responsive Design

Tất cả components đều responsive và hoạt động tốt trên mobile, tablet, desktop.

### Breakpoints

- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

---

## ♿ Accessibility

Tất cả components tuân thủ WCAG 2.1 guidelines:

- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus indicators
- ✅ ARIA attributes
- ✅ Reduced motion support

---

## 🎯 Best Practices

### 1. Import Components

```jsx
// ✅ Good - Named imports
import { Card, Button, Toast } from './components/ui';

// ❌ Bad - Default imports
import Card from './components/ui/Card';
```

### 2. Use Design Tokens

```jsx
// ✅ Good - Use design tokens
<div style={{ padding: 'var(--spacing-md)' }}>

// ❌ Bad - Hard-coded values
<div style={{ padding: '16px' }}>
```

### 3. Consistent Variants

```jsx
// ✅ Good - Consistent variants
<Button variant="primary">Submit</Button>
<Card variant="primary">...</Card>

// ❌ Bad - Inconsistent
<Button variant="primary">Submit</Button>
<Card variant="blue">...</Card>
```

### 4. Loading States

```jsx
// ✅ Good - Show loading
<Button loading={isSubmitting}>Submit</Button>

// ❌ Bad - No feedback
<Button>Submit</Button>
```

### 5. Empty States

```jsx
// ✅ Good - Show empty state
{data.length === 0 ? (
  <Empty
    title="No data"
    action={<Button>Add data</Button>}
  />
) : (
  <DataList data={data} />
)}

// ❌ Bad - No empty state
{data.map(item => <Item key={item.id} />)}
```

---

## 🔧 Customization

### Override Styles

```jsx
// Using className
<Card className="my-custom-card">
  ...
</Card>

// CSS
.my-custom-card {
  background: linear-gradient(135deg, #667eea, #764ba2);
}
```

### Extend Components

```jsx
// Create custom component
import { Button } from './components/ui';

export const IconButton = ({ icon, ...props }) => (
  <Button icon={icon} {...props} />
);
```

---

## 📊 Examples

### Dashboard Card

```jsx
<Card hoverable shadow="lg">
  <Card.Header>
    <Card.Title>Sales Overview</Card.Title>
  </Card.Header>
  <Card.Body>
    <div className="stats">
      <div className="stat">
        <h4>Total Sales</h4>
        <p>$125,000</p>
      </div>
    </div>
  </Card.Body>
  <Card.Footer>
    <Button variant="outline" size="sm">View Details</Button>
  </Card.Footer>
</Card>
```

### Form with Loading

```jsx
function MyForm() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await submitForm();
      toast.success('Form submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" />
      <Button type="submit" loading={loading}>
        Submit
      </Button>
    </form>
  );
}
```

### Data List with Empty State

```jsx
function DataList({ data, loading }) {
  if (loading) {
    return <Skeleton.List rows={5} />;
  }

  if (data.length === 0) {
    return (
      <Empty
        variant="search"
        title="No results found"
        description="Try adjusting your search criteria"
        action={<Button onClick={handleReset}>Reset</Button>}
      />
    );
  }

  return (
    <div>
      {data.map(item => (
        <Card key={item.id} hoverable>
          <Card.Body>{item.name}</Card.Body>
        </Card>
      ))}
    </div>
  );
}
```

---

## 🎉 Kết Luận

Thư viện UI Components này cung cấp:

- ✅ **6 Components chính**: Card, Skeleton, Toast, Button, Loading, Empty
- ✅ **Design System hoàn chỉnh**: Tokens, animations, typography
- ✅ **Responsive**: Hoạt động tốt trên mọi thiết bị
- ✅ **Accessible**: Tuân thủ WCAG guidelines
- ✅ **Customizable**: Dễ dàng tùy chỉnh và mở rộng
- ✅ **Modern**: Sử dụng công nghệ và best practices mới nhất

---

## 📚 Tài Liệu Liên Quan

- [UX_UI_UPGRADE_PLAN.md](./UX_UI_UPGRADE_PLAN.md) - Kế hoạch nâng cấp UX/UI
- [src/styles/design-tokens.css](./src/styles/design-tokens.css) - Design tokens
- [src/styles/animations.css](./src/styles/animations.css) - Animations
- [src/styles/typography.css](./src/styles/typography.css) - Typography

---

**Version**: 4.0.3
**Last Updated**: Dec 11, 2025
**Status**: ✅ Phase 2 Complete

