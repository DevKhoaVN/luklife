export type VariantOption = {
  size: string
  color: string
  stock?: number
  price?: number
}

export type CartItem = {

  productId: string
  name: string
  image: string

  // giá hiển thị
  price: number
  originalPrice?: number

  qty: number

  // lựa chọn hiện tại
  selected: {
    size: string
    color: string
  }

  // để dropdown “Chọn phân loại” (size/màu) trong cart
  variants: VariantOption[]
}

export type CartState = {
  items: CartItem[]
}
