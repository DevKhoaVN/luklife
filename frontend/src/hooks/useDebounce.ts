// hooks/useDebounce.js
import { useState, useEffect } from 'react';

export function useDebounce(value:number, delay:number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Thiết lập timer để update giá trị sau khoảng delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Xóa timer nếu value thay đổi (người dùng gõ tiếp) trước khi hết giờ
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
