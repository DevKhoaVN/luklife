import { createSlice, type PayloadAction, nanoid } from '@reduxjs/toolkit'
import type { CartItem, CartState, VariantOption } from './cart.types'

const initialState: CartState = { items: [] }

type AddToCartPayload = {
  productId: string
  name: string
  image: string
  price: number
  originalPrice?: number
  qty?: number
  selected: { size: string; color: string }
  variants: VariantOption[]
}

export const cartSlice = createSlice({
    
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<AddToCartPayload>) {
      const { productId, selected } = action.payload
      const qty = action.payload.qty ?? 1

      // nếu cùng product + cùng variant thì cộng qty
      const found = state.items.find(
        (i) =>
          i.productId === productId &&
          i.selected.size === selected.size &&
          i.selected.color === selected.color
      )

      if (found) {
        found.qty += qty
      } else {
        state.items.push({
          lineId: nanoid(),
          productId,
          name: action.payload.name,
          image: action.payload.image,
          price: action.payload.price,
          originalPrice: action.payload.originalPrice,
          qty,
          selected: action.payload.selected,
          variants: action.payload.variants,
        })
      }
    },

    setQty(state, action: PayloadAction<{ lineId: string; qty: number }>) {
      const item = state.items.find((i) => i.lineId === action.payload.lineId)
      if (!item) return
      item.qty = Math.max(1, action.payload.qty)
    },

    changeVariant(
      state,
      action: PayloadAction<{
        lineId: string
        selected: { size: string; color: string }
      }>
    ) {
      const item = state.items.find((i) => i.lineId === action.payload.lineId)
      if (!item) return

      // validate: variant mới có tồn tại trong variants không?
      const ok = item.variants.some(
        (v) =>
          v.size === action.payload.selected.size &&
          v.color === action.payload.selected.color
      )
      if (!ok) return

      // nếu đổi variant mà trùng với 1 item khác -> gộp qty
      const duplicate = state.items.find(
        (i) =>
          i.lineId !== item.lineId &&
          i.productId === item.productId &&
          i.selected.size === action.payload.selected.size &&
          i.selected.color === action.payload.selected.color
      )

      if (duplicate) {
        duplicate.qty += item.qty
        state.items = state.items.filter((i) => i.lineId !== item.lineId)
      } else {
        item.selected = action.payload.selected
      }
    },

    removeItem(state, action: PayloadAction<{ lineId: string }>) {
      state.items = state.items.filter((i) => i.lineId !== action.payload.lineId)
    },

    clearCart(state) {
      state.items = []
    },
  },
})

export const { addToCart, setQty, changeVariant, removeItem, clearCart } =
  cartSlice.actions

export default cartSlice.reducer
